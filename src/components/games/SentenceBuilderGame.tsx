import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface SentenceBuilderGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

export const SentenceBuilderGame = ({ onComplete, onReset }: SentenceBuilderGameProps) => {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showResult, setShowResult] = useState(false);
  const [questions, setQuestions] = useState<Array<{ sentence: string; correctOrder: string[] }>>([]);
  const { toast } = useToast();

  const questionBank = [
    { sentence: "I go to school every day", correctOrder: ["I", "go", "to", "school", "every", "day"] },
    { sentence: "She likes to read books", correctOrder: ["She", "likes", "to", "read", "books"] },
    { sentence: "They are playing football", correctOrder: ["They", "are", "playing", "football"] },
    { sentence: "We will travel tomorrow", correctOrder: ["We", "will", "travel", "tomorrow"] },
    { sentence: "He is studying English", correctOrder: ["He", "is", "studying", "English"] },
    { sentence: "The cat is sleeping", correctOrder: ["The", "cat", "is", "sleeping"] },
    { sentence: "I have a big house", correctOrder: ["I", "have", "a", "big", "house"] },
    { sentence: "She can swim very well", correctOrder: ["She", "can", "swim", "very", "well"] },
    { sentence: "We are eating dinner", correctOrder: ["We", "are", "eating", "dinner"] },
    { sentence: "They went to the park", correctOrder: ["They", "went", "to", "the", "park"] }
  ];

  useEffect(() => {
    const shuffled = [...questionBank].sort(() => Math.random() - 0.5);
    setQuestions(shuffled.slice(0, 5));
    shuffleWords(shuffled[0].correctOrder);
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && questions.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleComplete();
    }
  }, [timeLeft, questions]);

  const shuffleWords = (words: string[]) => {
    setAvailableWords([...words].sort(() => Math.random() - 0.5));
    setSelectedWords([]);
  };

  const handleWordClick = (word: string, fromAvailable: boolean) => {
    if (fromAvailable) {
      setSelectedWords([...selectedWords, word]);
      setAvailableWords(availableWords.filter(w => w !== word || availableWords.indexOf(w) !== availableWords.lastIndexOf(w)));
    } else {
      const index = selectedWords.indexOf(word);
      setAvailableWords([...availableWords, word]);
      setSelectedWords(selectedWords.filter((_, i) => i !== index));
    }
  };

  const handleCheck = () => {
    const current = questions[currentQuestion];
    const isCorrect = selectedWords.join(" ") === current.correctOrder.join(" ");
    
    setShowResult(true);
    
    if (isCorrect) {
      const timeBonus = Math.floor(timeLeft / 10);
      const points = 20 + timeBonus;
      setScore(score + points);
      
      toast({
        title: "¡Correcto! 🎉",
        description: `+${points} puntos (${timeBonus} bonus de tiempo)`,
      });
    } else {
      toast({
        title: "Incorrecto ❌",
        description: `Correcto: "${current.correctOrder.join(" ")}"`,
        variant: "destructive",
      });
    }

    setTimeout(() => {
      setShowResult(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        shuffleWords(questions[currentQuestion + 1].correctOrder);
      } else {
        handleComplete();
      }
    }, 2000);
  };

  const handleComplete = () => {
    onComplete(score);
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
              <h3 className="text-2xl font-bold">Construye la oración</h3>
              <p className="text-lg text-muted-foreground mt-2">{current.sentence}</p>
            </div>

            <div className="min-h-[80px] p-4 border-2 border-dashed rounded-lg bg-muted/30">
              <div className="flex flex-wrap gap-2">
                {selectedWords.map((word, index) => (
                  <Button
                    key={`selected-${index}`}
                    variant="secondary"
                    onClick={() => handleWordClick(word, false)}
                    className="text-lg"
                  >
                    {word}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {availableWords.map((word, index) => (
                <Button
                  key={`available-${index}`}
                  variant="outline"
                  onClick={() => handleWordClick(word, true)}
                  disabled={showResult}
                  className="text-lg"
                >
                  {word}
                </Button>
              ))}
            </div>

            <Button
              onClick={handleCheck}
              disabled={selectedWords.length !== current.correctOrder.length || showResult}
              className="w-full text-lg py-6"
              size="lg"
            >
              Verificar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
