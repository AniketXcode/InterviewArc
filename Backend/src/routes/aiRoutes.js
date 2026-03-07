import express from 'express';
import * as aiService from '../services/aiService.js';

const router = express.Router();

// Generate an interview question
router.post('/generate-question', async (req, res) => {
  try {
    const { jobRole, difficulty, category } = req.body;

    if (!jobRole || !difficulty || !category) {
      return res.status(400).json({ error: 'Missing required fields: jobRole, difficulty, category' });
    }

    const question = await aiService.generateInterviewQuestion(jobRole, difficulty, category);

    res.json({ success: true, data: { question } });
  } catch (error) {
    console.error('[AI Routes] Generate question error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Evaluate a candidate response
router.post('/evaluate-response', async (req, res) => {
  try {
    const { question, userResponse, jobRole, difficulty } = req.body;

    if (!question || !userResponse || !jobRole || !difficulty) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const evaluation = await aiService.evaluateResponse(
      question,
      userResponse,
      jobRole,
      difficulty
    );

    res.json({ success: true, data: evaluation });
  } catch (error) {
    console.error('[AI Routes] Evaluate response error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// Generate a comprehensive feedback report
router.post('/generate-report', async (req, res) => {
  try {
    const { interview } = req.body;

    if (!interview) {
      return res.status(400).json({ error: 'Missing interview data' });
    }

    const report = await aiService.generateFeedbackReport(interview);

    res.json({ success: true, data: report });
  } catch (error) {
    console.error('[AI Routes] Generate report error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
