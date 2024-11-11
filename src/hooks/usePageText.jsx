import { useState, useEffect } from 'react';

export function usePageText() {
    const [pageText, setPageText] = useState('');
    const [readingTime, setReadingTime] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        function getPageText() {
            return document.body.innerText;
        }

        if (window.chrome && chrome.tabs && chrome.scripting) {
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                const activeTab = tabs[0];

                chrome.scripting.executeScript(
                    {
                        target: { tabId: activeTab.id },
                        func: getPageText,
                    },
                    (results) => {
                        if (chrome.runtime.lastError) {
                            setError('Errore: ' + chrome.runtime.lastError.message);
                            return;
                        }

                        if (results && results[0] && results[0].result) {
                            const text = results[0].result;
                            const wordCount = text.split(/\s+/).length;
                            const readingTimeMinutes = Math.ceil(wordCount / 200);
                            setReadingTime(`Tempo di lettura approssimativo: ${readingTimeMinutes} minuto/i`);
                            setPageText(text);
                        } else {
                            setError('Impossibile recuperare il contenuto della pagina.');
                        }
                    }
                );
            });
        } else {
            setError('Le API di Chrome non sono disponibili.');
        }
    }, []);

    return { pageText, readingTime, error };
}
