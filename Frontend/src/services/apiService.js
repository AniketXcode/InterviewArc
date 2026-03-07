const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiService = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('[API Service] Request error:', error.message);
      throw error;
    }
  },

  // AI Service endpoints
  async generateQuestion(jobRole, difficulty, category) {
    return this.request('/ai/generate-question', {
      method: 'POST',
      body: JSON.stringify({ jobRole, difficulty, category }),
    });
  },

  async evaluateResponse(question, userResponse, jobRole, difficulty) {
    return this.request('/ai/evaluate-response', {
      method: 'POST',
      body: JSON.stringify({ question, userResponse, jobRole, difficulty }),
    });
  },

  async generateReport(interview) {
    return this.request('/ai/generate-report', {
      method: 'POST',
      body: JSON.stringify({ interview }),
    });
  },

  // Interview Service endpoints
  async createInterview(userId, jobRole, difficulty, numQuestions) {
    return this.request('/interviews/create', {
      method: 'POST',
      body: JSON.stringify({ userId, jobRole, difficulty, numQuestions }),
    });
  },

  async saveQuestion(interviewId, questionNumber, question) {
    return this.request(`/interviews/${interviewId}/question`, {
      method: 'POST',
      body: JSON.stringify({ questionNumber, question }),
    });
  },

  async saveResponse(interviewId, questionId, response, evaluation) {
    return this.request(`/interviews/${interviewId}/response`, {
      method: 'POST',
      body: JSON.stringify({ questionId, response, evaluation }),
    });
  },

  async completeInterview(interviewId, report) {
    return this.request(`/interviews/${interviewId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ report }),
    });
  },

  async getInterviewHistory(userId, limit = 10) {
    return this.request(`/interviews/history/${userId}?limit=${limit}`, {
      method: 'GET',
    });
  },

  async getInterviewDetail(interviewId) {
    return this.request(`/interviews/${interviewId}`, {
      method: 'GET',
    });
  },

  // Auth Service endpoints
  async verifyToken(token) {
    return this.request('/auth/verify', {
      method: 'POST',
      body: JSON.stringify({ token }),
    });
  },
};

export default apiService;
