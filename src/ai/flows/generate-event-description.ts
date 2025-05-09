'use server';

/**
 * @fileOverview Generates event descriptions from a title and keywords.
 *
 * - generateEventDescription - A function that generates an event description.
 * - GenerateEventDescriptionInput - The input type for the generateEventDescription function.
 * - GenerateEventDescriptionOutput - The return type for the generateEventDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEventDescriptionInputSchema = z.object({
  title: z.string().describe('The title of the event.'),
  keywords: z.string().describe('Comma separated keywords related to the event.'),
});
export type GenerateEventDescriptionInput = z.infer<typeof GenerateEventDescriptionInputSchema>;

const GenerateEventDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling description of the event.'),
});
export type GenerateEventDescriptionOutput = z.infer<typeof GenerateEventDescriptionOutputSchema>;

export async function generateEventDescription(
  input: GenerateEventDescriptionInput
): Promise<GenerateEventDescriptionOutput> {
  return generateEventDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEventDescriptionPrompt',
  input: {schema: GenerateEventDescriptionInputSchema},
  output: {schema: GenerateEventDescriptionOutputSchema},
  prompt: `You are an event description writer. You will generate a compelling and engaging event description based on the event title and keywords.

Title: {{{title}}}
Keywords: {{{keywords}}}

Write a short and engaging event description:
`,
});

const generateEventDescriptionFlow = ai.defineFlow(
  {
    name: 'generateEventDescriptionFlow',
    inputSchema: GenerateEventDescriptionInputSchema,
    outputSchema: GenerateEventDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
