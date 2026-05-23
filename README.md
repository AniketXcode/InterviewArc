# InterviewArc

InterviewArc is a full-stack AI interview preparation platform that helps candidates practice realistic mock interviews, analyze resumes, review detailed performance reports, and earn rewards for consistent practice.

The project is built with a React/Vite frontend and an Express/MongoDB backend. It includes resume parsing, AI-generated interview questions, timed answer evaluation, voice interview support, Razorpay credit purchases, reward coins, badges, leaderboard, and admin reward-order management.

## Features

- AI mock interviews for HR and Technical rounds
- Resume upload and PDF text extraction
- Optional job-description based ATS score and resume feedback
- Role, experience, question count, and interview duration setup
- Dynamic interview difficulty progression
- Timed questions with answer submission and scoring
- AI feedback across confidence, communication, and correctness
- Interview history and detailed report pages
- Resume builder with PDF export support
- Voice interview support through browser speech, Vapi, HeadTTS, ElevenLabs, and optional Tavus visual sessions
- Credit-based usage model
- Razorpay checkout for buying interview credits
- Rewards system with coins, XP, levels, badges, streaks, unlockable packs, consumables, and merch orders
- Leaderboard and rewards hub
- Admin panel for reward order status management
- Google and email/password authentication
- Welcome, interview report, and reward notification emails
- SEO helpers, static page generation, analytics hooks, and PWA assets

## Tech Stack

### Frontend

- React 19
- Vite 7
- React Router 7
- Redux Toolkit
- Tailwind CSS 4
- Motion
- Axios
- Firebase Authentication
- Vapi Web SDK
- Daily JS
- HeadTTS
- jsPDF and jsPDF AutoTable
- Recharts
- React Icons
- React Joyride

### Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- JWT authentication
- Cookie-based and bearer-token auth support
- Multer for resume uploads
- pdfjs-dist for PDF parsing
- OpenRouter for AI generation and scoring
- Razorpay for payments
- Nodemailer for transactional emails
- ElevenLabs and Tavus integrations

## Project Structure

```text
InterviewArc/
  client/
    public/
      manifest.webmanifest
      sw.js
    scripts/
      generate-static-pages.mjs
    src/
      assets/
      components/
      context/
      data/
      pages/
      redux/
      utils/
      App.jsx
      main.jsx
    package.json
    vite.config.js
  server/
    config/
    controllers/
    middlewares/
    models/
    routes/
    services/
    utils/
    index.js
    package.json
```

## Prerequisites

- Node.js 20 or newer recommended
- npm
- MongoDB database URL
- OpenRouter API key
- Firebase project for Google authentication
- Razorpay account for paid credit packs
- Optional voice/video provider keys for Vapi, ElevenLabs, Tavus, and HeadTTS configuration
- SMTP credentials for production email delivery

## Getting Started

Clone the repository and install dependencies in both apps:

```bash
git clone <your-repository-url>
cd InterviewArc

cd server
npm install

cd ../client
npm install
```

Create environment files:

```bash
cd ../server
cp .env.example .env

cd ../client
cp .env.example .env
```

This repository does not currently include example env files, so you can create them manually using the variables listed below.

## Environment Variables

### Server `.env`

Create `server/.env`:

```env
PORT=8000
NODE_ENV=development

MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/interviewarc
JWT_SECRET=replace_with_a_long_random_secret

CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://localhost:5173,http://127.0.0.1:5173

OPENROUTER_API_KEY=your_openrouter_api_key

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM="InterviewArc AI <noreply@example.com>"

ADMIN_EMAILS=admin@example.com
ADMIN_NOTIFICATION_EMAILS=admin@example.com

TAVUS_ENABLED=false
TAVUS_API_KEY=
TAVUS_PERSONA_ID=
TAVUS_REPLICA_ID=

ELEVENLABS_API_KEY=
ELEVENLABS_VOICE_ID=JBFqnCBsd6RMkjVDRZzb
ELEVENLABS_MODEL_ID=eleven_flash_v2_5
ELEVENLABS_OUTPUT_FORMAT=mp3_44100_128
ELEVENLABS_VOICE_GENDER=female

DEV_TEST_TOOLS_ENABLED=false
```

Important: the backend defaults to port `6000`, while the frontend development fallback points to `http://localhost:8000`. For the smoothest local setup, either set `PORT=8000` in `server/.env` or set `VITE_SERVER_URL=http://localhost:6000` in `client/.env`.

### Client `.env`

Create `client/.env`:

