import  { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";

const typingSpeed = 120; // מהירות הקלדה
const pauseBetweenExamples = 1500; // זמן השהיה בין דוגמאות
const examples = [
    "Turn this into a pencil sketch",
    "Make it look like a painting",
    "Add a sunset background",
    "Change colors to black and white",
    "Blur the background",
    "Make the person smile",
    "Enhance the image quality",
    "Add a fantasy forest vibe",
    "Make it look like it's winter",
    "Replace sky with galaxy",
    "Add cinematic lighting",
    "Turn it into anime style",
    "Make it look vintage",
    "Add rain effect",
    "Sharpen facial features",
  ];

export default function PromptInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [exampleIndex, setExampleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [typing, setTyping] = useState(true);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (value) {
      setTyping(false); 
      return;
    }

    setTyping(true);
  }, [value]);

  useEffect(() => {
    if (!typing) return;

    const currentExample = examples[exampleIndex];

    if (charIndex < currentExample.length) {
      timeoutRef.current = setTimeout(() => {
        setDisplayedText((prev) => prev + currentExample[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, typingSpeed);
    } else {
      timeoutRef.current = setTimeout(() => {
        setDisplayedText("");
        setCharIndex(0);
        setExampleIndex((prev) => (prev + 1) % examples.length);
      }, pauseBetweenExamples);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [charIndex, typing, exampleIndex]);

  return (
    <TextField
    multiline
    minRows={2}
    maxRows={2}
    placeholder={typing ? displayedText + "▌" : ""}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    sx={{
      backgroundColor: "#000",
      borderRadius: 1,
      mb: 2,
      width: "60%",
      input: {
        fontFamily: "monospace",
        color: "#fff",
      },
      textarea: {
        fontFamily: "monospace",
        color: "#fff",
      },
      "& .MuiInputBase-input::placeholder": {
        color: "#ccc",
        opacity: 1,
      },
    }}
    onClick={(e) => e.stopPropagation()}
  />
  );
}
