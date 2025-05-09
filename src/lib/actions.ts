
'use server';

import { generateEventDescription, type GenerateEventDescriptionInput } from '@/ai/flows/generate-event-description';
import { generatePromotionalContent, type GeneratePromotionalContentInput } from '@/ai/flows/generate-promotional-content';
import type { CampusEvent } from './types'; // Assuming CampusEvent might be needed or for context

export async function handleGenerateDescription(title: string, keywords: string) {
  try {
    const input: GenerateEventDescriptionInput = { title, keywords };
    const result = await generateEventDescription(input);
    return { success: true, description: result.description };
  } catch (error) {
    console.error("Error generating event description:", error);
    return { success: false, error: "Failed to generate description." };
  }
}

export async function handleGeneratePromotionalContent(
  eventDescription: string,
  contentType: 'socialMediaPost' | 'emailSnippet'
) {
  try {
    const input: GeneratePromotionalContentInput = { eventDescription, contentType };
    const result = await generatePromotionalContent(input);
    return { success: true, content: result.promotionalContent };
  } catch (error) {
    console.error(`Error generating ${contentType}:`, error);
    return { success: false, error: `Failed to generate ${contentType}.` };
  }
}
