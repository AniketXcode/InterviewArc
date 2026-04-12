import fs from "fs"
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf.mjs";
import { askAi } from "../services/openRouter.service.js";
import User from "../models/user.model.js";
import Interview from "../models/interview.model.js";
import { sendInterviewReportEmail } from "../utils/sendEmail.js";
import { calculateInterviewRewards, getLevelFromXp, normalizeRewardInventory } from "../utils/rewards.js";

const getDynamicDifficulty = (index, totalQuestions) => {
  if (totalQuestions <= 1) return "easy";

  const progress = index / (totalQuestions - 1);

  if (progress < 0.34) return "easy";
  if (progress < 0.74) return "medium";
  return "hard";
};

const getTavusConfig = () => ({
  apiKey: process.env.TAVUS_API_KEY,
  personaId: process.env.TAVUS_PERSONA_ID,
  replicaId: process.env.TAVUS_REPLICA_ID,
  enabled: process.env.TAVUS_ENABLED === "true",
});

export const analyzeResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume required" });
    }
    const filepath = req.file.path
    const jobDescription = req.body.jobDescription || "";

    const fileBuffer = await fs.promises.readFile(filepath)
    const uint8Array = new Uint8Array(fileBuffer)

    const pdf = await pdfjsLib.getDocument({ data: uint8Array }).promise;

    let resumeText = "";

    // Extract text from all pages
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const content = await page.getTextContent();

      const pageText = content.items.map(item => item.str).join(" ");
      resumeText += pageText + "\n";
    }


    resumeText = resumeText
      .replace(/\s+/g, " ")
      .trim();

    const messages = [
      {
        role: "system",
        content: `
Extract structured data from resume.
${jobDescription ? "Also act as an ATS System and compare the candidate's resume against the provided Job Description. Provide an ATS score (0-100) based on skill match, and a brief 1-2 sentence actionable feedback." : ""}

Return strictly JSON:

{
  "role": "string",
  "experience": "string",
  "projects": ["project1", "project2"],
  "skills": ["skill1", "skill2"]${jobDescription ? `,\n  "atsScore": 85,\n  "atsFeedback": "string"` : ""}
}
`
      },
      {
        role: "user",
        content: `Resume:\n${resumeText}\n\n${jobDescription ? `Job Description:\n${jobDescription}` : ""}`
      }
    ];


    const aiResponse = await askAi(messages)

    const parsed = JSON.parse(aiResponse);

    fs.unlinkSync(filepath)


    res.json({
      role: parsed.role,
      experience: parsed.experience,
      projects: parsed.projects,
      skills: parsed.skills,
      atsScore: parsed.atsScore || null,
      atsFeedback: parsed.atsFeedback || null,
      resumeText
    });

  } catch (error) {
    console.error(error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({ message: error.message });
  }
};


