// ================== FETCH DATA UTAMA ==================
fetch('data/tentang.json')
  .then(res => res.json())
  .then(data => {

    document.getElementById("judul").innerText = data.judul;
    document.getElementById("tagline").innerText = data.tagline;
    document.getElementById("deskripsi").innerText = data.deskripsi;
    document.getElementById("visi").innerText = data.visi;

    // misi
    const misiContainer = document.getElementById("misi");
    data.misi.forEach(item => {
      misiContainer.innerHTML += `<li>${item}</li>`;
    });

    // link daftar
    document.getElementById("linkDaftar").href = data.linkDaftar;
  });


// ================== KEGIATAN ==================
fetch('data/kegiatan.json')
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById("kegiatanContainer");

    data.forEach(item => {
      container.innerHTML += `
        <div class="card">
          <img src="${item.gambar}">
          <h3>${item.judul}</h3>
          <p>${item.deskripsi}</p>
        </div>
      `;
    });

  });


// ================== TIM ==================
fetch('data/tim.json')
  .then(res => res.json())
  .then(data => {

    const container = document.getElementById("timContainer");

    data.forEach(item => {
      container.innerHTML += `
        <div class="card">
          <img src="${item.foto}">
          <h3>${item.nama}</h3>
          <p>${item.jabatan}</p>
        </div>
      `;
    });

  });


// ================== HAMBURGER ==================
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