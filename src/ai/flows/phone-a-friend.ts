'use server';
/**
 * @fileOverview Implements the Phone-A-Friend lifeline using Genkit.
 *
 * - phoneAFriend - A function that provides a likely correct answer to a trivia question.
 * - PhoneAFriendInput - The input type for the phoneAFriend function.
 * - PhoneAFriendOutput - The return type for the phoneAFriend function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PhoneAFriendInputSchema = z.object({
  question: z.string().describe('The trivia question.'),
  options: z.array(z.string()).describe('The answer options for the trivia question.'),
});
export type PhoneAFriendInput = z.infer<typeof PhoneAFriendInputSchema>;

const PhoneAFriendOutputSchema = z.object({
  advice: z.string().describe('The AI-generated advice on which answer is likely correct.'),
  uncertainty: z
    .string()
    .optional()
    .describe('A degree of uncertainty to mimic human advice.'),
});
export type PhoneAFriendOutput = z.infer<typeof PhoneAFriendOutputSchema>;

export async function phoneAFriend(input: PhoneAFriendInput): Promise<PhoneAFriendOutput> {
  return phoneAFriendFlow(input);
}

const phoneAFriendPrompt = ai.definePrompt({
  name: 'phoneAFriendPrompt',
  input: {schema: PhoneAFriendInputSchema},
  output: {schema: PhoneAFriendOutputSchema},
  prompt: `You are providing assistance to a player in a trivia game as their "phone-a-friend" lifeline.
  Given the following question and possible answers, provide advice on which answer is most likely correct, but also include a degree of uncertainty to mimic human advice.

  Question: {{{question}}}
  Options:
  {{#each options}}
  - {{{this}}}
  {{/each}}
  `,
});

const phoneAFriendFlow = ai.defineFlow(
  {
    name: 'phoneAFriendFlow',
    inputSchema: PhoneAFriendInputSchema,
    outputSchema: PhoneAFriendOutputSchema,
  },
  async input => {
    const {output} = await phoneAFriendPrompt(input);
    return output!;
  }
);
