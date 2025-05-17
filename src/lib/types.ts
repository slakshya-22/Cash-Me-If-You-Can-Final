
import { z } from 'zod';
import type { Timestamp } from 'firebase/firestore'; // For type reference if needed, though client state might use number

export const DifficultyEnum = z.enum(["Easy", "Medium", "Hard", "Very Hard"]);
export type Difficulty = z.infer<typeof DifficultyEnum>;

export const AnswerSchema = z.object({
  text: z.string().describe("The text of the answer option."),
  isCorrect: z.boolean().describe("Whether this answer option is correct."),
});
export type Answer = z.infer<typeof AnswerSchema>;

export const QuestionSchema = z.object({
  id: z.string().describe("A unique identifier for the question (e.g., generated UUID or sequential)."),
  text: z.string().describe("The text of the trivia question."),
  answers: z.array(AnswerSchema).length(4).describe("An array of exactly four answer options."),
  difficulty: DifficultyEnum.describe("The difficulty level of the question."),
  points: z.number().optional().describe("Points awarded for this question (will be assigned by the game logic)."),
  imageUrl: z.string().optional().describe("An optional URL for an image related to the question."),
});
export type Question = z.infer<typeof QuestionSchema>;

export interface FirestoreScoreEntry {
  name: string;
  score: number;
  userId: string;
  timestamp: Timestamp; // Firestore Timestamp
  timeTakenMs: number; // Time taken to complete the game in milliseconds
}

// Client-side representation of a score entry
export interface ScoreEntry {
  id: string; // This will be the userId (document ID from Firestore)
  name: string;
  score: number;
  date: string; // Formatted date string for display
  timestampMillis?: number; // Milliseconds since epoch, for client-side sorting if needed
  timeTakenMs?: number; // Time taken to complete the game in milliseconds
}

export const AudiencePollResultsSchema = z.record(z.number());
export type AudiencePollResults = z.infer<typeof AudiencePollResultsSchema>;
