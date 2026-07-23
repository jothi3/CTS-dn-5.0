function OddPlayers({ IndianTeam }) {

    const [first, , third, , fifth] = IndianTeam;

    return (
        <div>
            <ul>
                <li>{first}</li>
                <li>{third}</li>
                <li>{fifth}</li>
            </ul>
        </div>
    );
}

export default OddPlayers;