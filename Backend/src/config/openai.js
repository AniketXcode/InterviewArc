import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('[Warning] OPENAI_API_KEY not configured');
}

export const openai = new OpenAI({
  apiKey: apiKey || '',
});

export default openai;
