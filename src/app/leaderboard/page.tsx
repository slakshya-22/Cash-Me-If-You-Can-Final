
"use client";

import { useEffect, useState } from "react";
import type { ScoreEntry, FirestoreScoreEntry } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { firestore } from "@/lib/firebase/config";
import { collection, query, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";
import { CreativeLoader } from "@/components/ui/creative-loader";

// Helper function to format milliseconds into MM:SS
const formatTimeTaken = (ms: number | undefined): string => {
  if (typeof ms !== 'number' || ms <= 0) return "N/A";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

export default function LeaderboardPage() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScores = async () => {
      if (!firestore) {
        console.error("[LeaderboardPage] Firestore is not initialized.");
        setError("Database connection is not available.");
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      console.log("[LeaderboardPage] Fetching scores from Firestore...");
      try {
        const scoresCollection = collection(firestore, "leaderboard_scores");
        // IMPORTANT: This query requires a composite index in Firestore.
        // Collection: leaderboard_scores
        // Fields: 
        // 1. score (Descending)
        // 2. timeTakenMs (Ascending)
        // 3. timestamp (Ascending)
        // Firebase Console will usually provide a link to create this index if it's missing.
        const q = query(
          scoresCollection, 
          orderBy("score", "desc"), 
          orderBy("timeTakenMs", "asc"), 
          orderBy("timestamp", "asc"), 
          limit(10)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedScores: ScoreEntry[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data() as FirestoreScoreEntry;
          let dateStr = "N/A";
          if (data.timestamp && data.timestamp instanceof Timestamp) {
             dateStr = data.timestamp.toDate().toLocaleDateString();
          } else if (data.timestamp) {
            try {
              const jsDate = new Date((data.timestamp as any).seconds * 1000 + (data.timestamp as any).nanoseconds / 1000000);
              dateStr = jsDate.toLocaleDateString();
            } catch (dateError) {
              console.warn(`[LeaderboardPage] Could not parse timestamp for doc ${doc.id}:`, data.timestamp, dateError);
            }
          }

          fetchedScores.push({
            id: doc.id,
            name: data.name || "Anonymous",
            score: data.score || 0,
            date: dateStr,
            timestampMillis: data.timestamp instanceof Timestamp ? data.timestamp.toMillis() : (data.timestamp ? ((data.timestamp as any).seconds * 1000) : undefined),
            timeTakenMs: data.timeTakenMs,
          });
        });
        console.log("[LeaderboardPage] Successfully fetched and processed scores:", fetchedScores.length, "entries.");
        setScores(fetchedScores);
      } catch (e: any) {
        console.error("[LeaderboardPage] Failed to fetch scores from Firestore:", e);
        if (e.code === 'failed-precondition' && e.message.includes('requires an index')) {
          setError(`Database query failed: This query needs a new composite index in Firestore for 'score' (DESC), 'timeTakenMs' (ASC), and 'timestamp' (ASC). Please check your Firebase console for 'leaderboard_scores' collection. The error console might provide a direct link to create it. Error: ${e.message}`);
        } else {
          setError(`Could not load high scores. Please try again later. Error: ${e.message || e.toString()}`);
        }
        setScores([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScores();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-12rem)] p-4">
        <CreativeLoader text="Loading leaderboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-12rem)] p-4 text-center">
        <Trophy className="h-12 w-12 sm:h-16 sm:w-16 text-destructive mb-4" />
        <p className="text-xl sm:text-2xl text-destructive-foreground font-semibold">Error Loading Leaderboard</p>
        <p className="text-muted-foreground mt-2 mb-6 max-w-lg whitespace-pre-wrap">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-primary hover:bg-primary/90">
            Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 px-2 sm:px-4">
      <Card className="max-w-xl sm:max-w-2xl lg:max-w-4xl mx-auto shadow-2xl bg-card/80 backdrop-blur-md border-primary/30 rounded-xl">
        <CardHeader className="text-center p-5 sm:p-6">
          <div className="inline-block mx-auto p-3 sm:p-4 bg-gradient-to-br from-primary via-accent to-secondary rounded-full mb-3 sm:mb-4 shadow-lg">
            <Trophy className="h-12 w-12 sm:h-14 sm:w-14 text-primary-foreground" />
          </div>
          <CardTitle className="text-3xl sm:text-4xl font-bold text-primary">High Scores</CardTitle>
          <CardDescription className="text-base sm:text-lg text-muted-foreground">
            Champions of "Cash Me If You Can"!
          </CardDescription>
        </CardHeader>
        <CardContent className="px-3 sm:px-4 md:px-6 pb-5 sm:pb-6">
          {scores.length === 0 ? (
            <div className="text-center py-8 sm:py-10">
              <p className="text-lg sm:text-xl text-muted-foreground mb-4 sm:mb-6">
                No scores recorded yet. Be the first to make history!
              </p>
              <div data-ai-hint="empty stage spotlight" className="flex justify-center mb-6">
                <img 
                    src="https://placehold.co/300x200.png" 
                    alt="Empty leaderboard stage" 
                    className="mx-auto rounded-lg shadow-md border border-border max-w-[300px] w-full" 
                />
              </div>
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-base sm:text-lg">
                <Link href="/play">Play Now</Link>
              </Button>
            </div>
          ) : (
            <Table>
              <TableCaption className="text-sm sm:text-base mt-4">Top 10 Champions</TableCaption>
              <TableHeader>
                <TableRow className="border-b-primary/30">
                  <TableHead className="w-[60px] sm:w-[80px] text-center text-accent font-semibold text-sm sm:text-base">Rank</TableHead>
                  <TableHead className="text-accent font-semibold text-sm sm:text-base">Name</TableHead>
                  <TableHead className="text-right text-accent font-semibold text-sm sm:text-base">Score</TableHead>
                  <TableHead className="text-right text-accent font-semibold text-sm sm:text-base hidden sm:table-cell">Time</TableHead>
                  <TableHead className="text-right hidden md:table-cell text-accent font-semibold text-sm sm:text-base">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scores.map((entry, index) => (
                  <TableRow 
                    key={entry.id} 
                    className={cn(
                        "hover:bg-primary/10 border-b-border/50",
                        index === 0 && "bg-accent/10 hover:bg-accent/20", 
                        index === 1 && "bg-primary/15 hover:bg-primary/25", 
                        index === 2 && "bg-secondary/10 hover:bg-secondary/20" 
                    )}
                  >
                    <TableCell className="font-medium text-center text-base sm:text-lg">
                        {index < 3 ? <Medal className={cn("inline-block h-5 w-5 sm:h-6 sm:w-6", index === 0 && "text-yellow-400", index === 1 && "text-slate-400", index === 2 && "text-orange-400")} /> : index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-foreground text-sm sm:text-base">{entry.name}</TableCell>
                    <TableCell className="text-right font-semibold text-primary text-sm sm:text-base">
                      {entry.score.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs sm:text-sm hidden sm:table-cell">
                      <div className="flex items-center justify-end">
                        <Clock className="h-3.5 w-3.5 mr-1 opacity-70"/> 
                        {formatTimeTaken(entry.timeTakenMs)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right hidden md:table-cell text-muted-foreground text-xs sm:text-sm">
                      {entry.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
