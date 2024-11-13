import React from 'react';
import ReactMarkdown from 'react-markdown';

function MarkdownDisplay({ title, content }) {
    return (
        <div className="summary-container">
            <h2>{title}</h2>
            <div className="summary-content">
                {Array.isArray(content)
                    ? content.map((item, index) => (
                        <ReactMarkdown key={index} className="summary-paragraph">
                            {item}
                        </ReactMarkdown>
                    ))
                    : <ReactMarkdown className="summary-paragraph">{content}</ReactMarkdown>
                }
            </div>
        </div>
    );
}

export default MarkdownDisplay;
