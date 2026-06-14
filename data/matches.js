const matches = groups.flatMap((group, groupIndex) => {
  const [team1, team2, team3, team4] = group.teams;
  const startId = groupIndex * 6 + 1;

  return [
    { id: startId, group: group.id, matchday: 1, date: "2026-06-11", home: team1, away: team2 },
    { id: startId + 1, group: group.id, matchday: 1, date: "2026-06-12", home: team3, away: team4 },
    { id: startId + 2, group: group.id, matchday: 2, date: "2026-06-17", home: team1, away: team3 },
    { id: startId + 3, group: group.id, matchday: 2, date: "2026-06-18", home: team4, away: team2 },
    { id: startId + 4, group: group.id, matchday: 3, date: "2026-06-23", home: team4, away: team1 },
    { id: startId + 5, group: group.id, matchday: 3, date: "2026-06-24", home: team2, away: team3 },
  ];
});
