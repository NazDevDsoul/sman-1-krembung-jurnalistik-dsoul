// ================== INIT ==================
const container = document.getElementById("agendaContainer");
const buttons = document.querySelectorAll(".filter button");
const slider = document.getElementById("agendaSlider");

let allData = [];

// 🔥 state kalender (biar bisa pindah bulan)
let currentDate = new Date();


// ================== FETCH DATA ==================
fetch('data/agenda.json')
  .then(res => res.json())
  .then(data => {

    // urutkan terbaru
    data.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

    allData = data;

    tampilkan(data);
    initSlider(data);
    renderCalendar(data);
  });


// ================== STATUS ==================
function getStatus(tanggal) {
  const today = new Date();
  const tgl = new Date(tanggal);

  today.setHours(0,0,0,0);
  tgl.setHours(0,0,0,0);

  return tgl >= today ? "upcoming" : "done";
}


// ================== TAMPILKAN (MAX 5) ==================
function tampilkan(data) {
  container.innerHTML = "";

  const list = data.slice(0, 5);

  list.forEach(item => {
    const status = getStatus(item.tanggal);

    container.innerHTML += `
      <a href="${item.link}" target="_blank" class="agenda-card">
        <img src="${item.gambar}">
        
        <div class="agenda-body">
          <span class="agenda-date">${formatTanggal(item.tanggal)}</span>

          <h3>${item.judul}</h3>
          <p>${item.deskripsi}</p>

          <div class="agenda-detail">
            <p><b>Waktu:</b> ${item.waktu || '-'}</p>
            <p><b>Dresscode:</b> ${item.dresscode || '-'}</p>
            <p><b>Kegiatan:</b> ${item.kegiatan || '-'}</p>
          </div>

          <span class="status ${status}">
            ${status === "upcoming" ? "Akan Datang" : "Selesai"}
          </span>
        </div>
      </a>
    `;
  });
}


// ================== FORMAT ==================
function formatTanggal(tanggal) {
  const tgl = new Date(tanggal);

  return tgl.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}


// ================== FILTER ==================
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


// ================== HERO SLIDER ==================
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


// ================== KALENDER ==================
function renderCalendar(data) {
  const calendar = document.getElementById("calendar");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const eventDates = data.map(item => item.tanggal);

  let html = "";

  // 🔥 HEADER HARI
  const days = ["M","S","S","R","K","J","S"];
  days.forEach(day => {
    html += `<div class="cal-box header">${day}</div>`;
  });

  // kosong awal
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-box empty"></div>`;
  }

  // tanggal
  for (let i = 1; i <= totalDays; i++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(i).padStart(2,'0')}`;

    const isToday =
      i === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear();

    const hasEvent = eventDates.includes(dateStr);

    html += `
      <div class="
        cal-box
        ${hasEvent ? 'event' : ''}
        ${isToday ? 'today' : ''}
      ">
        ${i}
      </div>
    `;
  }

  calendar.innerHTML = html;

  // 🔥 JUDUL BULAN
  const monthNames = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember"
  ];

  document.getElementById("calendarTitle").innerText =
    `${monthNames[month]} ${year}`;
}


// ================== NAVIGASI BULAN ==================
document.getElementById("prevMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(allData);
});

document.getElementById("nextMonth").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(allData);
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