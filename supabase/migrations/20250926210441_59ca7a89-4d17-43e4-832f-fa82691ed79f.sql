-- Update the handle_new_user function to also create initial stats
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1))
  );
  
  -- Create initial stats (all at 0) if user_stats table exists
  INSERT INTO public.user_stats (user_id, words_learned, games_completed, phrasal_verbs_learned, current_streak, total_study_days, level_progress)
  VALUES (NEW.id, 0, 0, 0, 0, 0, 0)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;