# InterviewArc - Architecture Documentation

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                          INTERNET / USERS                            │
└──────────────────────────┬──────────────────────────────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Browser   │
                    │   (React)   │
                    └──────┬──────┘
                           │
              ┌────────────┼────────────┐
              │                         │
        ┌─────▼─────┐           ┌──────▼───────┐
        │ Supabase  │           │ Express.js   │
        │   Auth    │           │   Backend    │
        └─────┬─────┘           └──────┬───────┘
              │                        │
              └────────────┬───────────┘
                           │
                    ┌──────▼──────┐
                    │  Supabase   │
                    │ PostgreSQL  │
                    └─────────────┘
```

## Detailed Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                         FRONTEND LAYER                               │
│  (React Application - http://localhost:5173)                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Auth Pages      │  │ Interview Pages  │  │ Dashboard Pages  │  │
│  │  - Login         │  │ - Setup          │  │ - History        │  │
│  │  - Register      │  │ - Practice       │  │ - Analytics      │  │
│  │  - Profile       │  │ - Feedback       │  │ - Settings       │  │
│  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘  │
│           │                     │                     │             │
│           └─────────────────────┼─────────────────────┘             │
│                                 │                                   │
│           ┌─────────────────────▼─────────────────────┐             │
│           │      React Context / State Management     │             │
│           │  - AuthContext: User authentication      │             │
│           │  - Interview State: Current session      │             │
│           └─────────────────────┬─────────────────────┘             │
│                                 │                                   │
│           ┌─────────────────────▼─────────────────────┐             │
│           │           Service Layer                   │             │
│           │  ┌─────────────────────────────────────┐  │             │
│           │  │ apiService.js                       │  │             │
│           │  │ - Base API client                   │  │             │
│           │  │ - Request/Response handling         │  │             │
│           │  │ - Error management                  │  │             │
│           │  └─────────────────────────────────────┘  │             │
│           │  ┌─────────────────────────────────────┐  │             │
│           │  │ aiService.js (Updated)              │  │             │
│           │  │ - generateQuestion()                │  │             │
│           │  │ - evaluateResponse()                │  │             │
│           │  │ - synthesizeFeedback()              │  │             │
│           │  └─────────────────────────────────────┘  │             │
│           │  ┌─────────────────────────────────────┐  │             │
│           │  │ authService.js                      │  │             │
│           │  │ - Login/Signup                      │  │             │
│           │  │ - Token management                  │  │             │
│           │  └─────────────────────────────────────┘  │             │
│           │  ┌─────────────────────────────────────┐  │             │
│           │  │ interviewService.js                 │  │             │
│           │  │ - Interview CRUD operations         │  │             │
│           │  │ - History management                │  │             │
│           │  └─────────────────────────────────────┘  │             │
│           │  ┌─────────────────────────────────────┐  │             │
│           │  │ supabaseClient.js                   │  │             │
│           │  │ - Supabase instance                 │  │             │
│           │  │ - Direct DB operations              │  │             │
│           │  └─────────────────────────────────────┘  │             │
│           └─────────────────────┬─────────────────────┘             │
│                                 │                                   │
└─────────────────────────────────┼───────────────────────────────────┘
                                  │
                   HTTP/HTTPS (Fetch API)
                                  │
                    ┌─────────────▼──────────────┐
                    │  CORS Configuration       │
                    │  - Origin validation      │
                    │  - Credentials handling   │
                    └─────────────┬──────────────┘
                                  │
┌─────────────────────────────────▼──────────────────────────────────┐
│                         BACKEND LAYER                              │
│  (Express.js - http://localhost:5000/api)                          │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                    Express Server                            │ │
│  │  - CORS Middleware                                          │ │
│  │  - JSON Body Parser                                         │ │
│  │  - Error Handler                                            │ │
│  └─────────────────────────┬──────────────────────────────────┘ │
│                            │                                    │
│            ┌───────────────┼───────────────┐                   │
│            │               │               │                   │
│      ┌─────▼────────┐ ┌───▼────────┐ ┌───▼──────────┐         │
│      │ AI Routes    │ │ Interview  │ │ Auth Routes  │         │
│      │              │ │ Routes     │ │              │         │
│      │ - Generate   │ │            │ │ - Verify     │         │
│      │   Question   │ │ - Create   │ │ - Health     │         │
│      │ - Evaluate   │ │ - Save Q   │ │              │         │
│      │ - Report     │ │ - Save R   │ │              │         │
│      │              │ │ - Complete │ │              │         │
│      │              │ │ - History  │ │              │         │
│      │              │ │ - Detail   │ │              │         │
│      └─────┬────────┘ └───┬────────┘ └───┬──────────┘         │
│            │               │               │                   │
│            └───────────────┼───────────────┘                   │
│                            │                                    │
│            ┌───────────────▼───────────────┐                   │
│            │     Service Layer             │                   │
│            │                               │                   │
│            │  ┌────────────────────────┐   │                   │
│            │  │ aiService.js           │   │                   │
│            │  │                        │   │                   │
│            │  │ generateInterviewQ()   │   │                   │
│            │  │ evaluateResponse()     │   │                   │
│            │  │ generateFeedbackReport │   │                   │
│            │  └────────┬───────────────┘   │                   │
│            │           │                    │                   │
│            │           ▼                    │                   │
│            │   ┌────────────────┐          │                   │
│            │   │  OpenAI Client │          │                   │
│            │   │  (GPT-4 API)   │          │                   │
│            │   └────────────────┘          │                   │
│            │                               │                   │
│            │  ┌────────────────────────┐   │                   │
│            │  │ interviewService.js    │   │                   │
│            │  │                        │   │                   │
│            │  │ createInterview()      │   │                   │
│            │  │ saveQuestion()         │   │                   │
│            │  │ saveResponse()         │   │                   │
│            │  │ completeInterview()    │   │                   │
│            │  │ getInterviewHistory()  │   │                   │
│            │  │ getInterviewDetail()   │   │                   │
│            │  └────────┬───────────────┘   │                   │
│            │           │                    │                   │
│            │           ▼                    │                   │
│            │   ┌────────────────┐          │                   │
│            │   │ Supabase Client│          │                   │
│            │   │ (@supabase-js) │          │                   │
│            │   └────────────────┘          │                   │
│            └─────────────────────────────┘ │                   │
│                                            │                   │
└────────────────────────────────────────────┼───────────────────┘
                                             │
                         PostgreSQL (Supabase)
                                             │
┌────────────────────────────────────────────▼───────────────────┐
│                    DATABASE LAYER                              │
│              (Supabase PostgreSQL)                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  INTERVIEWS TABLE                         │  │
│  │  - id (UUID, PK)                                         │  │
│  │  - user_id (UUID, FK)                                   │  │
│  │  - job_role (text)                                      │  │
│  │  - difficulty (text)                                    │  │
│  │  - status (text)                                        │  │
│  │  - overall_score (integer)                              │  │
│  │  - created_at, completed_at (timestamps)                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            INTERVIEW_QUESTIONS TABLE                    │  │
│  │  - id (UUID, PK)                                         │  │
│  │  - interview_id (UUID, FK -> interviews)                │  │
│  │  - question_number (integer)                            │  │
│  │  - question (text)                                      │  │
│  │  - created_at (timestamp)                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │            INTERVIEW_RESPONSES TABLE                    │  │
│  │  - id (UUID, PK)                                         │  │
│  │  - interview_id (UUID, FK -> interviews)                │  │
│  │  - question_id (UUID, FK -> interview_questions)        │  │
│  │  - response (text)                                      │  │
│  │  - score (integer)                                      │  │
│  │  - strengths (jsonb array)                              │  │
│  │  - improvements (jsonb array)                           │  │
│  │  - feedback (text)                                      │  │
│  │  - created_at (timestamp)                               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                INDEXES                                   │  │
│  │  - user_id on interviews                                │  │
│  │  - interview_id on interview_questions                  │  │
│  │  - interview_id on interview_responses                  │  │
│  │  - question_id on interview_responses                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

### Create and Practice Interview Flow

```
User → Frontend Login
  ├─→ Supabase Auth
  └─→ User authenticated

