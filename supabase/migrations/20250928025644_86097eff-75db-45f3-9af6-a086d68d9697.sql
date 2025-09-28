-- Create achievements table
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL, -- 'words_learned', 'games_completed', 'streak', 'study_days'
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_achievements table to track which achievements users have earned
CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Enable Row Level Security
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Achievements are viewable by everyone
CREATE POLICY "Achievements are viewable by everyone" 
ON public.achievements 
FOR SELECT 
USING (true);

-- Users can view their own achievements
CREATE POLICY "Users can view their own achievements" 
ON public.user_achievements 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own achievements
CREATE POLICY "Users can insert their own achievements" 
ON public.user_achievements 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Insert some default achievements
INSERT INTO public.achievements (title, description, icon, requirement_type, requirement_value) VALUES
('Primera Palabra', 'Aprende tu primera palabra', 'BookOpen', 'words_learned', 1),
('10 Palabras', 'Aprende 10 palabras', 'BookOpen', 'words_learned', 10),
('50 Palabras', 'Aprende 50 palabras', 'BookOpen', 'words_learned', 50),
('100 Palabras', 'Aprende 100 palabras', 'Trophy', 'words_learned', 100),
('250 Palabras', 'Aprende 250 palabras', 'Crown', 'words_learned', 250),
('Primer Juego', 'Completa tu primer juego', 'Target', 'games_completed', 1),
('5 Juegos', 'Completa 5 juegos', 'Target', 'games_completed', 5),
('20 Juegos', 'Completa 20 juegos', 'Trophy', 'games_completed', 20),
('Racha de 3 días', 'Mantén una racha de 3 días', 'Target', 'current_streak', 3),
('Racha de 7 días', 'Mantén una racha de 7 días', 'Trophy', 'current_streak', 7),
('Racha de 30 días', 'Mantén una racha de 30 días', 'Crown', 'current_streak', 30),
('7 Días de Estudio', 'Estudia durante 7 días en total', 'Calendar', 'total_study_days', 7),
('30 Días de Estudio', 'Estudia durante 30 días en total', 'Calendar', 'total_study_days', 30);