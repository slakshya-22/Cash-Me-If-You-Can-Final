
"use client";

import { Award, Star } from "lucide-react"; 

interface ScoreDisplayProps {
  score: number;
}

export function ScoreDisplay({ score }: ScoreDisplayProps) {
  return (
    <div className="p-4 sm:p-5 bg-card rounded-lg shadow-xl border border-primary/20 flex flex-col items-center space-y-1 sm:space-y-2">
      <div className="flex items-center text-primary">
        <Award className="h-6 w-6 sm:h-7 sm:w-7 mr-2 text-accent" />
        <p className="text-base sm:text-lg font-medium text-muted-foreground">Current Score</p>
      </div>
      <p className="text-4xl sm:text-5xl font-bold text-accent animate-pulse">{score.toLocaleString()}</p>
    </div>
  );
}

    