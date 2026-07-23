function EvenPlayers({ IndianTeam }) {

    const [, second, , fourth, , sixth] = IndianTeam;

    return (
        <div>
            <ul>
                <li>{second}</li>
                <li>{fourth}</li>
                <li>{sixth}</li>
            </ul>
        </div>
    );
}

export default EvenPlayers;