import openai from '../config/openai.js';

export async function generateInterviewQuestion(jobRole, difficulty, category) {
  try {
    const prompt = `Generate a professional interview question for a ${jobRole} position at ${difficulty} difficulty level focused on ${category}. 
    Return ONLY the question text, nothing else.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 200,
    });

    const question = response.choices[0]?.message?.content || '';
    return question.trim();
  } catch (error) {
    console.error('[AI Service] Error generating question:', error.message);
    throw new Error('Failed to generate interview question');
  }
}

export async function evaluateResponse(question, userResponse, jobRole, difficulty) {
  try {
    const prompt = `You are an expert interview evaluator. Evaluate the following interview response:

Question: ${question}
Candidate Response: ${userResponse}
Position: ${jobRole}
Difficulty Level: ${difficulty}

Provide a JSON response with:
1. score (0-100)
2. strengths (array of 2-3 key strengths)
3. improvements (array of 2-3 areas to improve)
4. feedback (1-2 sentences of overall feedback)
5. followUp (a follow-up question if applicable)

Return ONLY valid JSON, no markdown or extra text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || '{}';
    const evaluation = JSON.parse(content);
    return evaluation;
  } catch (error) {
    console.error('[AI Service] Error evaluating response:', error.message);
    throw new Error('Failed to evaluate interview response');
  }
}

export async function generateFeedbackReport(interview) {
  try {
    const questionsData = interview.responses.map(r => 
      `Q: ${r.question}\nA: ${r.response}\nScore: ${r.score}`
    ).join('\n\n');

    const prompt = `Based on the following interview session data, generate a comprehensive feedback report:

${questionsData}

Position: ${interview.jobRole}
Duration: ${interview.duration} minutes
Total Questions: ${interview.responses.length}

Provide a JSON response with:
1. overallScore (0-100)
2. performanceSummary (2-3 sentences)
3. topStrengths (array of 3 key strengths)
4. areasForImprovement (array of 3 areas to improve)
5. recommendations (array of 3-4 specific action items for improvement)

Return ONLY valid JSON, no markdown or extra text.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      max_tokens: 800,
    });

    const content = response.choices[0]?.message?.content || '{}';
    const report = JSON.parse(content);
    return report;
  } catch (error) {
    console.error('[AI Service] Error generating report:', error.message);
    throw new Error('Failed to generate feedback report');
  }
}

export default {
  generateInterviewQuestion,
  evaluateResponse,
  generateFeedbackReport,
};
