const container = document.getElementById("detailContainer");
const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch("data/karya-internal.json")
  .then(res => res.json())
  .then(data => {
    const item = data.find(d => String(d.id) === String(id));

    if (!item) {
      container.innerHTML = "<h2>Karya tidak ditemukan</h2>";
      return;
    }

    container.innerHTML = `
      <h1>${item.judul}</h1>
      <p><b>${item.tanggal || ""}</b></p>
      <img src="${item.gambar}" alt="${item.judul}">
      <p>${item.deskripsi}</p>
      <div>${item.isi || ""}</div>
    `;
  })
  .catch(() => {
    container.innerHTML = "<h2>Karya tidak ditemukan</h2>";
  });