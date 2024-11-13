import { useState } from 'react';

export function useSummarizer() {
    const [keyPointsSummary, setKeyPointsSummary] = useState([]);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [error, setError] = useState('');
    const [relatedTopics, setRelatedTopics] = useState();

    const summarizerOptions = {
        sharedContext: 'This is an article, your job is to introduce the article and talk about the main points',
        type: 'key-points',
        format: 'markdown',
        length: 'short',
    };

    const processSummaryText = (text) => {
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
        setKeyPointsSummary(cleanedSummary);
    };

    function formatRelatedTopicsText(inputText) {
        const points = inputText.split(/\d+\.\s*/).filter(point => point.trim() !== "");

        const cleanedPoints = points.map(point => {
            return point.replace(/\*\*/g, '').trim();
        });

        const formattedText = cleanedPoints.join("\n\n");

        setRelatedTopics(formattedText);
    }

    const fetchContentSummary = async (pageText) => {
        if (!pageText) {
            alert('No content to summarize');
            return;
        }

        setIsSummarizing(true);

        try {
            const canSummarize = await self.ai.summarizer.capabilities();
            let summarizer;
            let dater;

            if (canSummarize && canSummarize.available !== 'no') {
                summarizer = await self.ai.summarizer.create(summarizerOptions);
                dater = await self.ai.languageModel.create();

                const relatedTopicsText = await dater.prompt("List up to 5 related topics concerning the following text. Provide only the list, nothing else." + pageText);
                formatRelatedTopicsText(relatedTopicsText);
                dater.destroy();

                const resultOfSummary = await summarizer.summarize(pageText);
                processSummaryText(resultOfSummary);
                summarizer.destroy();

            } else {
                setError('Summary is not available');
            }
        } catch (error) {
            console.error('Error during summary', error);
            setError('An error occurred during the summary');
        } finally {
            setIsSummarizing(false);
        }
    };

    return {
        keyPointsSummary,
        isSummarizing,
        relatedTopics,
        error,
        fetchContentSummary,
    };
}
