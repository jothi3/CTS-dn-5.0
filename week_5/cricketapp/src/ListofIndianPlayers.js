function ListofIndianPlayers() {

    const T20Players = [
        "Virat",
        "Rohit",
        "Surya"
    ];

    const RanjiPlayers = [
        "Pujara",
        "Rahane",
        "Jaiswal"
    ];

    const IndianPlayers = [...T20Players, ...RanjiPlayers];

    return (
        <div>
            <ul>
                {IndianPlayers.map((player, index) => (
                    <li key={index}>{player}</li>
                ))}
            </ul>
        </div>
    );
}

export default ListofIndianPlayers;