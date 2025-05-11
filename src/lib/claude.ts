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

export async function generateClaudeEventDescription(title: string, keywords: string, userId = 'default-user') {
  try {
    // Check rate limit
    if (!checkRateLimit(userId)) {
      throw new Error('Rate limit exceeded. Please try again in a minute.');
    }

    const prompt = `You are an event description writer. Write a compelling and engaging event description based on the following information.\n\nTitle: ${title}\nKeywords: ${keywords}\n\nWrite a short and engaging event description:`;

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    const response = message.content[0];
    if (response.type !== 'text') {
      throw new Error('Unexpected response type from Claude API');
    }

    return response.text.trim();
  } catch (error: any) {
    console.error('Error generating event description:', error);
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