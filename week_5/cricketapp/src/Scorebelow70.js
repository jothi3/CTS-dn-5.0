function Scorebelow70({ players }) {

    const players70 = players.filter(item => item.score <= 70);

    return (
        <div>
            <ul>
                {players70.map((item, index) => (
                    <li key={index}>
                        Mr. {item.name} {item.score}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Scorebelow70;