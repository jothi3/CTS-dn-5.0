import styles from "./CohortDetails.module.css";

function CohortDetails(props) {

    const headingStyle = {
        color: props.status === "ongoing" ? "green" : "blue"
    };

    return (
        <div className={styles.box}>

            <h3 style={headingStyle}>
                {props.name}
            </h3>

            <dl>
                <dt>Trainer</dt>
                <dd>{props.trainer}</dd>

                <dt>Status</dt>
                <dd>{props.status}</dd>

                <dt>Strength</dt>
                <dd>{props.strength}</dd>
            </dl>

        </div>
    );
}

export default CohortDetails;