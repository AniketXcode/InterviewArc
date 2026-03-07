# InterviewArc - Complete Setup Guide

Follow this guide to get InterviewArc running locally for development and testing.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Running Locally](#running-locally)
7. [Testing the Application](#testing-the-application)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18.0.0 or higher** ([Download](https://nodejs.org/))
  ```bash
  node --version  # Check version
  npm --version   # Check npm version
  ```

- **Git** ([Download](https://git-scm.com/))
  ```bash
  git --version
  ```

- **Code Editor** (VS Code recommended)

- **API Keys and Credentials**:
  - OpenAI API key (from https://platform.openai.com)
  - Supabase account (https://supabase.com)

## Environment Setup

### 1. Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. Click "Create new secret key"
3. Copy the key (you won't be able to see it again)
4. Save it safely - you'll need it for `.env.local`

### 2. Setup Supabase

1. Go to [Supabase](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - Organization: Select or create one
   - Project name: e.g., "interviewarc"
   - Database password: Choose a strong password
   - Region: Select closest to you
4. Click "Create new project" and wait for initialization
5. Once ready, go to **Settings > API**:
   - Copy **Project URL** (SUPABASE_URL)
   - Copy **anon public** key (SUPABASE_ANON_KEY)
   - Copy **service_role** key (SUPABASE_SERVICE_ROLE_KEY)

### 3. Create Environment File

In the root directory of the project, create `.env.local`:

```bash
# Copy the template
cp .env.local .env.local
```

Edit `.env.local` and add your credentials:

```env
# Supabase (from your Supabase project settings)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI (from your OpenAI account)
OPENAI_API_KEY=sk-your_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:5000/api
```

**⚠️ IMPORTANT**: Never commit `.env.local` to git. It's already in `.gitignore`.

## Database Setup

### 1. Create Database Tables

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy the entire content from `supabase/migrations/20260305164436_01_create_initial_schema.sql`
5. Paste it into the SQL editor
6. Click **Run**
7. You should see success message at the bottom

### 2. Verify Tables

In Supabase SQL Editor, run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

You should see:
- interviews
- interview_questions
- interview_responses

## Backend Setup

### 1. Install Dependencies

```bash
# Navigate to Backend directory
cd Backend

# Install all dependencies
npm install
```

This will install:
- express (web framework)
- cors (cross-origin requests)
- dotenv (environment variables)
- openai (OpenAI SDK)
- @supabase/supabase-js (Supabase client)

### 2. Verify Setup

```bash
# Run from Backend directory
npm run dev
```

You should see:
```
[Server] InterviewArc Backend is running on http://localhost:5000
[Server] CORS enabled for: http://localhost:5173
```

### 3. Test Backend

In another terminal, test the health endpoint:

```bash
curl http://localhost:5000/api/health
```

You should get:
```json
{
  "status": "Backend is running",
  "timestamp": "2024-03-07T10:30:00.000Z"
}
```

Type `Ctrl+C` to stop the server.

## Frontend Setup

### 1. Install Dependencies

```bash
# Navigate to Frontend directory
cd Frontend

# Install all dependencies
npm install
```

### 2. Create Frontend Env File

Create `Frontend/.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:5000/api
```

### 3. Verify Setup

```bash
# From Frontend directory
npm run build
```

This should complete without errors. You should see a `dist` folder created.

## Running Locally

### Terminal 1 - Start Backend

```bash
cd Backend
npm run dev
```

Expected output:
```
[Server] InterviewArc Backend is running on http://localhost:5000
```

### Terminal 2 - Start Frontend

```bash
cd Frontend
npm run dev
```

Expected output:
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 3. Open in Browser

Open http://localhost:5173 in your browser. You should see the InterviewArc login page.

## Testing the Application

### 1. Create Account

1. Click "Sign Up" on the login page
2. Enter email and password
3. Click "Sign Up"
4. You should be redirected to the dashboard

### 2. Create Practice Interview

1. Click "Start New Interview"
2. Fill in details:
   - Job Role: "Software Engineer" (or any role)
   - Difficulty: "Intermediate"
   - Number of Questions: "3"
3. Click "Start Interview"

### 3. Practice Questions

1. You should see the first AI-generated question
2. Read it and think about your answer
3. Type your response
4. Click "Submit Answer"

### 4. View Feedback

1. You should see your score and feedback
2. Read the strengths and improvement areas
3. Click "Next Question" to continue

### 5. Complete Interview

1. Answer all questions
2. On the last question, click "Complete Interview"
3. You should see a comprehensive report with:
   - Overall score
   - Performance summary
   - Strengths
   - Areas for improvement
   - Recommendations

### 6. View History

1. Go back to dashboard
2. Click "Interview History"
3. You should see your completed interview listed

## Troubleshooting

### Backend Won't Start

**Error**: "Port 5000 already in use"
- Change PORT in `.env.local` to another number
- Or kill the process using port 5000

**Error**: "Cannot find module 'openai'"
- Run `npm install` in Backend directory
- Make sure you're in the Backend directory

**Error**: "OPENAI_API_KEY not configured"
- Check `.env.local` file exists and has correct key
- Ensure no extra spaces around the value

### Frontend Won't Start

**Error**: "Cannot find module '@supabase/auth-ui-react'"
- Run `npm install` in Frontend directory
- Delete `node_modules` and run `npm install` again

**Error**: "VITE_API_URL not found"
- Create `Frontend/.env.local` with all three variables
- Frontend won't work without these environment variables

### API Not Responding

**Error**: "Failed to fetch from API"
- Ensure backend is running (see Terminal 1)
- Check VITE_API_URL in Frontend/.env.local matches backend URL
- Check browser console for specific error

### OpenAI API Errors

**Error**: "Invalid API key"
- Verify API key in `.env.local`
- Copy-paste the entire key from OpenAI dashboard
- No spaces before or after the key

**Error**: "You exceeded your current quota"
- Check OpenAI account has credits
- Upgrade account if trial expired

### Database Connection Errors

**Error**: "Failed to connect to Supabase"
- Verify SUPABASE_URL and keys in `.env.local`
- Check your Supabase project is active
- Try copying credentials again from Supabase dashboard
- Check network connectivity

**Error**: "Relation 'interviews' does not exist"
- Run the SQL migration in Supabase SQL Editor again
- Verify tables are created in Supabase dashboard

### CORS Errors in Browser

**Error**: "Access to XMLHttpRequest blocked by CORS policy"
- Ensure backend is running
- Check CORS is enabled in `Backend/src/server.js`
- Verify FRONTEND_URL environment variable if needed

## Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- Frontend: Changes to `.jsx`, `.css` files auto-reload
- Backend: Changes to `.js` files auto-reload (with nodemon)

### Console Logs

Add debug logs to understand flow:

**Frontend**:
```javascript
console.log('[Debug]', data);
```

**Backend**:
```javascript
console.log('[API] Received request:', req.body);
```

### Network Inspection

1. Open browser DevTools (F12)
2. Go to Network tab
3. Make a request in the app
4. Click on the request to see details
5. Check Status, Headers, Response

### Database Inspection

1. In Supabase dashboard
2. Click **Table Editor**
3. Select a table to see data
4. You can add, edit, or delete records

## Next Steps

1. **Customize styling** - Update colors and fonts in `Frontend/src/index.css`
2. **Add more question categories** - Extend question generation in backend
3. **Setup authentication** - Deploy your app with Supabase Auth
4. **Deploy to Vercel** - See [DEPLOYMENT.md](./DEPLOYMENT.md)

## Getting Help

If you encounter issues:

1. Check the [Troubleshooting](#troubleshooting) section above
2. Check error messages in browser console (F12)
3. Check backend terminal for error logs
4. Review the API documentation in [Backend/README.md](./Backend/README.md)
5. Check OpenAI docs: https://platform.openai.com/docs
6. Check Supabase docs: https://supabase.com/docs

## Project Structure Reference

```
InterviewArc/
├── Backend/                    # Express.js API
│   ├── src/
│   │   ├── server.js          # Main server
│   │   ├── config/            # Configuration
│   │   ├── services/          # Business logic
│   │   └── routes/            # API endpoints
│   ├── package.json
│   └── .env.example
├── Frontend/                   # React app
│   ├── src/
│   │   ├── components/        # Components
│   │   ├── pages/             # Pages
│   │   ├── services/          # Services
│   │   ├── App.jsx            # Main app
│   │   └── main.jsx           # Entry point
│   ├── package.json
│   └── vite.config.js
├── supabase/
│   └── migrations/            # Database schemas
├── .env.local                 # Your credentials (local only)
├── README.md                  # Project overview
├── SETUP.md                   # This file
└── DEPLOYMENT.md              # Production deployment
```

---

**Need help?** Check the main [README.md](./README.md) or [DEPLOYMENT.md](./DEPLOYMENT.md) for additional guidance.
