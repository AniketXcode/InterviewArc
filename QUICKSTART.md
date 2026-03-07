# InterviewArc - Quick Start Guide

Get InterviewArc running in 5 minutes!

## Prerequisites

- Node.js 18+
- OpenAI API key: https://platform.openai.com
- Supabase account: https://supabase.com

## 1. Get Your Credentials (2 minutes)

### OpenAI API Key
1. Go to https://platform.openai.com/account/api-keys
2. Create new secret key
3. Copy it (save it!)

### Supabase Credentials
1. Go to https://supabase.com
2. Create new project
3. Go to Settings > API
4. Copy Project URL and keys

## 2. Setup Environment (1 minute)

Create `.env.local` in project root:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk_your_key_here
PORT=5000
NODE_ENV=development
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:5000/api
```

## 3. Setup Database (1 minute)

1. In Supabase dashboard, click **SQL Editor**
2. Click **New Query**
3. Copy content from `supabase/migrations/20260305164436_01_create_initial_schema.sql`
4. Paste and click **Run**

## 4. Install & Run (1 minute)

**Terminal 1 - Backend:**
```bash
cd Backend
npm install
npm run dev
```

Expected: `[Server] InterviewArc Backend is running on http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm install
npm run dev
```

Expected: `➜  Local: http://localhost:5173/`

## 5. Test It! (Open browser)

Open http://localhost:5173 and:

1. Sign up with email/password
2. Click "Start New Interview"
3. Select role and difficulty
4. Get AI-generated questions
5. See instant feedback!

## Common Commands

```bash
# Start development servers
cd Backend && npm run dev      # Terminal 1
cd Frontend && npm run dev     # Terminal 2

# Build for production
cd Frontend && npm run build

# Deploy to Vercel
vercel deploy --prod

# View backend logs
# Check Terminal 1 output

# Check API health
curl http://localhost:5000/api/health
```

## Project Files Overview

| File | Purpose |
|------|---------|
| `README.md` | Full project documentation |
| `SETUP.md` | Detailed setup instructions |
| `API.md` | API endpoint documentation |
| `DEPLOYMENT.md` | Production deployment guide |
| `Backend/` | Express.js API server |
| `Frontend/` | React application |
| `.env.local` | Your credentials (don't commit!) |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 5000 in use | Change PORT in `.env.local` |
| API not found | Ensure backend is running on Terminal 1 |
| SUPABASE_URL error | Check `.env.local` has correct credentials |
| OpenAI error | Verify API key and account has credits |
| Database error | Re-run SQL migration in Supabase |

## Next Steps

1. **Customize**: Edit styling in `Frontend/src/index.css`
2. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
3. **Extend**: Add more question categories in `Backend/src/services/aiService.js`
4. **Share**: Deploy and share with others!

## Feature Overview

- ✅ AI-generated interview questions (GPT-4)
- ✅ Real-time response evaluation
- ✅ Comprehensive performance reports
- ✅ Interview history tracking
- ✅ User authentication
- ✅ Difficulty levels (junior/intermediate/senior)
- ✅ Multiple question types (behavioral/technical/situational)

## API Endpoints (Quick Reference)

```
POST /api/ai/generate-question       # Get AI question
POST /api/ai/evaluate-response       # Evaluate answer
POST /api/ai/generate-report         # Get full report

POST /api/interviews/create          # Start interview
GET  /api/interviews/history/:userId # Get past interviews
GET  /api/interviews/:id             # Get interview details

GET  /api/health                     # Check backend status
```

See [API.md](./API.md) for full documentation.

## Questions?

1. Check relevant markdown file (SETUP.md, API.md, DEPLOYMENT.md)
2. Review Terminal logs
3. Check browser console (F12)
4. Verify credentials in `.env.local`

## Ready to Deploy?

See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment steps.

---

**Stuck?** Run through the setup checklist in [SETUP.md](./SETUP.md) for detailed help.
