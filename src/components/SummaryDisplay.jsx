function SummaryDisplay({summary}) {
    return (
        <div className="summary-container">
            <h2>Summary</h2>
            <div className="summary-content">
                {summary.map((item, index) => (
                    <p key={index} className="summary-paragraph">
                        {item}
                    </p>
                ))}
            </div>
        </div>
    );
}


export default SummaryDisplay;
