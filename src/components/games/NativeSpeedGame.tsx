import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Volume2, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface NativeSpeedGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

const questionBank = [
  {
    audio: "I'm gonna grab a coffee real quick before the meeting starts, you want anything?",
    question: "What is the speaker going to do?",
    options: [
      "Attend the meeting",
      "Get coffee before the meeting",
      "Cancel the meeting",
      "Order food"
    ],
    correct: "Get coffee before the meeting"
  },
  {
    audio: "We've been trying to get this project off the ground for months, but keep running into roadblocks.",
    question: "What's happening with the project?",
    options: [
      "It's almost finished",
      "It's facing obstacles",
      "It was cancelled",
      "It's very successful"
    ],
    correct: "It's facing obstacles"
  },
  {
    audio: "She's really good at thinking on her feet and coming up with creative solutions under pressure.",
    question: "What is she good at?",
    options: [
      "Dancing",
      "Running fast",
      "Quick problem-solving",
      "Public speaking"
    ],
    correct: "Quick problem-solving"
  },
  {
    audio: "Look, I'm not trying to beat around the bush here - we need to talk about your performance.",
    question: "What does the speaker want to do?",
    options: [
      "Avoid the topic",
      "Speak directly about performance",
      "Talk about gardening",
      "Change the subject"
    ],
    correct: "Speak directly about performance"
  },
  {
    audio: "The whole situation was a blessing in disguise - losing that job led me to my dream career.",
    question: "How does the speaker view losing their job?",
    options: [
      "As a disaster",
      "As something ultimately positive",
      "As unfair",
      "As confusing"
    ],
    correct: "As something ultimately positive"
  },
  {
    audio: "You're barking up the wrong tree if you think I had anything to do with that decision.",
    question: "What is the speaker saying?",
    options: [
      "They own a dog",
      "They made the decision",
      "They're not responsible",
      "They're angry"
    ],
    correct: "They're not responsible"
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

export const NativeSpeedGame = ({ onComplete, onReset }: NativeSpeedGameProps) => {
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
    utterance.rate = 1.2; // Native speed
    speechSynthesis.speak(utterance);
  };

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
        title: "¡Increíble! 🎉",
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
            <h2 className="text-2xl font-bold">Velocidad Nativa</h2>
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
              ⚡ Audio a velocidad nativa - Escucha con atención
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
