import supabase from '../config/supabase.js';

export async function createInterview(userId, jobRole, difficulty, numQuestions) {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .insert([
        {
          user_id: userId,
          job_role: jobRole,
          difficulty: difficulty,
          num_questions: numQuestions,
          status: 'in_progress',
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[Interview Service] Error creating interview:', error.message);
    throw new Error('Failed to create interview');
  }
}

export async function saveQuestion(interviewId, questionNumber, question) {
  try {
    const { data, error } = await supabase
      .from('interview_questions')
      .insert([
        {
          interview_id: interviewId,
          question_number: questionNumber,
          question: question,
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[Interview Service] Error saving question:', error.message);
    throw new Error('Failed to save question');
  }
}

export async function saveResponse(interviewId, questionId, response, evaluation) {
  try {
    const { data, error } = await supabase
      .from('interview_responses')
      .insert([
        {
          interview_id: interviewId,
          question_id: questionId,
          response: response,
          score: evaluation.score || 0,
          strengths: evaluation.strengths || [],
          improvements: evaluation.improvements || [],
          feedback: evaluation.feedback || '',
          follow_up: evaluation.followUp || '',
          created_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[Interview Service] Error saving response:', error.message);
    throw new Error('Failed to save response');
  }
}

export async function completeInterview(interviewId, report) {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .update({
        status: 'completed',
        overall_score: report.overallScore || 0,
        performance_summary: report.performanceSummary || '',
        top_strengths: report.topStrengths || [],
        areas_for_improvement: report.areasForImprovement || [],
        recommendations: report.recommendations || [],
        completed_at: new Date().toISOString(),
      })
      .eq('id', interviewId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('[Interview Service] Error completing interview:', error.message);
    throw new Error('Failed to complete interview');
  }
}

export async function getInterviewHistory(userId, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('interviews')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('[Interview Service] Error fetching history:', error.message);
    throw new Error('Failed to fetch interview history');
  }
}

export async function getInterviewDetail(interviewId) {
  try {
    const { data: interview, error: intError } = await supabase
      .from('interviews')
      .select('*')
      .eq('id', interviewId)
      .single();

    if (intError) throw intError;

    const { data: questions, error: qError } = await supabase
      .from('interview_questions')
      .select('*')
      .eq('interview_id', interviewId);

    if (qError) throw qError;

    const { data: responses, error: rError } = await supabase
      .from('interview_responses')
      .select('*')
      .eq('interview_id', interviewId);

    if (rError) throw rError;

    return { interview, questions, responses };
  } catch (error) {
    console.error('[Interview Service] Error fetching detail:', error.message);
    throw new Error('Failed to fetch interview details');
  }
}

export default {
  createInterview,
  saveQuestion,
  saveResponse,
  completeInterview,
  getInterviewHistory,
  getInterviewDetail,
};
