"use server"

import topicRepo from "../repositories/topicRepository"


export const getAllTopics = async () => {
    return await topicRepo.getAllTopics()
}