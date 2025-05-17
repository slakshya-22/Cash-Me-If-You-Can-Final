"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart3, UsersRound } from "lucide-react";
import type { Question, AudiencePollResults } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

interface AudiencePollDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  currentQuestion: Question | null;
  audiencePollResults: AudiencePollResults | null;
}

export function AudiencePollDialog({
  isOpen,
  onOpenChange,
  currentQuestion,
  audiencePollResults,
}: AudiencePollDialogProps) {
  if (!currentQuestion || !audiencePollResults) return null;

  // Find the answer with the highest percentage for highlighting, if desired
  // const highestVote = Math.max(...Object.values(audiencePollResults));

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card/90 backdrop-blur-md border-primary shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-primary">
            <UsersRound className="mr-2 h-6 w-6" />
            Audience Poll Results
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            The audience has voted on:
            <strong className="block mt-1 text-foreground">{currentQuestion?.text}</strong>
          </DialogDescription>
        </DialogHeader>
        
        <div className="my-4 space-y-3">
          {Object.entries(audiencePollResults).map(([option, percentage]) => (
            <Card key={option} className="bg-background/50 border-border">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{option}</span>
                  <span className="text-sm font-bold text-primary">{percentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3.5">
                  <div
                    className="bg-gradient-to-r from-secondary to-primary h-3.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                    aria-label={`Poll result for ${option}: ${percentage}%`}
                  ></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <BarChart3 className="mr-2 h-4 w-4"/>
            Got it!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
