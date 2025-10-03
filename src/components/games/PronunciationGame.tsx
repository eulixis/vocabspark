import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Volume2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PronunciationGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

const questionBank = [
  { audio: "thought", word: "thought", options: ["taught", "thought", "through", "tough"] },
  { audio: "receipt", word: "receipt", options: ["recipe", "receipt", "recent", "recite"] },
  { audio: "colonel", word: "colonel", options: ["kernel", "colonel", "coronal", "colonial"] },
  { audio: "Wednesday", word: "Wednesday", options: ["Wensday", "Wednesday", "Wednsday", "Wendsday"] },
  { audio: "schedule", word: "schedule", options: ["skedule", "schedule", "shedule", "schedual"] },
  { audio: "comfortable", word: "comfortable", options: ["comfterble", "comfortable", "comfortible", "comfrtable"] },
  { audio: "vegetable", word: "vegetable", options: ["vegtable", "vegetible", "vegetable", "vegitable"] },
  { audio: "February", word: "February", options: ["Febuary", "Feburary", "February", "Februery"] }
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

export const PronunciationGame = ({ onComplete, onReset }: PronunciationGameProps) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<typeof questionBank>([]);
  const { toast } = useToast();

  useEffect(() => {
    setQuestions(getRandomQuestions(6));
  }, []);

  useEffect(() => {
    if (questions.length > 0 && currentQuestion < questions.length) {
      playAudio();
    }
  }, [currentQuestion, questions]);

  useEffect(() => {
    if (timeLeft > 0 && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleComplete();
    }
  }, [timeLeft, questions]);

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === questions[currentQuestion].word;
    
    if (isCorrect) {
      const points = 15;
      setScore(score + points);
      toast({
        title: "¡Correcto! 🎉",
        description: `+${points} puntos`,
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
            <h2 className="text-2xl font-bold">Pronunciación</h2>
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
          {/* Audio Button */}
          <div className="text-center">
            <Button
              onClick={playAudio}
              size="lg"
              className="w-32 h-32 rounded-full"
              disabled={showResult}
            >
              <Volume2 className="h-12 w-12" />
            </Button>
            <p className="mt-4 text-muted-foreground">
              Escucha la palabra y selecciona la ortografía correcta
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
