import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MasterChallengeGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

const questionBank = [
  {
    type: "phrasal",
    question: "Complete: 'After years of hard work, his efforts finally _____ when he got promoted.'",
    answer: "paid off",
    hint: "Phrasal verb meaning 'to be successful or worthwhile'"
  },
  {
    type: "idiom",
    question: "What idiom means 'to reveal a secret accidentally'?",
    answer: "let the cat out of the bag",
    hint: "Involves an animal and a container"
  },
  {
    type: "business",
    question: "What word means 'a detailed plan or model for a specific purpose'?",
    answer: "blueprint",
    hint: "Originally used in architecture and engineering"
  },
  {
    type: "advanced",
    question: "Complete: 'The committee will _____ the proposal before making a final decision.'",
    answer: "scrutinize",
    hint: "To examine very carefully"
  },
  {
    type: "phrasal",
    question: "Complete: 'The meeting was _____ until next week due to scheduling conflicts.'",
    answer: "put off",
    hint: "Phrasal verb meaning 'to postpone'"
  },
  {
    type: "vocabulary",
    question: "What word means 'using very few words to express ideas'?",
    answer: "concise",
    hint: "The opposite of verbose"
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

export const MasterChallengeGame = ({ onComplete, onReset }: MasterChallengeGameProps) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [questions, setQuestions] = useState<typeof questionBank>([]);
  const { toast } = useToast();

  useEffect(() => {
    setQuestions(getRandomQuestions(5));
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
    return text.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  };

  const handleCheck = () => {
    if (!userAnswer.trim()) return;
    
    setShowResult(true);
    
    const isCorrect = normalizeText(userAnswer) === normalizeText(questions[currentQuestion].answer);
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 10);
      const hintPenalty = showHint ? 10 : 0;
      const points = Math.max(0, 40 + timeBonus - hintPenalty);
      setScore(score + points);
      toast({
        title: "¡Maestro! 🏆",
        description: `+${points} puntos${showHint ? ' (-10 por usar pista)' : ''}`,
      });
    } else {
      toast({
        title: "Incorrecto",
        description: `La respuesta correcta es: ${questions[currentQuestion].answer}`,
        variant: "destructive",
      });
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setUserAnswer("");
        setShowResult(false);
        setShowHint(false);
      } else {
        handleComplete();
      }
    }, 2500);
  };

  const handleComplete = () => {
    onComplete(score);
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
            <h2 className="text-2xl font-bold">Desafío Maestro</h2>
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
          {/* Type Badge */}
          <div className="flex justify-center">
            <span className="px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium capitalize">
              {questions[currentQuestion].type}
            </span>
          </div>

          {/* Question */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-lg">
            <p className="text-lg font-medium text-center">
              {questions[currentQuestion].question}
            </p>
          </div>

          {/* Hint */}
          {showHint ? (
            <div className="text-center bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground">
                💡 {questions[currentQuestion].hint}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <Button
                onClick={() => setShowHint(true)}
                variant="ghost"
                size="sm"
                disabled={showResult}
              >
                Ver pista (-10 puntos)
              </Button>
            </div>
          )}

          {/* Answer Input */}
          <div className="space-y-3">
            <Input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
              placeholder="Escribe tu respuesta aquí..."
              disabled={showResult}
              className="text-lg h-14"
            />
            
            {showResult && (
              <div className={`p-4 rounded-lg text-center ${
                normalizeText(userAnswer) === normalizeText(questions[currentQuestion].answer)
                  ? 'bg-success/20 text-success'
                  : 'bg-destructive/20 text-destructive'
              }`}>
                <p className="font-medium">
                  {normalizeText(userAnswer) === normalizeText(questions[currentQuestion].answer)
                    ? '✓ Correcto'
                    : `✗ Respuesta correcta: ${questions[currentQuestion].answer}`
                  }
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleCheck}
            className="w-full h-12"
            disabled={!userAnswer.trim() || showResult}
          >
            Verificar Respuesta
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
