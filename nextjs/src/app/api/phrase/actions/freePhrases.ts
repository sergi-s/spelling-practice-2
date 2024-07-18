"use server"
import { type Prisma } from "@prisma/client";
import { prisma } from "../../globalVariables";


export async function getFreePhrases({ skip = 0, take = 10, topic, difficulty }: { skip: number, take: number, topic?: string, difficulty?: number }) {
  try {
    const whereClause: Prisma.PhraseWhereInput = {
      phrase: topic !== null && topic !== undefined ? { contains: topic } : undefined,
    };

    const phrases = await prisma.phrase.findMany({
      skip, take, where: whereClause
    });
    return phrases;
  } catch (error) {
    console.error('Error fetching random sentence:', error);
    throw error;
  }
}
