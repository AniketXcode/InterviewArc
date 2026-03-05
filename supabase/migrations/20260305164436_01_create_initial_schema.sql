/*
  # Initialize InterviewArc Database Schema

  1. New Tables
    - `profiles` - User profile information
    - `interviews` - Interview session records
    - `interview_questions` - Questions asked during interviews
    - `interview_responses` - User responses and AI evaluation
    - `feedback_records` - Detailed feedback for each interview

  2. Security
    - Enable RLS on all tables
    - Users can only access their own data
    - Service role can manage all data for backend operations

  3. Indexes
    - Created for frequently queried columns (user_id, created_at)
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  resume_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_role text NOT NULL,
  job_domain text NOT NULL,
  status text DEFAULT 'in_progress',
  overall_score integer DEFAULT 0,
  total_questions integer DEFAULT 0,
  completed_questions integer DEFAULT 0,
  duration_seconds integer DEFAULT 0,
  resume_text text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  question_number integer NOT NULL,
  question_text text NOT NULL,
  question_type text DEFAULT 'behavioral',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS interview_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  question_id uuid NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
  response_text text NOT NULL,
  response_audio_url text,
  duration_seconds integer DEFAULT 0,
  score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS feedback_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id uuid NOT NULL REFERENCES interviews(id) ON DELETE CASCADE,
  response_id uuid NOT NULL REFERENCES interview_responses(id) ON DELETE CASCADE,
  strengths text,
  weaknesses text,
  improvement_tips text,
  communication_score integer DEFAULT 0,
  filler_words integer DEFAULT 0,
  pace_score integer DEFAULT 0,
  clarity_score integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_records ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can create profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own interviews"
  ON interviews FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create interviews"
  ON interviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own interviews"
  ON interviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view questions in own interviews"
  ON interview_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = interview_questions.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create questions in own interviews"
  ON interview_questions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = interview_questions.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view responses in own interviews"
  ON interview_responses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = interview_responses.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create responses in own interviews"
  ON interview_responses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = interview_responses.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view feedback for own interviews"
  ON feedback_records FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = feedback_records.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create feedback for own interviews"
  ON feedback_records FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM interviews
      WHERE interviews.id = feedback_records.interview_id
      AND interviews.user_id = auth.uid()
    )
  );

CREATE INDEX idx_interviews_user_id ON interviews(user_id);
CREATE INDEX idx_interviews_created_at ON interviews(created_at DESC);
CREATE INDEX idx_interview_questions_interview_id ON interview_questions(interview_id);
CREATE INDEX idx_interview_responses_interview_id ON interview_responses(interview_id);
CREATE INDEX idx_feedback_records_interview_id ON feedback_records(interview_id);