export const generateQuestion = async (req, res) => {
  try {
    let {
      role,
      experience,
      mode,
      resumeText,
      projects,
      skills,
      selectedRolePack,
      selectedCompanyPack,
      questionCount,
      interviewDuration,
    } = req.body

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();
    const normalizedQuestionCount = Number(questionCount) || 5;
    const normalizedDuration = Number(interviewDuration) || 10;

    if (!role || !experience || !mode) {
      return res.status(400).json({ message: "Role, Experience and Mode are required." })
    }

    if (![3, 5, 7, 10].includes(normalizedQuestionCount)) {
      return res.status(400).json({ message: "Please choose a valid question count." })
    }

    if (![5, 10, 15, 20].includes(normalizedDuration)) {
      return res.status(400).json({ message: "Please choose a valid interview duration." })
    }

    const user = await User.findById(req.userId)

    if (!user) {
      return res.status(404).json({
        message: "User not found."
      });
    }

    const rewardInventory = normalizeRewardInventory(user.rewardInventory);
    let usedMockInterviewTicket = false;

    if (selectedRolePack && !rewardInventory.rolePacks.includes(selectedRolePack)) {
      return res.status(403).json({
        message: "Unlock this role pack from the rewards store first."
      });
    }

    if (selectedCompanyPack && !rewardInventory.companyPacks.includes(selectedCompanyPack)) {
      return res.status(403).json({
        message: "Unlock this company pack from the rewards store first."
      });
    }

    if (user.credits < 50) {
      if ((rewardInventory.consumables?.mockInterviewTickets || 0) > 0) {
        rewardInventory.consumables.mockInterviewTickets -= 1;
        user.rewardInventory = rewardInventory;
        usedMockInterviewTicket = true;
      } else {
        return res.status(400).json({
          message: "Not enough credits. Minimum 50 required, or redeem a mock interview ticket from the rewards store."
        });
      }
    }

    const projectText = Array.isArray(projects) && projects.length
      ? projects.join(", ")
      : "None";

    const skillsText = Array.isArray(skills) && skills.length
      ? skills.join(", ")
      : "None";

    const safeResume = resumeText?.trim() || "None";
    const totalSeconds = normalizedDuration * 60;
    const baseSeconds = Math.max(45, Math.floor(totalSeconds / normalizedQuestionCount));
    const recentInterviews = await Interview.find({
      userId: user._id,
      role,
      mode,
    })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("questions")
      .lean();

    const recentQuestions = recentInterviews
      .flatMap((interview) => interview.questions || [])
      .map((question) => question.question)
      .filter(Boolean)
      .slice(0, 12);

    const variationThemes = [
      "practical execution and project ownership",
      "debugging, tradeoffs, and decision making",
      "real examples, teamwork, and delivery under pressure",
      "fundamentals, problem solving, and role-specific depth",
    ];

    const variationHint =
      variationThemes[(recentInterviews.length + normalizedQuestionCount + normalizedDuration) % variationThemes.length];

    const userPrompt = `
    Role:${role}
    Experience:${experience}
    InterviewMode:${mode}
    Projects:${projectText}
    Skills:${skillsText}
    Resume:${safeResume}
    RolePack:${selectedRolePack || "None"}
    CompanyPack:${selectedCompanyPack || "None"}
    QuestionCount:${normalizedQuestionCount}
    TotalInterviewDurationMinutes:${normalizedDuration}
    VariationFocus:${variationHint}
    PreviousQuestionsToAvoid:${recentQuestions.length ? recentQuestions.join(" || ") : "None"}
    `;

    if (!userPrompt.trim()) {
      return res.status(400).json({
        message: "Prompt content is empty."
      });
    }

    const messages = [

      {
        role: "system",
        content: `
You are a real human interviewer conducting a professional interview.

Speak in simple, natural English as if you are directly talking to the candidate.

Generate exactly ${normalizedQuestionCount} interview questions.

Strict Rules:
- Each question must contain between 15 and 25 words.
- Each question must be a single complete sentence.
- Do NOT number them.
- Do NOT add explanations.
- Do NOT add extra text before or after.
- One question per line only.
- Keep language simple and conversational.
- Questions must feel practical and realistic.
- Make this set feel fresh and different from earlier rounds.
- Do not repeat or closely paraphrase any question listed in PreviousQuestionsToAvoid.
- Mix resume-based questions with fundamentals, scenario-based prompts, and decision-making prompts.
- Avoid always starting with the same resume-summary question.

Difficulty progression:
Question 1 → easy  
Question 2 → easy  
Question 3 → medium  
Question 4 → medium  
Question 5 → hard  

Make questions based on the candidate’s role, experience,interviewMode, projects, skills, and resume details.
`
      }
      ,
      {
        role: "user",
        content: userPrompt
      }
    ];


    const aiResponse = await askAi(messages)

    if (!aiResponse || !aiResponse.trim()) {
           
      return res.status(500).json({
        message: "AI returned empty response."
      });

    }

    const questionsArray = aiResponse
      .split("\n")
      .map(q => q.trim())
      .filter(q => q.length > 0)
      .slice(0, normalizedQuestionCount);

    if (questionsArray.length !== normalizedQuestionCount) {
      
      return res.status(500).json({
        message: "AI failed to generate the requested interview questions."
      });
    }

    if (!usedMockInterviewTicket) {
      user.credits -= 50;
    }
    await user.save();

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      selectedRolePack: selectedRolePack || null,
      selectedCompanyPack: selectedCompanyPack || null,
      requestedQuestionCount: normalizedQuestionCount,
      requestedDurationMinutes: normalizedDuration,
      questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: getDynamicDifficulty(index, normalizedQuestionCount),
        timeLimit:
          getDynamicDifficulty(index, normalizedQuestionCount) === "hard"
            ? Math.min(baseSeconds + 15, 180)
            : getDynamicDifficulty(index, normalizedQuestionCount) === "medium"
              ? Math.min(baseSeconds + 5, 150)
              : Math.max(45, baseSeconds - 5),
      }))
    })

    res.json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      usedMockInterviewTicket,
      userName: user.name,
      questionCount: normalizedQuestionCount,
      interviewDuration: normalizedDuration,
      questions: interview.questions,
      updatedUser: {
        ...user.toObject(),
        rewardInventory: normalizeRewardInventory(user.rewardInventory),
        level: getLevelFromXp(user.xp || 0),
      }
    });
  } catch (error) {
    return res.status(500).json({message:`failed to create interview ${error}`})
  }
}


