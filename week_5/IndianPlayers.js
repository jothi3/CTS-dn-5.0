function IndianPlayers() {
  const players = [
    "Virat",
    "Rohit",
    "Gill",
    "Rahul",
    "Hardik",
    "Pant"
  ];
  const [first, second, third, fourth, fifth, sixth] = players;
  const T20Players = [
    "Virat",
    "Rohit",
    "Surya"
  ];
  const RanjiPlayers = [
    "Sarfaraz",
    "Prithvi",
    "Karun"
  ];
  const mergedPlayers = [...T20Players, ...RanjiPlayers];
  return (
    <div>
      <h2>Odd Team Players</h2>
      <ul>
        <li>{first}</li>
        <li>{third}</li>
        <li>{fifth}</li>
      </ul>
      <h2>Even Team Players</h2>
      <ul>
        <li>{second}</li>
        <li>{fourth}</li>
        <li>{sixth}</li>
      </ul>
      <h2>Merged Players</h2>
      <ul>
        {mergedPlayers.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
    </div>
  );
}

export default IndianPlayers;