# InterviewArc API Documentation

Complete reference for the InterviewArc backend API endpoints.

## Base URL

- **Development**: `http://localhost:5000/api`
- **Production**: `https://your-backend-url.vercel.app/api`

## Authentication

Currently, API endpoints don't require authentication tokens, but they integrate with Supabase auth on the frontend.

## Response Format

All endpoints return JSON responses in the following format:

### Success Response
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "field": "value"
  }
}
```

### Error Response
```json
{
  "error": "Error message describing what went wrong"
}
```

## Endpoints

### Health & Status

#### Health Check
```
GET /api/health
```

**Description**: Check if the backend server is running.

**Response**:
```json
{
  "status": "Backend is running",
  "timestamp": "2024-03-07T10:30:00.000Z"
}
```

**Status Code**: 200

---

### AI Endpoints

#### Generate Interview Question
```
POST /api/ai/generate-question
```

**Description**: Generate a realistic interview question using GPT-4.

**Request Body**:
```json
{
  "jobRole": "Software Engineer",
  "difficulty": "intermediate",
  "category": "technical"
}
```

**Parameters**:
- `jobRole` (string, required): Job position (e.g., "Software Engineer", "Data Scientist")
- `difficulty` (string, required): "junior", "intermediate", or "senior"
- `category` (string, required): "behavioral", "technical", or "situational"

**Response**:
```json
{
  "success": true,
  "data": {
    "question": "Explain the difference between REST and GraphQL APIs and when you would use each."
  }
}
```

**Status Codes**:
- 200: Success
- 400: Missing required fields
- 500: Server error (likely OpenAI API issue)

**Example cURL**:
```bash
curl -X POST http://localhost:5000/api/ai/generate-question \
  -H "Content-Type: application/json" \
  -d '{
    "jobRole": "Frontend Developer",
    "difficulty": "intermediate",
    "category": "technical"
  }'
```

---

#### Evaluate Candidate Response
```
POST /api/ai/evaluate-response
```

**Description**: Evaluate a candidate's interview response using GPT-4.

**Request Body**:
```json
{
  "question": "What is a closure in JavaScript?",
  "userResponse": "A closure is a function that has access to variables...",
  "jobRole": "Frontend Developer",
  "difficulty": "intermediate"
}
```

**Parameters**:
- `question` (string, required): The interview question asked
- `userResponse` (string, required): The candidate's response
- `jobRole` (string, required): The job position being interviewed for
- `difficulty` (string, required): Difficulty level of the interview

**Response**:
```json
{
  "success": true,
  "data": {
    "score": 82,
    "strengths": [
      "Clear explanation of the concept",
      "Provided practical examples",
      "Mentioned use cases"
    ],
    "improvements": [
      "Could mention performance implications",
      "Could discuss garbage collection impact"
    ],
    "feedback": "Good understanding demonstrated. You clearly explained the concept with examples.",
    "followUp": "Can you explain how closures affect memory usage in your applications?"
  }
}
```

**Response Fields**:
- `score` (integer): Score from 0-100
- `strengths` (array): List of positive aspects
- `improvements` (array): Areas for improvement
- `feedback` (string): Overall feedback
- `followUp` (string): Suggested follow-up question

**Status Codes**:
- 200: Success
- 400: Missing required fields
- 500: Server error

**Example cURL**:
```bash
curl -X POST http://localhost:5000/api/ai/evaluate-response \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What is a closure in JavaScript?",
    "userResponse": "A closure is a function that has access to...",
    "jobRole": "Frontend Developer",
    "difficulty": "intermediate"
  }'
