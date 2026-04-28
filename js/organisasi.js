fetch('data/organisasi.json')
  .then(res => res.json())
  .then(data => {

    /* ================= STATS ================= */
    const statsContainer = document.getElementById("orgStats");

    data.stats.forEach(item => {
      statsContainer.innerHTML += `
        <div class="stat-card">
          <h2>${item.value}</h2>
          <p>${item.label}</p>
        </div>
      `;
    });

    /* ================= FUNCTION CARD ================= */
    function createSlider(id, list) {
      const container = document.getElementById(id);

      let index = 0;

      container.innerHTML = `
        <div class="org-inner"></div>
      `;

      const inner = container.querySelector(".org-inner");

      function render() {
        const item = list[index];

        inner.innerHTML = `
          <img src="${item.foto}">
          <div>
            <h3>${item.nama}</h3>
            <p>${item.role}</p>
          </div>
        `;

        inner.classList.remove("fade");
        setTimeout(() => inner.classList.add("fade"), 50);
      }

      render();

      setInterval(() => {
        index++;
        if (index >= list.length) index = 0;
        render();
      }, 3000);
    }

    /* ================= INIT ================= */
    createSlider("ketua", data.ketua);
    createSlider("sekretaris", data.sekretaris);
    createSlider("bendahara", data.bendahara);
    createSlider("koordinator", data.koordinator);
    createSlider("member", data.member);

  });