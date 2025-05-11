import { Anthropic } from '@anthropic-ai/sdk';

if (!process.env.ANTHROPIC_API_KEY) {
  throw new Error('Missing ANTHROPIC_API_KEY environment variable');
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Simple in-memory rate limiting
const rateLimiter = new Map<string, number>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userRequests = rateLimiter.get(userId) || 0;
  
  if (now - userRequests > RATE_LIMIT_WINDOW) {
    rateLimiter.set(userId, now);
    return true;
  }
  
  if (userRequests > MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  rateLimiter.set(userId, userRequests + 1);
  return true;
}

export async function generateEventDescription(eventDetails: {
  name: string;
  date: string;
  time: string;
  location: string;
  description: string;
  keywords?: string;
}, userId: string) {
  try {
    // Check rate limit
    if (!checkRateLimit(userId)) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    }

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

    // Handle the response properly
    const response = message.content[0];
    if (response.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    return JSON.parse(response.text);
  } catch (error: any) {
    console.error('Error generating event description:', error);
    
    // Handle specific error cases
    if (error.message.includes('rate limit')) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    }
    
    if (error.message.includes('invalid api key')) {
      throw new Error('Invalid API key. Please check your Anthropic API configuration.');
    }
    
    if (error.message.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw new Error('Failed to generate event description. Please try again later.');
  }
} 