const container = document.getElementById("karyaContainer");
const filterButtons = document.querySelectorAll(".filter button");

let allData = [];

fetch('data/karya.json')
  .then(res => res.json())
  .then(data => {
    allData = data;
    tampilkanData(data);
  });

function tampilkanData(data) {
  container.innerHTML = "";

  data.forEach(item => {
    const card = `
      <a href="${item.link}" class="karya-card">
        <div class="karya-img">
          <img src="${item.gambar}">
          <span class="karya-badge">${item.kategori}</span>
        </div>
        <div class="karya-body">
          <h3>${item.judul}</h3>
          <p>${item.deskripsi}</p>
        </div>
      </a>
    `;
    container.innerHTML += card;
  });
}

filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    if (filter === "all") {
      tampilkanData(allData);
    } else {
      tampilkanData(allData.filter(item => item.kategori === filter));
    }
  });
});

/* ================= HAMBURGER FIX FINAL ================= */
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger-menu");
  const navMenu = document.querySelector(".navbar-nav");

  if (hamburger && navMenu) {

    hamburger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      navMenu.classList.toggle("active");
    });

    // klik luar = nutup
    document.addEventListener("click", function (e) {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
      }
    });

  }
});

/* ================= HERO KARYA AUTO SLIDER ================= */
const karyaSlider = document.getElementById("karyaSlider");

fetch('data/karya.json')
  .then(res => res.json())
  .then(data => {

    const heroData = data.slice(0, 5);

    heroData.forEach(item => {
      const slide = `
        <div class="karya-slide">
          <img src="${item.gambar}">
        </div>
      `;
      karyaSlider.innerHTML += slide;
    });

    startKaryaSlider();
  });

let karyaIndex = 0;

function startKaryaSlider() {
  const slides = document.querySelectorAll(".karya-slide");

  setInterval(() => {
    karyaIndex++;
    if (karyaIndex >= slides.length) karyaIndex = 0;

    karyaSlider.style.transform = `translateX(-${karyaIndex * 100}%)`;
  }, 4000);
}