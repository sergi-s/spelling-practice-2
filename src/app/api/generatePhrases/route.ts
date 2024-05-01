import { NextResponse } from "next/server";
import { GemmaChatSentenceStrategy } from "../phrase/phrase.generation.strategies/gemma.2b.chat";
import { generateSentence } from "./../phrase/phrase.generation.strategies";
import { saveGeneratedPhrase } from "../phrase/phrase.service";
import { Language } from "../stemmer/validation";

export const GET = async () => {
    const difficulty = Math.floor(Math.random() * 4) + 1;
    const language = Language.en;

    console.log('Generating phrase with difficulty:', difficulty, 'and language:', language);

    const phrase = await generateSentence(GemmaChatSentenceStrategy, difficulty, language);
    if (!phrase) return NextResponse.json({
        error: "An error occurred during phrase generation"
    })
    const savedPhrase = await saveGeneratedPhrase(difficulty, language, phrase);

    return NextResponse.json({
        phrase: savedPhrase
    })
}
