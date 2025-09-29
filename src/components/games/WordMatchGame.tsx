import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, RefreshCw, CheckCircle, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WordMatchGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

const wordBank = [
  { question: "Selecciona la traducción correcta de 'Achievement'", options: ["Logro", "Intento", "Problema", "Solución"], correct: "Logro" },
  { question: "¿Qué significa 'Brilliant'?", options: ["Oscuro", "Brillante", "Pequeño", "Grande"], correct: "Brillante" },
  { question: "Traducción de 'Opportunity'", options: ["Problema", "Oportunidad", "Dificultad", "Obstáculo"], correct: "Oportunidad" },
  { question: "¿Qué significa 'Challenge'?", options: ["Desafío", "Facilidad", "Rutina", "Aburrimiento"], correct: "Desafío" },
  { question: "Traducción de 'Success'", options: ["Fracaso", "Éxito", "Intento", "Pérdida"], correct: "Éxito" },
  { question: "¿Qué significa 'Knowledge'?", options: ["Ignorancia", "Conocimiento", "Duda", "Confusión"], correct: "Conocimiento" },
  { question: "Traducción de 'Beautiful'", options: ["Feo", "Hermoso", "Ordinario", "Simple"], correct: "Hermoso" },
  { question: "¿Qué significa 'Strength'?", options: ["Debilidad", "Fuerza", "Cansancio", "Pereza"], correct: "Fuerza" },
  { question: "Traducción de 'Happiness'", options: ["Tristeza", "Felicidad", "Enojo", "Miedo"], correct: "Felicidad" },
  { question: "¿Qué significa 'Wisdom'?", options: ["Tontería", "Sabiduría", "Ignorancia", "Duda"], correct: "Sabiduría" },
];

const getRandomQuestions = (count: number) => {
  const today = new Date().toDateString();
  let seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  const shuffled = [...wordBank].sort(() => {
    const random = Math.sin(seed++) * 10000;
    return random - Math.floor(random);
  });
  
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const WordMatchGame = ({ onComplete, onReset }: WordMatchGameProps) => {
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<typeof wordBank>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuestions(getRandomQuestions(5));
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      const gameTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(gameTimer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimer(gameTimer);

      return () => clearInterval(gameTimer);
    }
  }, [currentQuestion, questions]);

  const handleTimeUp = () => {
    if (!showResult) {
      setShowResult(true);
      toast({
        title: "¡Tiempo agotado!",
        description: "Se acabó el tiempo para esta pregunta.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        moveCurrentQuestionToEndAndContinue();
      }, 2000);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    if (timer) clearInterval(timer);
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === questions[currentQuestion].correct;
    if (isCorrect) {
      setScore(score + 10);
      toast({
        title: "¡Correcto!",
        description: "Respuesta correcta. +10 puntos",
      });
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      toast({
        title: "Incorrecto",
        description: `La respuesta correcta es: ${questions[currentQuestion].correct}`,
        variant: "destructive",
      });
      setTimeout(() => {
        moveCurrentQuestionToEndAndContinue();
      }, 2500);
    }
  };

  const moveCurrentQuestionToEndAndContinue = () => {
    const updatedQuestions = [...questions];
    const currentQ = updatedQuestions[currentQuestion];
    updatedQuestions.splice(currentQuestion, 1);
    updatedQuestions.push(currentQ);
    setQuestions(updatedQuestions);
    
    if (currentQuestion >= updatedQuestions.length - 1) {
      onComplete(score);
    } else {
      resetForNextQuestion();
    }
  };

  const resetForNextQuestion = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setTimeLeft(30);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      resetForNextQuestion();
    } else {
      onComplete(score);
    }
  };

  const getAnswerStyle = (option: string) => {
    if (!showResult) return "hover:bg-accent/50";
    if (option === questions[currentQuestion].correct) return "bg-success text-success-foreground";
    if (option === selectedAnswer && option !== questions[currentQuestion].correct) {
      return "bg-destructive text-destructive-foreground";
    }
    return "bg-muted";
  };

  if (questions.length === 0) return null;

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Card className="shadow-learning-lg">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-primary">
              <Trophy className="h-5 w-5 mr-1" />
              <span className="font-bold">{score} pts</span>
            </div>
            <div className="flex items-center text-warning">
              <Clock className="h-5 w-5 mr-1" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
          </div>
          <Button onClick={onReset} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Reiniciar
          </Button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progreso</span>
            <span className="text-sm text-muted-foreground">
              Pregunta {currentQuestion + 1} de {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <CardTitle className="text-xl text-center">
          {questions[currentQuestion].question}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {questions[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              variant="outline"
              className={`h-16 text-lg ${getAnswerStyle(option)}`}
              disabled={showResult}
            >
              {option}
              {showResult && option === questions[currentQuestion].correct && (
                <CheckCircle className="h-5 w-5 ml-2" />
              )}
              {showResult && option === selectedAnswer && option !== questions[currentQuestion].correct && (
                <X className="h-5 w-5 ml-2" />
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
