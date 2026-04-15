import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { upload } from "../middlewares/multer.js"
import {
  analyzeResume,
  createTavusConversation,
  endTavusConversation,
  finishInterview,
  generateQuestion,
  getInterviewReport,
  getMyInterviews,
  submitAnswer
} from "../controllers/interview.controller.js"




const interviewRouter = express.Router()

interviewRouter.post("/resume",isAuth,upload.single("resume"),analyzeResume)
interviewRouter.post("/generate-questions",isAuth,generateQuestion)
interviewRouter.post("/tavus/session",isAuth,createTavusConversation)
interviewRouter.post("/tavus/end",isAuth,endTavusConversation)
interviewRouter.post("/submit-answer",isAuth,submitAnswer)
interviewRouter.post("/finish",isAuth,finishInterview)

interviewRouter.get("/get-interview",isAuth,getMyInterviews)
interviewRouter.get("/report/:id",isAuth,getInterviewReport)



export default interviewRouter
