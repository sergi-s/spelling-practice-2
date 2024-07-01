"use server"
import type { Phrase, Prisma } from "@prisma/client";
import { prisma } from "../../globalVariables";
import { getServerAuthSession } from "~/server/auth";
import { tokenize } from "~/app/utils/NLP/tokenizer";
import wordRepository from "~/app/api/word/repositories/wordRepository"
import { userWordAttemptRepo } from "../../userWordAttempt/userWordAttempt.repo";

export async function authedGetPhrases({ skip = 0, take = 10, topic, difficulty }: { skip: number, take: number, topic?: string, difficulty?: number }) {
  try {
    const session = await getServerAuthSession()
    if (!session) throw new Error("Oops")
    const userId = session?.user.id

    const whereClause: Prisma.PhraseWhereInput = {
      phrase: topic !== null && topic !== undefined ? { contains: topic } : undefined,
      topic: topic !== null && topic !== undefined ? { topic: { contains: topic } } : undefined,
      // TODO: add difficulty
    };

    const phrases = await prisma.phrase.findMany({ where: whereClause, skip, take, orderBy: { createdAt: 'desc' } });

    await recommendSentences(userId)
    // TODO: simple recommendation system based on user performance, (exploration vs exploitation)
    return phrases;
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

    // update word performance (only for the first attempts)
    await wordRepository.updateWordsPerformance(savedWords, existingUserWordIds, userWords)


  } catch (error) {
    console.error('Error fetching random sentence:', error);
    throw error;
  }
}


async function recommendSentences(userId: string) {
  // Get words with a performance average of less than 90%
  const difficultWords = await prisma.userAttemptingWord.findRaw({
    filter: {
      userId: { $eq: userId },
      "performance.correctEncounters": { "$gt": 0 }
    },
  });

  console.log("=================================================================")
  console.dir({ difficultWords }, { depth: null })
  console.log("=================================================================")
  
  // TODO: continue the implementation the algo
}