```

---

#### Generate Feedback Report
```
POST /api/ai/generate-report
```

**Description**: Generate a comprehensive feedback report for a completed interview.

**Request Body**:
```json
{
  "interview": {
    "jobRole": "Software Engineer",
    "duration": 45,
    "responses": [
      {
        "question": "Tell me about a challenging project...",
        "response": "I worked on a project where...",
        "score": 85
      },
      {
        "question": "How do you handle...",
        "response": "I typically approach this by...",
        "score": 78
      }
    ]
  }
}
```

**Parameters**:
- `interview` (object, required):
  - `jobRole` (string): The position being interviewed for
  - `duration` (number): Interview duration in minutes
  - `responses` (array): Array of question-response-score objects

**Response**:
```json
{
  "success": true,
  "data": {
    "overallScore": 81,
    "performanceSummary": "Strong overall performance with consistent responses and good communication skills.",
    "topStrengths": [
      "Clear communication and articulation",
      "Problem-solving approach",
      "Technical knowledge demonstration"
    ],
    "areasForImprovement": [
      "Provide more specific metrics in examples",
      "Elaborate on learning outcomes",
      "Discuss architectural considerations"
    ],
    "recommendations": [
      "Practice using the STAR method more consistently",
      "Prepare specific metrics and data points for projects",
      "Study system design principles for your role",
      "Record practice sessions to improve delivery"
    ]
  }
}
```

**Response Fields**:
- `overallScore` (integer): Overall performance score 0-100
- `performanceSummary` (string): Summary of performance
- `topStrengths` (array): Top 3 strengths demonstrated
- `areasForImprovement` (array): Top 3 areas needing improvement
- `recommendations` (array): 3-4 specific recommendations

**Status Codes**:
- 200: Success
- 400: Missing interview data
- 500: Server error

---

### Interview Endpoints

#### Create Interview
```
POST /api/interviews/create
```

**Description**: Create a new interview session.

**Request Body**:
```json
{
  "userId": "user-uuid",
  "jobRole": "Software Engineer",
  "difficulty": "intermediate",
  "numQuestions": 5
}
```

**Parameters**:
- `userId` (string, required): UUID of the user
- `jobRole` (string, required): Job position
- `difficulty` (string, required): "junior", "intermediate", or "senior"
- `numQuestions` (integer, required): Number of questions (typically 3-5)

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "interview-uuid",
    "user_id": "user-uuid",
    "job_role": "Software Engineer",
    "difficulty": "intermediate",
    "num_questions": 5,
    "status": "in_progress",
    "created_at": "2024-03-07T10:30:00Z"
  }
}
```

**Status Codes**:
- 200: Interview created
- 400: Missing required fields
- 500: Server error

---

#### Save Question
```
POST /api/interviews/:interviewId/question
```

**Description**: Save a generated question to an interview.

**Parameters**:
- `interviewId` (path, required): UUID of the interview

**Request Body**:
```json
{
  "questionNumber": 1,
  "question": "Tell me about a challenging project you've worked on..."
}
```

**Parameters**:
- `questionNumber` (integer, required): Question sequence number (1-based)
- `question` (string, required): The interview question text

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "question-uuid",
    "interview_id": "interview-uuid",
    "question_number": 1,
    "question": "Tell me about...",
    "created_at": "2024-03-07T10:30:00Z"
  }
}
```

**Status Codes**:
- 200: Question saved
- 400: Missing required fields
- 500: Server error

---

#### Save Response
```
POST /api/interviews/:interviewId/response
```

**Description**: Save a candidate response with evaluation.

**Parameters**:
- `interviewId` (path, required): UUID of the interview

**Request Body**:
```json
{
  "questionId": "question-uuid",
  "response": "I worked on a project where...",
  "evaluation": {
    "score": 85,
    "strengths": ["Clear examples", "Detailed explanation"],
    "improvements": ["More specific metrics"],
    "feedback": "Strong response with good detail.",
    "followUp": "What did you learn from this?"
  }
}
```

**Parameters**:
- `questionId` (string, required): UUID of the question
- `response` (string, required): The candidate's response
- `evaluation` (object, required): Evaluation object from evaluate-response endpoint

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "response-uuid",
    "interview_id": "interview-uuid",
    "question_id": "question-uuid",
    "response": "I worked on a project where...",
    "score": 85,
    "strengths": ["Clear examples", "Detailed explanation"],
    "improvements": ["More specific metrics"],
    "feedback": "Strong response with good detail.",
    "created_at": "2024-03-07T10:30:00Z"
  }
}
```

**Status Codes**:
- 200: Response saved
- 400: Missing required fields
- 500: Server error

---

#### Complete Interview
```
POST /api/interviews/:interviewId/complete
```

**Description**: Mark interview as complete and save final report.

**Parameters**:
- `interviewId` (path, required): UUID of the interview

**Request Body**:
```json
{
  "report": {
    "overallScore": 82,
    "performanceSummary": "Strong overall performance...",
    "topStrengths": ["Clear communication", "Problem solving"],
    "areasForImprovement": ["Specific metrics", "Technical depth"],
    "recommendations": ["Practice STAR method", "Prepare examples"]
  }
}
```

**Parameters**:
- `report` (object, required): Report object from generate-report endpoint

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "interview-uuid",
    "user_id": "user-uuid",
    "status": "completed",
    "overall_score": 82,
    "performance_summary": "Strong overall performance...",
    "top_strengths": ["Clear communication", "Problem solving"],
    "completed_at": "2024-03-07T10:35:00Z"
  }
}
```

**Status Codes**:
- 200: Interview completed
- 400: Missing report data
- 500: Server error

---

#### Get Interview History
```
GET /api/interviews/history/:userId?limit=10
```

**Description**: Get user's past interview sessions.

**Parameters**:
- `userId` (path, required): UUID of the user
- `limit` (query, optional): Number of interviews to return (default: 10, max: 100)

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "interview-uuid-1",
      "user_id": "user-uuid",
      "job_role": "Software Engineer",
      "difficulty": "intermediate",
      "overall_score": 82,
      "status": "completed",
      "created_at": "2024-03-07T10:00:00Z",
      "completed_at": "2024-03-07T10:35:00Z"
    },
    {
      "id": "interview-uuid-2",
      "job_role": "Frontend Developer",
      "difficulty": "senior",
      "overall_score": 78,
      "status": "completed",
      "created_at": "2024-03-06T14:00:00Z",
      "completed_at": "2024-03-06T14:40:00Z"
    }
  ]
}
```

