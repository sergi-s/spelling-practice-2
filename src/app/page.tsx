"use client"
import { useState } from "react";
// import Speech from 'react-speech';
import { useSpeechSynthesis } from 'react-speech-kit';
 



// async function fetchData() {
//   // Define the URL endpoint you want to send the request to
//   const url = 'http://localhost:3000/api/stem';

//   // Define the options for the fetch request (e.g., method, headers, body)
//   const options = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     // Add body for POST or PUT requests
//     body: JSON.stringify({ language: 'english', phrase: "hello world" }),
//   };

//   try {
//     // Make the fetch request
//     const response = await fetch(url, options);

//     // Check if the request was successful
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }

//     // Parse the response as JSON
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const data = await response.json();

//     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//     return data
//   } catch (error) {
//     // Handle any errors that occurred during the fetch request
//     console.error('There was a problem with the fetch operation:', error);
//   }
// }


export default function HomePage() {

  const [text, setText] = useState('how much wood would a woodchuck chuck if the woodchuck could chuck wood');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const { speak } = useSpeechSynthesis()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
        {/* <Speech
          textAsButton={true}
          displayText="Hello"
          lang="en-GB"
          voice="Google UK English Male"
          text={text} /> */}
          {/* eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */}
          <button onClick={() => speak({ text })}>Speak</button>
      </div>
    </main>
  );
}
