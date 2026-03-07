# InterviewArc Backend

AI-powered interview practice platform backend API built with Express.js, OpenAI GPT-4, and Supabase.

## Features

- **AI-Powered Question Generation**: Generate realistic interview questions using GPT-4
- **Intelligent Response Evaluation**: Evaluate candidate responses with detailed feedback
- **Comprehensive Reporting**: Generate personalized feedback reports
- **RESTful API**: Clean and intuitive API endpoints
- **Database Integration**: Supabase for persistent data storage
- **CORS Support**: Enable cross-origin requests for frontend integration

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **AI**: OpenAI API (GPT-4)
- **Database**: Supabase (PostgreSQL)
- **Package Manager**: npm

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- OpenAI API key
- Supabase account and credentials

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the Backend directory:
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
```env
PORT=5000
NODE_ENV=development
OPENAI_API_KEY=your_openai_api_key_here
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
FRONTEND_URL=http://localhost:5173
```

## Running the Server

### Development Mode
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Production Mode
```bash
npm start
```

## API Endpoints

### Health Check
- `GET /api/health` - Server status

### AI Endpoints
- `POST /api/ai/generate-question` - Generate interview question
- `POST /api/ai/evaluate-response` - Evaluate candidate response
- `POST /api/ai/generate-report` - Generate comprehensive feedback report

### Interview Endpoints
- `POST /api/interviews/create` - Create new interview
- `POST /api/interviews/:interviewId/question` - Save question
- `POST /api/interviews/:interviewId/response` - Save response with evaluation
- `POST /api/interviews/:interviewId/complete` - Complete interview with report
- `GET /api/interviews/history/:userId` - Get user's interview history
- `GET /api/interviews/:interviewId` - Get interview details

### Auth Endpoints
- `POST /api/auth/verify` - Verify authentication token
- `GET /api/auth/health` - Auth service status

## API Request/Response Examples

### Generate Question
**Request:**
```bash
POST /api/ai/generate-question
{
  "jobRole": "Software Engineer",
  "difficulty": "intermediate",
  "category": "technical"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "question": "Explain the difference between REST and GraphQL APIs and when you would use each."
  }
}
```

### Evaluate Response
**Request:**
```bash
POST /api/ai/evaluate-response
{
  "question": "Explain the difference between REST and GraphQL APIs...",
  "userResponse": "REST is...",
  "jobRole": "Software Engineer",
  "difficulty": "intermediate"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 85,
    "strengths": ["Clear explanation", "Good examples"],
    "improvements": ["Mention performance considerations"],
    "feedback": "Strong understanding demonstrated.",
    "followUp": "How would you handle caching with GraphQL?"
  }
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | No (default: 5000) |
| NODE_ENV | Environment (development/production) | No (default: development) |
| OPENAI_API_KEY | OpenAI API key | Yes |
| SUPABASE_URL | Supabase project URL | Yes |
| SUPABASE_ANON_KEY | Supabase anonymous key | Yes |
| SUPABASE_SERVICE_ROLE_KEY | Supabase service role key | No |
| FRONTEND_URL | Frontend URL for CORS | No |

## Database Schema

The backend expects the following Supabase tables:

### interviews
- id (UUID, primary key)
- user_id (UUID, foreign key)
- job_role (text)
- difficulty (text)
- num_questions (integer)
- status (text: in_progress, completed)
- overall_score (integer)
- performance_summary (text)
- created_at (timestamp)
- completed_at (timestamp)

### interview_questions
- id (UUID, primary key)
- interview_id (UUID, foreign key)
- question_number (integer)
- question (text)
- created_at (timestamp)

### interview_responses
- id (UUID, primary key)
- interview_id (UUID, foreign key)
- question_id (UUID, foreign key)
- response (text)
- score (integer)
- strengths (jsonb array)
- improvements (jsonb array)
- feedback (text)
- follow_up (text)
- created_at (timestamp)

## Error Handling

All endpoints return error responses in the following format:

```json
{
  "error": "Error message describing what went wrong"
}
```

HTTP Status Codes:
- 200: Success
- 400: Bad Request (missing required fields)
- 401: Unauthorized
- 500: Server Error

## Development

### Project Structure
```
Backend/
├── src/
│   ├── server.js           # Main server file
│   ├── config/
│   │   ├── openai.js       # OpenAI configuration
│   │   └── supabase.js     # Supabase configuration
│   ├── services/
│   │   ├── aiService.js         # AI logic
│   │   └── interviewService.js  # Interview database operations
│   └── routes/
│       ├── aiRoutes.js         # AI endpoints
│       ├── interviewRoutes.js   # Interview endpoints
│       └── authRoutes.js        # Auth endpoints
├── .env.example
├── package.json
└── README.md
```

## Troubleshooting

### OpenAI API Errors
- Verify your API key is correct and has sufficient credits
- Check if the key has the right permissions

### Supabase Connection Errors
- Verify credentials in .env file
- Ensure Supabase project is active
- Check network connectivity

### CORS Errors
- Verify FRONTEND_URL environment variable is set correctly
- Check browser console for specific error messages

## Contributing

Please follow the existing code style and structure when making changes.

## License

MIT
