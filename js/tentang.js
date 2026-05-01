const container = document.getElementById("teamContainer");

function asArray(value) {
  return Array.isArray(value) ? value : [];
}

fetch("data/organisasi.json")
  .then((res) => {
    if (!res.ok) throw new Error("Gagal memuat data/organisasi.json");
    return res.json();
  })
  .then((data) => {
    const all = [
      ...asArray(data.ketua),
      ...asArray(data.sekretaris),
      ...asArray(data.bendahara),
      ...asArray(data.koordinator),
      ...asArray(data.anggota)
    ];

    const seen = new Set();
    const unique = [];

    all.forEach((item) => {
      const key = item.id ? String(item.id).trim() : String(item.nama || "").trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    });

    renderMembers(unique);
  })
  .catch(() => {
    if (container) {
      container.innerHTML = `<div class="team-empty">Data tim belum tersedia.</div>`;
    }
  });

function renderMembers(data) {
  if (!container) return;

  container.innerHTML = data.map((item) => `
    <div class="team-card">
      <div class="team-photo-wrap">
        <img src="${item.foto || 'img/logodsoul.png'}" alt="${item.nama || ''}">
      </div>
      <div class="team-body">
        <span class="team-role">${item.role || item.jabatan || 'Anggota'}</span>
        <h3>${item.nama || '-'}</h3>
        <p>${item.catatan || ''}</p>
      </div>
    </div>
  `).join("");
}