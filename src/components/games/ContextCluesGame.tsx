import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContextCluesGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

const questionBank = [
  {
    context: "The old mansion was completely _____ after years of neglect; not a single piece of furniture remained.",
    word: "barren",
    options: ["barren", "furnished", "decorated", "occupied"],
    hint: "Vacío, despojado"
  },
  {
    context: "Despite the _____ weather forecast, we decided to go ahead with our outdoor picnic plans.",
    word: "ominous",
    options: ["pleasant", "ominous", "accurate", "optimistic"],
    hint: "Amenazador, de mal augurio"
  },
  {
    context: "Her _____ personality made her the perfect candidate for the customer service position.",
    word: "affable",
    options: ["hostile", "shy", "affable", "arrogant"],
    hint: "Amable, cordial"
  },
  {
    context: "The detective's _____ observations helped solve the mysterious case that had puzzled everyone.",
    word: "astute",
    options: ["careless", "astute", "obvious", "random"],
    hint: "Perspicaz, agudo"
  },
  {
    context: "The company's _____ growth over the past decade has made it a leader in the tech industry.",
    word: "exponential",
    options: ["slow", "steady", "exponential", "declining"],
    hint: "Rápido y acelerado"
  },
  {
    context: "His _____ attempt to fix the computer only made the problem worse.",
    word: "futile",
    options: ["successful", "futile", "professional", "careful"],
    hint: "Inútil, vano"
  },
  {
    context: "The professor's _____ lecture left students confused rather than enlightened.",
    word: "convoluted",
    options: ["clear", "brief", "convoluted", "simple"],
    hint: "Complicado, enredado"
  },
  {
    context: "She maintained her _____ despite facing numerous challenges and setbacks.",
    word: "composure",
    options: ["anger", "composure", "confusion", "excitement"],
    hint: "Calma, serenidad"
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

export const ContextCluesGame = ({ onComplete, onReset }: ContextCluesGameProps) => {
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
      const timeBonus = Math.floor(timeLeft / 8);
      const points = 20 + timeBonus;
      setScore(score + points);
      toast({
        title: "¡Excelente! 🎉",
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
            <h2 className="text-2xl font-bold">Pistas de Contexto</h2>
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

          {/* Hint */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Pista: {questions[currentQuestion].hint}
            </p>
          </div>

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
