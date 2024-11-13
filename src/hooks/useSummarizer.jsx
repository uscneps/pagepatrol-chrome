import { useState } from 'react';

export function useSummarizer() {
    const [summary, setSummary] = useState([]);
    const [isSummarizing, setIsSummarizing] = useState(false);
    const [error, setError] = useState('');
    const [date, setDate] = useState()
    const [otherTopic, setOtherTopic] = useState();

    const optionsSummary = {
        sharedContext: 'This is an article, your job is to introduce the article and talk about the main points',
        type: 'key-points',
        format: 'markdown',
        length: 'short',
    };


    const cleanSummaryText = (text) => {
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

    function cleanOtherTopicText(inputText) {
        const points = inputText.split(/\d+\.\s*/).filter(point => point.trim() !== "");

        const cleanedPoints = points.map(point => {
            return point.replace(/\*\*/g, '').trim();
        });

        const formattedText = cleanedPoints.join("\n\n");

        setOtherTopic(formattedText);
    }


    const getSummary = async (pageText) => {
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
                summarizer = await self.ai.summarizer.create(optionsSummary);
                dater = await self.ai.languageModel.create();

                const resultOfDate = await dater.prompt("Provide the date for the following text. Only include the date, nothing else." + pageText);
                setDate(resultOfDate);

                const otherTopic = await dater.prompt("list MAX 5 correlated topics regards the following text: " + pageText);
                cleanOtherTopicText(otherTopic)
                dater.destroy();

                const resultOfSummary = await summarizer.summarize(pageText);
                cleanSummaryText(resultOfSummary);
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
        summary,
        date,
        isSummarizing,
        otherTopic,
        error,
        getSummary,
    };
}