```env
VITE_SERVER_URL=http://localhost:8000

VITE_FIREBASE_APIKEY=your_firebase_web_api_key

VITE_RAZORPAY_KEY_ID=your_razorpay_key_id

VITE_VAPI_PUBLIC_KEY=
VITE_VAPI_ASSISTANT_ID=
VITE_VAPI_USE_EXISTING_ASSISTANT=false
VITE_VAPI_VOICE_PROVIDER=vapi
VITE_VAPI_VOICE_ID=Elliot
VITE_VAPI_VOICE_GENDER=male
VITE_VAPI_TRANSCRIBER_PROVIDER=deepgram
VITE_VAPI_TRANSCRIBER_MODEL=nova-2
VITE_VAPI_TRANSCRIBER_LANGUAGE=hi
VITE_VAPI_MODEL_PROVIDER=openai
VITE_VAPI_MODEL_NAME=gpt-4.1-mini

VITE_SPEECH_RECOGNITION_LANGUAGE=hi-IN

VITE_TAVUS_ENABLED=false

VITE_HEADTTS_ENABLED=true
VITE_HEADTTS_VOICE=af_bella
VITE_HEADTTS_PRELOAD_VOICES=
VITE_HEADTTS_SPEED=1

VITE_GA_MEASUREMENT_ID=
VITE_PLAUSIBLE_DOMAIN=
VITE_MONITORING_ENDPOINT=
VITE_SENTRY_DSN=

VITE_DEV_TEST_TOOLS=false
```

## Running Locally

Start the backend:

```bash
cd server
npm run dev
```

Start the frontend in a second terminal:

```bash
cd client
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```text
http://localhost:5173
```

## Available Scripts

### Client

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the production frontend and runs static page generation.

```bash
npm run preview
```

Serves the production build locally.

```bash
npm run lint
```

Runs ESLint across the client source.

### Server

```bash
npm run dev
```

Starts the Express server with nodemon.

```bash
npm start
```

Starts the Express server with Node.

## Main Application Routes

### Frontend Routes

| Route | Description |
| --- | --- |
| `/` | Home page |
| `/auth` | Authentication page |
| `/interview` | Guided mock interview workspace |
| `/history` | Past interview sessions |
| `/report/:id` | Detailed interview report |
| `/pricing` | Credit plans and Razorpay checkout |
| `/resume-builder` | Resume builder |
| `/rewards` | Rewards hub, store, leaderboard, and orders |
| `/resources` | Blog/resources listing |
| `/resources/:slug` | Blog article page |
| `/admin/reward-orders` | Admin reward-order management |

### Backend API Routes

Base URL in development:

```text
http://localhost:8000
```

#### Auth

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Create an email/password account |
| `POST` | `/api/auth/login` | Login with email/password |
| `POST` | `/api/auth/google` | Login or create account with Google profile data |
| `GET` | `/api/auth/logout` | Clear auth cookie |

#### User and Rewards

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/user/current-user` | Get authenticated user profile |
| `GET` | `/api/user/rewards` | Get rewards overview |
| `GET` | `/api/user/leaderboard` | Get top users and current user ranking |
| `GET` | `/api/user/store` | Get store catalog for the current user |
| `POST` | `/api/user/store/purchase` | Purchase a digital reward item |
| `POST` | `/api/user/store/claim-order` | Claim a physical merch reward |
| `GET` | `/api/user/store/orders` | Get the current user's reward orders |
| `GET` | `/api/user/admin/reward-orders` | Admin: list all reward orders |
| `PATCH` | `/api/user/admin/reward-orders/:orderId` | Admin: update order status |
| `POST` | `/api/user/dev/add-test-coins` | Dev tool: add test coins |
| `POST` | `/api/user/dev/enable-admin` | Dev tool: make current user admin |
| `POST` | `/api/user/dev/create-demo-order` | Dev tool: create a demo reward order |

#### Interview

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/interview/resume` | Upload and analyze a resume PDF |
| `POST` | `/api/interview/generate-questions` | Generate AI interview questions |
| `POST` | `/api/interview/submit-answer` | Submit and evaluate an answer |
| `POST` | `/api/interview/finish` | Complete interview and calculate final report/rewards |
| `GET` | `/api/interview/get-interview` | Get current user's interview history |
| `GET` | `/api/interview/report/:id` | Get a detailed interview report |
| `GET` | `/api/interview/elevenlabs/status` | Check ElevenLabs server configuration |
| `POST` | `/api/interview/elevenlabs/speech` | Generate speech audio through ElevenLabs |
| `POST` | `/api/interview/tavus/session` | Create a Tavus conversation |
| `POST` | `/api/interview/tavus/end` | End a Tavus conversation |

#### Payments

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/payment/order` | Create a Razorpay order |
| `POST` | `/api/payment/verify` | Verify Razorpay signature and add credits |

## Authentication

InterviewArc supports:

- Email/password signup and login
- Google login through Firebase on the client
- JWT issued by the backend
- HTTP-only auth cookie for browser requests
- Bearer token fallback for API clients

