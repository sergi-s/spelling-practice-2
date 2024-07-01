import json
import nltk
from datasets import load_dataset
from nltk.corpus import words

# Ensure NLTK data is downloaded
nltk.download('words')
nltk.download('punkt')

# Load the dataset
dataset = load_dataset('wmt14', 'fr-en', split='train[:1000]')

max_word_limit = 9
min_word_limit = 3

# Initialize sets for tracking unique sentences
english_sentences_set = set()

# Initialize lists for filtered and eliminated sentences
english_sentences = []
eliminated_english_sentences = []

# Flag to control inclusion of eliminated sentences in output
include_eliminated_sentences = False

# Helper function to count words in a sentence
def word_count(sentence):
    return len(sentence.split())

# Helper function to check if a word is English
english_vocab = set(words.words())
def is_english_word(word):
    return word.lower() in english_vocab

# Function to check if a sentence contains only English words
def contains_only_english_words(sentence):
    tokens = nltk.word_tokenize(sentence)
    for token in tokens:
        if token.isalnum() and not is_english_word(token):
            return False
    return True

# Function to check if a sentence meets the constraints and update the sets and lists
def process_sentence(sentence, sentence_set, sentence_list, eliminated_list):
    if min_word_limit <= word_count(sentence) <= max_word_limit:
        if sentence not in sentence_set:
            if contains_only_english_words(sentence):
                sentence_set.add(sentence)
                sentence_list.append(sentence)
            elif include_eliminated_sentences:
                eliminated_list.append(sentence)
    elif include_eliminated_sentences:
        eliminated_list.append(sentence)

# Extract sentences and filter by length
for entry in dataset:
    en_sentence = entry['translation']['en']
    
    # Process English sentences
    process_sentence(en_sentence, english_sentences_set, english_sentences, eliminated_english_sentences)

# Combine the sentences into a single dictionary
output_data = {
    "combined_sentences": {
        "en": english_sentences
    }
}

if include_eliminated_sentences:
    output_data["eliminated_sentences"] = {
        "en": eliminated_english_sentences
    }

# Save combined and eliminated sentences to a JSON file
with open('sentences_output.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, ensure_ascii=False, indent=4)

print("Saved filtered and eliminated English sentences to 'sentences_output.json'")
