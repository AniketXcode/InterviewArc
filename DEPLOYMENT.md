# InterviewArc Deployment Guide

Complete guide for deploying InterviewArc to production on Vercel.

## Prerequisites

- GitHub account with repository pushed
- Vercel account
- OpenAI API key with GPT-4 access
- Supabase account with PostgreSQL database

## Step 1: Setup Supabase Database

### Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Select your organization and region
4. Set a strong database password
5. Wait for project to initialize (2-3 minutes)

### Get Credentials

1. Go to Project Settings > API
2. Copy and save:
   - Project URL (SUPABASE_URL)
   - Anon Public Key (SUPABASE_ANON_KEY)
   - Service Role Key (SUPABASE_SERVICE_ROLE_KEY)

### Run Database Migrations

1. In Supabase dashboard, go to SQL Editor
2. Create a new query and run the migration from `supabase/migrations/20260305164436_01_create_initial_schema.sql`
3. Verify tables are created: interviews, interview_questions, interview_responses

## Step 2: Setup OpenAI

1. Go to [platform.openai.com](https://platform.openai.com)
2. Create API key
3. Ensure you have GPT-4 access (may require payment account)
4. Copy your API key (OPENAI_API_KEY)

## Step 3: Deploy to Vercel

### Option A: GitHub Integration (Recommended)

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Click "Import"

3. **Configure Build Settings**:
   - Framework Preset: Other
   - Build Command: `cd Frontend && npm install && npm run build`
   - Output Directory: `Frontend/dist`
   - Install Command: `npm install`

4. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add each variable from below
   - Make sure they're set for Production environment

### Option B: Manual Deploy

```bash
npm install -g vercel
vercel login
vercel deploy
```

## Step 4: Set Environment Variables in Vercel

In Vercel Project Settings > Environment Variables, add:

```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-domain.vercel.app
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=https://your-backend-api.vercel.app/api
```

## Step 5: Configure Backend Deployment

Since InterviewArc has both frontend and backend:

### Option A: Deploy Backend Separately

1. Create `vercel.json` in Backend directory:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "src/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "src/server.js"
    }
  ]
}
```

2. Deploy backend:
```bash
cd Backend
vercel deploy --prod
```

3. Update frontend VITE_API_URL to point to backend URL

### Option B: Use Vercel's experimentalServices (Recommended for v0)

The project uses the existing `vercel.json` configuration which handles the integration.

## Step 6: Update CORS Settings

After deployment, update backend CORS settings:

1. In Backend `src/server.js`
2. Update `FRONTEND_URL` environment variable to your production frontend URL
3. Redeploy backend

## Step 7: Test Deployment

1. Visit your Vercel frontend URL
2. Try signing up/logging in
3. Create a practice interview
4. Verify AI question generation works
5. Submit a response and verify evaluation works
6. Check interview history saves correctly

## Step 8: Configure Custom Domain (Optional)

1. In Vercel dashboard, go to Settings > Domains
2. Add your custom domain
3. Update DNS settings with Vercel records
4. Wait for DNS propagation (can take up to 48 hours)

## Monitoring & Maintenance

### View Logs

**Frontend Logs**:
- In Vercel dashboard, go to Deployments
- Click on deployment
- Go to Logs tab

**Backend Logs**:
- Same process if backend deployed separately
- Or use Vercel's function logs

### Update Environment Variables

1. Go to Vercel Project Settings > Environment Variables
2. Edit the variable
3. Save and redeploy

### Redeploy

```bash
# Simple redeploy
git push origin main

# Or manual
vercel deploy --prod
```

## Troubleshooting

### Frontend Won't Load

**Issue**: 404 error or blank page

**Solutions**:
- Check build logs in Vercel dashboard
- Verify build command: `cd Frontend && npm install && npm run build`
- Check Frontend/dist folder was created

### Backend API Not Responding

**Issue**: 502 or 503 errors from API

**Solutions**:
- Check backend environment variables are set
- Verify OpenAI API key is valid
- Check Supabase connection string
- Review backend logs in Vercel

### OpenAI API Errors

**Issue**: "Invalid API key" or quota exceeded

**Solutions**:
- Verify API key is correct
- Check account has sufficient credits
- Ensure GPT-4 is enabled for your account

### Database Connection Errors

**Issue**: "Supabase connection failed"

**Solutions**:
- Verify SUPABASE_URL and keys are correct
- Check Supabase project is active
- Verify migrations were run
- Check network/firewall allows connections

### CORS Errors

**Issue**: Browser console shows CORS error

**Solutions**:
- Update FRONTEND_URL in backend environment
- Ensure backend CORS settings include frontend domain
- Check backend is responding to OPTIONS requests

## Performance Optimization

### Frontend

- Vite builds are already optimized
- Images are lazy loaded
- Code splitting is automatic

### Backend

- Database queries are indexed
- Results are cached where possible
- Connection pooling via Supabase

### Database

- Indexes on frequently queried columns
- Partitioning for large tables

## Security Considerations

1. **API Keys**: Never commit .env files, use Vercel's environment variables
2. **CORS**: Restrict to your frontend domain only
3. **Rate Limiting**: Consider adding rate limiting to prevent abuse
4. **Input Validation**: All inputs are validated server-side
5. **Database**: Use Row Level Security (RLS) for additional protection

## Scaling

### If you need more capacity:

1. **OpenAI**: Upgrade to higher rate limits
2. **Supabase**: Upgrade to higher tier
3. **Vercel**: Upgrade plan for more serverless function invocations

## Rollback

If deployment has issues:

```bash
# Revert to previous deployment
vercel rollback

# Or redeploy specific commit
git checkout <commit-hash>
git push origin main
```

## Support

- Check Vercel docs: https://vercel.com/docs
- Check Supabase docs: https://supabase.com/docs
- Check OpenAI docs: https://platform.openai.com/docs

## Deployment Checklist

- [ ] Supabase project created with migrations run
- [ ] OpenAI API key obtained with GPT-4 access
- [ ] Repository pushed to GitHub
- [ ] Vercel account created
- [ ] Frontend and backend built and tested locally
- [ ] Environment variables set in Vercel
- [ ] Build and deployment commands configured
- [ ] Domain configured (if using custom domain)
- [ ] All features tested in production
- [ ] Monitoring and logging setup
- [ ] Backup strategy planned

## Next Steps

1. Monitor application performance
2. Gather user feedback
3. Plan feature enhancements
4. Setup analytics (optional)
5. Implement user support system
