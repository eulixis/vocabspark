import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Clock, RefreshCw, CheckCircle, X, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SpeedWordsGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

const speedWordBank = [
  { question: "Rápido: 'Book'", options: ["Libro", "Mesa", "Casa", "Perro"], correct: "Libro" },
  { question: "Quick! 'Water'", options: ["Fuego", "Aire", "Agua", "Tierra"], correct: "Agua" },
  { question: "Veloz: 'Car'", options: ["Bicicleta", "Coche", "Avión", "Barco"], correct: "Coche" },
  { question: "Fast! 'Dog'", options: ["Gato", "Perro", "Pájaro", "Pez"], correct: "Perro" },
  { question: "Rápido: 'House'", options: ["Casa", "Edificio", "Tienda", "Escuela"], correct: "Casa" },
  { question: "Quick! 'Food'", options: ["Bebida", "Comida", "Plato", "Mesa"], correct: "Comida" },
  { question: "Veloz: 'Sun'", options: ["Luna", "Estrella", "Sol", "Planeta"], correct: "Sol" },
  { question: "Fast! 'Tree'", options: ["Flor", "Árbol", "Planta", "Hierba"], correct: "Árbol" },
  { question: "Rápido: 'Phone'", options: ["Computadora", "Teléfono", "Tableta", "Reloj"], correct: "Teléfono" },
  { question: "Quick! 'Friend'", options: ["Enemigo", "Amigo", "Familiar", "Extraño"], correct: "Amigo" },
];

const getRandomQuestions = (count: number) => {
  const today = new Date().toDateString();
  let seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + 2000;
  
  const shuffled = [...speedWordBank].sort(() => {
    const random = Math.sin(seed++) * 10000;
    return random - Math.floor(random);
  });
  
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const SpeedWordsGame = ({ onComplete, onReset }: SpeedWordsGameProps) => {
  const { toast } = useToast();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15); // Menos tiempo para juego rápido
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<typeof speedWordBank>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setQuestions(getRandomQuestions(8)); // Más preguntas pero más rápido
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
        title: "¡Muy lento!",
        description: "Necesitas ser más rápido.",
        variant: "destructive",
      });
      
      setTimeout(() => {
        moveCurrentQuestionToEndAndContinue();
      }, 1500);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    if (timer) clearInterval(timer);
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === questions[currentQuestion].correct;
    const timeBonus = timeLeft * 2; // Bonus por velocidad
    
    if (isCorrect) {
      const pointsEarned = 10 + timeBonus;
      setScore(score + pointsEarned);
      toast({
        title: "¡Veloz!",
        description: `+${pointsEarned} puntos (bonus: ${timeBonus})`,
      });
      setTimeout(() => {
        nextQuestion();
      }, 1000);
    } else {
      toast({
        title: "Incorrecto",
        description: `Respuesta: ${questions[currentQuestion].correct}`,
        variant: "destructive",
      });
      setTimeout(() => {
        moveCurrentQuestionToEndAndContinue();
      }, 2000);
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
    setTimeLeft(15);
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
    <Card className="shadow-learning-lg border-2 border-warning/50">
      <CardHeader>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center text-primary">
              <Trophy className="h-5 w-5 mr-1" />
              <span className="font-bold">{score} pts</span>
            </div>
            <div className="flex items-center text-warning">
              <Zap className="h-5 w-5 mr-1" />
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

        <CardTitle className="text-xl text-center animate-pulse">
          {questions[currentQuestion].question}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {questions[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              variant="outline"
              className={`h-14 text-base ${getAnswerStyle(option)}`}
              disabled={showResult}
            >
              {option}
              {showResult && option === questions[currentQuestion].correct && (
                <CheckCircle className="h-4 w-4 ml-2" />
              )}
              {showResult && option === selectedAnswer && option !== questions[currentQuestion].correct && (
                <X className="h-4 w-4 ml-2" />
              )}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