User → Create Interview
  ├─→ Frontend: interviewService.createInterview()
  ├─→ Backend: POST /api/interviews/create
  ├─→ Backend: interviewService.createInterview()
  ├─→ Database: INSERT into interviews
  └─→ Return interview_id

User → Get First Question
  ├─→ Frontend: aiService.generateQuestion()
  ├─→ Backend: POST /api/ai/generate-question
  ├─→ Backend: aiService.generateInterviewQuestion()
  ├─→ OpenAI API: GPT-4 call
  ├─→ Backend: Return question
  ├─→ Frontend: Display question
  ├─→ Backend: POST /api/interviews/:id/question
  ├─→ Database: INSERT into interview_questions
  └─→ Confirm save

User → Answer Question
  ├─→ Frontend: Collect response text
  ├─→ Frontend: aiService.evaluateResponse()
  ├─→ Backend: POST /api/ai/evaluate-response
  ├─→ Backend: aiService.evaluateResponse()
  ├─→ OpenAI API: GPT-4 call for evaluation
  ├─→ Backend: Return evaluation (score, feedback)
  ├─→ Frontend: Display feedback
  ├─→ Backend: POST /api/interviews/:id/response
  ├─→ Database: INSERT into interview_responses
  └─→ Confirm save

User → Complete Interview
  ├─→ Frontend: aiService.synthesizeFeedback()
  ├─→ Backend: POST /api/ai/generate-report
  ├─→ Backend: aiService.generateFeedbackReport()
  ├─→ OpenAI API: GPT-4 call for comprehensive report
  ├─→ Backend: Return report
  ├─→ Frontend: Display report
  ├─→ Backend: POST /api/interviews/:id/complete
  ├─→ Database: UPDATE interviews (set status=completed)
  └─→ Redirect to history

