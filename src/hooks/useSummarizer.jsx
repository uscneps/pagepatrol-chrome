import { useState } from 'react';

export function useSummarizer() {
    const [summary, setSummary] = useState([]);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [error, setError] = useState('');
    const [date, setDate] = useState()

    const optionsSummary = {
        sharedContext: 'This is an article, your job is to introduce the article and talk about the main points',
        type: 'key-points',
        format: 'markdown',
        length: 'short',
    };

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
            const canSummarize = await self.ai.summarizer.capabilities();
            let summarizer;
            let dater;
            let connectedElements;

            if (canSummarize && canSummarize.available !== 'no') {
                if (canSummarize.available === 'readily') {
                    summarizer = await self.ai.summarizer.create(optionsSummary);
                    dater = await self.ai.languageModel.create();
                } else {
                    summarizer = await self.ai.summarizer.create(optionsSummary);
                    dater = await self.ai.languageModel.create();

                    summarizer.addEventListener('downloadprogress', (e) => {
                        console.log(`Download progress: ${e.loaded}/${e.total}`);
                    });
                    await summarizer.ready;
                    await dater.ready;
                }

                const resultOfDate = await dater.prompt("Provide the date for the following text. Only include the date, nothing else."+pageText);
                setDate(resultOfDate)
                dater.destroy();

                const resultOfSummary = await summarizer.summarize(pageText);
                cleanText(resultOfSummary);
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

    return {
        summary,
        date,
        isSummarizing,
        error,
        getSummary,
    };
}