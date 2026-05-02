document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("prestasiContainer");
  const loading = document.getElementById("loading");
  const filterButtons = document.querySelectorAll(".filter button");
  const heroSlider = document.getElementById("prestasiSlider");
  const hamburger = document.getElementById("hamburger-menu");
  const navMenu = document.querySelector(".navbar-nav");

  const CACHE_KEY = "prestasi_cache_v3";
  const CACHE_TTL = 5 * 60 * 1000;

  let allData = [];

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

  function showLoading(text = "Memuat prestasi...") {
    if (!loading) return;
    loading.style.display = "flex";
    loading.innerHTML = `<div class="spinner"></div><p>${text}</p>`;
  }

  function hideLoading() {
    if (!loading) return;
    loading.style.display = "none";
  }

  function normalizeData(data) {
    if (!Array.isArray(data)) return [];
    return data.map((item, index) => ({
      id: item.id ?? `p-${index + 1}`,
      sumber: item.sumber || "umum",
      status: item.status || "",
      judul: item.judul || "",
      deskripsi: item.deskripsi || "",
      gambar: item.gambar || "img/default.jpg",
      tanggal: item.tanggal || "",
      kategori: String(item.kategori || "").toLowerCase(),
      link: item.link || "",
      isi: item.isi || "",
      penulis: item.penulis || ""
    }));
  }

  function sortByDateDesc(data) {
    return [...data].sort((a, b) => {
      const da = new Date(a.tanggal || 0).getTime();
      const db = new Date(b.tanggal || 0).getTime();
      return db - da;
    });
  }

  function renderList(data) {
    if (!container) return;

    if (!data.length) {
      container.innerHTML = "<div style='text-align:center;padding:2rem;color:#555;'>Belum ada prestasi yang tersedia.</div>";
      return;
    }

    container.innerHTML = data.map(item => {
      const badge = item.sumber === "internal" ? "Internal" : "Umum";
      return `
        <a href="detail-prestasi.html?id=${encodeURIComponent(item.id)}" class="karya-card" data-category="${item.kategori}" data-source="${item.sumber}">
          <div class="karya-img">
            <img src="${item.gambar}" alt="${item.judul}" loading="lazy" onerror="this.src='img/default.jpg'">
            <span class="badge ${item.sumber}">${badge}</span>
          </div>
          <div class="karya-body">
            <h3>${item.judul}</h3>
            <p>${item.deskripsi}</p>
            <small>${item.tanggal || ""}</small>
          </div>
        </a>
      `;
    }).join("");

    container.classList.add("fade-in");
  }

  function initHeroSlider(data) {
    if (!heroSlider) return;

    const heroData = data.slice(0, 5);
    if (!heroData.length) return;

    heroSlider.innerHTML = [...heroData, ...heroData].map(item => `
      <div class="karya-slide">
        <img src="${item.gambar}" alt="${item.judul}" loading="lazy" onerror="this.src='img/default.jpg'">
      </div>
    `).join("");

    let index = 0;
    setInterval(() => {
      index++;
      if (index >= heroData.length) index = 0;
      heroSlider.style.transform = `translateX(-${index * 100}%)`;
    }, 4000);
  }

  function applyFilter(filter) {
    if (filter === "all") return renderList(allData);
    if (filter === "lomba" || filter === "sekolah" || filter === "lainnya") {
      return renderList(allData.filter(item => item.kategori === filter));
    }
    renderList(allData.filter(item => item.sumber === filter));
  }

  function setupFilters() {
    filterButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        const active = document.querySelector(".filter .active");
        if (active) active.classList.remove("active");
        btn.classList.add("active");
        applyFilter(btn.dataset.filter);
      });
    });
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", e => {
      e.preventDefault();
      navMenu.classList.toggle("active");
    });
  }

  setupFilters();

  const cached = readCache();
  if (cached) {
    allData = sortByDateDesc(normalizeData(cached));
    renderList(allData);
    initHeroSlider(allData);
  } else {
    showLoading();
  }

  fetchJson("prestasi")
    .then(data => {
      allData = sortByDateDesc(normalizeData(data));
      writeCache(allData);
      hideLoading();
      renderList(allData);
      initHeroSlider(allData);
    })
    .catch(err => {
      console.error("Gagal load prestasi:", err);
      if (!cached) showLoading("Gagal memuat prestasi.");
    });
});