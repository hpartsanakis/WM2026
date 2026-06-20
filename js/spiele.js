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
let activeView = "all";

const viewTitles = {
  all: "Alle Spiele",
  "matchday-1": "Spieltag 1",
  "matchday-2": "Spieltag 2",
  "matchday-3": "Spieltag 3",
  "round-32": "16tel-Finale",
  "round-16": "Achtelfinale",
  "quarter-final": "Viertelfinale",
  "semi-final": "Halbfinale",
  final: "Finale",
};

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

function compareTableRows(a, b) {
  return (
    b.points - a.points ||
    b.goalDiff - a.goalDiff ||
    b.goalsFor - a.goalsFor ||
    a.goalsAgainst - b.goalsAgainst ||
    a.team.localeCompare(b.team, "de")
  );
}

function calculateGroupTable(group) {
  const table = group.teams.map((team) => ({
    team,
    played: 0,
    wins: 0,
    draws: 0,
    losses: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    goalDiff: 0,
    points: 0,
  }));

  matches
    .filter((match) => match.group === group.id)
    .forEach((match) => {
      const result = results[match.id];

      if (!result || !isValidScore(result.home) || !isValidScore(result.away)) return;

      const homeTeam = table.find((row) => row.team === match.home);
      const awayTeam = table.find((row) => row.team === match.away);

      if (!homeTeam || !awayTeam) return;

      homeTeam.played += 1;
      awayTeam.played += 1;
      homeTeam.goalsFor += result.home;
      homeTeam.goalsAgainst += result.away;
      awayTeam.goalsFor += result.away;
      awayTeam.goalsAgainst += result.home;

      if (result.home > result.away) {
        homeTeam.wins += 1;
        awayTeam.losses += 1;
        homeTeam.points += 3;
      } else if (result.home < result.away) {
        awayTeam.wins += 1;
        homeTeam.losses += 1;
        awayTeam.points += 3;
      } else {
        homeTeam.draws += 1;
        awayTeam.draws += 1;
        homeTeam.points += 1;
        awayTeam.points += 1;
      }
    });

  table.forEach((row) => {
    row.goalDiff = row.goalsFor - row.goalsAgainst;
  });

  return table.sort(compareTableRows);
}

function getGroupPosition(groupId, position) {
  const group = groups.find((item) => item.id === groupId);
  if (!group) return null;

  const row = calculateGroupTable(group)[position - 1];
  return row && row.played > 0 ? row.team : null;
}

function getThirdPlacedTeam(candidateGroups, usedGroups = new Set()) {
  const thirdPlacedTeams = candidateGroups
    .filter((groupId) => !usedGroups.has(groupId))
    .map((groupId) => {
      const group = groups.find((item) => item.id === groupId);
      if (!group) return null;

      const row = calculateGroupTable(group)[2];
      return row && row.played > 0 ? { ...row, group: groupId } : null;
    })
    .filter(Boolean)
    .sort(compareTableRows);

  return thirdPlacedTeams[0]?.team || null;
}

function getMatchWinner(matchId) {
  const match = matches.find((item) => item.id === matchId);
  const result = results[matchId];

  if (!match || !result || !isValidScore(result.home) || !isValidScore(result.away)) return null;
  if (result.home === result.away) return null;

  const resolvedMatch = resolveMatchTeams(match, calculateThirdPlaceAssignments());
  return result.home > result.away ? resolvedMatch.home : resolvedMatch.away;
}

function getThirdPlaceCandidateGroups(slot) {
  const thirdPlaceSlot = slot.match(/^3\. Gruppe ([A-L](?:\/[A-L])*)$/);
  return thirdPlaceSlot ? thirdPlaceSlot[1].split("/") : null;
}

