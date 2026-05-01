<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Tentang Kami - SMAN 1 Krembung</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="stylesheet" href="css/style.css">
  <script src="https://unpkg.com/feather-icons"></script>
</head>

<body>

<!-- NAVBAR -->
<nav class="navbar">
  <div class="brand">
    <img src="img/logodsoul.png" class="logo">
    <a href="index.html" class="navbar-logo">
      sman1krembung<span>jurnalistik</span>.
    </a>
  </div>

  <div class="navbar-nav">
    <a href="index.html">Home</a>
    <a href="tentang-kami.html" class="active">Tentang</a>
    <a href="berita.html">Berita</a>
    <a href="karya.html">Karya</a>
    <a href="agenda.html">Agenda</a>
    <a href="index.html#contact">Kontak</a>
  </div>

  <div class="nav-right">
    <a href="#" id="hamburger-menu"><i data-feather="menu"></i></a>
  </div>
</nav>

<!-- HERO -->
<section class="about-hero">
  <div class="about-hero-overlay"></div>
  <div class="about-hero-content">
    <h1>Tentang Kami</h1>
    <p>Jurnalistik SMAN 1 Krembung</p>
  </div>
</section>

<!-- INTRO -->
<section class="about-intro">
  <h2>Kami Bukan Sekadar Ekstrakurikuler</h2>
  <p>
    Jurnalistik SMAN 1 Krembung adalah ruang berkembang bagi siswa untuk berkarya,
    berpikir kritis, dan menyampaikan cerita melalui media digital.
  </p>
</section>

<!-- VISI MISI -->
<section class="about-visi">
  <div class="visi-card">
    <h3>Visi</h3>
    <p>Menjadi media sekolah yang kreatif, informatif, dan berdampak.</p>
  </div>

  <div class="misi-card">
    <h3>Misi</h3>
    <ul>
      <li>Menyampaikan informasi yang akurat</li>
      <li>Mendorong kreativitas siswa</li>
      <li>Mengembangkan literasi digital</li>
      <li>Membangun pola pikir kritis</li>
    </ul>
  </div>
</section>

<!-- KEGIATAN -->
<section class="about-kegiatan">
  <h2>Kegiatan Utama</h2>

  <div class="kegiatan-grid">
    <div class="kegiatan-card">
      <i data-feather="edit-3"></i>
      <h3>Menulis</h3>
      <p>Membuat berita dan artikel</p>
    </div>

    <div class="kegiatan-card">
      <i data-feather="camera"></i>
      <h3>Fotografi</h3>
      <p>Mengabadikan momen sekolah</p>
    </div>

    <div class="kegiatan-card">
      <i data-feather="video"></i>
      <h3>Videografi</h3>
      <p>Konten visual kreatif</p>
    </div>

    <div class="kegiatan-card">
      <i data-feather="globe"></i>
      <h3>Publikasi</h3>
      <p>Website & media sosial</p>
    </div>
  </div>
</section>

<!-- TIM -->
<section class="about-team">
  <h2>Tim Jurnalistik</h2>
  <div class="team-grid" id="teamContainer"></div>
</section>

<!-- CTA -->
<section class="about-cta">
  <div class="cta-box">
    <h2>Siap Bergabung?</h2>
    <p>Jadilah bagian dari tim kreatif kami 🚀</p>
    <a href="daftar-ekstra.html" class="cta-btn">Daftar Sekarang</a>
  </div>
</section>

<!-- FOOTER -->
<footer class="footer">
  <h3>SMAN 1 Krembung Jurnalistik</h3>
  <p>Media sekolah yang berkembang bersama siswa</p>
</footer>

<script src="js/tentang.js"></script>

<script>
feather.replace();

const menu = document.querySelector('#hamburger-menu');
const nav = document.querySelector('.navbar-nav');

menu.onclick = () => {
  nav.classList.toggle('active');
};
</script>

</body>
</html>