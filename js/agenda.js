const container = document.getElementById("agendaContainer");
const buttons = document.querySelectorAll(".filter button");

let allData = [];

fetch('data/agenda.json')
  .then(res => res.json())
  .then(data => {
    allData = data;
    tampilkan(data);
    initSlider(data);
  });

function getStatus(tanggal) {
  const today = new Date();
  const tgl = new Date(tanggal);
  return tgl >= today ? "upcoming" : "done";
}

function tampilkan(data) {
  container.innerHTML = "";

  data.forEach(item => {
    const status = getStatus(item.tanggal);

    const card = `
      <div class="agenda-card">
        <img src="${item.gambar}">
        <div class="agenda-body">
          <span class="agenda-date">${item.tanggal}</span>
          <h3>${item.judul}</h3>
          <p>${item.deskripsi}</p>
          <span class="status ${status}">
            ${status === "upcoming" ? "Akan Datang" : "Selesai"}
          </span>
        </div>
      </div>
    `;

    container.innerHTML += card;
  });
}

/* FILTER */
buttons.forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter .active").classList.remove("active");
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    if (filter === "all") {
      tampilkan(allData);
    } else {
      tampilkan(allData.filter(item => getStatus(item.tanggal) === filter));
    }
  });
});

/* HERO SLIDER */
const slider = document.getElementById("agendaSlider");

function initSlider(data) {
  const heroData = data.slice(0, 5);

  heroData.forEach(item => {
    slider.innerHTML += `
      <div class="agenda-slide">
        <img src="${item.gambar}">
      </div>
    `;
  });

  let index = 0;

  setInterval(() => {
    index++;
    if (index >= heroData.length) index = 0;
    slider.style.transform = `translateX(-${index * 100}%)`;
  }, 4000);
}

/* HAMBURGER FIX */
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger-menu");
  const navMenu = document.querySelector(".navbar-nav");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function (e) {
      e.preventDefault();
      navMenu.classList.toggle("active");
    });
  }
});

