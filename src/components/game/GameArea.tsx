
"use client";

import { useEffect, useState, useCallback } from "react";
import { useGameState } from "@/hooks/use-game-state";
import { useTimer } from "@/hooks/use-timer";
import { QuestionDisplay } from "./QuestionDisplay";
import { AnswerOption } from "./AnswerOption";
import { TimerDisplay } from "./TimerDisplay";
import { ScoreDisplay } from "./ScoreDisplay";
import { LifelinePanel } from "./LifelinePanel";
import { GameOverDialog } from "./GameOverDialog";
import { Button } from "@/components/ui/button";
import { CreativeLoader } from "@/components/ui/creative-loader";
import { RefreshCw, AlertTriangle, LogOut, Home as HomeIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GameAreaProps {
  gameMode: string;
  gameCategory: string;
}

export function GameArea({ gameMode, gameCategory }: GameAreaProps) {
  const router = useRouter();
  const [isQuitConfirmOpen, setIsQuitConfirmOpen] = useState(false);
  const {
    currentQuestion,
    currentQuestionIndex,
    score,
    selectedAnswer,
    isAnswerRevealed,
    gameStatus,
    startGame,
    handleSelectAnswer,
    handleTimeUp,
    INITIAL_TIMER_DURATION,
    totalQuestions,
    isPhoneAFriendUsed,
    usePhoneAFriend,
    isFiftyFiftyUsed,
    useFiftyFifty,
    isAudiencePollUsed,
    useAudiencePoll,
    audiencePollResults,
    displayedAnswers,
    saveScore,
    timeTakenMs,
  } = useGameState();

  const { timeLeft, startTimer, stopTimer, resetTimer, isRunning } = useTimer(
    INITIAL_TIMER_DURATION,
    handleTimeUp
  );

  useEffect(() => {
    if (gameStatus === "playing" && currentQuestion && !isAnswerRevealed) { 
      if (!isRunning) { 
        resetTimer(); // Ensure timer is reset for the new question
        startTimer();
      }
    } else if ((gameStatus !== "playing" || isAnswerRevealed) && isRunning) {
      stopTimer();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus, currentQuestion, isAnswerRevealed]); 

  useEffect(() => {
    if (gameStatus === "idle") {
      startGame(gameMode, gameCategory);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStatus, startGame, gameMode, gameCategory]);

  const handleConfirmQuit = useCallback(() => {
    router.push('/');
    setIsQuitConfirmOpen(false);
  }, [router]);

  const handleCloseGameOverRedirect = useCallback(() => {
    router.push('/');
  }, [router]);


  if (gameStatus === "idle" || gameStatus === "loading_questions") { 
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4">
        <CreativeLoader text={gameStatus === "idle" ? "Initializing Game..." : "Generating fresh questions with AI..."} />
        {gameStatus === "loading_questions" && (
          <p className="text-sm text-muted-foreground/70 mt-2">(This might take a few moments)</p>
        )}
      </div>
    );
  }

  if (gameStatus === "error_loading_questions") {
    return (
     <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 text-center">
       <AlertTriangle className="h-12 w-12 sm:h-16 sm:w-16 text-destructive mb-4" />
       <p className="text-xl sm:text-2xl text-destructive-foreground font-semibold">Oops! Question Time Out!</p>
       <p className="text-muted-foreground mt-2 mb-6 max-w-md">
         We couldn't fetch new trivia questions from our AI. This can happen due to high server load or a temporary glitch.
       </p>
       <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-4">
           <Button onClick={() => startGame(gameMode, gameCategory)} className="bg-primary hover:bg-primary/90">
               <RefreshCw className="mr-2 h-5 w-5" /> Try Again
           </Button>
           <Button variant="outline" asChild>
               <Link href="/">
                   <HomeIcon className="mr-2 h-5 w-5" /> Go Home
               </Link>
           </Button>
       </div>
     </div>
   );
 }
  
  if (!currentQuestion && (gameStatus === "playing" || gameStatus === "answered")) { 
     return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4 text-center">
        <CreativeLoader text="Loading question..." />
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 p-2 sm:p-4 md:p-0">
      <div className="md:col-span-8 space-y-6">
        {currentQuestion && (
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
          />
        )}
        <Card className="shadow-xl bg-card/90 backdrop-blur-sm border-primary/20 rounded-xl">
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            {currentQuestion && displayedAnswers.map((answer, index) => (
              <AnswerOption
                key={`${currentQuestion.id}-answer-${answer.text}-${index}`} 
                answer={answer}
                onClick={() => handleSelectAnswer(answer)}
                isSelected={selectedAnswer?.text === answer.text && selectedAnswer?.isCorrect === answer.isCorrect} // Compare based on text and correctness
                isCorrect={answer.isCorrect}
                isRevealed={isAnswerRevealed}
                disabled={isAnswerRevealed || gameStatus === "game_over" || gameStatus === "game_won" || gameStatus === "answered" || gameStatus === "loading_questions" || gameStatus === "error_loading_questions"}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="md:col-span-4 space-y-6">
        <TimerDisplay timeLeft={timeLeft} initialTime={INITIAL_TIMER_DURATION} />
        <ScoreDisplay score={score} />
        {currentQuestion && (
          <LifelinePanel
            currentQuestion={currentQuestion}
            isPhoneAFriendUsed={isPhoneAFriendUsed}
            onPhoneAFriendUsed={usePhoneAFriend}
            isFiftyFiftyUsed={isFiftyFiftyUsed}
            onFiftyFiftyUsed={useFiftyFifty}
            isAudiencePollUsed={isAudiencePollUsed}
            onAudiencePollUsed={useAudiencePoll}
            audiencePollResults={audiencePollResults}
            disabled={isAnswerRevealed || gameStatus === "game_over" || gameStatus === "game_won" || gameStatus === "answered" || gameStatus === "loading_questions" || gameStatus === "error_loading_questions"}
          />
        )}
        <AlertDialog open={isQuitConfirmOpen} onOpenChange={setIsQuitConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full border-destructive text-destructive hover:bg-destructive/10 hover:text-destructive-foreground"
              disabled={gameStatus === "loading_questions" || gameStatus === "error_loading_questions"}
            >
              <LogOut className="mr-2 h-5 w-5" /> Quit Game
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                If you quit now, your current game progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsQuitConfirmOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmQuit} className="bg-destructive hover:bg-destructive/90">
                Confirm Quit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <GameOverDialog
        isOpen={gameStatus === "game_over" || gameStatus === "game_won"}
        isWinner={gameStatus === "game_won"}
        score={score}
        timeTakenMs={timeTakenMs}
        onPlayAgain={() => startGame(gameMode, gameCategory)}
        onSaveScore={saveScore}
        onCloseRedirectHome={handleCloseGameOverRedirect} 
        gameName="Cash Me If You Can"
      />
    </div>
  );
}
