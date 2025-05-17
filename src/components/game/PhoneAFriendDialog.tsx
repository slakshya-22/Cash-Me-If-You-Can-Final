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
import { Loader2, Lightbulb } from "lucide-react";
import { phoneAFriend, type PhoneAFriendInput, type PhoneAFriendOutput } from "@/ai/flows/phone-a-friend";
import type { Question } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface PhoneAFriendDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentQuestion: Question | null;
}

export function PhoneAFriendDialog({ isOpen, onOpenChange, currentQuestion }: PhoneAFriendDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [advice, setAdvice] = useState<PhoneAFriendOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && currentQuestion && !advice) {
      fetchAdvice();
    }
    if (!isOpen) {
      // Reset state when dialog closes
      setAdvice(null);
      setError(null);
      setIsLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentQuestion]);

  const fetchAdvice = async () => {
    if (!currentQuestion) return;
    setIsLoading(true);
    setError(null);
    try {
      const input: PhoneAFriendInput = {
        question: currentQuestion.text,
        options: currentQuestion.answers.map(a => a.text),
      };
      const result = await phoneAFriend(input);
      setAdvice(result);
    } catch (err) {
      console.error("Error fetching AI advice:", err);
      setError("Sorry, your friend couldn't be reached. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Lightbulb className="mr-2 h-5 w-5 text-yellow-500" />
            Phone-A-Friend
          </DialogTitle>
          <DialogDescription>
            Your AI friend is thinking... here's what they suggest for:
            <strong className="block mt-1">{currentQuestion?.text}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          {isLoading && (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="ml-4 text-lg">Dialing your friend...</p>
            </div>
          )}
          {error && (
             <Alert variant="destructive">
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
           </Alert>
          )}
          {advice && !isLoading && (
            <Alert className="bg-accent/10 border-accent/50">
              <Lightbulb className="h-5 w-5 text-accent" />
              <AlertTitle className="text-accent">Your friend says...</AlertTitle>
              <AlertDescription className="mt-2 text-foreground">
                <p className="mb-2">{advice.advice}</p>
                {advice.uncertainty && (
                  <p className="text-sm italic text-muted-foreground">"{advice.uncertainty}"</p>
                )}
              </AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Got it, thanks!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
