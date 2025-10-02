import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface TranslationChallengeGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

export const TranslationChallengeGame = ({ onComplete, onReset }: TranslationChallengeGameProps) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(90);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<Array<{ spanish: string; english: string; alternatives?: string[] }>>([]);
  const { toast } = useToast();

  const questionBank = [
    { spanish: "Hola, ¿cómo estás?", english: "hello how are you", alternatives: ["hi how are you", "hello how do you do"] },
    { spanish: "Me gusta estudiar inglés", english: "i like to study english", alternatives: ["i like studying english", "i enjoy studying english"] },
    { spanish: "Ella es mi mejor amiga", english: "she is my best friend", alternatives: ["she's my best friend"] },
    { spanish: "Vamos al cine esta noche", english: "we are going to the cinema tonight", alternatives: ["we're going to the movies tonight", "let's go to the cinema tonight"] },
    { spanish: "El gato está durmiendo", english: "the cat is sleeping", alternatives: [] },
    { spanish: "Quiero aprender más", english: "i want to learn more", alternatives: ["i would like to learn more"] },
    { spanish: "Hace mucho calor hoy", english: "it is very hot today", alternatives: ["it's very hot today"] },
    { spanish: "Necesito ayuda con esto", english: "i need help with this", alternatives: [] },
    { spanish: "¿Dónde está el baño?", english: "where is the bathroom", alternatives: ["where's the restroom", "where is the toilet"] },
    { spanish: "Gracias por tu ayuda", english: "thank you for your help", alternatives: ["thanks for your help"] }
  ];

  useEffect(() => {
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 6));
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleComplete();
    }
  }, [timeLeft, questions]);

  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[¿?¡!.,]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  };

  const handleCheck = () => {
    const current = questions[currentQuestion];
    const normalized = normalizeText(userAnswer);
    const correctAnswers = [current.english, ...(current.alternatives || [])];
    const isCorrect = correctAnswers.some(answer => normalizeText(answer) === normalized);
    
    setShowResult(true);
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 15);
      const points = 25 + timeBonus;
      setScore(score + points);
      
      toast({
        title: "¡Excelente! 🎉",
        description: `+${points} puntos (${timeBonus} bonus de tiempo)`,
      });
    } else {
      toast({
        title: "Incorrecto ❌",
        description: `Respuesta correcta: "${current.english}"`,
        variant: "destructive",
      });
    }

    setTimeout(() => {
      setShowResult(false);
      setUserAnswer("");
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        handleComplete();
      }
    }, 2500);
  };

  const handleComplete = () => {
    onComplete(score);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim() && !showResult) {
      handleCheck();
    }
  };

  if (questions.length === 0) {
    return <div className="text-center p-8">Cargando preguntas...</div>;
  }

  const current = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Puntuación: {score}
        </Badge>
        <Badge variant={timeLeft < 30 ? "destructive" : "default"} className="text-lg px-4 py-2">
          ⏱️ {timeLeft}s
        </Badge>
      </div>

      <Progress value={progress} className="h-3" />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Pregunta {currentQuestion + 1} de {questions.length}</p>
              <h3 className="text-2xl font-bold mb-4">Traduce al inglés</h3>
              <p className="text-3xl font-bold text-primary mb-6">{current.spanish}</p>
            </div>

            <div className="space-y-4">
              <Input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Escribe tu traducción aquí..."
                disabled={showResult}
                className="text-lg p-6"
                autoFocus
              />

              <Button
                onClick={handleCheck}
                disabled={!userAnswer.trim() || showResult}
                className="w-full text-lg py-6"
                size="lg"
              >
                Verificar
              </Button>
            </div>

            {showResult && (
              <div className={`p-4 rounded-lg text-center ${
                normalizeText(userAnswer) === normalizeText(current.english) 
                  ? "bg-green-500/20 text-green-700 dark:text-green-300" 
                  : "bg-red-500/20 text-red-700 dark:text-red-300"
              }`}>
                <p className="font-semibold">
                  {normalizeText(userAnswer) === normalizeText(current.english) 
                    ? "¡Correcto!" 
                    : `Respuesta correcta: "${current.english}"`}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
