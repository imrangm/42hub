'use server';

/**
 * @fileOverview Generates promotional content for an event based on its description.
 *
 * - generatePromotionalContent - A function that generates promotional content.
 * - GeneratePromotionalContentInput - The input type for the generatePromotionalContent function.
 * - GeneratePromotionalContentOutput - The return type for the generatePromotionalContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePromotionalContentInputSchema = z.object({
  eventDescription: z.string().describe('The description of the event.'),
  contentType: z
    .enum(['socialMediaPost', 'emailSnippet'])
    .describe('The type of promotional content to generate.'),
});
export type GeneratePromotionalContentInput = z.infer<typeof GeneratePromotionalContentInputSchema>;

const GeneratePromotionalContentOutputSchema = z.object({
  promotionalContent: z.string().describe('The generated promotional content.'),
});
export type GeneratePromotionalContentOutput = z.infer<typeof GeneratePromotionalContentOutputSchema>;

export async function generatePromotionalContent(
  input: GeneratePromotionalContentInput
): Promise<GeneratePromotionalContentOutput> {
  return generatePromotionalContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePromotionalContentPrompt',
  input: {schema: GeneratePromotionalContentInputSchema},
  output: {schema: GeneratePromotionalContentOutputSchema},
  prompt: `You are an expert marketing assistant specializing in generating promotional content for events.

  Based on the event description provided, generate promotional content of the specified type.

  Event Description: {{{eventDescription}}}
  Content Type: {{{contentType}}}

  If the content type is socialMediaPost, generate a short, engaging post suitable for platforms like Twitter or Facebook.
  If the content type is emailSnippet, generate a brief email snippet to entice people to register for the event.
  `,
});

const generatePromotionalContentFlow = ai.defineFlow(
  {
    name: 'generatePromotionalContentFlow',
    inputSchema: GeneratePromotionalContentInputSchema,
    outputSchema: GeneratePromotionalContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
