"use server"
import type { Phrase, User, Word } from "@prisma/client";
import { getServerAuthSession } from "~/server/auth";
import { tokenize } from "~/app/utils/NLP/tokenizer";
import { wordRepo } from "~/app/api/word/repositories/word.repo"
import { userWordAttemptRepo } from "../../userWordAttempt/userWordAttempt.repo";
import { userPhraseAttemptRepo } from "../../userPhraseAttempt/userPhraseAttempt.repo";
import { generateAndSaveSentence } from "../phrase.generators";
import phraseRepo from "../repositories/phrase.repo";
import { userRepo } from "../../user/user.repo";

export async function authedGetPhrases({ skip = 0, take = 10, topic }: { skip: number, take: number, topic?: string, difficulty?: number }) {
  try {
    const session = await getServerAuthSession()
    if (!session) throw new Error("Oops")
    const userId = session?.user.id
    const user = await userRepo.getById(userId)
    if (!user) throw new Error("Oops")

    const practiceSentences = (await recommendSentences(user)).sort(() => Math.random() - 0.5)
    console.dir({ practiceSentences }, { depth: null })
    return practiceSentences
  } catch (error) {
    console.error('Error fetching random sentence:', error);
    throw error;
  }
}

export async function recordUserPerformance({ sentence, userInput }: { sentence: Phrase, userInput: string }) {
  try {
    if (!sentence) throw new Error("Oops")
    const session = await getServerAuthSession()
    if (!session) throw new Error("Oops")
    const userId = session?.user.id
    const user = await userRepo.getById(userId)
    if (!user) throw new Error("Oops")

    // I hate Typescript and Prisma and NextJs
    /* eslint-disable @typescript-eslint/dot-notation */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const sentenceId = sentence['_id']['$oid'] as unknown as string

    const correctWords = tokenize(sentence.phrase)
    const savedWords = await wordRepo.getByPhraseId(sentenceId)
    const userWords = tokenize(userInput)

    let isAllCorrect = true
    const matched: {
      userSpelling: string, word: WordWithPerformance
      isCorrectSpelling: boolean;
    }[] = []

    correctWords.forEach((word, index) => {
      const savedWord = savedWords.find((w) => w.word === word)
      const userWord = userWords[index]
      if (userWord && savedWord) {
        const isCorrectSpelling = word === userWord
        isAllCorrect = isAllCorrect && isCorrectSpelling
        matched.push({ userSpelling: userWord, word: savedWord, isCorrectSpelling })
        // ? not using the matched array by should use it in creating the update array instead of looping again 
      }
    })
    await updateEloRating(user, sentence, isAllCorrect)



    // update/create user word attempt
    const existingUserWordIds = await userWordAttemptRepo.getWordUserAttempted(userId, savedWords.map(({ id }) => id))

    // update user performance
    await userWordAttemptRepo.updateAttemptPerformance(userId, correctWords, userWords, savedWords)

    // 
    await userPhraseAttemptRepo.updateAttemptPerformance(userId, sentenceId)

    // update word performance (only for the first attempts)
    await wordRepo.updateWordsPerformance(savedWords, existingUserWordIds, userWords)


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

type ReturnSentence = ({
  userAttemptingPhrase?: {
    performance: {
      encounters: number;
    };
  }[];
} & Phrase & { recommender: SentenceRecommender })

type SentenceRecommender = "Performance" | "Elo"

type SentenceWithAttempts = ({
  userAttemptingPhrase: {
    performance: {
      encounters: number;
    };
  }[];
} & Phrase)

type WordWithPerformance = Word & {
  performance: {
    encounters: number;
    correctEncounters: number;
  } | null
}
async function recommendSentences(user: User) {
  // TODO: account for difficulties and topics 
  // TODO: refactor the code to return simple Type (note nested objects)
  const difficultAttempts: BadWordsPerformance = await getDifficultAttempts(user.id);
  const wordIds = difficultAttempts.map(a => a.wordId);
  const sortedSentences: SentenceWithAttempts[] = await sortSentencesByEncounters(wordIds);
  await handleSpecialCase(sortedSentences, wordIds);

  const singleSad: ReturnSentence[] = sortedSentences.map((e) => ({ ...e, recommender: "Performance" }))

  //? recommend based on elo
  const eloRating: number = user.eloRating as number
  // Fetch words with difficulty scores close to user's Elo rating
  const sad: ReturnSentence[] = (await phraseRepo.getBasedOnElo(eloRating, 10)).map((e) => ({ ...e, recommender: "Elo" }))

  return [...singleSad, ...sad];

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

async function handleSpecialCase(sortedSentences: SentenceWithAttempts[], wordIds: string[]) {
  if (sortedSentences.length > 1) {
    const firstEncounters = (sortedSentences[0]?.userAttemptingPhrase ?? []).reduce((sum, item) => sum + item.performance.encounters, 0);
    const secondEncounters = (sortedSentences[1]?.userAttemptingPhrase ?? []).reduce((sum, item) => sum + item.performance.encounters, 0);

    if (firstEncounters === secondEncounters && Math.random() > 0.5) {
      const wordId = sortedSentences[0]?.wordIDs.find(id => wordIds.includes(id));
      if (wordId) {
        const word = (await wordRepo.getWordsByIds([wordId]))[0];
        if (word) {
          const newSentence = await generateAndSaveSentence({ word: word.word });
          // NOTE: I have typescripts
          sortedSentences.unshift({ userAttemptingPhrase: [{ performance: { encounters: 0 } }], ...newSentence });
        }
      }
    }
  }
}

async function updateEloRating(user: User, sentence: Phrase, isCorrect: boolean) {
  try {

    const userEloRating = user.eloRating as number
    // Calculate expected score
    const expectedScore = calculateExpectedScore(userEloRating, sentence.difficulty.score);

    // Update user's Elo rating based on actual performance
    const actualScore = isCorrect ? 1 : 0;
    // K-factor = 32
    const newEloRating = userEloRating + 32 * (actualScore - expectedScore);
    await userRepo.updateEloRating(user.id, newEloRating)

    return newEloRating;
  } catch (error) {
    console.error('Error updating Elo rating:', error);
    throw error;
  }
}

function calculateExpectedScore(userEloRating: number, wordDifficultyScore: number) {
  const difference = userEloRating - wordDifficultyScore;
  const expectedScore = 1 / (1 + Math.exp(-difference / 400)); // Using logistic function approximation
  return expectedScore;
}
