const container = document.getElementById("detailContainer");

// ambil id dari URL
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

// fetch data
Promise.all([
  fetch("data/prestasi.json").then(res => res.json()).catch(() => []),
  fetch("data/prestasi-internal.json").then(res => res.json()).catch(() => [])
]).then(([umum, internal]) => {

  const allData = [...umum, ...internal];

  // cari berdasarkan id
  const item = allData.find(d => String(d.id) === String(id));

  if (!item) {
    container.innerHTML = "<h2>Data tidak ditemukan</h2>";
    return;
  }

  // tampilkan detail
  container.innerHTML = `
    <div class="detail-card">
      <img src="${item.gambar}" class="detail-img">
      
      <div class="detail-content">
        <span class="detail-kategori">${item.kategori || ""}</span>
        <h1>${item.judul}</h1>
        <small>${item.tanggal || ""}</small>

        <p>${item.deskripsi}</p>
        <p>${item.isi || ""}</p>
      </div>
    </div>
  `;
});