Admin access is granted when a user's email is listed in `ADMIN_EMAILS` or when the user's role is set to `ADMIN`.

## Interview Flow

1. User signs in.
2. User selects role, experience, interview mode, question count, and duration.
3. User may upload a resume PDF and optional job description.
4. Backend extracts resume text with `pdfjs-dist`.
5. Backend asks OpenRouter to generate structured resume data and interview questions.
6. User answers each timed question.
7. Backend evaluates each answer with AI and stores feedback.
8. User finishes the round.
9. Backend calculates final score, confidence, communication, correctness, rewards, streak, XP, level, and badges.
10. User reviews the report and can revisit history later.

## Rewards System

The rewards system includes:

- Coins earned from completed interviews
- XP and level progression
- Daily streak tracking
- Performance bonuses
- Badges
- Leaderboard
- Unlockable role packs and company packs
- Consumables such as mock interview tickets
- Physical reward/merch order checkout
- Admin order status management

## Payments and Credits

The pricing page includes:

- Free plan with starter credits
- Starter Pack
- Pro Pack

Paid plans create Razorpay orders through the backend. After successful checkout, the backend verifies the Razorpay signature before adding credits to the user account.

## Voice and Video Integrations

InterviewArc can use several speech and video layers:

- Browser speech recognition via `VITE_SPEECH_RECOGNITION_LANGUAGE`
- Vapi for voice runtime and transcription
- HeadTTS for client-side text-to-speech support
- ElevenLabs for server-side premium speech generation
- Tavus for optional visual interviewer conversations

Most of these integrations are optional. The app can run locally with the core AI interview flow as long as MongoDB, JWT, OpenRouter, and basic client/server URLs are configured.

## Email Notifications

The backend uses Nodemailer for:

- Welcome emails
- Interview report emails
- Reward claim/admin notification emails

If SMTP credentials are missing, email sending may be skipped or fail depending on the action. Configure SMTP variables before using production email workflows.

## Deployment Notes

### Frontend

The client can be deployed to Vercel, Netlify, or any static hosting provider:

```bash
cd client
npm run build
```

Deploy the generated `client/dist` directory.

Set all required `VITE_*` variables in your hosting provider dashboard.

### Backend

The server can be deployed to Render, Railway, Fly.io, or another Node hosting platform:

```bash
cd server
npm start
```

Set production environment variables on the server host.

For production cookies, use:

```env
NODE_ENV=production
```

In production, cookies use `secure: true` and `sameSite: "None"`, so HTTPS is required.

### CORS

Allowed origins are defined in `server/index.js`. Defaults include:

- `http://localhost:5173`
- `http://127.0.0.1:5173`
- `http://localhost:4173`
- `http://127.0.0.1:4173`
- `https://interviewarc.tech`
- `https://www.interviewarc.tech`
- `https://interview-arc.vercel.app`

Add additional frontend URLs through:

```env
CLIENT_URLS=https://your-frontend-domain.com,https://www.your-frontend-domain.com
```

## Troubleshooting

### Frontend cannot connect to backend

Check that `VITE_SERVER_URL` matches your backend port. If the server is running on `6000`, set:

```env
VITE_SERVER_URL=http://localhost:6000
```

If you prefer the frontend default, set the backend to:

```env
PORT=8000
```

### CORS error

Add your frontend origin to `CLIENT_URLS` in `server/.env`.

### Login cookie not working in production

Make sure:

- Backend is served over HTTPS
- `NODE_ENV=production`
- Frontend uses the deployed backend URL
- Requests use `withCredentials: true`
- Backend CORS allows the exact frontend origin

### Resume upload fails

Check:

- Uploaded file is a PDF
- File size is under 5 MB
- The server has a writable `public` directory
- `OPENROUTER_API_KEY` is configured

### AI generation fails

Check:

- `OPENROUTER_API_KEY` is valid
- OpenRouter account has access to `openai/gpt-4o-mini`
- Backend logs for `OpenRouter API Error`

### Razorpay checkout fails

Check:

- `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` are set on the server
- `VITE_RAZORPAY_KEY_ID` is set on the client
- Razorpay checkout script is available in the browser
- Payment verification endpoint receives `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`

### Admin pages are forbidden

Add your account email to:

```env
ADMIN_EMAILS=your-email@example.com
```

Then log out and log back in.

## Security Notes

- Never commit `.env` files.
- Keep `JWT_SECRET`, database credentials, payment keys, SMTP credentials, and provider API keys private.
- Use HTTPS in production.
- Restrict `CLIENT_URLS` to trusted frontend domains.
- Disable dev tools in production:

```env
DEV_TEST_TOOLS_ENABLED=false
VITE_DEV_TEST_TOOLS=false
```

## License

The backend package is currently marked as `ISC`. Add a root `LICENSE` file if you want to publish the repository with an explicit open-source license.
