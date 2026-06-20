const matchDates = {
  A: { 1: ["2026-06-11", "2026-06-11"], 2: ["2026-06-18", "2026-06-18"], 3: ["2026-06-24", "2026-06-24"] },
  B: { 1: ["2026-06-12", "2026-06-13"], 2: ["2026-06-18", "2026-06-18"], 3: ["2026-06-24", "2026-06-24"] },
  C: { 1: ["2026-06-13", "2026-06-13"], 2: ["2026-06-19", "2026-06-19"], 3: ["2026-06-24", "2026-06-24"] },
  D: { 1: ["2026-06-12", "2026-06-13"], 2: ["2026-06-19", "2026-06-19"], 3: ["2026-06-25", "2026-06-25"] },
  E: { 1: ["2026-06-14", "2026-06-14"], 2: ["2026-06-20", "2026-06-20"], 3: ["2026-06-25", "2026-06-25"] },
  F: { 1: ["2026-06-14", "2026-06-14"], 2: ["2026-06-20", "2026-06-20"], 3: ["2026-06-25", "2026-06-25"] },
  G: { 1: ["2026-06-15", "2026-06-15"], 2: ["2026-06-21", "2026-06-21"], 3: ["2026-06-26", "2026-06-26"] },
  H: { 1: ["2026-06-15", "2026-06-15"], 2: ["2026-06-21", "2026-06-21"], 3: ["2026-06-26", "2026-06-26"] },
  I: { 1: ["2026-06-16", "2026-06-16"], 2: ["2026-06-22", "2026-06-22"], 3: ["2026-06-26", "2026-06-26"] },
  J: { 1: ["2026-06-16", "2026-06-16"], 2: ["2026-06-22", "2026-06-22"], 3: ["2026-06-27", "2026-06-27"] },
  K: { 1: ["2026-06-17", "2026-06-17"], 2: ["2026-06-23", "2026-06-23"], 3: ["2026-06-27", "2026-06-27"] },
  L: { 1: ["2026-06-17", "2026-06-17"], 2: ["2026-06-23", "2026-06-23"], 3: ["2026-06-27", "2026-06-27"] },
};

const groupPairings = [
  { matchday: 1, home: 0, away: 1, dateIndex: 0 },
  { matchday: 1, home: 2, away: 3, dateIndex: 1 },
  { matchday: 2, home: 0, away: 2, dateIndex: 0 },
  { matchday: 2, home: 3, away: 1, dateIndex: 1 },
  { matchday: 3, home: 3, away: 0, dateIndex: 0 },
  { matchday: 3, home: 1, away: 2, dateIndex: 1 },
];

const groupMatches = groups.flatMap((group, groupIndex) => (
  groupPairings.map((pairing, pairingIndex) => ({
    id: groupIndex * groupPairings.length + pairingIndex + 1,
    group: group.id,
    round: "group",
    roundName: `Spieltag ${pairing.matchday}`,
    matchday: pairing.matchday,
    date: matchDates[group.id][pairing.matchday][pairing.dateIndex],
    home: group.teams[pairing.home],
    away: group.teams[pairing.away],
  }))
));

