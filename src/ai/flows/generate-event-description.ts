'use server';

/**
 * @fileOverview Generates event descriptions from a title and keywords using Claude API.
 */

import { generateClaudeEventDescription } from '@/lib/claude';

export type GenerateEventDescriptionInput = {
  title: string;
  keywords: string;
};

export type GenerateEventDescriptionOutput = {
  description: string;
};

export async function generateEventDescription(
  input: GenerateEventDescriptionInput
): Promise<GenerateEventDescriptionOutput> {
  const { title, keywords } = input;
  const description = await generateClaudeEventDescription(title, keywords);
  return { description };
}