**Status Codes**:
- 200: Success
- 500: Server error

**Example cURL**:
```bash
curl http://localhost:5000/api/interviews/history/user-uuid?limit=5
```

---

#### Get Interview Details
```
GET /api/interviews/:interviewId
```

**Description**: Get complete details of a specific interview including all questions and responses.

**Parameters**:
- `interviewId` (path, required): UUID of the interview

**Response**:
```json
{
  "success": true,
  "data": {
    "interview": {
      "id": "interview-uuid",
      "user_id": "user-uuid",
      "job_role": "Software Engineer",
      "overall_score": 82,
      "status": "completed",
      "created_at": "2024-03-07T10:00:00Z"
    },
    "questions": [
      {
        "id": "question-uuid-1",
        "question_number": 1,
        "question": "Tell me about a challenging project..."
      },
      {
        "id": "question-uuid-2",
        "question_number": 2,
        "question": "How do you handle disagreements..."
      }
    ],
    "responses": [
      {
        "id": "response-uuid-1",
        "question_id": "question-uuid-1",
        "response": "I worked on a project where...",
        "score": 85,
        "feedback": "Strong response"
      },
      {
        "id": "response-uuid-2",
        "question_id": "question-uuid-2",
        "response": "I try to understand different perspectives...",
        "score": 79,
        "feedback": "Good approach"
      }
    ]
  }
}
```

**Status Codes**:
- 200: Success
- 500: Server error

---

### Auth Endpoints

#### Verify Token
```
POST /api/auth/verify
```

**Description**: Verify an authentication token.

**Request Body**:
```json
{
  "token": "supabase_auth_token"
}
```

**Parameters**:
- `token` (string, required): Supabase authentication token

**Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "aud": "authenticated"
    }
  }
}
```

**Status Codes**:
- 200: Token is valid
- 401: Invalid token
- 400: Token not provided
- 500: Server error

---

## Error Handling

### Common Error Responses

**Missing Required Field**:
```json
{
  "error": "Missing required fields: jobRole, difficulty, category"
}
```

**Invalid API Key**:
```json
{
  "error": "Failed to generate interview question"
}
```

**Database Error**:
```json
{
  "error": "Failed to create interview"
}
```

## Rate Limiting

The API does not currently have built-in rate limiting, but OpenAI API may have rate limits based on your plan.

## CORS

CORS is enabled for the frontend URL specified in `FRONTEND_URL` environment variable.

## Usage Examples

### Complete Interview Flow

```bash
# 1. Create interview
INTERVIEW=$(curl -X POST http://localhost:5000/api/interviews/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "jobRole": "Software Engineer",
    "difficulty": "intermediate",
    "numQuestions": 2
  }')
INTERVIEW_ID=$(echo $INTERVIEW | jq -r '.data.id')

# 2. Generate first question
Q1=$(curl -X POST http://localhost:5000/api/ai/generate-question \
  -H "Content-Type: application/json" \
  -d '{
    "jobRole": "Software Engineer",
    "difficulty": "intermediate",
    "category": "behavioral"
  }')
QUESTION=$(echo $Q1 | jq -r '.data.question')

# 3. Save question
Q1_SAVED=$(curl -X POST http://localhost:5000/api/interviews/$INTERVIEW_ID/question \
  -H "Content-Type: application/json" \
  -d "{
    \"questionNumber\": 1,
    \"question\": \"$QUESTION\"
  }")
QUESTION_ID=$(echo $Q1_SAVED | jq -r '.data.id')

# 4. Evaluate response
EVAL=$(curl -X POST http://localhost:5000/api/ai/evaluate-response \
  -H "Content-Type: application/json" \
  -d '{
    "question": "'"$QUESTION"'",
    "userResponse": "I worked on a scaling project...",
    "jobRole": "Software Engineer",
    "difficulty": "intermediate"
  }')

# 5. Save response
curl -X POST http://localhost:5000/api/interviews/$INTERVIEW_ID/response \
  -H "Content-Type: application/json" \
  -d "{
    \"questionId\": \"$QUESTION_ID\",
    \"response\": \"I worked on a scaling project...\",
    \"evaluation\": $(echo $EVAL | jq '.data')
  }"
```

## Support

For API issues or questions:
1. Check this documentation
2. Review backend logs
3. Verify environment variables are set correctly
4. Check OpenAI and Supabase status pages