function calculateThirdPlaceAssignments() {
  const assignments = {};
  const usedGroups = new Set();

  matches
    .filter((match) => match.round === "round-32")
    .sort((a, b) => a.id - b.id)
    .forEach((match) => {
      ["home", "away"].forEach((side) => {
        const candidateGroups = getThirdPlaceCandidateGroups(match[side]);

        if (!candidateGroups) return;

        const assignedTeam = getThirdPlacedTeam(candidateGroups, usedGroups);
        if (!assignedTeam) return;

        const assignedGroup = candidateGroups.find((groupId) => (
          calculateGroupTable(groups.find((group) => group.id === groupId))[2]?.team === assignedTeam
        ));

        assignments[`${match.id}-${side}`] = assignedTeam;
        if (assignedGroup) usedGroups.add(assignedGroup);
      });
    });

  return assignments;
}

function resolveTeamName(slot, matchId, side, thirdPlaceAssignments = {}) {
  const groupPosition = slot.match(/^([123])\. Gruppe ([A-L])$/);
  if (groupPosition) {
    return getGroupPosition(groupPosition[2], Number(groupPosition[1])) || slot;
  }

  if (getThirdPlaceCandidateGroups(slot)) {
    return thirdPlaceAssignments[`${matchId}-${side}`] || slot;
  }

  const winnerSlot = slot.match(/^Sieger Spiel (\d+)$/);
  if (winnerSlot) {
    return getMatchWinner(Number(winnerSlot[1])) || slot;
  }

  return slot;
}

function resolveMatchTeams(match, thirdPlaceAssignments = {}) {
  return {
    ...match,
    home: resolveTeamName(match.home, match.id, "home", thirdPlaceAssignments),
    away: resolveTeamName(match.away, match.id, "away", thirdPlaceAssignments),
  };
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
  const visibleMatches = matches
    .filter((match) => (
      activeView === "all" ||
      match.matchday === selectedMatchday ||
      match.round === activeView
    ))
    .sort((a, b) => a.id - b.id);
  const daySection = document.createElement("section");
  const sectionTitle = viewTitles[activeView] || "Alle Spiele";
  const thirdPlaceAssignments = calculateThirdPlaceAssignments();

  daySection.className = "group-matches-section";
  daySection.innerHTML = `
    <h2>${sectionTitle}</h2>
    <div class="group-matches-list"></div>
  `;

  const list = daySection.querySelector(".group-matches-list");

  visibleMatches.forEach((match) => {
    const resolvedMatch = resolveMatchTeams(match, thirdPlaceAssignments);
    const tip = tips[match.id] || {};
    const result = results[match.id] || {};
    const points = calculatePoints(match.id);
    const card = document.createElement("article");

    card.className = "match-card";
    const matchLabel = match.group ? `Gruppe ${match.group}` : match.roundName;
    card.innerHTML = `
      <div class="match-top">
        <span>Spiel ${match.id} · ${matchLabel}</span>
        <span>${match.date}</span>
      </div>

      <div class="teams">
        <span>${resolvedMatch.home}</span>
        <strong>vs</strong>
        <span>${resolvedMatch.away}</span>
      </div>

      <div class="score-row">
        <span>Tipp</span>
        <input type="number" min="0" inputmode="numeric" id="tip-home-${match.id}" value="${tip.home ?? ""}" placeholder="0" aria-label="Tipp ${resolvedMatch.home}">
        <span>:</span>
        <input type="number" min="0" inputmode="numeric" id="tip-away-${match.id}" value="${tip.away ?? ""}" placeholder="0" aria-label="Tipp ${resolvedMatch.away}">
        <button type="button" onclick="saveTip(${match.id})">Speichern</button>
        <button type="button" class="secondary" onclick="deleteTip(${match.id})">Löschen</button>
      </div>

      <div class="score-row">
        <span>Ergebnis</span>
        <input type="number" min="0" inputmode="numeric" id="result-home-${match.id}" value="${result.home ?? ""}" placeholder="0" aria-label="Ergebnis ${resolvedMatch.home}">
        <span>:</span>
        <input type="number" min="0" inputmode="numeric" id="result-away-${match.id}" value="${result.away ?? ""}" placeholder="0" aria-label="Ergebnis ${resolvedMatch.away}">
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