export const submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body

    const interview = await Interview.findById(interviewId)
    const question = interview.questions[questionIndex]

    // If no answer
    if (!answer) {
      question.score = 0;
      question.feedback = "You did not submit an answer.";
      question.answer = "";

      await interview.save();

      return res.json({
        feedback: question.feedback
      });
    }

    // If time exceeded
    if (timeTaken > question.timeLimit) {
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";
      question.answer = answer;

      await interview.save();

      return res.json({
        feedback: question.feedback
      });
    }


    const messages = [
      {
        role: "system",
        content: `
You are a professional human interviewer evaluating a candidate's answer in a real interview.

Evaluate naturally and fairly, like a real person would.

Score the answer in these areas (0 to 10):

1. Confidence – Does the answer sound clear, confident, and well-presented?
2. Communication – Is the language simple, clear, and easy to understand?
3. Correctness – Is the answer accurate, relevant, and complete?

Rules:
- Be realistic and unbiased.
- Do not give random high scores.
- If the answer is weak, score low.
- If the answer is strong and detailed, score high.
- Consider clarity, structure, and relevance.

Calculate:
finalScore = average of confidence, communication, and correctness (rounded to nearest whole number).

Feedback Rules:
- Write natural human feedback.
- 10 to 15 words only.
- Sound like real interview feedback.
- Can suggest improvement if needed.
- Do NOT repeat the question.
- Do NOT explain scoring.
- Keep tone professional and honest.

Return ONLY valid JSON in this format:

{
  "confidence": number,
  "communication": number,
  "correctness": number,
  "finalScore": number,
  "feedback": "short human feedback"
}
`
      }
      ,
      {
        role: "user",
        content: `
Question: ${question.question}
Answer: ${answer}
`
      }
    ];


    const aiResponse = await askAi(messages)


    const parsed = JSON.parse(aiResponse);

    question.answer = answer;
    question.confidence = parsed.confidence;
    question.communication = parsed.communication;
    question.correctness = parsed.correctness;
    question.score = parsed.finalScore;
    question.feedback = parsed.feedback;
    await interview.save();


    return res.status(200).json({feedback :parsed.feedback})
  } catch (error) {
    return res.status(500).json({message:`failed to submit answer ${error}`})

  }
}


