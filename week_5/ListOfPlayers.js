function ListOfPlayers() {
  const players = [
    { name: "Virat", score: 95 },
    { name: "Rohit", score: 80 },
    { name: "Gill", score: 45 },
    { name: "Rahul", score: 65 },
    { name: "Hardik", score: 70 },
    { name: "Jadeja", score: 50 },
    { name: "Pant", score: 90 },
    { name: "Surya", score: 40 },
    { name: "Bumrah", score: 25 },
    { name: "Shami", score: 30 },
    { name: "Siraj", score: 15 }
  ];
  const playersBelow70 = players.filter(player => player.score < 70);
  return (
    <div>
      <h2>All Players</h2>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            {player.name} - {player.score}
          </li>
        ))}
      </ul>
      <h2>Players with Score Below 70</h2>
      <ul>
        {playersBelow70.map((player, index) => (
          <li key={index}>
            {player.name} - {player.score}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListOfPlayers;