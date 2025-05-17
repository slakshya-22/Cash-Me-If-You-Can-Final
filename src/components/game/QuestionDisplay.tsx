
"use client";

import type { Question } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, TrendingUp } from "lucide-react"; // Using TrendingUp for difficulty

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
}

export function QuestionDisplay({ question, questionNumber, totalQuestions }: QuestionDisplayProps) {
  if (!question) return null;

  return (
    <Card className="w-full shadow-2xl transform transition-all duration-500 hover:shadow-primary/40 bg-gradient-to-br from-card via-background to-card/90 border-2 border-primary/30 rounded-xl">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3 sm:mb-4">
          <CardDescription className="text-sm sm:text-base text-muted-foreground flex items-center mb-2 sm:mb-0">
            <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-accent"/>
            Question {questionNumber} / {totalQuestions}
          </CardDescription>
          <CardDescription className="text-sm sm:text-base text-primary font-semibold px-3 py-1 bg-primary/10 rounded-md">
            {question.points.toLocaleString()} Points
          </CardDescription>
        </div>
        <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight py-3 sm:py-4 text-center">
          {question.text}
        </CardTitle>
         <div className="text-center text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2 flex items-center justify-center">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 text-secondary"/>
            Difficulty: <span className="font-semibold text-secondary ml-1">{question.difficulty}</span>
        </div>
      </CardHeader>
      {/* Optional: Placeholder for image related to question */}
      {/* {question.imageUrl && (
        <CardContent className="p-4 flex justify-center">
          <img src={question.imageUrl} alt="Question related" className="max-h-64 rounded-lg shadow-md" />
        </CardContent>
      )} */}
    </Card>
  );
}

    