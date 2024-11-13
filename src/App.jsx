import { useEffect } from 'react';
import { usePageText } from './hooks/usePageText';
import { useSummarizer } from './hooks/useSummarizer';
import ReadingTimeDisplay from './components/ReadingTimeDisplay';
import MarkdownDisplay from './components/MarkdownDisplay';
import './App.css';

function App() {
    const { pageText, readingTime, error: pageTextError } = usePageText();
    const { keyPointsSummary, isSummarizing, relatedTopics, error: summarizerError, fetchContentSummary } = useSummarizer();

    useEffect(() => {
        if (pageText) {
            fetchContentSummary(pageText);
        }
    }, [pageText]);

    return (
        <div className="app-container">
            <h1 className="app-title">Page Patrol 🧭</h1>

            {/* Purpose description in English */}
            <p className="app-description">
                Page Patrol aims to gently introduce the reader to the article by offering a clear summary of key points, suggesting related topics, and providing other relevant insights.
            </p>

            {pageTextError && <p className="error-message">{pageTextError}</p>}
            {summarizerError && <p className="error-message">{summarizerError}</p>}

            {isSummarizing ? (
                <p className="loading-message">
                    <span className="spinner">🧭</span>
                    analyzing
                </p>
            ) : (
                <>
                    {keyPointsSummary.length > 0 && <MarkdownDisplay title="Main Summary" content={keyPointsSummary} />}
                    {relatedTopics && <MarkdownDisplay title="Other Topics" content={relatedTopics} />}
                    {readingTime && <ReadingTimeDisplay readingTime={readingTime} />}
                </>
            )}
        </div>
    );
}

export default App;
