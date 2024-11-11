function SummaryDisplay({ summary }) {
    return (
        <div>
            <h2>Riassunto:</h2>
            <ul>
                {summary.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export default SummaryDisplay;
