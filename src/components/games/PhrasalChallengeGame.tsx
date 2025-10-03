import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhrasalChallengeGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

const questionBank = [
  {
    question: "I can't believe she _____ her boss at the meeting yesterday!",
    phrasal: "stood up to",
    options: ["stood up to", "stood by", "stood for", "stood out"],
    meaning: "Enfrentó, se opuso a"
  },
  {
    question: "The deal _____ at the last minute due to legal issues.",
    phrasal: "fell through",
    options: ["fell for", "fell behind", "fell through", "fell out"],
    meaning: "Fracasó, no se concretó"
  },
  {
    question: "They decided to _____ the old system and implement a new one.",
    phrasal: "do away with",
    options: ["do away with", "do without", "do up", "do over"],
    meaning: "Eliminar, deshacerse de"
  },
  {
    question: "I'm trying to _____ smoking, but it's really difficult.",
    phrasal: "give up",
    options: ["give in", "give away", "give up", "give out"],
    meaning: "Dejar de hacer algo"
  },
  {
    question: "The teacher asked us to _____ our homework tomorrow.",
    phrasal: "hand in",
    options: ["hand out", "hand over", "hand in", "hand down"],
    meaning: "Entregar"
  },
  {
    question: "We need to _____ a solution to this problem quickly.",
    phrasal: "come up with",
    options: ["come across", "come up with", "come down to", "come over"],
    meaning: "Idear, proponer"
  },
  {
    question: "I _____ my old friend at the supermarket yesterday.",
    phrasal: "ran into",
    options: ["ran over", "ran into", "ran out", "ran through"],
    meaning: "Encontrarse con alguien por casualidad"
  },
  {
    question: "The company had to _____ 50 employees due to financial problems.",
    phrasal: "lay off",
    options: ["lay down", "lay off", "lay out", "lay up"],
    meaning: "Despedir empleados"
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

export const PhrasalChallengeGame = ({ onComplete, onReset }: PhrasalChallengeGameProps) => {
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
    
    const isCorrect = answer === questions[currentQuestion].phrasal;
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 8);
      const points = 20 + timeBonus;
      setScore(score + points);
      toast({
        title: "¡Perfecto! 🎉",
        description: `+${points} puntos (${timeBonus} bonus)`,
      });
    } else {
      toast({
        title: "Incorrecto",
        description: `La respuesta correcta es: ${questions[currentQuestion].phrasal}`,
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
    if (option === questions[currentQuestion].phrasal) return "bg-success text-white";
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
            <h2 className="text-2xl font-bold">Desafío Phrasal Verbs</h2>
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
          {/* Question */}
          <div className="bg-muted/30 p-6 rounded-lg">
            <p className="text-xl font-medium text-center">
              {questions[currentQuestion].question}
            </p>
          </div>

          {/* Meaning */}
          {showResult && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Significado: {questions[currentQuestion].meaning}
              </p>
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
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
