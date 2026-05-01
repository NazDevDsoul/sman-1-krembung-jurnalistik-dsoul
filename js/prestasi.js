const container = document.getElementById("prestasiContainer");
const buttons = document.querySelectorAll(".filter button");
const heroSlider = document.getElementById("prestasiSlider");

let allData = [];

// ================= FETCH DATA =================
function safeFetchJSON(path) {
  return fetch(path)
    .then(res => {
      if (!res.ok) throw new Error(`Gagal memuat ${path}`);
      return res.json();
    })
    .catch(() => []);
}

Promise.all([
  safeFetchJSON("data/prestasi.json"),
  safeFetchJSON("data/prestasi-internal.json")
]).then(([umum, internal]) => {

  // GABUNG + SORT TERBARU
  allData = [...umum, ...internal].sort((a, b) => {
    const da = new Date(a.tanggal || "1970-01-01");
    const db = new Date(b.tanggal || "1970-01-01");
    return db - da;
  });

  tampilkan(allData);
  initHeroSlider(allData);
});

// ================= TAMPILKAN CARD =================
function tampilkan(data) {
  if (!container) return;

  container.innerHTML = "";

  data.forEach(item => {

    // 🔥 AUTO LINK KE DETAIL PAGE
    const href = item.link 
      ? item.link 
      : `detail-prestasi.html?id=${item.id}`;

    const target = href.startsWith("http") ? "_blank" : "_self";

    const card = `
      <a href="${href}" target="${target}" class="karya-card">
        <div class="karya-img">
          <img src="${item.gambar}" alt="${item.judul}">
          <span class="karya-badge">${item.kategori || "prestasi"}</span>
        </div>
        <div class="karya-body">
          <h3>${item.judul}</h3>
          <p>${item.deskripsi}</p>
          <small>${item.tanggal || item.tahun || ""}</small>
        </div>
      </a>
    `;

    container.innerHTML += card;
  });
}

// ================= FILTER =================
buttons.forEach(btn => {
  btn.addEventListener("click", () => {

    document.querySelector(".filter .active").classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    if (filter === "all") {
      tampilkan(allData);
    } else {
      tampilkan(allData.filter(item => item.kategori === filter));
    }
  });
});

// ================= HERO SLIDER =================
function initHeroSlider(data) {
  if (!heroSlider) return;

  const heroData = data.slice(0, 5);
  if (heroData.length === 0) return;

  let html = "";

  // DUPLIKAT SLIDE BIAR LOOP HALUS
  heroData.forEach(item => {
    html += `
      <div class="karya-slide">
        <img src="${item.gambar}" alt="${item.judul}">
      </div>
    `;
  });

  heroData.forEach(item => {
    html += `
      <div class="karya-slide">
        <img src="${item.gambar}" alt="${item.judul}">
      </div>
    `;
  });

  heroSlider.innerHTML = html;

  let index = 0;

  setInterval(() => {
    index++;
    if (index >= heroData.length) index = 0;

    heroSlider.style.transform = `translateX(-${index * 100}%)`;
  }, 4000);
}