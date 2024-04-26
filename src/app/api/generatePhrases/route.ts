import { NextApiRequest } from "next";
import { generateSentence } from "./generateGemma:2b";




export const GET = async (
    req: NextApiRequest,
) => {
    return await generateSentence()
}

