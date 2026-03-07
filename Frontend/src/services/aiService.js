import apiService from './apiService.js';

export const aiService = {
  async generateQuestion(jobRole, jobDomain, questionNumber, previousQuestions = []) {
    try {
      // Determine category based on question number
      const category = questionNumber === 1 ? 'behavioral' : questionNumber <= 3 ? 'technical' : 'situational';
      const difficulty = 'intermediate'; // Default difficulty

      // Call backend API to generate question with GPT-4
      const response = await apiService.generateQuestion(jobRole, difficulty, category);
      
      if (response.success && response.data) {
        return {
          question_text: response.data.question,
          question_type: category,
        };
      }
    } catch (error) {
      console.warn('[AI Service] Backend generation failed, using fallback:', error.message);
    }

    // Fallback to local generation if API fails
    return {
      question_text: `${questionNumber === 1 ? '[Behavioral]' : questionNumber <= 3 ? '[Technical]' : '[Situational]'} ${this.getDefaultQuestion(jobRole, questionNumber)}`,
      question_type: questionNumber === 1 ? 'behavioral' : questionNumber <= 3 ? 'technical' : 'situational',
    };
  },

  getDefaultQuestion(jobRole, questionNumber) {
    const questions = {
      1: "Tell me about a challenging project you've worked on and how you overcame obstacles.",
      2: "What are the key principles you follow when designing/implementing solutions?",
      3: "Describe a time when you had to learn something new quickly. How did you approach it?",
      4: "How do you handle disagreements with team members or stakeholders?",
      5: "What's your greatest strength and how have you used it to impact your team?",
    };

    return questions[questionNumber] || `Tell me about your experience as a ${jobRole} and what you've learned.`;
  },

  async evaluateResponse(question, response, jobRole) {
    try {
      // Call backend API for GPT-4 evaluation
      const apiResponse = await apiService.evaluateResponse(question, response, jobRole, 'intermediate');
      
      if (apiResponse.success && apiResponse.data) {
        return {
          score: apiResponse.data.score || 0,
          communication_score: apiResponse.data.score || 0,
          filler_words: 0,
          pace_score: 75,
          clarity_score: apiResponse.data.score || 0,
          strengths: (apiResponse.data.strengths || []).join(', '),
          weaknesses: (apiResponse.data.improvements || []).join(', '),
          improvement_tips: apiResponse.data.feedback || '',
        };
      }
    } catch (error) {
      console.warn('[AI Service] Backend evaluation failed, using fallback:', error.message);
    }

    // Fallback to local evaluation if API fails
    const wordCount = response.split(/\s+/).length;
    const hasMetrics = /\d+%|\$\d+|metric/i.test(response);
    const hasAction = /I\s+(?:created|built|developed|designed|implemented|led)/i.test(response);
    const hasResult = /result|outcome|impact|achieved|improved/i.test(response);
    const fillerWords = (response.match(/\b(?:like|um|uh|you know|basically|actually|literally|honestly)\b/gi) || []).length;

    let score = 60;
    score += Math.min(wordCount / 20, 20);
    score += hasMetrics ? 10 : 0;
    score += hasAction ? 5 : 0;
    score += hasResult ? 5 : 0;
    score -= fillerWords * 2;

    score = Math.max(0, Math.min(100, Math.round(score)));

    return {
      score,
      communication_score: Math.max(0, score - 10),
      filler_words: fillerWords,
      pace_score: Math.min(100, wordCount * 2),
      clarity_score: hasAction && hasResult ? 85 : 70,
      strengths: this.getStrengths(response, hasMetrics, hasAction, hasResult),
      weaknesses: this.getWeaknesses(response, fillerWords, wordCount),
      improvement_tips: this.getImprovementTips(response, hasMetrics, fillerWords),
    };
  },

  getStrengths(response, hasMetrics, hasAction, hasResult) {
    const strengths = [];
    if (hasAction) strengths.push('Clear action-oriented approach');
    if (hasResult) strengths.push('Focused on measurable outcomes');
    if (hasMetrics) strengths.push('Provided specific metrics and data');
    if (response.length > 500) strengths.push('Comprehensive explanation');
    return strengths.length > 0 ? strengths.join(', ') : 'Good communication overall';
  },

  getWeaknesses(response, fillerWords, wordCount) {
    const weaknesses = [];
    if (fillerWords > 3) weaknesses.push('Excessive use of filler words');
    if (wordCount < 50) weaknesses.push('Response too brief, lacks depth');
    if (!/I/i.test(response.substring(0, 100))) weaknesses.push('Passive language, use more "I" statements');
    return weaknesses.length > 0 ? weaknesses.join(', ') : 'Keep practicing to strengthen responses';
  },

  getImprovementTips(response, hasMetrics, fillerWords) {
    const tips = [];
    if (!hasMetrics) tips.push('Include specific numbers, percentages, or data to quantify impact');
    if (fillerWords > 0) tips.push('Reduce filler words like "um", "like", "you know"');
    if (response.length < 100) tips.push('Provide more context and detailed explanation of your approach');
    tips.push('Practice the STAR method (Situation, Task, Action, Result)');
    return tips.slice(0, 3).join('; ');
  },

  async synthesizeFeedback(allResponses, interview) {
    try {
      // Call backend API for comprehensive report generation
      const apiResponse = await apiService.generateReport(interview);
      
      if (apiResponse.success && apiResponse.data) {
        return {
          overall_score: apiResponse.data.overallScore || 0,
          total_questions: allResponses.length,
          recommendation: apiResponse.data.performanceSummary || 'Practice more to improve your interview skills.',
          top_strengths: apiResponse.data.topStrengths || [],
          areas_for_improvement: apiResponse.data.areasForImprovement || [],
          recommendations: apiResponse.data.recommendations || [],
        };
      }
    } catch (error) {
      console.warn('[AI Service] Backend report generation failed, using fallback:', error.message);
    }

    // Fallback to local synthesis if API fails
    const scores = allResponses.map(r => r.score || 0);
    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

    return {
      overall_score: overallScore,
      total_questions: allResponses.length,
      recommendation: overallScore >= 80
        ? 'Excellent performance! You are well-prepared for this role.'
        : overallScore >= 70
        ? 'Good preparation. Focus on specific metrics and reducing filler words.'
        : 'Continue practicing. Work on clarity and providing specific examples.',
    };
  },
};
