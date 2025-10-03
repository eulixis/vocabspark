import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BusinessEnglishGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

const questionBank = [
  {
    context: "Let's schedule a meeting to discuss the project _____ and identify potential roadblocks.",
    word: "milestones",
    options: ["milestones", "celebrations", "distances", "memories"],
    meaning: "Hitos importantes del proyecto"
  },
  {
    context: "The company's _____ for this quarter shows a significant increase in revenue.",
    word: "forecast",
    options: ["history", "forecast", "complaint", "advertisement"],
    meaning: "Pronóstico o proyección"
  },
  {
    context: "We need to _____ our resources more efficiently to meet the deadline.",
    word: "allocate",
    options: ["waste", "allocate", "ignore", "celebrate"],
    meaning: "Asignar o distribuir recursos"
  },
  {
    context: "The CEO emphasized the importance of maintaining _____ with our company values.",
    word: "alignment",
    options: ["conflict", "alignment", "distance", "confusion"],
    meaning: "Alineación o coherencia"
  },
  {
    context: "Our team exceeded all _____ this quarter, resulting in substantial bonuses.",
    word: "benchmarks",
    options: ["problems", "benchmarks", "complaints", "difficulties"],
    meaning: "Puntos de referencia u objetivos"
  },
  {
    context: "The merger will create significant _____ for both companies involved.",
    word: "synergies",
    options: ["problems", "expenses", "synergies", "conflicts"],
    meaning: "Sinergias o beneficios mutuos"
  },
  {
    context: "We must _____ our competitive advantage in the market.",
    word: "leverage",
    options: ["ignore", "waste", "leverage", "abandon"],
    meaning: "Aprovechar o sacar ventaja"
  },
  {
    context: "The new strategy will help us _____ market share from our competitors.",
    word: "capture",
    options: ["lose", "capture", "donate", "avoid"],
    meaning: "Capturar o ganar"
  }
];

const getRandomQuestions = (count: number) => {
  const seed = new Date().toDateString();
  const seededRandom = (s: string) => {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      const char = s.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };
  
  const shuffled = [...questionBank].sort(() => seededRandom(seed + Math.random()) - 0.5);
  return shuffled.slice(0, count);
};

export const BusinessEnglishGame = ({ onComplete, onReset }: BusinessEnglishGameProps) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<typeof questionBank>([]);
  const { toast } = useToast();

  useEffect(() => {
    setQuestions(getRandomQuestions(6));
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleComplete();
    }
  }, [timeLeft, questions]);

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === questions[currentQuestion].word;
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 6);
      const points = 30 + timeBonus;
      setScore(score + points);
      toast({
        title: "¡Profesional! 🎉",
        description: `+${points} puntos (${timeBonus} bonus)`,
      });
    } else {
      toast({
        title: "Incorrecto",
        description: `La respuesta correcta es: ${questions[currentQuestion].word}`,
        variant: "destructive",
      });
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        handleComplete();
      }
    }, 1500);
  };

  const handleComplete = () => {
    onComplete(score);
  };

  const getAnswerStyle = (option: string) => {
    if (!showResult) return "bg-card hover:bg-accent";
    if (option === questions[currentQuestion].word) return "bg-success text-white";
    if (option === selectedAnswer) return "bg-destructive text-white";
    return "bg-card opacity-50";
  };

  if (questions.length === 0) {
    return <div className="text-center p-8">Cargando...</div>;
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onReset}>
            <RotateCcw className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Inglés de Negocios</h2>
            <p className="text-sm text-muted-foreground">
              Pregunta {currentQuestion + 1} de {questions.length}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">{score} pts</div>
          <div className="text-sm text-muted-foreground">⏱️ {timeLeft}s</div>
        </div>
      </div>

      {/* Progress */}
      <Progress value={progress} className="w-full" />

      {/* Game Content */}
      <Card>
        <CardContent className="pt-6 space-y-6">
          {/* Context */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <p className="text-lg leading-relaxed">
              {questions[currentQuestion].context.split('_____').map((part, index, array) => (
                <span key={index}>
                  {part}
                  {index < array.length - 1 && (
                    <span className="inline-block w-32 border-b-2 border-primary mx-2"></span>
                  )}
                </span>
              ))}
            </p>
          </div>

          {/* Meaning */}
          {showResult && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {questions[currentQuestion].meaning}
              </p>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                onClick={() => handleAnswerSelect(option)}
                className={`h-16 text-lg ${getAnswerStyle(option)}`}
                disabled={showResult}
                variant="outline"
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
