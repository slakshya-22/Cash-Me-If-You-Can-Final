
'use server';
/**
 * @fileOverview A Genkit flow to generate a set of trivia questions for the game.
 *
 * Exports:
 * - generateTriviaQuestions: Function to generate trivia questions based on input criteria.
 * - GenerateTriviaQuestionsInput: Type for the input to generateTriviaQuestions.
 * - GenerateTriviaQuestionsOutput: Type for the output from generateTriviaQuestions.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit'; 
import type { Question } from '@/lib/types'; // For the final Question type including points
import { AnswerSchema, DifficultyEnum } from '@/lib/types';

// Schema for input to the AI question generation flow
const GenerateTriviaQuestionsInputSchema = z.object({
  numberOfQuestions: z.number().int().positive().describe('The number of trivia questions to generate.'),
  difficulty: z.string().optional().describe('Optional: The desired difficulty for all questions (e.g., "Easy", "Medium", "Hard"). If "Mixed" or not provided, a range of difficulties will be generated.'),
  category: z.string().optional().describe('Optional: The desired category for all questions (e.g., "Sports", "History"). If "General Knowledge" or not provided, questions will cover various topics.'),
  requestIdentifier: z.string().optional().describe('An optional unique identifier for the game session to help ensure question variety across multiple plays.'),
  variationHint: z.string().optional().describe('An optional random string to further encourage unique question sets for each request.'),
});
export type GenerateTriviaQuestionsInput = z.infer<typeof GenerateTriviaQuestionsInputSchema>;

// Schema for the structure of each question as expected from the AI (before points are added)
const GeneratedQuestionSchema = z.object({
  id: z.string().describe("A unique identifier for the question (e.g., generated UUID or sequential, must be unique within THIS set of questions)."),
  text: z.string().min(1).describe("The text of the trivia question."),
  answers: z.array(AnswerSchema).length(4).describe("An array of exactly four answer options."),
  difficulty: DifficultyEnum.describe("The difficulty level of the question."),
});

// Schema for the overall output structure expected from the AI
const AIGeneratedTriviaOutputSchema = z.object({
  questions: z.array(GeneratedQuestionSchema).describe('An array of generated trivia questions, matching the GeneratedQuestionSchema structure.'),
});
// Type for the direct output from the AI based on the prompt's output schema
export type AIGeneratedTriviaData = z.infer<typeof AIGeneratedTriviaOutputSchema>;

// Public function that calls the Genkit flow and returns questions ready for game use
// Note: The flow itself returns questions without points; points are added client-side.
export async function generateTriviaQuestions(input: GenerateTriviaQuestionsInput): Promise<{ questions: Omit<Question, 'points' | 'imageUrl'>[] }> {
  const flowResult = await generateTriviaQuestionsFlow(input);
  return { questions: flowResult.questions };
}

// Prompt definition for Genkit
const triviaQuestionsPrompt = ai.definePrompt({
  name: 'generateTriviaQuestionsPrompt',
  input: {schema: GenerateTriviaQuestionsInputSchema},
  output: {schema: AIGeneratedTriviaOutputSchema},
  config: {
    temperature: 0.95, // Higher temperature for more varied, creative responses
  },
  prompt: `You are a trivia question generator for a game show.
  Request Identifier (for your internal reference): {{{requestIdentifier}}}
  Variation Hint for this specific request (use this to ensure a truly unique set of questions, do not include this hint in the questions themselves): {{{variationHint}}}

  Generate {{{numberOfQuestions}}} unique trivia questions.

  It is CRITICAL that for each request (even with similar category or difficulty requests), you generate a FRESH and DISTINCT set of questions. Avoid repeating questions that might have been generated in previous requests. The game is played multiple times, so variety is key. DO NOT REPEAT QUESTIONS. EACH GAME SESSION MUST HAVE NEW QUESTIONS. Use the Request Identifier and Variation Hint to ensure this uniqueness.

  {{#if category}}
  All questions should ideally be from the '{{category}}' category.
  {{else}}
  Ensure the questions cover a variety of general knowledge topics (e.g. history, geography, science, arts, sports, current events, etc.).
  {{/if}}

  {{#if difficulty}}
  All questions should ideally be of '{{difficulty}}' difficulty.
  {{else}}
  Generate a diverse set of questions covering "Easy", "Medium", "Hard", and "Very Hard" difficulties.
  It is especially important that the "Easy" questions in this mixed set are varied and fresh for each request. Ensure these easy questions cover different aspects of the category (if provided) or different general knowledge areas.
  Try to make the overall set of questions progressively more difficult if possible.
  {{/if}}

  For each question, provide:
  1. A unique 'id' (e.g., "q1", "q2", ... or a random string that is unique within THIS SET of questions). Ensure this ID is genuinely different for each question in the list you generate.
  2. The 'text' of the question.
  3. An array 'answers' containing exactly four objects, each with:
     - 'text': The answer option.
     - 'isCorrect': A boolean (true for the correct answer, false otherwise). Only one answer should be correct.
  4. A 'difficulty' level chosen from: "Easy", "Medium", "Hard", "Very Hard". This should align with the overall difficulty hint if one was provided, or contribute to the mix if "Mixed" difficulty was intended.

  Ensure the questions are engaging and suitable for a general audience.
  Avoid questions that are too niche, ambiguous, or require external knowledge beyond common understanding.
  The 'points' for each question will be assigned by the game logic later, so you don't need to include them in the output.
  `,
});

// Genkit flow definition
const generateTriviaQuestionsFlow = ai.defineFlow(
  {
    name: 'generateTriviaQuestionsFlow',
    inputSchema: GenerateTriviaQuestionsInputSchema,
    outputSchema: z.object({ questions: z.array(GeneratedQuestionSchema) }), // Flow directly outputs questions matching GeneratedQuestionSchema
  },
  async (input) => {
    let promptResult;
    let rawAiOutputFromPrompt: AIGeneratedTriviaData | null | undefined = null;

    try {
      promptResult = await triviaQuestionsPrompt(input);
      rawAiOutputFromPrompt = promptResult.output; 

      if (!rawAiOutputFromPrompt) {
        let errorDetails = "AI prompt returned no structured output. The AI response might be malformed, empty, or failed Zod parsing internally by Genkit.";
        if (promptResult && (promptResult as any).candidates && (promptResult as any).candidates[0]?.finishReason) {
            errorDetails += ` Finish Reason: ${(promptResult as any).candidates[0].finishReason}.`;
            if((promptResult as any).candidates[0].finishMessage) {
                errorDetails += ` Finish Message: ${(promptResult as any).candidates[0].finishMessage}.`;
            }
        }
        console.error('[generateTriviaQuestionsFlow] AI prompt returned no structured output (output is null or undefined). Input:', JSON.stringify(input, null, 2), 'Full Genkit Result (if available):', JSON.stringify(promptResult, null, 2));
        throw new Error(errorDetails);
      }

    } catch (e: any) {
      console.error('[generateTriviaQuestionsFlow] Critical error during AI prompt execution or initial parsing. Input:', JSON.stringify(input, null, 2), 'Error:', e);
      
      let errorMessage = 'AI prompt execution failed or returned malformed data.';
      if (e instanceof z.ZodError) { // Corrected ZodError check
        errorMessage = `AI output failed Zod validation: ${e.errors.map(err => `${err.path.join('.')} - ${err.message}`).join(', ')}`;
        console.error('[generateTriviaQuestionsFlow] Zod validation issues (details):', JSON.stringify(e.errors, null, 2));
      } else if (e instanceof Error) {
        errorMessage = e.message;
      }
      throw new Error(`AI Flow Error: ${errorMessage}`);
    }
    
    if (!rawAiOutputFromPrompt.questions || !Array.isArray(rawAiOutputFromPrompt.questions)) {
      console.error('[generateTriviaQuestionsFlow] AI output for "questions" is not an array, even after initial Genkit parsing. Input:', JSON.stringify(input, null, 2), 'Received Output:', JSON.stringify(rawAiOutputFromPrompt, null, 2));
      throw new Error('AI returned malformed data: "questions" field was not an array.');
    }

    if (rawAiOutputFromPrompt.questions.length === 0 && input.numberOfQuestions > 0) {
      console.warn('[generateTriviaQuestionsFlow] AI returned an empty list of questions when questions were requested. Input:', JSON.stringify(input, null, 2));
    }
    
    const validatedQuestions: (Omit<Question, 'points' | 'imageUrl'>)[] = [];
    const questionIdsInSet = new Set<string>();

    for (const [index, qSource] of rawAiOutputFromPrompt.questions.entries()) {
      let currentQuestionForLog = `Question at index ${index}`;
      try {
        let questionId = qSource.id;
        if (!questionId || typeof questionId !== 'string' || questionId.trim() === "") {
           console.warn(`[Validation] ${currentQuestionForLog} has missing/invalid ID "${qSource.id}". Assigning fallback.`);
           questionId = `gen_q_fallback_${index}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        } else if (questionIdsInSet.has(questionId)) {
           console.warn(`[Validation] ${currentQuestionForLog} has duplicate ID "${questionId}" within this set. Assigning fallback.`);
           questionId = `gen_q_dup_fallback_${index}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        }
        questionIdsInSet.add(questionId);
        currentQuestionForLog = `Question (ID: ${questionId})`;

        if (!qSource.text || typeof qSource.text !== 'string' || qSource.text.trim() === "") {
          throw new Error(`${currentQuestionForLog} has missing or empty text.`);
        }

        if (!qSource.answers || !Array.isArray(qSource.answers) || qSource.answers.length !== 4) {
          throw new Error(`${currentQuestionForLog} (Text: "${qSource.text.substring(0,30)}...") must have exactly four answers, found ${qSource.answers?.length || 0}.`);
        }

        const correctAnswers = qSource.answers.filter(a => a.isCorrect === true).length;
        if (correctAnswers !== 1) {
          throw new Error(`${currentQuestionForLog} (Text: "${qSource.text.substring(0,30)}...") must have exactly one correct answer, found ${correctAnswers}.`);
        }
        
        for (const [ansIdx, ans] of qSource.answers.entries()) {
            if (!ans.text || typeof ans.text !== 'string' || ans.text.trim() === '') {
                throw new Error(`Answer option ${ansIdx + 1} for ${currentQuestionForLog} (Text: "${qSource.text.substring(0,30)}...") is missing text.`);
            }
            if (typeof ans.isCorrect !== 'boolean') {
                throw new Error(`Answer option ${ansIdx + 1} for ${currentQuestionForLog} (Text: "${qSource.text.substring(0,30)}...") has an invalid 'isCorrect' field (must be boolean).`);
            }
        }

        let questionDifficulty = qSource.difficulty;
        if (!DifficultyEnum.safeParse(questionDifficulty).success) {
           console.warn(`[Validation] ${currentQuestionForLog} (Text: "${qSource.text.substring(0,30)}...") has invalid/missing difficulty "${qSource.difficulty}". Defaulting to "Medium".`);
           questionDifficulty = "Medium";
        }
        
        validatedQuestions.push({
          id: questionId,
          text: qSource.text,
          answers: qSource.answers.map(a => ({ text: a.text, isCorrect: a.isCorrect })),
          difficulty: questionDifficulty as Question['difficulty'], 
        });

      } catch (validationError: any) {
        // Log validation error with truncated sensitive data
        const safeQSource = JSON.stringify(qSource, (key, value) => 
            typeof value === 'string' && value.length > 100 ? value.substring(0,100) + '...' : value, 2);
        console.warn(`[generateTriviaQuestionsFlow] Skipping question at index ${index} due to validation error: ${validationError.message}. Original data (truncated):`, safeQSource);
      }
    }

    if (validatedQuestions.length === 0 && input.numberOfQuestions > 0) {
      console.error('[generateTriviaQuestionsFlow] No questions passed validation, or AI returned no usable questions initially. Input:', JSON.stringify(input, null, 2));
      throw new Error('AI-generated questions failed validation, or no questions were returned by the AI that could be used.');
    }
    
    if (validatedQuestions.length < input.numberOfQuestions) {
      console.warn(`[generateTriviaQuestionsFlow] Returning ${validatedQuestions.length} valid questions, but ${input.numberOfQuestions} were requested. Some AI-generated questions may have failed validation. Input:`, JSON.stringify(input, null, 2));
    }

    return { questions: validatedQuestions };
  }
);
