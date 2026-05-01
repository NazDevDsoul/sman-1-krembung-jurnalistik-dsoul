document.addEventListener("DOMContentLoaded", () => {
  const statsContainer = document.getElementById("orgStats");

  if (!statsContainer) return;

  const safeFetchJSON = (path) =>
    fetch(path)
      .then((res) => {
        if (!res.ok) throw new Error(`Gagal memuat ${path}`);
        return res.json();
      })
      .catch(() => null);

  Promise.all([
    safeFetchJSON("data/organisasi.json"),
    safeFetchJSON("data/prestasi-internal.json"),
    safeFetchJSON("data/karya-internal.json"),
  ]).then(([orgData, prestasiInternal, karyaInternal]) => {
    const anggotaCount = countUniqueMembers(orgData);
    const prestasiCount = Array.isArray(prestasiInternal) ? prestasiInternal.length : 0;
    const karyaCount = Array.isArray(karyaInternal) ? karyaInternal.length : 0;

    renderStats([
      { label: "Anggota Jurnalistik", value: anggotaCount },
      { label: "Prestasi", value: prestasiCount },
      { label: "Karya", value: karyaCount },
    ]);
  });

  function normalizeText(text) {
    return String(text || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  function countUniqueMembers(orgData) {
    if (!orgData || typeof orgData !== "object") return 0;

    const groups = ["ketua", "sekretaris", "bendahara", "koordinator", "anggota"];
    const unique = new Set();

    groups.forEach((group) => {
      const list = Array.isArray(orgData[group]) ? orgData[group] : [];

      list.forEach((person) => {
        if (!person) return;

        const key = person.id
          ? `id:${normalizeText(person.id)}`
          : `nama:${normalizeText(person.nama || person.jabatan || "")}`;

        unique.add(key);
      });
    });

    return unique.size;
  }

  function renderStats(items) {
    statsContainer.innerHTML = items
      .map(
        (item) => `
          <div class="stat-card">
            <div class="stat-num" data-target="${item.value}">0</div>
            <p>${item.label}</p>
          </div>
        `
      )
      .join("");

    statsContainer.querySelectorAll(".stat-num").forEach((el) => {
      const target = parseInt(el.dataset.target || "0", 10);
      animateCount(el, target, 1200);
    });
  }

  function animateCount(el, target, duration) {
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(progress * target);
      el.textContent = value.toLocaleString("id-ID");

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }
});