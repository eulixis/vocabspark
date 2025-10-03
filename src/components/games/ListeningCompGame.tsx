import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Volume2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ListeningCompGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

const questionBank = [
  {
    audio: "The company announced significant changes to its remote work policy, allowing employees to work from home three days a week starting next month.",
    question: "What is the company's new policy?",
    options: [
      "Employees must work from office",
      "Work from home 3 days per week",
      "Work from home 5 days per week",
      "No remote work allowed"
    ],
    correct: "Work from home 3 days per week"
  },
  {
    audio: "Scientists discovered that regular exercise not only improves physical health but also enhances cognitive function and memory retention in adults over 50.",
    question: "What benefit of exercise was discovered?",
    options: [
      "Only physical health improvement",
      "Better sleep quality",
      "Improved memory and cognition",
      "Increased appetite"
    ],
    correct: "Improved memory and cognition"
  },
  {
    audio: "The new restaurant downtown offers a unique dining experience with locally sourced ingredients and a menu that changes weekly based on seasonal availability.",
    question: "What makes the restaurant unique?",
    options: [
      "It's open 24 hours",
      "Menu changes weekly with seasonal items",
      "It only serves breakfast",
      "Fixed menu all year"
    ],
    correct: "Menu changes weekly with seasonal items"
  },
  {
    audio: "The museum's latest exhibition features contemporary art from emerging artists across Europe, showcasing diverse perspectives on urban life and social change.",
    question: "What does the exhibition showcase?",
    options: [
      "Ancient artifacts",
      "Photography only",
      "Contemporary art on urban life",
      "Classical paintings"
    ],
    correct: "Contemporary art on urban life"
  },
  {
    audio: "Due to unexpected weather conditions, the outdoor concert has been postponed until next Saturday, with all tickets remaining valid for the new date.",
    question: "What happened to the concert?",
    options: [
      "It was cancelled",
      "Moved indoors",
      "Postponed to next Saturday",
      "Tickets are refunded"
    ],
    correct: "Postponed to next Saturday"
  },
  {
    audio: "The university launched a new scholarship program specifically designed for students pursuing careers in environmental science and sustainable development.",
    question: "Who is the scholarship for?",
    options: [
      "All university students",
      "Medical students",
      "Environmental science students",
      "Engineering students"
    ],
    correct: "Environmental science students"
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

export const ListeningCompGame = ({ onComplete, onReset }: ListeningCompGameProps) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<typeof questionBank>([]);
  const { toast } = useToast();

  useEffect(() => {
    setQuestions(getRandomQuestions(5));
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
    const utterance = new SpeechSynthesisUtterance(questions[currentQuestion].audio);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    speechSynthesis.speak(utterance);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === questions[currentQuestion].correct;
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 10);
      const points = 20 + timeBonus;
      setScore(score + points);
      toast({
        title: "¡Excelente! 🎉",
        description: `+${points} puntos (${timeBonus} bonus)`,
      });
    } else {
      toast({
        title: "Incorrecto",
        description: `La respuesta correcta es: ${questions[currentQuestion].correct}`,
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
            <h2 className="text-2xl font-bold">Comprensión Auditiva</h2>
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
            <p className="mt-4 text-sm text-muted-foreground">
              Escucha el audio y responde la pregunta
            </p>
          </div>

          {/* Question */}
          <div className="text-center">
            <h3 className="text-xl font-semibold">{questions[currentQuestion].question}</h3>
          </div>

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
