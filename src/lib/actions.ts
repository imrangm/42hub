"use server";

import { generateEventDescription, type GenerateEventDescriptionInput } from '@/ai/flows/generate-event-description';

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
