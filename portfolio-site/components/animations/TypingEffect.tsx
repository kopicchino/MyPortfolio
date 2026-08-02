"use client";

/**
 * components/animations/TypingEffect.tsx
 * Typing / typewriter animation that cycles through an array of strings.
 */

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypingEffectProps {
  strings: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
  className?: string;
  cursorClassName?: string;
  showCursor?: boolean;
}

type TypingPhase = "typing" | "pausing" | "deleting" | "switching";

export function TypingEffect({
  strings,
  typeSpeed = 80,
  deleteSpeed = 40,
  pauseDuration = 1800,
  className,
  cursorClassName,
  showCursor = true,
}: TypingEffectProps) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<TypingPhase>("typing");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (strings.length === 0) return;

    const currentString = strings[currentIndex];
    let timeout: ReturnType<typeof setTimeout>;

    switch (phase) {
      case "typing":
        if (charIndex < currentString.length) {
          timeout = setTimeout(() => {
            setDisplayText(currentString.slice(0, charIndex + 1));
            setCharIndex((prev) => prev + 1);
          }, typeSpeed);
        } else {
          timeout = setTimeout(() => setPhase("pausing"), pauseDuration);
        }
        break;

      case "pausing":
        timeout = setTimeout(() => setPhase("deleting"), 100);
        break;

      case "deleting":
        if (charIndex > 0) {
          timeout = setTimeout(() => {
            setDisplayText(currentString.slice(0, charIndex - 1));
            setCharIndex((prev) => prev - 1);
          }, deleteSpeed);
        } else {
          setPhase("switching");
        }
        break;

      case "switching":
        setCurrentIndex((prev) => (prev + 1) % strings.length);
        setPhase("typing");
        break;
    }

    return () => clearTimeout(timeout);
  }, [
    phase,
    charIndex,
    currentIndex,
    strings,
    typeSpeed,
    deleteSpeed,
    pauseDuration,
  ]);

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span>{displayText}</span>
      {showCursor && (
        <span
          className={cn(
            "ml-0.5 inline-block w-0.5 h-[1em] bg-current",
            "animate-[typing-cursor_1s_infinite]",
            cursorClassName
          )}
          aria-hidden="true"
        />
      )}
    </span>
  );
}

// ------------------------------------------------------------------
// Simple fade-in text reveal (word by word)
// ------------------------------------------------------------------
interface WordRevealProps {
  text: string;
  className?: string;
  wordClassName?: string;
  staggerDelay?: number;
  delay?: number;
}

export function WordReveal({
  text,
  className,
  wordClassName,
  staggerDelay = 0.08,
  delay = 0,
}: WordRevealProps) {
  const words = text.split(" ");

  return (
    <span className={cn("inline-flex flex-wrap gap-x-[0.25em]", className)}>
      {words.map((word, i) => (
        <span
          key={i}
          className={cn(
            "inline-block animate-[slide-up_0.6s_cubic-bezier(0.215,0.61,0.355,1)_both]",
            wordClassName
          )}
          style={{
            animationDelay: `${delay + i * staggerDelay}s`,
          }}
        >
          {word}
        </span>
      ))}
    </span>
  );
}
