import {useState, useEffect} from 'react';

export function usePageText() {
    const [pageText, setPageText] = useState('');
    const [readingTime, setReadingTime] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        function getPageText() {
            return document.body.innerText;
        }

        if (window.chrome && chrome.tabs && chrome.scripting) {
            chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
                const activeTab = tabs[0];

                chrome.scripting.executeScript(
                    {
                        target: {tabId: activeTab.id},
                        func: getPageText,
                    },
                    (results) => {
                        if (chrome.runtime.lastError) {
                            setError('Error: ' + chrome.runtime.lastError.message);
                            return;
                        }

                        if (results && results[0] && results[0].result) {
                            const text = results[0].result;
                            const wordCount = text.split(/\s+/).length;
                            const readingTimeMinutes = Math.ceil(wordCount / 200);
                            setReadingTime(`time needed to read the article: ${readingTimeMinutes} minutes`);
                            setPageText(text);
                        } else {
                            setError('impossible to get the text of the page');
                        }
                    }
                );
            });
        } else {
            setError('Le API di Chrome non sono disponibili.');
        }
    }, []);

    return {pageText, readingTime, error};
}
