import { useEffect } from 'react';
import { usePageText } from './hooks/usePageText';
import { useSummarizer } from './hooks/useSummarizer';
import ReadingTimeDisplay from './components/ReadingTimeDisplay';
import MarkdownDisplay from './components/MarkdownDisplay'; // Only MarkdownDisplay needed now
import './App.css';

function App() {
    const { pageText, readingTime, error: pageTextError } = usePageText();
    const { summary, date, isSummarizing, otherTopic, error: summarizerError, getSummary } = useSummarizer();

    useEffect(() => {
        if (pageText) {
            getSummary(pageText);
        }
    }, [pageText]);

    return (
        <div className="app-container">
            <h1 className="app-title">Page Patrol 🧭</h1>
            {pageTextError && <p className="error-message">{pageTextError}</p>}
            {readingTime && <ReadingTimeDisplay readingTime={readingTime} />}
            {summarizerError && <p className="error-message">{summarizerError}</p>}

            {isSummarizing ? (
                <p className="loading-message">
                    <span className="spinner">🧭</span>
                </p>
            ) : (
                <>
                    {summary.length > 0 && <MarkdownDisplay title="Summary" content={summary} />}
                        {date && <MarkdownDisplay title="Is up to date?" content={date} />}
                        {otherTopic && <MarkdownDisplay title="Correlated Topics" content={otherTopic} />}
                </>
            )}
        </div>
    );
}

export default App;
