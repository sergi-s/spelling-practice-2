import { generateRandomLong } from "~/app/utils/random/randomLong";
import { type SentenceGenerationStrategy } from ".";
import { type Language } from "../../stemmer/validation";


const baseURL = 'https://hackathon-atlantiq.vercel.app/api/chat/groq';

// UTILS
function createMessages(difficulty: number, topic?: string) {
    const messages = [
        {
            "role": "system",
            "content": `System Instructions:\nYour responses are precise, straightforward, and limited to the requested sentence. You must always be fully accurate and reliable, ensuring the generated sentence is appropriate for the specified difficulty level.\n\nUser Instructions:\n# Role\nYou are an AI assistant designed to provide short sentences for spelling practice. Your primary roles are to generate varied, simple sentences and ensure they are appropriate for the given difficulty level. Your responses are concise, straightforward, and limited to the requested sentence only.\n### Your Purpose:\n- **Sentence Generator:** Create short sentences in double quotation marks for the user to practice spelling.\n- **Difficulty Adjuster:** Ensure sentences match the specified difficulty level on a scale from 1 to 5.\n- **Non-Repetitive:** Utilize a seed to generate diverse sentences to avoid repetition.\n\n### Example Interactions:\n- **Spelling Practice Request:** Give me a very short sentence to practice my spelling in double quotation marks, don't provide anything else, to prevent repeating sentences use this as a seed 12345.\n  - **Response:** \"The cat sat on the mat.\"\n\n- **Difficulty Adjustment:** The sentence difficulty should be ${difficulty}/5.\n  - **Response:** \"A bright star lights the sky.\"\n\n### Note:\n- Ensure the sentences are clear, simple, and fit the difficulty level specified by the user.`
        }
    ];

    if (topic !== undefined && topic !== null) {
        messages.push({
            "role": "user",
            "content": `the topic is about: ${topic}`
        });
    }

    return messages;
}

export class llama3SentenceStrategy implements SentenceGenerationStrategy {
    async generateSentence(difficulty: number, language: Language, topic?: string): Promise<string | undefined> {
        try {

            const requestBody = {
                "chatSettings": {
                    "model": "llama3-70b-8192",
                    "stream": false,
                    "prompt": `# Role\nYou are an AI assistant designed to provide short sentences for spelling practice. Your primary roles are to generate varied, simple sentences and ensure they are appropriate for the given difficulty level. Your responses are concise, straightforward, and limited to the requested sentence only.\n\n### Your Purpose:\n- **Sentence Generator:** Create short sentences in double quotation marks for the user to practice spelling.\n- **Difficulty Adjuster:** Ensure sentences match the specified difficulty level on a scale from 1 to 5.\n- **Non-Repetitive:** Utilize a seed to generate diverse sentences to avoid repetition.\n\n### Example Interactions:\n- **Spelling Practice Request:** Give me a very short sentence to practice my spelling in double quotation marks, don't provide anything else, to prevent repeating sentences use this as a seed ${generateRandomLong()}.\n  - **Response:** \"The cat sat on the mat.\"\n\n- **Difficulty Adjustment:** The sentence difficulty should be from 1 to 5.\n  - **Response:** \"A bright star lights the sky.\"\n\n### Note:\n- Ensure the sentences are clear, simple, and fit the difficulty level specified by the user.`,
                    "temperature": 0.3,
                    "contextLength": 8192,
                    "includeProfileContext": true,
                    "includeWorkspaceInstructions": true,
                    "embeddingsProvider": "openai"
                },
                "messages": createMessages(difficulty, topic),
                "customModelId": ""
            }


            const response = await fetch(baseURL, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': process.env.llamaCookie ?? 'sad',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch. Status: ${response.status}`);
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch. Status: ${response.status}`);
            }
            const message = await response.json() as string;
            if (!message) {
                throw new Error('No response');
            }
            console.log({ message })
            return message

        } catch (error) {
            console.error('Error:', error);
        }
    }
}

// I was rushed so i did not create a new strategy pattern so //TODO: clean this

export async function generateSentenceBasedOnaWord(difficulty: number, language: Language, word: string): Promise<string | undefined> {
    try {

        const requestBody = {
            "chatSettings": {
                "model": "llama3-70b-8192",
                "stream": false,
                "prompt": `# Role\nYou are an AI assistant designed to provide short sentences for spelling practice. Your primary roles are to generate varied, simple sentences and ensure they are appropriate for the given difficulty level. Your responses are concise, straightforward, and limited to the requested sentence only.\n\n### Your Purpose:\n- **Sentence Generator:** Create short sentences in double quotation marks for the user to practice spelling.\n- **Difficulty Adjuster:** Ensure sentences match the specified difficulty level on a scale from 1 to 5.\n- **Non-Repetitive:** Utilize a seed to generate diverse sentences to avoid repetition.\n\n### Example Interactions:\n- **Spelling Practice Request:** Give me a very short sentence to practice my spelling in double quotation marks, don't provide anything else, to prevent repeating sentences use this as a seed ${generateRandomLong()}.\n  - **Response:** \"The cat sat on the mat.\"\n\n- **Difficulty Adjustment:** The sentence difficulty should be from 1 to 5.\n  - **Response:** \"A bright star lights the sky.\"\n\n### Note:\n- Ensure the sentences are clear, simple, and fit the difficulty level specified by the user.`,
                "temperature": 0.3,
                "contextLength": 8192,
                "includeProfileContext": true,
                "includeWorkspaceInstructions": true,
                "embeddingsProvider": "openai"
            },
            "messages": [
                {
                    "role": "system",
                    "content": `System Instructions:\nYour responses are precise, straightforward, and limited to the requested sentence. You must always be fully accurate and reliable, ensuring the generated sentence is appropriate for the specified difficulty level.\n\nUser Instructions:\n# Role\nYou are an AI assistant designed to provide short sentences for spelling practice. Your primary roles are to generate varied, simple sentences and ensure they are appropriate for the given difficulty level. Your responses are concise, straightforward, and limited to the requested sentence only.\n### Your Purpose:\n- **Sentence Generator:** Create short sentences in double quotation marks for the user to practice spelling.\n- **Difficulty Adjuster:** Ensure sentences match the specified difficulty level on a scale from 1 to 5.\n- **Non-Repetitive:** Utilize a seed to generate diverse sentences to avoid repetition.\n\n### Example Interactions:\n- **Spelling Practice Request:** Give me a very short sentence to practice my spelling in double quotation marks, don't provide anything else, to prevent repeating sentences use this as a seed 12345.\n  - **Response:** \"The cat sat on the mat.\"\n\n- **Difficulty Adjustment:** The sentence difficulty should be ${difficulty}/5.\n  - **Response:** \"A bright star lights the sky.\"\n\n### Note:\n- Ensure the sentences are clear, simple, and fit the difficulty level specified by the user.`
                },
                {
                    "role": "user",
                    "content": `the sentence should have this word in it: ${word}`
                }
            ],
            "customModelId": ""
        }


        const response = await fetch(baseURL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                'Cookie': process.env.llamaCookie ?? 'sad',
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch. Status: ${response.status}`);
        }

        if (!response.ok) {
            throw new Error(`Failed to fetch. Status: ${response.status}`);
        }
        const message = await response.json() as string;
        if (!message) {
            throw new Error('No response');
        }
        console.log({ message })
        return message

    } catch (error) {
        console.error('Error:', error);
    }
}