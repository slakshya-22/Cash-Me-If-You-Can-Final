"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, UsersRound, Scissors } from "lucide-react";
import { PhoneAFriendDialog } from "./PhoneAFriendDialog";
import { AudiencePollDialog } from "./AudiencePollDialog"; // New Dialog
import type { Question, AudiencePollResults } from "@/lib/types";

interface LifelinePanelProps {
  currentQuestion: Question | null;
  isPhoneAFriendUsed: boolean;
  onPhoneAFriendUsed: () => void;
  isFiftyFiftyUsed: boolean;
  onFiftyFiftyUsed: () => void;
  isAudiencePollUsed: boolean;
  onAudiencePollUsed: () => void; // This will trigger state change and dialog opening
  audiencePollResults: AudiencePollResults | null; // To pass to dialog
  disabled: boolean;
}

export function LifelinePanel({
  currentQuestion,
  isPhoneAFriendUsed,
  onPhoneAFriendUsed,
  isFiftyFiftyUsed,
  onFiftyFiftyUsed,
  isAudiencePollUsed,
  onAudiencePollUsed,
  audiencePollResults,
  disabled,
}: LifelinePanelProps) {
  const [isPhoneAFriendDialogOpen, setIsPhoneAFriendDialogOpen] = useState(false);
  const [isAudiencePollDialogOpen, setIsAudiencePollDialogOpen] = useState(false);

  const handlePhoneAFriendClick = () => {
    if (!isPhoneAFriendUsed) {
      setIsPhoneAFriendDialogOpen(true);
      onPhoneAFriendUsed(); // Mark as used in game state
    }
  };

  const handleFiftyFiftyClick = () => {
    if (!isFiftyFiftyUsed) {
      onFiftyFiftyUsed(); // Mark as used and apply logic in game state
    }
  };

  const handleAudiencePollClick = () => {
    if (!isAudiencePollUsed) {
      onAudiencePollUsed(); // Mark as used and generate results in game state
      setIsAudiencePollDialogOpen(true); // Open the dialog
    }
  };

  return (
    <div className="p-4 bg-card rounded-lg shadow-xl border border-primary/20">
      <h3 className="text-xl font-semibold mb-4 text-primary text-center">Lifelines</h3>
      <div className="space-y-3">
        <Button
          onClick={handlePhoneAFriendClick}
          disabled={isPhoneAFriendUsed || disabled || !currentQuestion}
          className="w-full transition-all duration-300 ease-in-out group hover:shadow-primary/50 hover:shadow-md"
          variant={isPhoneAFriendUsed ? "secondary" : "outline"}
        >
          <Phone className="mr-2 h-5 w-5 group-hover:animate-pulse text-accent" />
          Phone-A-Friend
          {isPhoneAFriendUsed && <span className="ml-2 text-xs opacity-70">(Used)</span>}
        </Button>

        <Button
          onClick={handleFiftyFiftyClick}
          disabled={isFiftyFiftyUsed || disabled || !currentQuestion}
          className="w-full transition-all duration-300 ease-in-out group hover:shadow-primary/50 hover:shadow-md"
          variant={isFiftyFiftyUsed ? "secondary" : "outline"}
        >
          <Scissors className="mr-2 h-5 w-5 group-hover:rotate-[-15deg] transition-transform text-accent" />
          50:50
          {isFiftyFiftyUsed && <span className="ml-2 text-xs opacity-70">(Used)</span>}
        </Button>

        <Button
          onClick={handleAudiencePollClick}
          disabled={isAudiencePollUsed || disabled || !currentQuestion}
          className="w-full transition-all duration-300 ease-in-out group hover:shadow-primary/50 hover:shadow-md"
          variant={isAudiencePollUsed ? "secondary" : "outline"}
        >
          <UsersRound className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform text-accent" />
          Audience Poll
          {isAudiencePollUsed && <span className="ml-2 text-xs opacity-70">(Used)</span>}
        </Button>
      </div>

      {currentQuestion && (
        <PhoneAFriendDialog
          isOpen={isPhoneAFriendDialogOpen}
          onOpenChange={setIsPhoneAFriendDialogOpen}
          currentQuestion={currentQuestion}
        />
      )}
      {currentQuestion && audiencePollResults && (
        <AudiencePollDialog
          isOpen={isAudiencePollDialogOpen}
          onOpenChange={setIsAudiencePollDialogOpen}
          currentQuestion={currentQuestion}
          audiencePollResults={audiencePollResults}
        />
      )}
    </div>
  );
}
