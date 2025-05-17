
"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Answer } from "@/lib/types";

interface AnswerOptionProps {
  answer: Answer;
  onClick: () => void;
  isSelected: boolean;
  isRevealed: boolean;
  isCorrect: boolean;
  disabled: boolean;
}

export function AnswerOption({
  answer,
  onClick,
  isSelected,
  isRevealed,
  isCorrect,
  disabled,
}: AnswerOptionProps) {
  
  const getButtonVariantAndClasses = () => {
    if (isRevealed) {
      if (isCorrect) return { variant: "success" as const, extraClass: "shadow-lg shadow-success/50 ring-2 ring-success-foreground animate-pulse" };
      if (isSelected && !isCorrect) return { variant: "destructive" as const, extraClass: "shadow-lg shadow-destructive/50" };
    }
    // When selected but not yet revealed (locked in)
    if (isSelected) return { variant: "default" as const, extraClass: "ring-2 ring-primary-foreground shadow-md shadow-primary/40 scale-105" };
    // Default state, not selected, not revealed
    return { variant: "outline" as const, extraClass: "border-primary/50 hover:bg-primary/10 hover:text-primary-foreground hover:shadow-primary/20" };
  };

  const { variant, extraClass } = getButtonVariantAndClasses();

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full justify-start text-left h-auto py-3 sm:py-3.5 px-4 sm:px-5 text-sm sm:text-base md:text-lg transition-all duration-300 ease-in-out transform hover:scale-105 shadow-md rounded-lg",
        "focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-accent",
        extraClass,
        {
          "opacity-50 brightness-75 cursor-not-allowed": disabled && !isSelected,
          "opacity-70 brightness-90": isRevealed && !isCorrect && !isSelected, // Make unselected incorrect options less prominent after reveal
        }
      )}
      variant={variant}
    >
      {answer.text}
    </Button>
  );
}

    