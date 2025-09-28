-- Add phrasal verbs tracking to daily usage
ALTER TABLE public.daily_usage 
ADD COLUMN phrasal_verbs_learned_today INTEGER DEFAULT 0;

-- Insert phrasal verb achievements
INSERT INTO public.achievements (id, title, description, icon, requirement_type, requirement_value) VALUES
(gen_random_uuid(), 'Primer Verbo Frasal', 'Aprende tu primer phrasal verb', '🎯', 'phrasal_verbs_learned', 1),
(gen_random_uuid(), 'Phrasal Master', 'Aprende 10 phrasal verbs', '⚡', 'phrasal_verbs_learned', 10),
(gen_random_uuid(), 'Experto en Verbos', 'Aprende 25 phrasal verbs', '🏆', 'phrasal_verbs_learned', 25),
(gen_random_uuid(), 'Phrasal Legend', 'Aprende 50 phrasal verbs', '👑', 'phrasal_verbs_learned', 50),
(gen_random_uuid(), 'Phrasal God', 'Aprende 100 phrasal verbs', '🔥', 'phrasal_verbs_learned', 100);