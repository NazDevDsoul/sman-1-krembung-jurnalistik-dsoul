const container = document.getElementById("karyaContainer");
const filterButtons = document.querySelectorAll(".filter button");
const karyaSlider = document.getElementById("karyaSlider");

let allData = [];

/* ================= FETCH SEKALI ================= */
fetch('data/karya.json')
  .then(res => res.json())
  .then(data => {
    allData = data;

    tampilkanData(data);
    loadSlider(data);
  });

/* ================= CARD ================= */
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

/* ================= FILTER ================= */
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

/* ================= HERO SLIDER ================= */
function loadSlider(data) {
  const heroData = data.slice(0, 5);

  let html = "";

  // 🔥 DUPLIKAT BIAR LOOP TERASA PANJANG
  heroData.forEach(item => {
    html += `
      <div class="karya-slide">
        <img src="${item.gambar}">
      </div>
    `;
  });

  heroData.forEach(item => {
    html += `
      <div class="karya-slide">
        <img src="${item.gambar}">
      </div>
    `;
  });

  karyaSlider.innerHTML = html;

  startKaryaSlider();
  enableDrag();
}

let karyaIndex = 0;

function startKaryaSlider() {
  const slides = document.querySelectorAll(".karya-slide");

  setInterval(() => {
    karyaIndex++;
    if (karyaIndex >= slides.length / 2) karyaIndex = 0;

    karyaSlider.style.transition = "0.8s ease";
    karyaSlider.style.transform = `translateX(-${karyaIndex * 100}%)`;
  }, 4000);
}

/* ================= DRAG SLIDER ================= */
function enableDrag() {
  let isDown = false;
  let startX;
  let scrollLeft;

  karyaSlider.addEventListener("mousedown", (e) => {
    isDown = true;
    startX = e.pageX;
    scrollLeft = karyaIndex;
  });

  karyaSlider.addEventListener("mouseup", () => isDown = false);
  karyaSlider.addEventListener("mouseleave", () => isDown = false);

  karyaSlider.addEventListener("mousemove", (e) => {
    if (!isDown) return;

    const walk = (e.pageX - startX) / 100;
    karyaSlider.style.transform =
      `translateX(-${(scrollLeft - walk) * 100}%)`;
  });

  /* TOUCH */
  karyaSlider.addEventListener("touchstart", (e) => {
    startX = e.touches[0].pageX;
    scrollLeft = karyaIndex;
  });

  karyaSlider.addEventListener("touchmove", (e) => {
    const walk = (e.touches[0].pageX - startX) / 100;
    karyaSlider.style.transform =
      `translateX(-${(scrollLeft - walk) * 100}%)`;
  });
}

/* ================= HAMBURGER ================= */
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger-menu");
  const navMenu = document.querySelector(".navbar-nav");

  if (hamburger && navMenu) {

    hamburger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      navMenu.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active");
      }
    });

  }
});