export const finishInterview = async (req,res) => {
  try {
    const {interviewId} = req.body
    const interview = await Interview.findById(interviewId)
    if(!interview){
      return res.status(400).json({message:"failed to find Interview"})
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalScore += q.score || 0;
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const finalScore = totalQuestions
      ? totalScore / totalQuestions
      : 0;

    const avgConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

    interview.finalScore = finalScore;
    interview.finalConfidence = avgConfidence;
    interview.finalCommunication = avgCommunication;
    interview.finalCorrectness = avgCorrectness;
    interview.status = "completed";

    await interview.save();

    // -- Streak Tracking Logic --
    const user = await User.findById(req.userId);
    let rewardSummary = null;
    let updatedUserSnapshot = null;

    if (user) {
      const now = new Date();
      if (!user.streak) {
        user.streak = { current: 1, lastInterviewDate: now };
      } else if (!user.streak.lastInterviewDate) {
        user.streak.current = 1;
        user.streak.lastInterviewDate = now;
      } else {
        const lastDate = new Date(user.streak.lastInterviewDate);
        // Normalize to midnight to check calendar days
        const lastDateMidnight = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
        const nowMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        const diffTime = Math.abs(nowMidnight - lastDateMidnight);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

        if (diffDays === 1) {
          // Came back the exact next day, increment streak!
          user.streak.current += 1;
          user.streak.lastInterviewDate = now;
        } else if (diffDays > 1) {
          // Missed a day, reset streak
          user.streak.current = 1;
          user.streak.lastInterviewDate = now;
        } else {
          // Same day, just update the last active time
          user.streak.lastInterviewDate = now;
        }
      }

      user.rewardInventory = normalizeRewardInventory(user.rewardInventory);

      const completedInterviews = user.rewardStats?.interviewsCompleted || 0;
      const highestScore = user.rewardStats?.highestScore || 0;
      const rewards = calculateInterviewRewards({
        finalScore: Number(finalScore.toFixed(1)),
        currentStreak: user.streak.current || 0,
        completedInterviews,
        mode: interview.mode,
        currentXp: user.xp || 0,
      });

      user.coins = (user.coins || 0) + rewards.coinsEarned;
      user.xp = (user.xp || 0) + rewards.xpEarned;
      user.level = rewards.newLevel;
      user.rewardStats.interviewsCompleted = completedInterviews + 1;
      user.rewardStats.totalCoinsEarned =
        (user.rewardStats.totalCoinsEarned || 0) + rewards.coinsEarned;
      user.rewardStats.highestScore = Math.max(highestScore, Number(finalScore.toFixed(1)));

      const existingBadges = new Set((user.badges || []).map((badge) => badge.key));
      const newlyEarnedBadges = rewards.badges.filter((badge) => !existingBadges.has(badge.key));
      user.badges = [...(user.badges || []), ...newlyEarnedBadges];

      await user.save();

      rewardSummary = {
        coinsEarned: rewards.coinsEarned,
        xpEarned: rewards.xpEarned,
        streakBonus: rewards.streakBonus,
        performanceBonus: rewards.performanceBonus,
        leveledUp: rewards.leveledUp,
        level: rewards.newLevel,
        badges: newlyEarnedBadges,
      };

      updatedUserSnapshot = {
        ...user.toObject(),
        level: getLevelFromXp(user.xp || 0),
      };
    }

    // -- Send Email Notification (Async, non-blocking) --
    if (user && user.email) {
      sendInterviewReportEmail(
        user.email,
        user.name,
        Number(finalScore.toFixed(1)),
        interview.role
      );
    }

    return res.status(200).json({
       finalScore: Number(finalScore.toFixed(1)),
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions.map((q) => ({
        question: q.question,
        score: q.score || 0,
        feedback: q.feedback || "",
        confidence: q.confidence || 0,
        communication: q.communication || 0,
        correctness: q.correctness || 0,
      })),
      rewardSummary,
      updatedUser: updatedUserSnapshot,
    })
  } catch (error) {
    return res.status(500).json({message:`failed to finish Interview ${error}`})
  }
}


export const getMyInterviews = async (req,res) => {
  try {
    const interviews = await Interview.find({userId:req.userId})
    .sort({ createdAt: -1 })
    .select("role experience mode finalScore finalConfidence finalCommunication finalCorrectness status createdAt");

    return res.status(200).json(interviews)

  } catch (error) {
     return res.status(500).json({message:`failed to find currentUser Interview ${error}`})
  }
}

export const getInterviewReport = async (req,res) => {
  try {
    const interview = await Interview.findById(req.params.id)

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }


    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });
    const avgConfidence = totalQuestions
      ? totalConfidence / totalQuestions
      : 0;

    const avgCommunication = totalQuestions
      ? totalCommunication / totalQuestions
      : 0;

    const avgCorrectness = totalQuestions
      ? totalCorrectness / totalQuestions
      : 0;

       return res.json({
      finalScore: interview.finalScore,
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions
    });

  } catch (error) {
    return res.status(500).json({message:`failed to find currentUser Interview report ${error}`})
  }
}

