-- Create vocabulary table
CREATE TABLE public.vocabulary (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  word text NOT NULL,
  translation text NOT NULL,
  example text NOT NULL,
  level text NOT NULL CHECK (level IN ('Easy', 'Intermediate', 'Hard', 'UltraHard')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create phrasal verbs table
CREATE TABLE public.phrasal_verbs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  verb text NOT NULL,
  meaning text NOT NULL,
  example text NOT NULL,
  level text NOT NULL CHECK (level IN ('Easy', 'Intermediate', 'Hard', 'UltraHard')),
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create game questions table
CREATE TABLE public.game_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  game_type text NOT NULL CHECK (game_type IN ('word_match', 'fill_blanks', 'speed_words')),
  question text NOT NULL,
  correct_answer text NOT NULL,
  options jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create daily content rotation table
CREATE TABLE public.daily_content (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_date date NOT NULL DEFAULT CURRENT_DATE,
  content_type text NOT NULL CHECK (content_type IN ('vocabulary', 'phrasal_verbs', 'game_questions')),
  content_ids jsonb NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(content_date, content_type)
);

-- Enable RLS
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phrasal_verbs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_content ENABLE ROW LEVEL SECURITY;

-- Create policies (everyone can view)
CREATE POLICY "Anyone can view vocabulary" ON public.vocabulary FOR SELECT USING (true);
CREATE POLICY "Anyone can view phrasal verbs" ON public.phrasal_verbs FOR SELECT USING (true);
CREATE POLICY "Anyone can view game questions" ON public.game_questions FOR SELECT USING (true);
CREATE POLICY "Anyone can view daily content" ON public.daily_content FOR SELECT USING (true);

-- Insert initial vocabulary data (Easy level)
INSERT INTO public.vocabulary (word, translation, example, level) VALUES
('Hello', 'Hola', 'Hello, how are you?', 'Easy'),
('Goodbye', 'Adiós', 'Goodbye, see you later!', 'Easy'),
('Thank you', 'Gracias', 'Thank you for your help', 'Easy'),
('Please', 'Por favor', 'Please help me', 'Easy'),
('Yes', 'Sí', 'Yes, I agree', 'Easy'),
('No', 'No', 'No, I disagree', 'Easy'),
('Water', 'Agua', 'I need water', 'Easy'),
('Food', 'Comida', 'The food is delicious', 'Easy'),
('House', 'Casa', 'My house is big', 'Easy'),
('Car', 'Coche', 'I have a new car', 'Easy');

-- Insert initial vocabulary data (Intermediate level)
INSERT INTO public.vocabulary (word, translation, example, level) VALUES
('Achievement', 'Logro', 'This is a great achievement', 'Intermediate'),
('Opportunity', 'Oportunidad', 'This is a good opportunity', 'Intermediate'),
('Challenge', 'Desafío', 'This is a big challenge', 'Intermediate'),
('Knowledge', 'Conocimiento', 'Knowledge is power', 'Intermediate'),
('Success', 'Éxito', 'Success requires hard work', 'Intermediate'),
('Beautiful', 'Hermoso', 'What a beautiful day', 'Intermediate'),
('Strength', 'Fuerza', 'He has great strength', 'Intermediate'),
('Happiness', 'Felicidad', 'Happiness is important', 'Intermediate'),
('Wisdom', 'Sabiduría', 'She has great wisdom', 'Intermediate'),
('Brilliant', 'Brillante', 'That is a brilliant idea', 'Intermediate');

-- Insert initial phrasal verbs (Easy level)
INSERT INTO public.phrasal_verbs (verb, meaning, example, level) VALUES
('Wake up', 'Despertarse', 'I wake up at 7 AM every day', 'Easy'),
('Get up', 'Levantarse', 'I get up early in the morning', 'Easy'),
('Sit down', 'Sentarse', 'Please sit down here', 'Easy'),
('Stand up', 'Ponerse de pie', 'Stand up when the teacher enters', 'Easy'),
('Go out', 'Salir', 'Let''s go out tonight', 'Easy'),
('Come in', 'Entrar', 'Come in, please', 'Easy'),
('Turn on', 'Encender', 'Turn on the lights', 'Easy'),
('Turn off', 'Apagar', 'Turn off your phone', 'Easy'),
('Look at', 'Mirar', 'Look at the board', 'Easy'),
('Listen to', 'Escuchar', 'Listen to the music', 'Easy');

-- Insert initial phrasal verbs (Intermediate level)
INSERT INTO public.phrasal_verbs (verb, meaning, example, level) VALUES
('Give up', 'Rendirse', 'Don''t give up on your dreams', 'Intermediate'),
('Look forward to', 'Esperar con ansias', 'I look forward to seeing you', 'Intermediate'),
('Get along with', 'Llevarse bien con', 'I get along with my colleagues', 'Intermediate'),
('Run out of', 'Quedarse sin', 'We ran out of milk', 'Intermediate'),
('Put off', 'Posponer', 'Don''t put off your homework', 'Intermediate'),
('Take off', 'Despegar/Quitarse', 'The plane takes off at 10 PM', 'Intermediate'),
('Figure out', 'Resolver/Entender', 'I need to figure out this problem', 'Intermediate'),
('Carry on', 'Continuar', 'Please carry on with your work', 'Intermediate'),
('Bring up', 'Mencionar/Criar', 'She brought up an important point', 'Intermediate'),
('Call off', 'Cancelar', 'They called off the meeting', 'Intermediate');

-- Insert game questions (Word Match)
INSERT INTO public.game_questions (game_type, question, correct_answer, options) VALUES
('word_match', 'Selecciona la traducción correcta de ''Achievement''', 'Logro', '["Logro", "Intento", "Problema", "Solución"]'),
('word_match', '¿Qué significa ''Brilliant''?', 'Brillante', '["Oscuro", "Brillante", "Pequeño", "Grande"]'),
('word_match', 'Traducción de ''Opportunity''', 'Oportunidad', '["Problema", "Oportunidad", "Dificultad", "Obstáculo"]'),
('word_match', '¿Qué significa ''Challenge''?', 'Desafío', '["Desafío", "Facilidad", "Rutina", "Aburrimiento"]'),
('word_match', 'Traducción de ''Success''', 'Éxito', '["Fracaso", "Éxito", "Intento", "Pérdida"]'),
('word_match', '¿Qué significa ''Knowledge''?', 'Conocimiento', '["Ignorancia", "Conocimiento", "Duda", "Confusión"]'),
('word_match', 'Traducción de ''Beautiful''', 'Hermoso', '["Feo", "Hermoso", "Ordinario", "Simple"]'),
('word_match', '¿Qué significa ''Strength''?', 'Fuerza', '["Debilidad", "Fuerza", "Cansancio", "Pereza"]'),
('word_match', 'Traducción de ''Happiness''', 'Felicidad', '["Tristeza", "Felicidad", "Enojo", "Miedo"]'),
('word_match', '¿Qué significa ''Wisdom''?', 'Sabiduría', '["Tontería", "Sabiduría", "Ignorancia", "Duda"]');

-- Insert game questions (Fill Blanks)
INSERT INTO public.game_questions (game_type, question, correct_answer, options) VALUES
('fill_blanks', 'I ___ to school every day', 'go', '["go", "goes", "going", "gone"]'),
('fill_blanks', 'She ___ a book right now', 'is reading', '["read", "reads", "is reading", "was reading"]'),
('fill_blanks', 'They ___ to the party yesterday', 'went', '["go", "went", "going", "gone"]'),
('fill_blanks', 'I ___ English for 5 years', 'have studied', '["study", "studied", "have studied", "studying"]'),
('fill_blanks', 'He ___ his homework when I called', 'was doing', '["do", "did", "was doing", "does"]'),
('fill_blanks', 'We ___ a new house next month', 'will buy', '["buy", "bought", "will buy", "buying"]'),
('fill_blanks', 'She ___ in London since 2010', 'has lived', '["live", "lived", "has lived", "living"]'),
('fill_blanks', 'They ___ tennis every weekend', 'play', '["play", "plays", "playing", "played"]'),
('fill_blanks', 'I ___ my keys yesterday', 'lost', '["lose", "lost", "losing", "losed"]'),
('fill_blanks', 'He ___ to music now', 'is listening', '["listen", "listens", "is listening", "listened"]');

-- Insert game questions (Speed Words)
INSERT INTO public.game_questions (game_type, question, correct_answer, options) VALUES
('speed_words', 'Rápido: ''Book''', 'Libro', '["Libro", "Mesa", "Casa", "Perro"]'),
('speed_words', 'Quick! ''Water''', 'Agua', '["Fuego", "Aire", "Agua", "Tierra"]'),
('speed_words', 'Veloz: ''Car''', 'Coche', '["Bicicleta", "Coche", "Avión", "Barco"]'),
('speed_words', 'Fast! ''Dog''', 'Perro', '["Gato", "Perro", "Pájaro", "Pez"]'),
('speed_words', 'Rápido: ''House''', 'Casa', '["Casa", "Edificio", "Tienda", "Escuela"]'),
('speed_words', 'Quick! ''Food''', 'Comida', '["Bebida", "Comida", "Plato", "Mesa"]'),
('speed_words', 'Veloz: ''Sun''', 'Sol', '["Luna", "Estrella", "Sol", "Planeta"]'),
('speed_words', 'Fast! ''Tree''', 'Árbol', '["Flor", "Árbol", "Planta", "Hierba"]'),
('speed_words', 'Rápido: ''Phone''', 'Teléfono', '["Computadora", "Teléfono", "Tableta", "Reloj"]'),
('speed_words', 'Quick! ''Friend''', 'Amigo', '["Enemigo", "Amigo", "Familiar", "Extraño"]');