
"use client";

import { Progress } from "@/components/ui/progress";
import { Clock, Zap } from "lucide-react"; // Zap for low time emphasis

interface TimerDisplayProps {
  timeLeft: number;
  initialTime: number;
}

export function TimerDisplay({ timeLeft, initialTime }: TimerDisplayProps) {
  const progressPercentage = (timeLeft / initialTime) * 100;
  const isLowTime = timeLeft <= 10 && timeLeft > 0; // KBC typically has 30 or 45 sec timer, 10s is low

  return (
    <div className="w-full p-4 sm:p-5 bg-card rounded-lg shadow-xl border border-primary/20 flex items-center space-x-3 sm:space-x-4">
      {isLowTime ? (
        <Zap className="h-7 w-7 sm:h-8 sm:w-8 text-destructive animate-ping" />
      ) : (
        <Clock className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
      )}
      <div className="flex-grow">
        <div className={`text-2xl sm:text-3xl font-bold mb-1 text-center ${isLowTime ? "text-destructive" : "text-foreground"}`}>
          {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:
          {String(timeLeft % 60).padStart(2, '0')}
        </div>
        <Progress 
          value={progressPercentage} 
          className={`h-3 sm:h-3.5 w-full transition-all duration-300 rounded-full ${isLowTime ? '[&>div]:bg-destructive': '[&>div]:bg-gradient-to-r [&>div]:from-accent [&>div]:to-primary'}`} 
        />
      </div>
    </div>
  );
}

    