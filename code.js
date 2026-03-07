document.addEventListener("DOMContentLoaded", () => {
  const rates = [
    [0.95, 0.05], [0.9, 0.1], [0.85, 0.15], [0.85, 0.15], [0.8, 0.2],
    [0.75, 0.25], [0.7, 0.3], [0.65, 0.35], [0.6, 0.4], [0.55, 0.45],
    [0.5, 0.5], [0.45, 0.55], [0.4, 0.6], [0.35, 0.65], [0.3, 0.7],
    [0.3, 0.679], [0.3, 0.679], [0.15, 0.782], [0.15, 0.782], [0.15, 0.765],
    [0.3, 0.595], [0.15, 0.7225], [0.15, 0.68], [0.1, 0.72], [0.1, 0.72],
    [0.1, 0.72], [0.07, 0.744], [0.05, 0.76], [0.03, 0.776], [0.01, 0.792]
  ];

  class Attempt {
    constructor(start) {
      this.curr_stars = start;
      this.booms = 0;
      this.meso_spent = 0;
    }
  }

  function calculateCost(level, star, mvp, minusMeso, safe) {
    const eq = level ** 3;
    let cs = 0;

    if (star <= 9) cs = (star + 1) / 2500;
    else if (star === 10) cs = (11 ** 2.7) / 40000;
    else if (star === 11) cs = (12 ** 2.7) / 22000;
    else if (star === 12) cs = (13 ** 2.7) / 15000;
    else if (star === 13) cs = (14 ** 2.7) / 11000;
    else if (star === 14) cs = (15 ** 2.7) / 7500;
    else if (star >= 15 && star <= 16) cs = ((star + 1) ** 2.7) / 20000;
    else if (star === 17) cs = ((star + 1) ** 2.7) / 15000;
    else if (star === 18) cs = ((star + 1) ** 2.7) / 7000;
    else if (star === 19) cs = ((star + 1) ** 2.7) / 4500;
    else if (star === 20) cs = ((star + 1) ** 2.7) / 20000;
    else if (star === 21) cs = ((star + 1) ** 2.7) / 12500;
    else if (star >= 22 && star <= 29) cs = ((star + 1) ** 2.7) / 20000;
    else return 0;

    let cost = 100 * (Math.round(eq * cs) + 10);

    if (mvp === "Silver" && star <= 16) cost *= 0.97;
    else if (mvp === "Gold" && star <= 16) cost *= 0.95;
    else if (mvp === "Diamond+" && star <= 16) cost *= 0.9;

    if (minusMeso && safe && star >= 15 && star <= 16) {
      const base = cost;
      cost = base * 0.7 + base * 2;
    } else if (minusMeso && safe && star === 17) {
      const base = cost;
      cost = base * 0.7 + base * 3;
    } else if (minusMeso) {
      cost *= 0.7;
    }

    return cost;
  }

  function mean(arr) {
    if (!arr.length) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }

  function median(arr) {
    if (!arr.length) return 0;
    const sorted = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2
      ? sorted[mid]
      : (sorted[mid - 1] + sorted[mid]) / 2;
  }

  function simulate(minusBoom, minusMeso, level, mvp, safe, target, start, tries) {
    const meso = [];
    const booms = [];

    for (let i = 0; i < tries; i++) {
      const a = new Attempt(start);

      while (a.curr_stars < target) {
        let success = rates[a.curr_stars][0];
        let fail = rates[a.curr_stars][1];
        let boom = 1 - (success + fail);

        if (minusBoom) {
          const moved = boom * 0.3;
          fail += moved;
          boom -= moved;
        }

        a.meso_spent += calculateCost(level, a.curr_stars, mvp, minusMeso, safe);

        const r = Math.random();

        if (r < success) {
          a.curr_stars += 1;
        } else if (r < success + fail || (safe && a.curr_stars >= 15 && a.curr_stars <= 17)) {
          // stay at current star
        } else {
          a.booms += 1;

          if (a.curr_stars >= 15 && a.curr_stars <= 19) a.curr_stars = 12;
          else if (a.curr_stars === 20) a.curr_stars = 15;
          else if (a.curr_stars >= 21 && a.curr_stars <= 22) a.curr_stars = 17;
          else if (a.curr_stars >= 23 && a.curr_stars <= 25) a.curr_stars = 19;
          else if (a.curr_stars >= 26) a.curr_stars = 20;
        }
      }

      meso.push(a.meso_spent);
      booms.push(a.booms);
    }

    return { meso, booms };
  }

  function buildHistogram(data, bucketSize) {
    const bins = {};

    for (const value of data) {
      const bucket = Math.floor(value / bucketSize) * bucketSize;
      bins[bucket] = (bins[bucket] || 0) + 1;
    }

    const sortedKeys = Object.keys(bins)
      .map(Number)
      .sort((a, b) => a - b);

    return {
      labels: sortedKeys.map(v => v.toLocaleString()),
      values: sortedKeys.map(v => bins[v])
    };
  }

  function buildCountMap(data) {
    const counts = {};
    for (const value of data) {
      counts[value] = (counts[value] || 0) + 1;
    }

    const sortedKeys = Object.keys(counts)
      .map(Number)
      .sort((a, b) => a - b);

    return {
      labels: sortedKeys.map(String),
      values: sortedKeys.map(v => counts[v])
    };
  }

  let mesoChart = null;
  let boomChart = null;

  function drawMesoChart(data) {
    const ctx = document.getElementById("mesoChart");
    const max = Math.max(...data);
    const bucketSize = Math.max(1, Math.ceil(max / 12));
    const hist = buildHistogram(data, bucketSize);

    if (mesoChart) mesoChart.destroy();

    mesoChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: hist.labels,
        datasets: [
          {
            label: "Meso Cost Distribution",
            data: hist.values
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#e5e7eb" }
          }
        },
        scales: {
          x: {
            ticks: { color: "#9ca3af" },
            grid: { color: "#1e293b" }
          },
          y: {
            beginAtZero: true,
            ticks: { color: "#9ca3af" },
            grid: { color: "#1e293b" }
          }
        }
      }
    });
  }

  function drawBoomChart(data) {
    const ctx = document.getElementById("boomChart");
    const counts = buildCountMap(data);

    if (boomChart) boomChart.destroy();

    boomChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: counts.labels,
        datasets: [
          {
            label: "Boom Count Distribution",
            data: counts.values
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: "#e5e7eb" }
          }
        },
        scales: {
          x: {
            ticks: { color: "#9ca3af" },
            grid: { color: "#1e293b" }
          },
          y: {
            beginAtZero: true,
            ticks: { color: "#9ca3af" },
            grid: { color: "#1e293b" }
          }
        }
      }
    });
  }

  const form = document.querySelector(".sf-form");
  const results = document.querySelector("#results");

  if (!form || !results) {
    console.error("Form or results container not found.");
    return;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const level = parseInt(document.querySelector("#level").value, 10);
    const start = parseInt(document.querySelector("#startStar").value, 10);
    const target = parseInt(document.querySelector("#targetStar").value, 10);
    const tries = parseInt(document.querySelector("#tries").value, 10);

    const safe = document.querySelector("#safe").checked;
    const minusBoom = document.querySelector("#boomEvent").checked;
    const minusMeso = document.querySelector("#mesoEvent").checked;
    const mvp = document.querySelector("#mvp").value;

    if (
      Number.isNaN(level) ||
      Number.isNaN(start) ||
      Number.isNaN(target) ||
      Number.isNaN(tries)
    ) {
      results.innerHTML = `<p>Please enter valid numbers.</p>`;
      return;
    }

    if (start < 0 || start > 29 || target < 1 || target > 30 || start >= target) {
      results.innerHTML = `<p>Make sure Start Star is less than Target Star, within valid range.</p>`;
      return;
    }

    if (tries <= 0) {
      results.innerHTML = `<p>Simulation Runs must be at least 1.</p>`;
      return;
    }

    const sim = simulate(minusBoom, minusMeso, level, mvp, safe, target, start, tries);

    results.innerHTML = `
      <div class="info-message">
        <h2>Simulation Complete</h2>
        <p>Here are your results.</p>
      </div>
      <div class="results-placeholder">
        <p><strong>Mean Meso:</strong> ${Math.round(mean(sim.meso)).toLocaleString()}</p>
        <p><strong>Median Meso:</strong> ${Math.round(median(sim.meso)).toLocaleString()}</p>
        <p><strong>Mean Booms:</strong> ${mean(sim.booms).toFixed(2)}</p>
        <p><strong>Median Booms:</strong> ${median(sim.booms)}</p>
      </div>
    `;

    drawMesoChart(sim.meso);
    drawBoomChart(sim.booms);
  });
});