User → View History
  ├─→ Frontend: interviewService.getUserInterviews()
  ├─→ Backend: GET /api/interviews/history/:userId
  ├─→ Database: SELECT * FROM interviews WHERE user_id=:id
  └─→ Display list
```

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    React Components                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│  │ LoginPage    │   │ Dashboard    │   │ InterviewRoom│   │
│  └────────┬─────┘   └──────┬───────┘   └──────┬───────┘   │
│           │                 │                  │            │
│           └─────────────────┼──────────────────┘            │
│                             │                              │
│                     ┌───────▼────────┐                     │
│                     │ AuthContext    │                     │
│                     └───────┬────────┘                     │
│                             │                              │
│                     ┌───────▼────────┐                     │
│                     │ Services Layer │                     │
│                     └────────────────┘                     │
│         │                   │                   │          │
│    ┌────▼─────┐      ┌─────▼──────┐    ┌─────▼──────┐    │
│    │authService   │      │aiService │    │interviewService    │
│    └────┬─────┘      └─────┬──────┘    └─────┬──────┘    │
│         │                   │                  │            │
│         │           ┌───────▼──────────┐      │            │
│         │           │apiService      │      │            │
│         │           │(All API calls)  │      │            │
│         │           └───────┬─────────┘      │            │
│         │                   │                │            │
│         └───────────────────┼────────────────┘            │
│                             │                            │
└─────────────────────────────┼────────────────────────────┘
                              │
              ┌───────────────▼─────────────────┐
              │  HTTP Requests (Fetch API)      │
              └───────────────┬─────────────────┘
                              │
┌─────────────────────────────▼─────────────────────────────┐
│                   Express.js Backend                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ AI Routes    │  │Interview     │  │Auth Routes   │  │
│  │              │  │Routes        │  │              │  │
│  └────────┬─────┘  └────────┬─────┘  └────────┬─────┘  │
│           │                 │                 │         │
│           └─────────────────┼─────────────────┘         │
│                             │                          │
│           ┌─────────────────▼─────────────────┐        │
│           │    Service Layer                  │        │
│           │  - aiService                      │        │
│           │  - interviewService               │        │
│           │  - Error handling                 │        │
│           └─────────────────┬─────────────────┘        │
│                             │                          │
│          ┌──────────────────┼──────────────────┐       │
│          │                  │                  │       │
│    ┌─────▼──────┐    ┌──────▼────────┐  ┌────▼─────┐  │
│    │OpenAI      │    │Supabase       │  │Error      │  │
│    │Client      │    │Client         │  │Handler    │  │
│    └────────────┘    └───────────────┘  └───────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## API Call Sequence Example

```
Sequence: User Completes Interview

Frontend                          Backend                    External APIs
  │                               │                             │
  │─── Create Interview ──────────>│                             │
  │      POST /interviews/create   │── Insert Interview ───────>│
  │                                │   (Supabase)         Database
  │<── Interview ID ───────────────│                             │
  │                                │                             │
  │─── Generate Question ─────────>│                             │
  │   POST /ai/generate-question   │─── Call GPT-4 ─────────────>│
  │                                │   (Generate Q1)        OpenAI
  │<── Question 1 ────────────────│                         API
  │                                │                             │
  │─ Save Question ──────────────>│── Insert Question 1 ──────>│
  │   POST /interviews/:id/question │   (Supabase)         Database
  │                                │                             │
  │ [User answers Q1]              │                             │
  │                                │                             │
  │─── Evaluate Response ─────────>│                             │
  │  POST /ai/evaluate-response    │─── Call GPT-4 ─────────────>│
  │                                │   (Evaluate Q1)        OpenAI
  │<── Evaluation ─────────────────│                         API
  │  (score, feedback)             │                             │
  │                                │                             │
  │─ Save Response ──────────────>│── Insert Response 1 ────────>│
  │   POST /interviews/:id/response │   (Supabase)         Database
  │                                │                             │
  │ [Repeat for Q2, Q3...]         │                             │
  │                                │                             │
  │─── Generate Report ───────────>│                             │
  │   POST /ai/generate-report     │─── Call GPT-4 ─────────────>│
  │                                │   (Generate Report)    OpenAI
  │<── Report ─────────────────────│                         API
  │  (overall_score, recommendations)                            │
  │                                │                             │
  │─ Complete Interview ─────────>│── Update Interview ────────>│
  │   POST /interviews/:id/complete │   (Supabase)         Database
  │                                │                             │
  │<── Completion Confirmation ───│                             │
  │                                │                             │
