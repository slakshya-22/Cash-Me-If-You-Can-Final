
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PartyPopper, RotateCcw, Trophy, Loader2, Sparkles, Crown, Gift } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface GameOverDialogProps {
  isOpen: boolean;
  isWinner: boolean;
  score: number;
  timeTakenMs: number | null;
  onPlayAgain: () => void;
  onSaveScore: (name: string, userId: string) => Promise<void>;
  onCloseRedirectHome: () => void; // New prop
  gameName?: string;
}

export function GameOverDialog({ 
  isOpen, 
  isWinner,
  score, 
  timeTakenMs,
  onPlayAgain, 
  onSaveScore, 
  onCloseRedirectHome,
  gameName = "Cash Me If You Can" 
}: GameOverDialogProps) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setIsSaving(false);
    }
  }, [isOpen]);

  const formatTime = (ms: number | null) => {
    if (ms === null || ms <= 0) return "N/A"; // Handle ms=0 as N/A as well
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleSaveScoreAndNavigate = async () => {
    if (!user) {
      console.error("User not authenticated, cannot save score.");
      toast({ title: "Authentication Error", description: "You must be signed in to save your score.", variant: "destructive"});
      return;
    }
    const nameToSave = user.displayName || user.email?.split('@')[0] || "Anonymous Player";
    
    setIsSaving(true);
    try {
      await onSaveScore(nameToSave, user.uid);
      router.push("/leaderboard");
    } catch (error: any) {
      console.error("Error during onSaveScore or navigation:", error);
      // Toast for onSaveScore failure is handled within useGameState,
      // but we can add a generic one here if navigation itself fails, though unlikely.
      // Or rely on the toast from useGameState's saveScore.
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlayAgain = () => {
    onPlayAgain();
  };

  const titleText = isWinner ? "YOU'RE A TRIVIA CHAMPION!" : "Game Over!";
  const descriptionText = isWinner 
    ? `Incredible! You've conquered all questions in ${gameName}! Your final score is an amazing ${score.toLocaleString()} points. Time: ${formatTime(timeTakenMs)}.`
    : `Congratulations${user?.displayName ? `, ${user.displayName}` : ''}! You scored ${score.toLocaleString()} points. Time: ${formatTime(timeTakenMs)}. ${score > 0 ? "Your score will be submitted to the leaderboard." : "Better luck next time!"}`;

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(openState) => {
        if (!openState) { // If dialog is trying to close (e.g. X button, Escape key)
          onCloseRedirectHome();
        }
      }}
    >
      <DialogContent className={cn(
        "sm:max-w-md bg-card/90 backdrop-blur-md border-primary shadow-2xl rounded-xl overflow-hidden",
        isWinner && "sm:max-w-lg border-none shadow-2xl shadow-yellow-500/70 bg-gradient-to-br from-purple-600 via-pink-500 to-yellow-400 text-white"
      )}>
        <DialogHeader className="text-center pt-6 sm:pt-8 px-4 sm:px-6">
          <div className="flex justify-center items-center space-x-2 mb-4">
            {isWinner ? (
              <>
                <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-300 animate-ping opacity-75" style={{animationDelay: '0s'}} />
                <Crown className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-400 animate-bounce" style={{animationDelay: '0.1s'}}/>
                <Trophy className="h-12 w-12 sm:h-14 sm:w-14 text-yellow-500 animate-pulse" />
                <PartyPopper className="h-10 w-10 sm:h-12 sm:w-12 text-pink-400 animate-bounce" style={{animationDelay: '0.2s'}}/>
                <Sparkles className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-300 animate-ping opacity-75" style={{animationDelay: '0.3s'}} />
              </>
            ) : (
              <Gift className="h-10 w-10 text-accent" />
            )}
          </div>
          <DialogTitle className={cn(
            "text-2xl sm:text-3xl font-bold",
            isWinner ? "text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-white to-pink-300 drop-shadow-lg text-3xl sm:text-4xl md:text-5xl py-2" : "text-primary"
          )}>
            {titleText}
          </DialogTitle>
          <DialogDescription className={cn(
            "text-sm sm:text-base mt-2",
            isWinner ? "text-indigo-100/90 font-medium" : "text-muted-foreground"
          )}>
            {descriptionText}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="flex-col sm:flex-row sm:justify-between space-y-3 sm:space-y-0 sm:space-x-2 pt-6 pb-6 sm:pb-8 px-6 sm:px-8">
          <Button 
            variant={isWinner ? "outline" : "outline"}
            onClick={handlePlayAgain} 
            className={cn(
              "w-full sm:w-auto border-primary text-primary hover:bg-primary/10", 
              isWinner && "border-yellow-200/70 text-yellow-100 hover:bg-white/20 hover:text-white font-semibold"
            )}
            disabled={isSaving}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Play Again
          </Button>
          {(score > 0 || isWinner) && user && (
            <Button 
              onClick={handleSaveScoreAndNavigate} 
              disabled={isSaving} 
              className={cn(
                "w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground",
                isWinner && "bg-gradient-to-r from-yellow-500 via-pink-400 to-purple-500 hover:opacity-95 text-white shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
              )}
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (isWinner ? <Crown className="mr-2 h-4 w-4"/> : <Trophy className="mr-2 h-4 w-4" />)}
              {isSaving ? "Saving..." : (isWinner ? "Claim Victory & See Ranks!" : "Submit & View Leaderboard")}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
