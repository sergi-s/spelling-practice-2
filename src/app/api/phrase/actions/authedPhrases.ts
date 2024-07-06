"use server"
import type { Phrase, Prisma } from "@prisma/client";
import { getServerAuthSession } from "~/server/auth";
import { tokenize } from "~/app/utils/NLP/tokenizer";
import wordRepository from "~/app/api/word/repositories/wordRepository"
import { userWordAttemptRepo } from "../../userWordAttempt/userWordAttempt.repo";
import { userPhraseAttemptRepo } from "../../userPhraseAttempt/userPhraseAttempt.repo";
import { generateAndSaveSentence } from "../phrase.generators";
import phraseRepo from "../repositories/phraseRepository";
import { prisma } from "../../globalVariables";

export async function authedGetPhrases({ skip = 0, take = 10, topic }: { skip: number, take: number, topic?: string, difficulty?: number }) {
  try {
    const session = await getServerAuthSession()
    if (!session) throw new Error("Oops")
    const userId = session?.user.id

    const whereClause: Prisma.PhraseWhereInput = {
      phrase: topic !== null && topic !== undefined ? { contains: topic } : undefined,
      topic: topic !== null && topic !== undefined ? { topic: { contains: topic } } : undefined,
      // TODO: add difficulty
    };

    // TODO: simple recommendation system based on user performance, (exploration vs exploitation)
    // const phrases = await prisma.phrase.findMany({ where: whereClause, skip, take, orderBy: { createdAt: 'desc' } });
    // return phrases;

    // DONE: based on user performance
    const practiceSentences = await recommendSentences(userId)
    if (practiceSentences.length > 0) return practiceSentences

    // TODO: exploration (eloRating calculations)
    else return await prisma.phrase.findMany({ where: whereClause, skip, take, orderBy: { createdAt: 'desc' } });
  } catch (error) {
    console.error('Error fetching random sentence:', error);
    throw error;
  }
}

export async function recordUserPerformance({ sentence, userInput }: { sentence: Phrase, userInput: string }) {
  try {
    const session = await getServerAuthSession()
    if (!session) throw new Error("Oops")
    const userId = session?.user.id


    const correctWords = tokenize(sentence.phrase)
    const savedWords = await wordRepository.getByPhraseId(sentence.id)
    const userWords = tokenize(userInput)


    // 
    const existingUserWordIds = await userWordAttemptRepo.getWordUserAttempted(userId, savedWords.map(({ id }) => id))

    // update user performance
    await userWordAttemptRepo.updateAttemptPerformance(userId, correctWords, userWords, savedWords)

    // 
    await userPhraseAttemptRepo.updateAttemptPerformance(userId, sentence.id)

    // update word performance (only for the first attempts)
    await wordRepository.updateWordsPerformance(savedWords, existingUserWordIds, userWords)


  } catch (error) {
    console.error('Error fetching random sentence:', error);
    throw error;
  }
}

// TODO: refactor code into separate files

type BadWordsPerformance = {
  encounters: number;
  correctEncounters: number;
  average: number;
  id: string;
  wordId: string;
  userId: string;
}[]

type ReturnSentences = ({
  userAttemptingPhrase: {
    performance: {
      encounters: number;
    };
  }[];
} & Phrase)[]

async function recommendSentences(userId: string) {
  // TODO: account for difficulties and topics 
  const difficultAttempts: BadWordsPerformance = await getDifficultAttempts(userId);
  const wordIds = difficultAttempts.map(a => a.wordId);
  const sortedSentences: ReturnSentences = await sortSentencesByEncounters(wordIds);
  await handleSpecialCase(sortedSentences, wordIds);

  console.log({ sortedSentences });
  return sortedSentences
}

async function getDifficultAttempts(userId: string) {
  const difficultAttempts = await userWordAttemptRepo.getAttemptsBasedOnAverage(userId, 0.9);
  return difficultAttempts.map(({ performance: { encounters, correctEncounters }, ...rest }) => ({
    ...rest,
    encounters,
    correctEncounters,
    average: 1 - (correctEncounters / encounters)
  }));
}

async function sortSentencesByEncounters(wordIds: string[]) {
  const sentencesWithWorsePerformanceWords = await phraseRepo.getByWordsIds(wordIds);
  return sentencesWithWorsePerformanceWords.sort((a, b) => {
    const aEncounters = (a.userAttemptingPhrase || []).reduce((sum, item) => sum + item.performance.encounters, 0);
    const bEncounters = (b.userAttemptingPhrase || []).reduce((sum, item) => sum + item.performance.encounters, 0);
    return aEncounters - bEncounters;
  });
}

async function handleSpecialCase(sortedSentences: ReturnSentences, wordIds: string[]) {
  if (sortedSentences.length > 1) {
    const firstEncounters = (sortedSentences[0]?.userAttemptingPhrase ?? []).reduce((sum, item) => sum + item.performance.encounters, 0);
    const secondEncounters = (sortedSentences[1]?.userAttemptingPhrase ?? []).reduce((sum, item) => sum + item.performance.encounters, 0);

    if (firstEncounters === secondEncounters && Math.random() > 0.5) {
      const wordId = sortedSentences[0]?.wordIDs.find(id => wordIds.includes(id));
      if (wordId) {
        const word = (await wordRepository.getWordsByIds([wordId]))[0];
        if (word) {
          const newSentence = await generateAndSaveSentence({ word: word.word });
          // NOTE: I have typescripts
          sortedSentences.unshift({ userAttemptingPhrase: [{ performance: { encounters: 0 } }], ...newSentence });
        }
      }
    }
  }
}
