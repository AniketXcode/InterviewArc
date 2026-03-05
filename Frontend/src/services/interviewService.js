import { supabase } from './supabaseClient';

export const interviewService = {
  async createInterview(userId, jobRole, jobDomain, resumeText = null) {
    const { data, error } = await supabase
      .from('interviews')
      .insert({
        user_id: userId,
        job_role: jobRole,
        job_domain: jobDomain,
        resume_text: resumeText,
        status: 'in_progress',
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getInterview(interviewId) {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', interviewId)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async getUserInterviews(userId) {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async addQuestion(interviewId, questionNumber, questionText, questionType = 'behavioral') {
    const { data, error } = await supabase
      .from('interview_questions')
      .insert({
        interview_id: interviewId,
        question_number: questionNumber,
        question_text: questionText,
        question_type: questionType,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getInterviewQuestions(interviewId) {
    const { data, error } = await supabase
      .from('interview_questions')
      .select('*')
      .eq('interview_id', interviewId)
      .order('question_number', { ascending: true });

    if (error) throw error;
    return data;
  },

  async addResponse(interviewId, questionId, responseText, audioUrl = null) {
    const { data, error } = await supabase
      .from('interview_responses')
      .insert({
        interview_id: interviewId,
        question_id: questionId,
        response_text: responseText,
        response_audio_url: audioUrl,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getResponses(interviewId) {
    const { data, error } = await supabase
      .from('interview_responses')
      .select('*')
      .eq('interview_id', interviewId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async updateInterviewStatus(interviewId, status) {
    const { data, error } = await supabase
      .from('interviews')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', interviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateInterviewScore(interviewId, overallScore, completedQuestions) {
    const { data, error } = await supabase
      .from('interviews')
      .update({
        overall_score: overallScore,
        completed_questions: completedQuestions,
        updated_at: new Date().toISOString(),
      })
      .eq('id', interviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async addFeedback(interviewId, responseId, feedback) {
    const { data, error } = await supabase
      .from('feedback_records')
      .insert({
        interview_id: interviewId,
        response_id: responseId,
        ...feedback,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getFeedback(interviewId) {
    const { data, error } = await supabase
      .from('feedback_records')
      .select('*')
      .eq('interview_id', interviewId);

    if (error) throw error;
    return data;
  },
};
