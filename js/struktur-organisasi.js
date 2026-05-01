document.addEventListener("DOMContentLoaded", () => {
  const statsContainer = document.getElementById("strukturStats");
  const roleCards = document.getElementById("roleCards");
  const memberList = document.getElementById("memberList");

  fetch("data/organisasi.json")
    .then((res) => {
      if (!res.ok) throw new Error("Gagal memuat organisasi.json");
      return res.json();
    })
    .then((data) => {
      renderStats(statsContainer, data.stats || []);
      renderRoleCards(roleCards, data);
      renderMemberList(memberList, data.anggota || []);
      if (window.feather) feather.replace();
    })
    .catch((err) => {
      console.error(err);
      if (roleCards) roleCards.innerHTML = "<div class='org-empty'>Data organisasi gagal dimuat.</div>";
    });

  function renderStats(container, stats) {
    if (!container) return;

    container.innerHTML = stats.map((item, index) => `
      <div class="stat-card stat-${index + 1}">
        <div class="stat-num" data-target="${item.value}">0</div>
        <p>${item.label}</p>
      </div>
    `).join("");

    container.querySelectorAll(".stat-num").forEach((el) => {
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

  function renderRoleCards(container, data) {
    if (!container) return;

    const groups = [
      {
        key: "sekretaris",
        title: "Sekretaris",
        accent: "admin",
        icon: "file-text"
      },
      {
        key: "ketua",
        title: "Pimpinan",
        accent: "chief",
        icon: "user-check"
      },
      {
        key: "bendahara",
        title: "Bendahara",
        accent: "finance",
        icon: "credit-card"
      },
      {
        key: "koordinator",
        title: "Koordinasi",
        accent: "coord",
        icon: "shuffle"
      },
      {
        key: "anggota",
        title: "Anggota",
        accent: "member",
        icon: "users"
      }
    ];

    container.innerHTML = groups.map((group) => `
      <div class="structure-card" data-group="${group.key}">
        <div class="structure-card-top">
          <span class="org-quick-tag ${group.accent}">${group.title}</span>
          <i data-feather="${group.icon}"></i>
        </div>

        <div class="structure-card-body">
          <img class="structure-photo" src="" alt="">
          <div class="structure-meta">
            <h3></h3>
            <p class="structure-role"></p>
            <p class="structure-note"></p>
          </div>
        </div>
      </div>
    `).join("");

    groups.forEach((group) => {
      const card = container.querySelector(`.structure-card[data-group="${group.key}"]`);
      const list = Array.isArray(data[group.key]) ? data[group.key] : [];

      if (!card) return;

      if (list.length === 0) {
        card.querySelector(".structure-card-body").innerHTML = "<div class='org-empty'>Belum ada data.</div>";
        return;
      }

      let index = 0;
      let current = list[index];
      const photo = card.querySelector(".structure-photo");
      const name = card.querySelector("h3");
      const role = card.querySelector(".structure-role");
      const note = card.querySelector(".structure-note");

      function paint(item) {
        photo.src = item.foto;
        photo.alt = item.nama;
        name.textContent = item.nama;
        role.textContent = item.role;
        note.textContent = item.catatan || "";
      }

      function fadeSwap() {
        card.classList.add("is-fading");
        setTimeout(() => {
          index = (index + 1) % list.length;
          current = list[index];
          paint(current);
          card.classList.remove("is-fading");
        }, 180);
      }

      paint(current);

      if (list.length > 1) {
        setInterval(fadeSwap, 3200);
      }
    });
  }

  function renderMemberList(container, members) {
    if (!container) return;

    container.innerHTML = members.map((item) => `
      <div class="member-pill">
        <img src="${item.foto}" alt="${item.nama}">
        <div>
          <h4>${item.nama}</h4>
          <p>${item.role}</p>
        </div>
      </div>
    `).join("");
  }
});