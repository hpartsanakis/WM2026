const TIPS_KEY = "wm26-tips";
const RESULTS_KEY = "wm26-results";

const groupMatchesContainer = document.getElementById("groupMatchesContainer");
const totalMatchesEl = document.getElementById("totalMatches");
const totalTipsEl = document.getElementById("totalTips");
const openTipsEl = document.getElementById("openTips");
const totalPointsEl = document.getElementById("totalPoints");
const viewButtons = document.querySelectorAll(".filter-btn");

let tips = loadStoredObject(TIPS_KEY);
let results = loadStoredObject(RESULTS_KEY);
let activeView = "matchday-1";

function loadStoredObject(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || {};
  } catch {
    return {};
  }
}

function saveStoredObject(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function isValidScore(score) {
  return Number.isInteger(score) && score >= 0;
}

function calculatePoints(matchId) {
  const tip = tips[matchId];
  const result = results[matchId];

  if (!tip || !result) return 0;
  if (!isValidScore(tip.home) || !isValidScore(tip.away)) return 0;
  if (!isValidScore(result.home) || !isValidScore(result.away)) return 0;

  if (tip.home === result.home && tip.away === result.away) return 3;

  const tipDiff = tip.home - tip.away;
  const resultDiff = result.home - result.away;

  if (tipDiff === resultDiff) return 2;
  if (Math.sign(tipDiff) === Math.sign(resultDiff)) return 1;

  return 0;
}

function renderDashboard() {
  const totalMatches = matches.length;
  const totalTips = matches.filter((match) => Boolean(tips[match.id])).length;
  const openTips = totalMatches - totalTips;
  const totalPoints = matches.reduce((sum, match) => sum + calculatePoints(match.id), 0);

  if (totalMatchesEl) totalMatchesEl.textContent = totalMatches;
  if (totalTipsEl) totalTipsEl.textContent = totalTips;
  if (openTipsEl) openTipsEl.textContent = openTips;
  if (totalPointsEl) totalPointsEl.textContent = totalPoints;
}

function renderMatches() {
  if (!groupMatchesContainer) return;

  groupMatchesContainer.innerHTML = "";

  const selectedMatchday = Number(activeView.replace("matchday-", ""));
  const dayMatches = matches.filter((match) => match.matchday === selectedMatchday);
  const daySection = document.createElement("section");

  daySection.className = "group-matches-section";
  daySection.innerHTML = `
    <h2>Spieltag ${selectedMatchday}</h2>
    <div class="group-matches-list"></div>
  `;

  const list = daySection.querySelector(".group-matches-list");

  dayMatches.forEach((match) => {
    const tip = tips[match.id] || {};
    const result = results[match.id] || {};
    const points = calculatePoints(match.id);
    const card = document.createElement("article");

    card.className = "match-card";
    card.innerHTML = `
      <div class="match-top">
        <span>Spiel ${match.id} · Gruppe ${match.group}</span>
        <span>${match.date}</span>
      </div>

      <div class="teams">
        <span>${match.home}</span>
        <strong>vs</strong>
        <span>${match.away}</span>
      </div>

      <div class="score-row">
        <span>Tipp</span>
        <input type="number" min="0" inputmode="numeric" id="tip-home-${match.id}" value="${tip.home ?? ""}" placeholder="0" aria-label="Tipp ${match.home}">
        <span>:</span>
        <input type="number" min="0" inputmode="numeric" id="tip-away-${match.id}" value="${tip.away ?? ""}" placeholder="0" aria-label="Tipp ${match.away}">
        <button type="button" onclick="saveTip(${match.id})">Speichern</button>
        <button type="button" class="secondary" onclick="deleteTip(${match.id})">Löschen</button>
      </div>

      <div class="score-row">
        <span>Ergebnis</span>
        <input type="number" min="0" inputmode="numeric" id="result-home-${match.id}" value="${result.home ?? ""}" placeholder="0" aria-label="Ergebnis ${match.home}">
        <span>:</span>
        <input type="number" min="0" inputmode="numeric" id="result-away-${match.id}" value="${result.away ?? ""}" placeholder="0" aria-label="Ergebnis ${match.away}">
        <button type="button" onclick="saveResult(${match.id})">Speichern</button>
        <button type="button" class="secondary" onclick="deleteResult(${match.id})">Löschen</button>
      </div>

      <div class="points-row">Punkte: <strong>${points}</strong></div>
    `;

    list.appendChild(card);
  });

  groupMatchesContainer.appendChild(daySection);
}

function readScorePair(homeId, awayId) {
  const homeInput = document.getElementById(homeId);
  const awayInput = document.getElementById(awayId);
  const home = Number(homeInput.value);
  const away = Number(awayInput.value);

  if (homeInput.value === "" || awayInput.value === "" || !isValidScore(home) || !isValidScore(away)) {
    alert("Bitte beide Felder mit Zahlen ab 0 ausfüllen.");
    return null;
  }

  return { home, away };
}

function saveTip(matchId) {
  const score = readScorePair(`tip-home-${matchId}`, `tip-away-${matchId}`);

  if (!score) return;

  tips[matchId] = score;
  saveStoredObject(TIPS_KEY, tips);
  render();
}

function deleteTip(matchId) {
  delete tips[matchId];
  saveStoredObject(TIPS_KEY, tips);
  render();
}

function saveResult(matchId) {
  const score = readScorePair(`result-home-${matchId}`, `result-away-${matchId}`);

  if (!score) return;

  results[matchId] = score;
  saveStoredObject(RESULTS_KEY, results);
  render();
}

function deleteResult(matchId) {
  delete results[matchId];
  saveStoredObject(RESULTS_KEY, results);
  render();
}

function render() {
  tips = loadStoredObject(TIPS_KEY);
  results = loadStoredObject(RESULTS_KEY);
  renderDashboard();
  renderMatches();
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeView = button.dataset.view;
    viewButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    render();
  });
});

render();
