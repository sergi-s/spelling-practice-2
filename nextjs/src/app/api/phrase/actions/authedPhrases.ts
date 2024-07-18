"use server"
import { userRepo } from "../../user/user.repo";
import { recommendSentences } from "../services/authedPhrase.service";

export async function authedGetPhrases({ skip = 0, take = 10, topic, difficulty, userId }: { skip: number, take: number, topic?: string, difficulty?: number, userId: string }) {
  try {
    if (!userId) throw new Error("Oops")
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