import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IdiomsExpertGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

const questionBank = [
  {
    idiom: "The ball is in your court",
    meaning: "It's your turn to make a decision or take action",
    options: [
      "You're playing sports",
      "It's your decision now",
      "You're very athletic",
      "You dropped something"
    ],
    correct: "It's your decision now"
  },
  {
    idiom: "Break the ice",
    meaning: "Make people feel more comfortable",
    options: [
      "Destroy frozen water",
      "Start a conversation",
      "Be very cold",
      "Cancel plans"
    ],
    correct: "Start a conversation"
  },
  {
    idiom: "Hit the nail on the head",
    meaning: "Get something exactly right",
    options: [
      "Do construction work",
      "Be exactly correct",
      "Hurt yourself",
      "Make a mistake"
    ],
    correct: "Be exactly correct"
  },
  {
    idiom: "Let the cat out of the bag",
    meaning: "Reveal a secret",
    options: [
      "Free a pet",
      "Reveal a secret",
      "Open a container",
      "Create a mess"
    ],
    correct: "Reveal a secret"
  },
  {
    idiom: "Piece of cake",
    meaning: "Something very easy",
    options: [
      "A dessert",
      "Very easy task",
      "A small portion",
      "Birthday celebration"
    ],
    correct: "Very easy task"
  },
  {
    idiom: "Spill the beans",
    meaning: "Reveal secret information",
    options: [
      "Make a mess",
      "Cook badly",
      "Tell a secret",
      "Waste food"
    ],
    correct: "Tell a secret"
  },
  {
    idiom: "Under the weather",
    meaning: "Feeling sick or ill",
    options: [
      "Outside in rain",
      "Feeling sick",
      "Very cold",
      "In a basement"
    ],
    correct: "Feeling sick"
  },
  {
    idiom: "Cost an arm and a leg",
    meaning: "Be very expensive",
    options: [
      "Cause injury",
      "Be very expensive",
      "Be dangerous",
      "Require effort"
    ],
    correct: "Be very expensive"
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

export const IdiomsExpertGame = ({ onComplete, onReset }: IdiomsExpertGameProps) => {
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
    
    const isCorrect = answer === questions[currentQuestion].correct;
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 6);
      const points = 30 + timeBonus;
      setScore(score + points);
      toast({
        title: "¡Excelente! 🎉",
        description: `+${points} puntos (${timeBonus} bonus)`,
      });
    } else {
      toast({
        title: "Incorrecto",
        description: `Significado: ${questions[currentQuestion].meaning}`,
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
    }, 2000);
  };

  const handleComplete = () => {
    onComplete(score);
  };

  const getAnswerStyle = (option: string) => {
    if (!showResult) return "bg-card hover:bg-accent";
    if (option === questions[currentQuestion].correct) return "bg-success text-white";
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
            <h2 className="text-2xl font-bold">Experto en Idioms</h2>
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
          {/* Idiom */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 rounded-lg text-center">
            <p className="text-sm text-muted-foreground mb-2">¿Qué significa este idiom?</p>
            <h3 className="text-3xl font-bold text-primary">
              "{questions[currentQuestion].idiom}"
            </h3>
          </div>

          {/* Explanation */}
          {showResult && (
            <div className="text-center bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-medium">
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
                className={`h-auto py-4 text-left justify-start ${getAnswerStyle(option)}`}
                disabled={showResult}
                variant="outline"
              >
                <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
