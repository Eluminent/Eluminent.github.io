import { useState, useRef } from "react";
import "./App.css";
import Chart from "chart.js/auto";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// import Starforce from "./pages/Starforce";
// import Login from "./pages/Login";

/* ================= DATA ================= */

const rates = [
  [0.95, 0.05],[0.9, 0.1],[0.85, 0.15],[0.85, 0.15],[0.8, 0.2],
  [0.75, 0.25],[0.7, 0.3],[0.65, 0.35],[0.6, 0.4],[0.55, 0.45],
  [0.5, 0.5],[0.45, 0.55],[0.4, 0.6],[0.35, 0.65],[0.3, 0.7],
  [0.3, 0.679],[0.3, 0.679],[0.15, 0.782],[0.15, 0.782],[0.15, 0.765],
  [0.3, 0.595],[0.15, 0.7225],[0.15, 0.68],[0.1, 0.72],[0.1, 0.72],
  [0.1, 0.72],[0.07, 0.744],[0.05, 0.76],[0.03, 0.776],[0.01, 0.792]
];

class Attempt {
  constructor(start) {
    this.curr_stars = start;
    this.booms = 0;
    this.meso_spent = 0;
  }
}

/* ================= HELPERS ================= */

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
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function median(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

/* ================= SIMULATION ================= */

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

      if (r < success) a.curr_stars++;
      else if (r >= success + fail) {
        a.booms++;

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

/* ================= APP ================= */

export default function App() {
  const mesoChartRef = useRef(null);
  const boomChartRef = useRef(null);
  const mesoChartInstance = useRef(null);
  const boomChartInstance = useRef(null);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const [formData, setFormData] = useState({
    level: 150,
    startStar: 12,
    targetStar: 17,
    tries: 1000,
    mvp: "No",
    safe: false,
    boomEvent: false,
    mesoEvent: false,
  });

  function handleChange(e) {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  }


 function buildHistogram(data, bucketSize) {
  const bins = {};

  for (const value of data) {
    const bucket = Math.floor(value / bucketSize) * bucketSize;
    bins[bucket] = (bins[bucket] || 0) + 1;
  }

  const keys = Object.keys(bins).map(Number).sort((a, b) => a - b);

  return {
    labels: keys.map(v => v.toLocaleString()), // X-axis (meso)
    values: keys.map(v => bins[v]),            // Y-axis (frequency)
  };
}


function buildCountMap(data) {
  const counts = {};

  for (const value of data) {
    counts[value] = (counts[value] || 0) + 1;
  }

  const keys = Object.keys(counts).map(Number).sort((a, b) => a - b);

  return {
    labels: keys.map(String),     // X-axis (booms)
    values: keys.map(v => counts[v]), // Y-axis (frequency)
  };
}


function drawCharts(mesoData, boomData) {
  if (mesoChartInstance.current) mesoChartInstance.current.destroy();
  if (boomChartInstance.current) boomChartInstance.current.destroy();

  // 🔹 Meso Histogram
  const max = Math.max(...mesoData);
  const bucketSize = Math.max(1, Math.ceil(max / 15));
  const hist = buildHistogram(mesoData, bucketSize);

  mesoChartInstance.current = new Chart(mesoChartRef.current, {
    type: "bar",
    data: {
      labels: hist.labels,
      datasets: [
        {
          label: "Frequency",
          data: hist.values,
        },
      ],
    },
    options: {
      scales: {
        x: { title: { display: true, text: "Meso Cost" } },
        y: { title: { display: true, text: "Frequency" }, beginAtZero: true },
      },
    },
  });

  // 🔹 Boom Distribution
  const boomCounts = buildCountMap(boomData);

  boomChartInstance.current = new Chart(boomChartRef.current, {
    type: "bar",
    data: {
      labels: boomCounts.labels,
      datasets: [
        {
          label: "Frequency",
          data: boomCounts.values,
        },
      ],
    },
    options: {
      scales: {
        x: { title: { display: true, text: "Number of Booms" } },
        y: { title: { display: true, text: "Frequency" }, beginAtZero: true },
      },
    },
  });
}

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const sim = simulate(
        formData.boomEvent,
        formData.mesoEvent,
        Number(formData.level),
        formData.mvp,
        formData.safe,
        Number(formData.targetStar),
        Number(formData.startStar),
        Number(formData.tries)
      );

      setResults({
        meanMeso: Math.round(mean(sim.meso)),
        medianMeso: Math.round(median(sim.meso)),
        meanBooms: mean(sim.booms).toFixed(2),
        medianBooms: median(sim.booms),
      });

      drawCharts(sim.meso, sim.booms);
      setLoading(false);
    }, 0);
  }

  return (
    <div className="app-shell">
      <main className="main">
        <div className="container main-layout">

          <section className="card">
            <h2 className="card-title">Simulation Settings</h2>

            <form className="sf-form" onSubmit={handleSubmit}>
              {/* Item Level */}
              <div className="form-row">
                <label htmlFor="level">Item Level</label>
                <input
                  id="level"
                  type="number"
                  min="1"
                  value={formData.level}
                  onChange={handleChange}
                />
                <p className="input-help">Level of your equipment</p>
              </div>

              {/* Start Star */}
              <div className="form-row">
                <label htmlFor="startStar">Start Star</label>
                <input
                  id="startStar"
                  type="number"
                  min="0"
                  max="29"
                  value={formData.startStar}
                  onChange={handleChange}
                />
                <p className="input-help">Current star level</p>
              </div>

              {/* Target Star */}
              <div className="form-row">
                <label htmlFor="targetStar">Target Star</label>
                <input
                  id="targetStar"
                  type="number"
                  min="1"
                  max="30"
                  value={formData.targetStar}
                  onChange={handleChange}
                />
                <p className="input-help">Desired star level</p>
              </div>

              {/* Runs */}
              <div className="form-row">
                <label htmlFor="tries">Simulation Runs</label>
                <input
                  id="tries"
                  type="number"
                  min="1"
                  value={formData.tries}
                  onChange={handleChange}
                />
                <p className="input-help">More runs = more accurate results</p>
              </div>

              {/* MVP */}
              <div className="form-row">
                <label htmlFor="mvp">MVP Rank</label>
                <select id="mvp" value={formData.mvp} onChange={handleChange}>
                  <option>No</option>
                  <option>Silver</option>
                  <option>Gold</option>
                  <option>Diamond+</option>
                </select>
                <p className="input-help">Applies cost discounts</p>
              </div>

              {/* Options */}
              <div className="form-row form-row--full">
                <fieldset>
                  <legend>Options</legend>

                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        id="safe"
                        checked={formData.safe}
                        onChange={handleChange}
                      />
                      Safeguard (prevents boom)
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        id="boomEvent"
                        checked={formData.boomEvent}
                        onChange={handleChange}
                      />
                      30% Boom Reduction Event
                    </label>

                    <label>
                      <input
                        type="checkbox"
                        id="mesoEvent"
                        checked={formData.mesoEvent}
                        onChange={handleChange}
                      />
                      30% Meso Discount Event
                    </label>
                  </div>
                </fieldset>
              </div>

              {/* Button */}
              <div className="form-actions">
                <button className="btn-primary" type="submit">
                  Run Simulation
                </button>
              </div>
            </form>
          </section>

          <aside className="card info-card">
            <h2 className="card-title">Results</h2>

            {loading && <p>Running simulation...</p>}

            {!results && !loading && (
              <div className="results-placeholder">
                <h3>Waiting for simulation</h3>
                <p>Click "Run Simulation" to see results.</p>
              </div>
            )}

            {results && (
              <div className="results-placeholder">
                <h3>Simulation Complete</h3>
                <p>Here are your results.</p>

                <br />

                <p><strong>Mean Meso:</strong> {results.meanMeso.toLocaleString()}</p>
                <p><strong>Median Meso:</strong> {results.medianMeso.toLocaleString()}</p>

                <br />

                <p><strong>Mean Booms:</strong> {results.meanBooms}</p>
                <p><strong>Median Booms:</strong> {results.medianBooms}</p>
              </div>
            )}

            <hr className="divider" />

            <canvas ref={mesoChartRef}></canvas>

            <hr className="divider" />

            <canvas ref={boomChartRef}></canvas>
          </aside>
        
          {/* <BrowserRouter>
            <Routes>
              <Route path="/" element={<Starforce />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter> */}

        </div>
      </main>
    </div>
  );
}