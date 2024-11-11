import { useState } from 'react';

export function useSummarizer() {
    const [summary, setSummary] = useState([]);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [error, setError] = useState('');

    const cleanText = (text) => {
        let summaryPoints = text.split('\n');
        let cleanedSummary = summaryPoints
            .map((point) => {
                if (point.trim() !== '') {
                    return point.replace(/^\*\s*/, '').replace(/\*\*/g, '').trim();
                } else {
                    return null;
                }
            })
            .filter((point) => point !== null);
        setSummary(cleanedSummary);
    };

    const getSummary = async (pageText) => {
        if (!pageText) {
            alert('no content to summarize');
            return;
        }

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
                setError('summary is not available');
            }
        } catch (error) {
            console.error('error during summary', error);
            setError('an error occurred during the summary');
        } finally {
            setIsSummarizing(false);
        }
    };

    return { summary, isSummarizing, error, getSummary };
}
