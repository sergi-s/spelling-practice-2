"use server"
import { getServerAuthSession } from "~/server/auth"
import { userRepo } from "../user.repo"
import { userWordAttemptRepo } from "../../userWordAttempt/userWordAttempt.repo"
import { wordRepo } from "../../word/repositories/word.repo"

export async function getUserInfo() {

    const session = await getServerAuthSession()
    if (!session) throw new Error("Oops")
    const userId = session?.user.id
    const user = await userRepo.getById(userId)
    if (!user) throw new Error("Oops")

    const wordIds = (await userWordAttemptRepo.getAttemptsBasedOnAverage(userId, 0.9)).map(e => e.wordId)
    const wordsStrugglingWith = await wordRepo.getWordsByIds(wordIds)
    const willReturnThis = { ...user, wordsStrugglingWith: wordsStrugglingWith.map(w => w.word) }
    // console.dir({ willReturnThis }, { depth: null })
    return willReturnThis
}