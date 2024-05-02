// Dear good what Have I put myself into

// tsc index.ts && mv index.js index.cjs && node index.cjs && rm index.cjs
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

// import { prisma } from '../../prisma';
function levenshteinDistance(s1, s2) {
    const len1 = s1.length;
    const len2 = s2.length;

    const dp = [];

    for (let i = 0; i <= len1; i++) {
        dp[i] = [i];
    }

    for (let j = 0; j <= len2; j++) {
        dp[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
            dp[i][j] = Math.min(
                dp[i - 1][j] + 1, // deletion
                dp[i][j - 1] + 1, // insertion
                dp[i - 1][j - 1] + cost // substitution
            );
        }
    }

    return dp[len1][len2];
}

function findMostSimilar(corpus, newString) {
    let maxSimilarity = Number.MAX_SAFE_INTEGER;
    let mostSimilar = null;

    for (const str of corpus) {
        const similarity = levenshteinDistance(str, newString);
        if (similarity < maxSimilarity) {
            maxSimilarity = similarity;
            mostSimilar = str;
        }
    }

    return { mostSimilar, maxSimilarity };
}

void (async function () {
    // Example corpus
    const corpus: string[] = await prisma.phrase.findMany({}).then(phrase => phrase.map(e => e.phrase));

    // Example usage
    const newString = `The sentence's meaning was obscured by excessive use of jargon`;

    const { mostSimilar, maxSimilarity } = findMostSimilar(corpus, newString);
    console.log(`Most similar string in the corpus: score (${maxSimilarity}) \n ${newString} <=VS=>\n ${mostSimilar}`)

})()