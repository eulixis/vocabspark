import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Volume2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

interface ListeningGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

export const ListeningGame = ({ onComplete, onReset }: ListeningGameProps) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(80);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<Array<{ text: string; question: string; options: string[]; correct: string }>>([]);
  const { toast } = useToast();
  const { speak, isSpeaking } = useTextToSpeech();

  const questionBank = [
    { 
      text: "The weather is beautiful today", 
      question: "¿Cómo está el clima?", 
      options: ["Horrible", "Hermoso", "Frío", "Lluvioso"], 
      correct: "Hermoso" 
    },
    { 
      text: "I have two cats and one dog", 
      question: "¿Cuántos gatos tiene?", 
      options: ["Uno", "Dos", "Tres", "Cuatro"], 
      correct: "Dos" 
    },
    { 
      text: "She goes to school by bus every morning", 
      question: "¿Cómo va ella a la escuela?", 
      options: ["En carro", "Caminando", "En autobús", "En bicicleta"], 
      correct: "En autobús" 
    },
    { 
      text: "The restaurant opens at seven o'clock", 
      question: "¿A qué hora abre el restaurante?", 
      options: ["A las seis", "A las siete", "A las ocho", "A las nueve"], 
      correct: "A las siete" 
    },
    { 
      text: "My favorite color is blue", 
      question: "¿Cuál es su color favorito?", 
      options: ["Rojo", "Verde", "Azul", "Amarillo"], 
      correct: "Azul" 
    },
    { 
      text: "They are planning to travel to Spain next year", 
      question: "¿A dónde van a viajar?", 
      options: ["Francia", "Italia", "España", "Portugal"], 
      correct: "España" 
    },
    { 
      text: "I usually drink coffee in the morning", 
      question: "¿Qué bebe en la mañana?", 
      options: ["Té", "Café", "Jugo", "Agua"], 
      correct: "Café" 
    },
    { 
      text: "The book is on the table", 
      question: "¿Dónde está el libro?", 
      options: ["En la silla", "En la mesa", "En el piso", "En la cama"], 
      correct: "En la mesa" 
    }
  ];

  useEffect(() => {
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    setQuestions(selected);
    
    // Auto-play first question
    if (selected.length > 0) {
      setTimeout(() => speak(selected[0].text), 500);
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleComplete();
    }
  }, [timeLeft, questions]);

  const handlePlayAudio = () => {
    if (!isSpeaking && questions.length > 0) {
      speak(questions[currentQuestion].text);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    const current = questions[currentQuestion];
    const isCorrect = answer === current.correct;
    
    setShowResult(true);
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 10);
      const points = 30 + timeBonus;
      setScore(score + points);
      
      toast({
        title: "¡Correcto! 🎉",
        description: `+${points} puntos (${timeBonus} bonus de tiempo)`,
      });
    } else {
      toast({
        title: "Incorrecto ❌",
        description: `Correcto: ${current.correct}`,
        variant: "destructive",
      });
    }

    setTimeout(() => {
      setShowResult(false);
      setSelectedAnswer(null);
      if (currentQuestion < questions.length - 1) {
        const nextQuestion = currentQuestion + 1;
        setCurrentQuestion(nextQuestion);
        setTimeout(() => speak(questions[nextQuestion].text), 300);
      } else {
        handleComplete();
      }
    }, 2000);
  };

  const handleComplete = () => {
    onComplete(score);
  };

  const getAnswerStyle = (option: string) => {
    if (!showResult) return "outline";
    if (option === questions[currentQuestion].correct) return "default";
    if (option === selectedAnswer) return "destructive";
    return "outline";
  };

  if (questions.length === 0) {
    return <div className="text-center p-8">Cargando preguntas...</div>;
  }

  const current = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <Badge variant="secondary" className="text-lg px-4 py-2">
          Puntuación: {score}
        </Badge>
        <Badge variant={timeLeft < 20 ? "destructive" : "default"} className="text-lg px-4 py-2">
          ⏱️ {timeLeft}s
        </Badge>
      </div>

      <Progress value={progress} className="h-3" />

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Pregunta {currentQuestion + 1} de {questions.length}</p>
              <h3 className="text-2xl font-bold mb-6">Escucha y responde</h3>
              
              <Button
                onClick={handlePlayAudio}
                disabled={isSpeaking}
                size="lg"
                className="mb-6"
              >
                <Volume2 className="mr-2 h-5 w-5" />
                {isSpeaking ? "Reproduciendo..." : "Escuchar audio"}
              </Button>

              <p className="text-xl font-semibold text-primary">{current.question}</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {current.options.map((option) => (
                <Button
                  key={option}
                  variant={getAnswerStyle(option)}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className="text-lg py-6 h-auto"
                  size="lg"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
