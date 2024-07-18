import React from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import IconButton from "./IconButton";

export const SpeakButton = ({ text }: { text?: string; }) => {
  const { speak } = useSpeechSynthesis();

  const handleSpeak = () => {
    if (text) {
      speak({ text });
    }
  };

  return (
    <IconButton onClick={handleSpeak} color="gradient2">
      Speak
    </IconButton>
  );
};
