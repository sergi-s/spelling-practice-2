
import { TfIdf } from "natural";

// Create TF-IDF document
export function createTfIdfDocument(documents: string[]): TfIdf {
    const tfidf = new TfIdf();

    // Add documents to the TF-IDF model
    documents.forEach((doc) => {
        tfidf.addDocument(doc);
    });

    return tfidf;
}