```

## Technology Integration Points

### Frontend ↔ Backend
- **HTTP Protocol**: REST API via Fetch API
- **Format**: JSON request/response
- **Authentication**: User tokens via Supabase
- **CORS**: Configured for localhost:5173 (development)

### Backend ↔ OpenAI
- **Protocol**: HTTPS API
- **Client**: OpenAI Node.js SDK
- **Model**: GPT-4
- **Endpoints**:
  - Question generation
  - Response evaluation
  - Report generation

### Backend ↔ Supabase
- **Protocol**: HTTPS via Supabase Client SDK
- **Database**: PostgreSQL
- **Authentication**: Service role key for backend
- **Operations**: CRUD on interviews, questions, responses

### Frontend ↔ Supabase
- **Direct**: Supabase Auth client
- **Operations**: User authentication only
- **Indirect**: Via backend for data operations

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION (Vercel)                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Frontend (Vercel Static Deployment)                  │ │
│  │ - React app compiled to static files                 │ │
│  │ - Served via Vercel CDN globally                    │ │
│  │ - Environment variables injected at build time      │ │
│  │ - URL: your-domain.vercel.app                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Backend (Vercel Serverless Functions)               │ │
│  │ - Express.js wrapped in Node.js runtime             │ │
│  │ - Auto-scales based on traffic                      │ │
│  │ - Environment variables managed by Vercel           │ │
│  │ - URL: your-backend.vercel.app                      │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ Supabase (Cloud Database)                           │ │
│  │ - PostgreSQL hosted on Supabase infrastructure      │ │
│  │ - Automatic backups and scaling                     │ │
│  │ - Auth service integrated                           │ │
│  │ - Real-time subscriptions available                 │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ OpenAI API (External)                               │ │
│  │ - GPT-4 model access                                │ │
│  │ - Rate limited per account                          │ │
│  │ - Billed on token usage                             │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    SECURITY LAYERS                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Layer 1: HTTPS/TLS
│  └─ All communication encrypted in transit
│                                                             │
│ Layer 2: CORS Policy
│  └─ Only frontend domain can access backend API
│                                                             │
│ Layer 3: Authentication
│  └─ Supabase Auth tokens required for data access
│                                                             │
│ Layer 4: Database Security
│  └─ Environment variables protect API keys
│  └─ Service role key only on backend
│  └─ Parameterized queries prevent SQL injection
│                                                             │
│ Layer 5: Input Validation
│  └─ All inputs validated on backend
│  └─ Content-Type validation
│  └─ Required field verification
│                                                             │
│ Layer 6: Error Handling
│  └─ Generic error messages to users
│  └─ Detailed logs on server side
│  └─ No sensitive data in error responses
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Scalability Considerations

### Current Capacity
- Supabase: Handles thousands of concurrent connections
- OpenAI API: Rate limited by account tier
- Vercel: Auto-scales serverless functions

### Scaling Strategies
1. **Database**: Upgrade Supabase tier or migrate to self-hosted PostgreSQL
2. **API Rate Limiting**: Implement Redis-based rate limiting
3. **Caching**: Cache common responses (questions, feedback templates)
4. **Async Jobs**: Use Vercel Cron or external job queue for heavy processing
5. **CDN**: Already included in Vercel deployment

## Monitoring & Logging

### Frontend Monitoring
- Browser console logs
- Error tracking via Sentry (optional)
- Performance monitoring via Vercel Analytics

### Backend Monitoring
- Server console logs
- Vercel function logs
- Error tracking via Sentry (optional)
- Database query logs via Supabase

### Key Metrics
- API response times
- OpenAI API usage
- Database query performance
- User authentication success rate
- Error rates by endpoint

---

This architecture provides a scalable, secure, and maintainable system for the InterviewArc platform.
