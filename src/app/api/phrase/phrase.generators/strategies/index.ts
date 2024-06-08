import { env } from "process";
import { GeminiChatSentenceStrategy, GeminiTopicMessage, GeminiWordMessage } from "./gemini";
import { GemmaChatSentenceStrategy, GemmaTopicMessage, GemmaWordMessage } from "./gemma.2b.chat";

export const SentenceStrategy = env.NODE_ENV == "development" ? GeminiChatSentenceStrategy : GemmaChatSentenceStrategy
export const TopicSentenceStrategy = env.NODE_ENV == "development" ? GeminiTopicMessage : GemmaTopicMessage
export const WordSentenceStrategy = env.NODE_ENV == "development" ? GeminiWordMessage : GemmaWordMessage