export const createTavusConversation = async (req, res) => {
  try {
    const { enabled, apiKey, personaId, replicaId } = getTavusConfig();

    if (!enabled) {
      return res.status(400).json({ message: "Tavus mode is disabled on the server." });
    }

    if (!apiKey || !personaId || !replicaId) {
      return res.status(400).json({
        message: "Tavus is not configured yet. Add TAVUS_API_KEY, TAVUS_PERSONA_ID, and TAVUS_REPLICA_ID on the server.",
      });
    }

    const {
      role,
      experience,
      mode,
      questionCount = 5,
      interviewDuration = 10,
      projects = [],
      skills = [],
      resumeText = "",
      selectedRolePack = "",
      selectedCompanyPack = "",
      userName = "candidate",
    } = req.body;

    const conversationalContext = [
      `You are a premium AI interviewer for InterviewArc.`,
      `The candidate name is ${userName}.`,
      `Target role: ${role || "Not specified"}.`,
      `Experience level: ${experience || "Not specified"}.`,
      `Interview mode: ${mode || "General"}.`,
      `Question count for this round: ${questionCount}.`,
      `Planned interview duration in minutes: ${interviewDuration}.`,
      `Role pack: ${selectedRolePack || "None"}.`,
      `Company pack: ${selectedCompanyPack || "None"}.`,
      `Projects: ${Array.isArray(projects) && projects.length ? projects.join(", ") : "None"}.`,
      `Skills: ${Array.isArray(skills) && skills.length ? skills.join(", ") : "None"}.`,
      `Resume context: ${resumeText?.trim() || "None"}.`,
      `Important: this Tavus session is being used as the live visual interviewer presence. The app controls the question flow and may send text via echo interactions for the replica to speak.`,
    ].join(" ");

    const tavusResponse = await fetch("https://tavusapi.com/v2/conversations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify({
        persona_id: personaId,
        replica_id: replicaId,
        conversation_name: `InterviewArc ${role || "Interview"} Session`,
        conversational_context: conversationalContext,
        require_auth: true,
        max_participants: 2,
      }),
    });

    const tavusData = await tavusResponse.json();

    if (!tavusResponse.ok) {
      return res.status(400).json({
        message: tavusData?.message || "Tavus conversation could not be created.",
        details: tavusData,
      });
    }

    return res.status(200).json({
      conversationId: tavusData.conversation_id,
      conversationUrl: tavusData.conversation_url,
      meetingToken: tavusData.meeting_token || null,
      status: tavusData.status,
    });
  } catch (error) {
    return res.status(500).json({ message: `failed to create Tavus conversation ${error}` });
  }
};

export const endTavusConversation = async (req, res) => {
  try {
    const { enabled, apiKey } = getTavusConfig();

    if (!enabled || !apiKey) {
      return res.status(200).json({ message: "Tavus not configured. Nothing to end." });
    }

    const { conversationId } = req.body;

    if (!conversationId) {
      return res.status(400).json({ message: "conversationId is required." });
    }

    const tavusResponse = await fetch(`https://tavusapi.com/v2/conversations/${conversationId}/end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });

    if (!tavusResponse.ok) {
      const tavusData = await tavusResponse.json().catch(() => ({}));
      return res.status(400).json({
        message: tavusData?.message || "Tavus conversation could not be ended cleanly.",
      });
    }

    return res.status(200).json({ message: "Tavus conversation ended." });
  } catch (error) {
    return res.status(500).json({ message: `failed to end Tavus conversation ${error}` });
  }
};
