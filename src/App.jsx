import { useState, useEffect } from 'react';

function App() {
    const [readingTime, setReadingTime] = useState('');
    const [summary, setSummary] = useState([]);
    const [pageText, setPageText] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);

    useEffect(() => {

        function getPageText() {
            return document.body.innerText;
        }


        if (window.chrome && chrome.tabs && chrome.scripting) {
            chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
                const activeTab = tabs[0];

                chrome.scripting.executeScript(
                    {
                        target: { tabId: activeTab.id },
                        func: getPageText,
                    },
                    (results) => {
                        if (chrome.runtime.lastError) {
                            setReadingTime('Errore: ' + chrome.runtime.lastError.message);
                            return;
                        }

                        if (results && results[0] && results[0].result) {
                            const text = results[0].result;
                            const wordCount = text.split(/\s+/).length;
                            const readingTimeMinutes = Math.ceil(wordCount / 200);
                            setReadingTime(`Tempo di lettura approssimativo: ${readingTimeMinutes} minuto/i`);
                            setPageText(text);
                        } else {
                            setReadingTime('Impossibile recuperare il contenuto della pagina.');
                        }
                    }
                );
            });
        } else {
            setReadingTime('Le API di Chrome non sono disponibili.');
        }
    }, []);

    const cleanText = (text) => {
        setReadingTime('Riassunto:');
        let summaryPoints = text.split('\n');
        let cleanedSummary = summaryPoints
            .map((point) => {
                if (point.trim() !== '') {
                    return point
                        .replace(/^\*\s*/, '')
                        .replace(/\*\*/g, '')
                        .trim();
                } else {
                    return null;
                }
            })
            .filter((point) => point !== null);
        setSummary(cleanedSummary);
    };

    const getSummary = async () => {
        if (!pageText) {
            alert('Nessun contenuto di pagina disponibile per il riassunto.');
            return;
        }

        setReadingTime('Riassumendo...');
        setIsSummarizing(true);

        try {

            const canSummarize = await ai.summarizer.capabilities();
            let summarizer;

            if (canSummarize && canSummarize.available !== 'no') {
                if (canSummarize.available === 'readily') {
                    summarizer = await ai.summarizer.create();
                } else {
                    summarizer = await ai.summarizer.create();
                    summarizer.addEventListener('downloadprogress', (e) => {
                        console.log(`Download progress: ${e.loaded}/${e.total}`);
                    });
                    await summarizer.ready;
                }

                const result = await summarizer.summarize(pageText);
                cleanText(result);

                summarizer.destroy();
            } else {
                setReadingTime('Il riassuntore non è disponibile.');
            }
        } catch (error) {
            console.error('Errore durante il riassunto:', error);
            setReadingTime('Si è verificato un errore durante il riassunto.');
        } finally {
            setIsSummarizing(false);
        }
    };

    return (
        <div>
            <h1>Riassuntore di Pagine</h1>
            <p>{readingTime}</p>
            <button onClick={getSummary} disabled={isSummarizing}>
                {isSummarizing ? 'Riassumendo...' : 'Riassumi Pagina'}
            </button>
            {summary.length > 0 && (
                <div>
                    <h2>Riassunto:</h2>
                    <ul>
                        {summary.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default App;