const knockoutMatches = [
  { id: 73, round: "round-32", roundName: "16tel-Finale", date: "2026-06-28", home: "1. Gruppe A", away: "3. Gruppe C/D/E/F" },
  { id: 74, round: "round-32", roundName: "16tel-Finale", date: "2026-06-28", home: "2. Gruppe B", away: "2. Gruppe F" },
  { id: 75, round: "round-32", roundName: "16tel-Finale", date: "2026-06-29", home: "1. Gruppe C", away: "3. Gruppe A/B/F" },
  { id: 76, round: "round-32", roundName: "16tel-Finale", date: "2026-06-29", home: "1. Gruppe E", away: "2. Gruppe I" },
  { id: 77, round: "round-32", roundName: "16tel-Finale", date: "2026-06-30", home: "1. Gruppe I", away: "3. Gruppe C/D/F/G" },
  { id: 78, round: "round-32", roundName: "16tel-Finale", date: "2026-06-30", home: "2. Gruppe E", away: "2. Gruppe A" },
  { id: 79, round: "round-32", roundName: "16tel-Finale", date: "2026-07-01", home: "1. Gruppe G", away: "3. Gruppe A/E/H/I" },
  { id: 80, round: "round-32", roundName: "16tel-Finale", date: "2026-07-01", home: "1. Gruppe K", away: "3. Gruppe D/E/I/J" },
  { id: 81, round: "round-32", roundName: "16tel-Finale", date: "2026-07-02", home: "1. Gruppe L", away: "3. Gruppe E/H/I/J" },
  { id: 82, round: "round-32", roundName: "16tel-Finale", date: "2026-07-02", home: "1. Gruppe H", away: "2. Gruppe J" },
  { id: 83, round: "round-32", roundName: "16tel-Finale", date: "2026-07-03", home: "1. Gruppe D", away: "3. Gruppe B/E/F/I" },
  { id: 84, round: "round-32", roundName: "16tel-Finale", date: "2026-07-03", home: "2. Gruppe G", away: "2. Gruppe K" },
  { id: 85, round: "round-32", roundName: "16tel-Finale", date: "2026-07-03", home: "1. Gruppe J", away: "2. Gruppe H" },
  { id: 86, round: "round-32", roundName: "16tel-Finale", date: "2026-07-03", home: "1. Gruppe F", away: "2. Gruppe C" },
  { id: 87, round: "round-32", roundName: "16tel-Finale", date: "2026-07-03", home: "1. Gruppe B", away: "3. Gruppe A/D/E/F" },
  { id: 88, round: "round-32", roundName: "16tel-Finale", date: "2026-07-03", home: "2. Gruppe D", away: "2. Gruppe L" },

  { id: 89, round: "round-16", roundName: "Achtelfinale", date: "2026-07-04", home: "Sieger Spiel 73", away: "Sieger Spiel 74" },
  { id: 90, round: "round-16", roundName: "Achtelfinale", date: "2026-07-04", home: "Sieger Spiel 75", away: "Sieger Spiel 76" },
  { id: 91, round: "round-16", roundName: "Achtelfinale", date: "2026-07-05", home: "Sieger Spiel 77", away: "Sieger Spiel 78" },
  { id: 92, round: "round-16", roundName: "Achtelfinale", date: "2026-07-05", home: "Sieger Spiel 79", away: "Sieger Spiel 80" },
  { id: 93, round: "round-16", roundName: "Achtelfinale", date: "2026-07-06", home: "Sieger Spiel 81", away: "Sieger Spiel 82" },
  { id: 94, round: "round-16", roundName: "Achtelfinale", date: "2026-07-06", home: "Sieger Spiel 83", away: "Sieger Spiel 84" },
  { id: 95, round: "round-16", roundName: "Achtelfinale", date: "2026-07-07", home: "Sieger Spiel 85", away: "Sieger Spiel 86" },
  { id: 96, round: "round-16", roundName: "Achtelfinale", date: "2026-07-07", home: "Sieger Spiel 87", away: "Sieger Spiel 88" },

  { id: 97, round: "quarter-final", roundName: "Viertelfinale", date: "2026-07-09", home: "Sieger Spiel 89", away: "Sieger Spiel 90" },
  { id: 98, round: "quarter-final", roundName: "Viertelfinale", date: "2026-07-10", home: "Sieger Spiel 91", away: "Sieger Spiel 92" },
  { id: 99, round: "quarter-final", roundName: "Viertelfinale", date: "2026-07-11", home: "Sieger Spiel 93", away: "Sieger Spiel 94" },
  { id: 100, round: "quarter-final", roundName: "Viertelfinale", date: "2026-07-11", home: "Sieger Spiel 95", away: "Sieger Spiel 96" },

  { id: 101, round: "semi-final", roundName: "Halbfinale", date: "2026-07-14", home: "Sieger Spiel 97", away: "Sieger Spiel 98" },
  { id: 102, round: "semi-final", roundName: "Halbfinale", date: "2026-07-15", home: "Sieger Spiel 99", away: "Sieger Spiel 100" },

  { id: 103, round: "final", roundName: "Finale", date: "2026-07-19", home: "Sieger Spiel 101", away: "Sieger Spiel 102" },
];

const matches = [...groupMatches, ...knockoutMatches];
