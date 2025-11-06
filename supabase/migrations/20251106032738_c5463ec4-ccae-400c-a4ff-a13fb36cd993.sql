-- Create vocabulary table
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word TEXT NOT NULL,
  translation TEXT NOT NULL,
  pronunciation TEXT,
  example TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Intermediate', 'Hard', 'UltraHard')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create phrasal_verbs table
CREATE TABLE IF NOT EXISTS public.phrasal_verbs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verb TEXT NOT NULL,
  translation TEXT NOT NULL,
  example TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Intermediate', 'Hard', 'UltraHard')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS public.conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  dialogue JSONB NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Intermediate', 'Hard', 'UltraHard')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create games table
CREATE TABLE IF NOT EXISTS public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Intermediate', 'Hard', 'UltraHard')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create user_stats table for tracking progress
CREATE TABLE IF NOT EXISTS public.user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  words_learned INTEGER DEFAULT 0,
  games_completed INTEGER DEFAULT 0,
  phrasal_verbs_learned INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  total_study_days INTEGER DEFAULT 0,
  level_progress INTEGER DEFAULT 0,
  subscription_tier TEXT DEFAULT 'noob' CHECK (subscription_tier IN ('noob', 'basic', 'medium', 'pro')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phrasal_verbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for vocabulary (public read access)
CREATE POLICY "Anyone can read vocabulary"
  ON public.vocabulary
  FOR SELECT
  USING (true);

-- RLS Policies for phrasal_verbs (public read access)
CREATE POLICY "Anyone can read phrasal verbs"
  ON public.phrasal_verbs
  FOR SELECT
  USING (true);

-- RLS Policies for conversations (public read access)
CREATE POLICY "Anyone can read conversations"
  ON public.conversations
  FOR SELECT
  USING (true);

-- RLS Policies for games (public read access)
CREATE POLICY "Anyone can read games"
  ON public.games
  FOR SELECT
  USING (true);

-- RLS Policies for user_stats (users can only see their own stats)
CREATE POLICY "Users can view own stats"
  ON public.user_stats
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own stats"
  ON public.user_stats
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats"
  ON public.user_stats
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_vocabulary_difficulty ON public.vocabulary(difficulty);
CREATE INDEX idx_phrasal_verbs_difficulty ON public.phrasal_verbs(difficulty);
CREATE INDEX idx_conversations_difficulty ON public.conversations(difficulty);
CREATE INDEX idx_games_difficulty ON public.games(difficulty);
CREATE INDEX idx_user_stats_user_id ON public.user_stats(user_id);