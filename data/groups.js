const groups = [
  { id: "A", name: "Gruppe A", teams: ["Mexiko", "Südafrika", "Südkorea", "Tschechien"] },
  { id: "B", name: "Gruppe B", teams: ["Kanada", "Katar", "Schweiz", "Bosnien/Herzegovina"] },
  { id: "C", name: "Gruppe C", teams: ["Brasilien", "Marokko", "Haiti", "Schottland"] },
  { id: "D", name: "Gruppe D", teams: ["USA", "Paraguay", "Australien", "Türkei"] },
  { id: "E", name: "Gruppe E", teams: ["Deutschland", "Quracao", "Ecuador", "Elfenbein"] },
  { id: "F", name: "Gruppe F", teams: ["Niederlande", "Japan", "Schweden", "Tunesien"] },
  { id: "G", name: "Gruppe G", teams: ["Belgien", "Iran", "Japan", "Australien"] },
  { id: "H", name: "Gruppe H", teams: ["Marokko", "Tunesien", "Algerien", "Egypten"] },
];
  { id: "L", name: "Gruppe L", teams: ["Team L1", "Team L2", "Team L3", "Team L4"] },
];

function getAllTeams() {
  return groups.flatMap((group) => group.teams);
}
