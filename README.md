# InterviewArc

An AI-powered interview practice platform that uses OpenAI's GPT-4 to generate realistic interview questions, evaluate responses, and provide comprehensive feedback. Built with React frontend, Express.js backend, and Supabase for data persistence.

## Features

- **AI-Generated Questions**: Realistic interview questions powered by GPT-4
- **Real-time Evaluation**: Get instant feedback on your responses with scoring and improvement tips
- **Comprehensive Reports**: Detailed performance analysis after each interview session
- **Interview History**: Track your progress over multiple practice sessions
- **Multi-category Support**: Practice behavioral, technical, and situational questions
- **Difficulty Levels**: Choose from various difficulty levels to match your preparation stage
- **User Authentication**: Secure authentication with Supabase Auth

## Tech Stack

### Frontend
- React 18+ with Vite
- Supabase Auth for authentication
- TailwindCSS for styling
- Responsive design for all devices

### Backend
- Node.js with Express.js
- OpenAI API (GPT-4) for AI features
- Supabase PostgreSQL for data storage
- CORS enabled for secure communication

### Database
- Supabase (PostgreSQL-based)
- Tables: interviews, interview_questions, interview_responses

## Project Structure

```
InterviewArc/
├── Frontend/                    # React application
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API and data services
│   │   ├── context/            # React context for state
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
├── Backend/                     # Express.js API server
│   ├── src/
│   │   ├── server.js           # Main server file
│   │   ├── config/             # Configuration files
│   │   ├── services/           # Business logic
│   │   └── routes/             # API endpoints
│   ├── package.json
│   └── .env.example
├── supabase/
│   └── migrations/             # Database migrations
├── .env.local                  # Environment variables
├── vercel.json                 # Vercel deployment config
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key
- Supabase account

### Local Development

1. **Clone the repository** (already done)

2. **Setup environment variables**:
   ```bash
   # Copy and fill in your credentials
   cp .env.local.example .env.local
   ```

3. **Install and run backend**:
   ```bash
   cd Backend
   npm install
   npm run dev
   # Backend runs on http://localhost:5000
   ```

4. **Install and run frontend** (in another terminal):
   ```bash
   cd Frontend
   npm install
   npm run dev
   # Frontend runs on http://localhost:5173
   ```

5. **Access the application**:
   - Open http://localhost:5173 in your browser
   - Sign up or log in with Supabase Auth
   - Start practicing interviews!

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Backend
PORT=5000
NODE_ENV=development

# Frontend
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5000/api
```

## How It Works

1. **User Signs Up/Logs In**: Authenticate via Supabase Auth
2. **Create Interview**: Select job role, difficulty, and number of questions
3. **Receive Questions**: AI generates relevant interview questions using GPT-4
4. **Answer Questions**: Record or type your responses
5. **Instant Evaluation**: Each response is evaluated with score and feedback
6. **View Report**: Get comprehensive performance analysis at the end
7. **Track Progress**: Review past interviews and track improvements

## API Documentation

### Backend Routes

**AI Endpoints**:
- `POST /api/ai/generate-question` - Generate a new interview question
- `POST /api/ai/evaluate-response` - Evaluate a candidate response
- `POST /api/ai/generate-report` - Generate comprehensive feedback report

**Interview Endpoints**:
- `POST /api/interviews/create` - Create new interview session
- `POST /api/interviews/:id/question` - Save question
- `POST /api/interviews/:id/response` - Save response with evaluation
- `POST /api/interviews/:id/complete` - Complete interview with final report
- `GET /api/interviews/history/:userId` - Get user's interview history
- `GET /api/interviews/:id` - Get interview details

See [Backend README](./Backend/README.md) for detailed API documentation.

## Deployment

### Deploy to Vercel

1. **Connect to GitHub**:
   - Push your code to GitHub
   - Connect your GitHub repository to Vercel

2. **Add Environment Variables**:
   - Go to Vercel Project Settings > Environment Variables
   - Add all required variables from `.env.local`

3. **Deploy**:
   - Push to main branch or click "Deploy" in Vercel dashboard
   - Both frontend and backend will deploy automatically

### Database Setup on Supabase

1. Create a new Supabase project
2. Run migrations from `supabase/migrations/` directory
3. Copy credentials to environment variables

## Usage Example

```bash
# Start backend (Terminal 1)
cd Backend
npm install
npm run dev

# Start frontend (Terminal 2)
cd Frontend
npm install
npm run dev

# Open browser
# Visit http://localhost:5173
```

## Features in Detail

### AI Question Generation
- GPT-4 powered question generation
- Contextual questions based on job role and difficulty
- Mix of behavioral, technical, and situational questions
- Prevents duplicate questions in same session

### Response Evaluation
- Instant scoring (0-100)
- Detailed strengths and weaknesses analysis
- Specific improvement recommendations
- Follow-up question suggestions

### Performance Tracking
- Overall session scores
- Question-by-question breakdown
- Personalized recommendations
- Progress over multiple sessions

## Troubleshooting

### Common Issues

**Backend not connecting**:
- Verify OPENAI_API_KEY is set
- Check SUPABASE_URL and credentials
- Ensure backend is running on port 5000

**Frontend can't reach backend**:
- Verify VITE_API_URL in Frontend/.env.local
- Check CORS settings in backend
- Ensure backend is running

**Supabase connection errors**:
- Verify credentials are correct
- Check Supabase project is active
- Ensure network connectivity

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

---

**Last Updated**: March 2026
**Version**: 1.0.0
