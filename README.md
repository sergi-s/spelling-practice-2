# Spelling Practice 2.0

## Overview
A Next.js application for spelling practice (English for now), using TypeScript, Prisma, and MongoDB.
Using an LLM (Gemma:2b with Ollama) to generate Phrases that ranges in difficulties.

## Requirements
- Node.js
- MongoDB
- Prisma


## Installation
1. Clone the repository.
2. Install dependencies: `yarn install`.
3. Set up and start MongoDB.
4. Configure Prisma connection in the schema file.
5. Run migrations: `npx prisma migrate dev`.
6. Start the development server: `yarn dev`.

## Usage
- Visit the application in your browser.
- Register or login.
- Start practicing English spelling!

## Current plan
1- Some refactoring
2- Make a better comparison between the input vs the sentence.phrase
3- Add some styling
4- control difficulties
5- Another module for logged in users and do analysis (of words scores)

## Contributing
Contributions welcome.

## License
This project is licensed under the MIT License.
