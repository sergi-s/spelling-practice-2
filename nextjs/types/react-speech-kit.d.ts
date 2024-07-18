declare module 'react-speech-kit' {
  interface SpeechSynthesisResult {
    speak: ({ text: string }) => void;
    cancel: () => void;
    // Add other properties if needed
  }

  export function useSpeechSynthesis(): SpeechSynthesisResult;
}
