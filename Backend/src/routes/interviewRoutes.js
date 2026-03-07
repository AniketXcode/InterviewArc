import express from 'express';
import * as interviewService from '../services/interviewService.js';

const router = express.Router();

// Create a new interview
router.post('/create', async (req, res) => {
  try {
    const { userId, jobRole, difficulty, numQuestions } = req.body;

    if (!userId || !jobRole || !difficulty || !numQuestions) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const interview = await interviewService.createInterview(
      userId,
      jobRole,
      difficulty,
      numQuestions
    );

    res.json({ success: true, data: interview });
  } catch (error) {
    console.error('[Interview Routes] Create error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Save a question for the interview
router.post('/:interviewId/question', async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { questionNumber, question } = req.body;

    if (!questionNumber || !question) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const savedQuestion = await interviewService.saveQuestion(
      interviewId,
      questionNumber,
      question
    );

    res.json({ success: true, data: savedQuestion });
  } catch (error) {
    console.error('[Interview Routes] Save question error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Save a response for a question
router.post('/:interviewId/response', async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { questionId, response, evaluation } = req.body;

    if (!questionId || !response || !evaluation) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const savedResponse = await interviewService.saveResponse(
      interviewId,
      questionId,
      response,
      evaluation
    );

    res.json({ success: true, data: savedResponse });
  } catch (error) {
    console.error('[Interview Routes] Save response error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Complete the interview with final report
router.post('/:interviewId/complete', async (req, res) => {
  try {
    const { interviewId } = req.params;
    const { report } = req.body;

    if (!report) {
      return res.status(400).json({ error: 'Missing report data' });
    }

    const completedInterview = await interviewService.completeInterview(
      interviewId,
      report
    );

    res.json({ success: true, data: completedInterview });
  } catch (error) {
    console.error('[Interview Routes] Complete error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get interview history for a user
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10 } = req.query;

    const history = await interviewService.getInterviewHistory(userId, parseInt(limit));

    res.json({ success: true, data: history });
  } catch (error) {
    console.error('[Interview Routes] History error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Get detailed interview information
router.get('/:interviewId', async (req, res) => {
  try {
    const { interviewId } = req.params;

    const detail = await interviewService.getInterviewDetail(interviewId);

    res.json({ success: true, data: detail });
  } catch (error) {
    console.error('[Interview Routes] Detail error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
