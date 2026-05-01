const container = document.getElementById("karyaInternalContainer");
const buttons = document.querySelectorAll(".filter button");
const heroSlider = document.getElementById("karyaInternalSlider");

let allData = [];

function safeFetchJSON(path) {
  return fetch(path)
    .then(res => {
      if (!res.ok) throw new Error(`Gagal memuat ${path}`);
      return res.json();
    })
    .catch(() => []);
}

safeFetchJSON("data/karya-internal.json").then(data => {
  allData = [...data].sort((a, b) => {
    const da = new Date(a.tanggal || "1970-01-01");
    const db = new Date(b.tanggal || "1970-01-01");
    return db - da;
  });

  tampilkan(allData);
  initHeroSlider(allData);
});

function tampilkan(data) {
  if (!container) return;

  container.innerHTML = "";

  data.forEach(item => {
    const card = document.createElement("div");
    card.className = "karya-card";

    card.innerHTML = `
      <div class="karya-img">
        <img src="${item.gambar}" alt="${item.judul}">
        <span class="karya-badge">${item.kategori || "karya"}</span>
      </div>
      <div class="karya-body">
        <h3>${item.judul}</h3>
        <p>${item.deskripsi}</p>
        <small>${item.tanggal || ""}</small>
      </div>
    `;

    card.addEventListener("click", () => {
      window.location.href = `detail-karya-internal.html?id=${encodeURIComponent(item.id)}`;
    });

    container.appendChild(card);
  });
}

buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    const active = document.querySelector(".filter .active");
    if (active) active.classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    if (filter === "all") {
      tampilkan(allData);
    } else {
      tampilkan(allData.filter(item => item.kategori === filter));
    }
  });
});

function initHeroSlider(data) {
  if (!heroSlider) return;

  const heroData = data.slice(0, 5);
  if (heroData.length === 0) return;

  let html = "";

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