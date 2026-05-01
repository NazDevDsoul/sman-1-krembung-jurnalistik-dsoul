document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("newsContainer");
  const loading = document.getElementById("loading");
  const filterButtons = document.querySelectorAll(".filter button");
  const heroSlider = document.getElementById("heroSlider");
  const hamburger = document.getElementById("hamburger-menu");
  const navMenu = document.querySelector(".navbar-nav");

  const BASE_API =
    "https://script.google.com/macros/s/AKfycbyw221VQqj3ql5INNphqZfSfDtpkrFt2xcJTSlgxu7AknNu81KAwyHx5hMyvSC6Px5Z/exec?type=berita";

  const CACHE_KEY = "berita_cache_v1";
  const CACHE_TTL = 5 * 60 * 1000;

  let allData = [];

  function showLoading(text = "Memuat berita...") {
    if (!loading) return;
    loading.style.display = "flex";
    loading.innerHTML = `
      <div class="spinner"></div>
      <p>${text}</p>
    `;
  }

  function hideLoading() {
    if (!loading) return;
    loading.style.display = "none";
  }

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
      localStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          time: Date.now(),
          data,
        })
      );
    } catch {
      // ignore
    }
  }

  function normalizeData(data) {
    if (!Array.isArray(data)) return [];

    return data.map((item, index) => ({
      id: item.id ?? index,
      judul: item.judul || "",
      deskripsi: item.deskripsi || "",
      gambar: item.gambar || "img/default.jpg",
      tanggal: item.tanggal || "",
      kategori: String(item.kategori || "").toLowerCase(),
      link: item.link || `detail-berita.html?id=${item.id ?? index}`,
      isi: item.isi || "",
      penulis: item.penulis || "",
      status: item.status || "",
    }));
  }

  function renderList(data) {
    if (!container) return;

    if (!data.length) {
      container.innerHTML =
        "<div style='text-align:center;padding:2rem;color:#555;'>Belum ada berita yang tersedia.</div>";
      return;
    }

    container.innerHTML = data
      .map(
        (item) => `
      <a href="detail-berita.html?id=${encodeURIComponent(item.id)}" class="news-card" data-category="${item.kategori}">
        <img src="${item.gambar}" alt="${item.judul}" loading="lazy" onerror="this.src='img/default.jpg'">
        <div class="news-body">
          <h3>${item.judul}</h3>
          <p>${item.deskripsi}</p>
          <div class="news-meta">
            <span>${item.tanggal}</span>
          </div>
        </div>
      </a>
    `
      )
      .join("");

    container.classList.add("fade-in");
  }

  function initHeroSlider(data) {
    if (!heroSlider) return;

    const heroData = data.slice(0, 5);
    if (!heroData.length) return;

    heroSlider.innerHTML = [...heroData, ...heroData]
      .map(
        (item) => `
      <div class="hero-slide">
        <img src="${item.gambar}" alt="${item.judul}" loading="lazy" onerror="this.src='img/default.jpg'">
      </div>
    `
      )
      .join("");

    let index = 0;
    setInterval(() => {
      index++;
      if (index >= heroData.length) index = 0;
      heroSlider.style.transform = `translateX(-${index * 100}%)`;
    }, 4000);
  }

  function applyFilter(filter) {
    if (filter === "all") {
      renderList(allData);
      return;
    }
    renderList(allData.filter((item) => item.kategori === filter));
  }

  function setupFilters() {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const active = document.querySelector(".filter .active");
        if (active) active.classList.remove("active");
        btn.classList.add("active");
        applyFilter(btn.dataset.filter);
      });
    });
  }

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", (e) => {
      e.preventDefault();
      navMenu.classList.toggle("active");
    });
  }

  const cached = readCache();
  if (cached) {
    allData = normalizeData(cached);
    renderList(allData);
    initHeroSlider(allData);
    setupFilters();
  } else {
    showLoading();
  }

  fetch(`${BASE_API}&nocache=${Date.now()}`, { cache: "no-store" })
    .then((res) => {
      if (!res.ok) throw new Error("Gagal memuat berita");
      return res.json();
    })
    .then((data) => {
      const normalized = normalizeData(data);
      allData = normalized;
      writeCache(normalized);

      hideLoading();
      renderList(allData);
      initHeroSlider(allData);
      setupFilters();
    })
    .catch((err) => {
      console.error("Gagal load berita:", err);
      if (!cached) {
        showLoading("Gagal memuat berita.");
      }
    });
});