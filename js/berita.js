const container = document.getElementById("newsContainer");
const filterButtons = document.querySelectorAll(".filter button");

let allData = [];

// LOAD DATA
fetch('data/berita.json')
  .then(res => res.json())
  .then(data => {
    allData = data;
    tampilkanData(data);
  });

// TAMPILKAN CARD
function tampilkanData(data) {
  container.innerHTML = "";

  data.forEach(item => {
    const card = `
      <a href="${item.link}" class="news-card" data-category="${item.kategori}">
        <img src="${item.gambar}">
        <div class="news-body">
          <h3>${item.judul}</h3>
          <p>${item.deskripsi}</p>
          <div class="news-meta">
            <span>${item.tanggal}</span>
          </div>
        </div>
      </a>
    `;
    container.innerHTML += card;
  });
}

// FILTER
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    if (filter === "all") {
      tampilkanData(allData);
    } else {
      const hasil = allData.filter(item => item.kategori === filter);
      tampilkanData(hasil);
    }
  });
});

/* ================= HERO AUTO SLIDER ================= */
const heroSlider = document.getElementById("heroSlider");

fetch('data/berita.json')
  .then(res => res.json())
  .then(data => {

    // ambil max 5 berita
    const heroData = data.slice(0, 5);

    heroData.forEach(item => {
      const slide = `
        <div class="hero-slide">
          <img src="${item.gambar}">
        </div>
      `;
      heroSlider.innerHTML += slide;
    });

    startSlider();
  });

let index = 0;

function startSlider() {
  const slides = document.querySelectorAll(".hero-slide");

  setInterval(() => {
    index++;
    if (index >= slides.length) index = 0;

    heroSlider.style.transform = `translateX(-${index * 100}%)`;
  }, 4000);
}

/* ================= HAMBURGER ================= */
const hamburger = document.getElementById("hamburger-menu");
const navMenu = document.querySelector(".navbar-nav");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});