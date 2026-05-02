document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("agendaContainer");
  const loading = document.getElementById("loading");
  const buttons = document.querySelectorAll(".filter button");
  const slider = document.getElementById("agendaSlider");
  const calendarEl = document.getElementById("calendar");
  const calendarTitle = document.getElementById("calendarTitle");
  const prevMonth = document.getElementById("prevMonth");
  const nextMonth = document.getElementById("nextMonth");

  const CACHE_KEY = "agenda_cache_v4";
  const CACHE_TTL = 5 * 60 * 1000;

  let allData = [];
  let currentDate = new Date();

  function readCache() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.time || !Array.isArray(parsed.data)) return null;
      if (Date.now() - parsed.time > CACHE_TTL) return null;
      return parsed.data;
    } catch {
      return null;
    }
  }

  function writeCache(data) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ time: Date.now(), data }));
    } catch {}
  }

  function showLoading(text = "Memuat agenda...") {
    if (!loading) return;
    loading.style.display = "flex";
    loading.innerHTML = `<div class="spinner"></div><p>${text}</p>`;
  }

  function hideLoading() {
    if (!loading) return;
    loading.style.display = "none";
  }

  function parseDateLocal(value) {
    if (!value) return null;
    const d = new Date(value);
    if (isNaN(d.getTime())) return null;
    d.setHours(0, 0, 0, 0);
    return d;
  }

  function normalizeAgenda(data) {
    if (!Array.isArray(data)) return [];

    return data.map((item, index) => ({
      id: item.id ?? `a-${index + 1}`,
      judul: item.judul || "",
      subjudul: item.subjudul || "",
      tanggalMulaiRaw: item.tanggalMulaiRaw || item.tanggalRaw || item.tanggal || "",
      tanggalMulai: item.tanggalMulai || item.tanggal || "",
      tanggalBerakhirRaw: item.tanggalBerakhirRaw || item.tanggalMulaiRaw || item.tanggalRaw || item.tanggal || "",
      tanggalBerakhir: item.tanggalBerakhir || item.tanggal || "",
      waktu: item.waktu || "",
      dresscode: item.dresscode || "",
      kegiatan: item.kegiatan || "",
      deskripsi: item.deskripsi || "",
      gambar: item.gambar || "img/default.jpg",
      link: item.link || "",
      eventStatus: item.eventStatus || "",
      sumber: item.sumber || "umum"
    }));
  }

  function sortAgendaByStartAsc(data) {
    return [...data].sort((a, b) => {
      const da = parseDateLocal(a.tanggalMulaiRaw || a.tanggalMulai || a.tanggalRaw || a.tanggal);
      const db = parseDateLocal(b.tanggalMulaiRaw || b.tanggalMulai || b.tanggalRaw || b.tanggal);
      const ta = da ? da.getTime() : 0;
      const tb = db ? db.getTime() : 0;
      return ta - tb;
    });
  }

  function computeStatus(item) {
    if (item.eventStatus) return String(item.eventStatus).toLowerCase();

    const start = parseDateLocal(item.tanggalMulaiRaw || item.tanggalMulai || item.tanggalRaw || item.tanggal);
    const end = parseDateLocal(
      item.tanggalBerakhirRaw ||
      item.tanggalBerakhir ||
      item.tanggalMulaiRaw ||
      item.tanggalMulai ||
      item.tanggalRaw ||
      item.tanggal
    );

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (!start) return "upcoming";
    if (now < start) return "upcoming";
    if (end && now > end) return "done";
    if (end && now >= start && now <= end) return "ongoing";
    return "ongoing";
  }

  function statusLabel(status) {
    switch (status) {
      case "upcoming":
        return "Akan Datang";
      case "ongoing":
        return "Berlangsung";
      case "done":
        return "Selesai";
      default:
        return "Agenda";
    }
  }

  function formatDate(value) {
    const d = parseDateLocal(value);
    if (!d) return String(value || "");
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  function formatRange(item) {
    const startText = item.tanggalMulai || formatDate(item.tanggalMulaiRaw || item.tanggalRaw || item.tanggal);
    const endText = item.tanggalBerakhir || formatDate(item.tanggalBerakhirRaw || item.tanggalBerakhir || item.tanggalMulaiRaw || item.tanggalRaw || item.tanggal);

    if (!startText) return endText || "";
    if (!endText || endText === startText) return startText;
    return `${startText} - ${endText}`;
  }

  function isExternal(url) {
    return /^https?:\/\//i.test(String(url || ""));
  }

  function renderList(data) {
    if (!container) return;

    if (!data.length) {
      container.innerHTML = "<div style='text-align:center;padding:2rem;color:#555;'>Belum ada agenda yang tersedia.</div>";
      return;
    }

    container.innerHTML = data.map(item => {
      const status = computeStatus(item);
      const href = item.link || "#";
      const target = isExternal(href) ? "_blank" : "_self";

      return `
        <a href="${href}" target="${target}" rel="${isExternal(href) ? "noopener noreferrer" : ""}" class="agenda-card agenda-link" data-status="${status}">
          <img src="${item.gambar}" alt="${item.judul}" onerror="this.src='img/default.jpg'">
          <div class="agenda-body">
            <span class="agenda-date">${formatRange(item)}</span>
            <h3>${item.judul}</h3>
            <p>${item.subjudul || item.deskripsi || ""}</p>

            <div class="agenda-detail">
              <p><b>Waktu:</b> ${item.waktu || "-"}</p>
              <p><b>Dresscode:</b> ${item.dresscode || "-"}</p>
              <p><b>Kegiatan:</b> ${item.kegiatan || "-"}</p>
            </div>

            <span class="status ${status}">${statusLabel(status)}</span>
          </div>
        </a>
      `;
    }).join("");
  }

  function renderSlider(data) {
    if (!slider) return;

    const top = sortAgendaByStartAsc(data).slice(0, 5);
    if (!top.length) return;

    slider.innerHTML = [...top, ...top].map(item => `
      <div class="agenda-slide">
        <img src="${item.gambar}" alt="${item.judul}" onerror="this.src='img/default.jpg'">
      </div>
    `).join("");

    let index = 0;
    setInterval(() => {
      index++;
      if (index >= top.length) index = 0;
      slider.style.transform = `translateX(-${index * 100}%)`;
    }, 4000);
  }

  function renderCalendar(data) {
    if (!calendarEl || !calendarTitle) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const eventDates = new Set();

    data.forEach(item => {
      const start = parseDateLocal(item.tanggalMulaiRaw || item.tanggalMulai || item.tanggalRaw || item.tanggal);
      const end = parseDateLocal(item.tanggalBerakhirRaw || item.tanggalBerakhir || item.tanggalMulaiRaw || item.tanggalMulai || item.tanggalRaw || item.tanggal);

      if (start && end) {
        const cur = new Date(start);
        while (cur <= end) {
          const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
          eventDates.add(key);
          cur.setDate(cur.getDate() + 1);
        }
      } else if (start) {
        const key = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}`;
        eventDates.add(key);
      }
    });

    const monthNames = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];

    let html = "";

    const days = ["M", "S", "S", "R", "K", "J", "S"];
    days.forEach(day => {
      html += `<div class="cal-box header">${day}</div>`;
    });

    for (let i = 0; i < firstDay; i++) {
      html += `<div class="cal-box empty"></div>`;
    }

    for (let i = 1; i <= totalDays; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;

      const isToday =
        i === today.getDate() &&
        month === today.getMonth() &&
        year === today.getFullYear();

      const hasEvent = eventDates.has(dateStr);

      html += `
        <div class="cal-box ${hasEvent ? "event" : ""} ${isToday ? "today" : ""}">
          ${i}
        </div>
      `;
    }

    calendarEl.innerHTML = html;
    calendarTitle.innerText = `${monthNames[month]} ${year}`;
  }

  function applyFilter(filter) {
    if (filter === "all") {
      renderList(allData);
      return;
    }

    renderList(allData.filter(item => computeStatus(item) === filter));
  }

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const active = document.querySelector(".filter .active");
      if (active) active.classList.remove("active");
      btn.classList.add("active");
      applyFilter(btn.dataset.filter);
    });
  });

  if (prevMonth) {
    prevMonth.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar(allData);
    });
  }

  if (nextMonth) {
    nextMonth.addEventListener("click", () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar(allData);
    });
  }

  const cached = readCache();
  if (cached) {
    allData = sortAgendaByStartAsc(normalizeAgenda(cached));
    renderList(allData);
    renderSlider(allData);
    renderCalendar(allData);
    hideLoading();
  } else {
    showLoading();
  }

  fetchJson("agenda")
    .then(data => {
      allData = sortAgendaByStartAsc(normalizeAgenda(data));
      writeCache(allData);
      hideLoading();
      renderList(allData);
      renderSlider(allData);
      renderCalendar(allData);
    })
    .catch(err => {
      console.error("Gagal load agenda:", err);
      if (!cached) showLoading("Gagal memuat agenda.");
    });
});