
function SummaryDisplay({ summary }) {
    return (
        <div className="summary-container">
            <h2>Summary</h2>
            <ul className="summary-list">
                {summary.map((item, index) => (
                    <li key={index} className="summary-item">
                        {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SummaryDisplay;
