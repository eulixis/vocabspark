-- Replace the function (no need to drop, CREATE OR REPLACE handles it)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create game_questions table
CREATE TABLE IF NOT EXISTS public.game_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_type TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Intermediate', 'Hard', 'UltraHard')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.game_questions ENABLE ROW LEVEL SECURITY;

-- RLS Policy for game_questions (public read)
CREATE POLICY "Anyone can read game questions"
  ON public.game_questions
  FOR SELECT
  USING (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_game_questions_difficulty ON public.game_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_game_questions_game_type ON public.game_questions(game_type);