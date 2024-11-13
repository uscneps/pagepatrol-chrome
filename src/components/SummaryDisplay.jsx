import React from 'react';
import ReactMarkdown from 'react-markdown';

function SummaryDisplay({ summary }) {
    return (
        <div className="summary-container">
            <h2>Summary</h2>
            <div className="summary-content">
                {summary.map((item, index) => (
                    <ReactMarkdown key={index} className="summary-paragraph">
                        {item}
                    </ReactMarkdown>
                ))}
            </div>
        </div>
    );
}

export default SummaryDisplay;
