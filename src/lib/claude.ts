import { Anthropic } from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateEventDescription(eventDetails: {
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  keywords?: string;
}) {
  try {
    const prompt = `Generate a compelling event description for the following event:
    Name: ${eventDetails.name}
    Date: ${eventDetails.date}
    Time: ${eventDetails.time}
    Location: ${eventDetails.location}
    Description: ${eventDetails.description}
    Keywords: ${eventDetails.keywords || 'N/A'}

    Please provide:
    1. A detailed event description (2-3 paragraphs)
    2. A short social media post (1-2 sentences)
    3. An email snippet for promotion (2-3 sentences)

    Format the response as JSON with the following structure:
    {
      "description": "detailed description here",
      "socialMediaPost": "social media post here",
      "emailSnippet": "email snippet here"
    }`;

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0].text;
    return JSON.parse(response);
  } catch (error) {
    console.error('Error generating event description:', error);
    throw error;
  }
} 