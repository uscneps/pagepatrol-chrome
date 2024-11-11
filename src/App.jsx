import { usePageText } from './hooks/usePageText';
import { useSummarizer } from './hooks/useSummarizer';
import ReadingTimeDisplay from './components/ReadingTimeDisplay';
import SummaryDisplay from './components/SummaryDisplay';

function App() {
    const { pageText, readingTime, error: pageTextError } = usePageText();
    const { summary, isSummarizing, error: summarizerError, getSummary } = useSummarizer();

    const handleSummarize = () => {
        getSummary(pageText);
    };

    return (
        <div>
            <h1>Riassuntore di Pagine</h1>
            {pageTextError && <p>{pageTextError}</p>}
            {readingTime && <ReadingTimeDisplay readingTime={readingTime} />}
            <button onClick={handleSummarize} disabled={isSummarizing}>
                {isSummarizing ? 'Riassumendo...' : 'Riassumi Pagina'}
            </button>
            {summarizerError && <p>{summarizerError}</p>}
            {summary.length > 0 && <SummaryDisplay summary={summary} />}
        </div>
    );
}

export default App;
