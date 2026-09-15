import CohortDetails from "./CohortDetails";

function App() {

    return (
        <div>

            <CohortDetails
                name="React - Jan 2026"
                trainer="John"
                status="ongoing"
                strength="28"
            />

            <CohortDetails
                name="Angular - Feb 2026"
                trainer="Steve"
                status="completed"
                strength="32"
            />

            <CohortDetails
                name="Java FSE"
                trainer="David"
                status="ongoing"
                strength="30"
            />

        </div>
    );
}

export default App;