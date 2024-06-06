// SpeakButton.tsx
import React from "react";
import { useSpeechSynthesis } from "react-speech-kit";

type SpeakButtonProps = {
  text?: string;
};

export const SpeakButton = ({ text }: SpeakButtonProps) => {
  const { speak } = useSpeechSynthesis();

  const handleSpeak = () => {
    if (text) {
      speak({ text });
    }
  };

  return (
    <button onClick={handleSpeak}>
      Speak
    </button>
  );
};
