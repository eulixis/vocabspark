import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RotateCcw, Shuffle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface WordBuilderGameProps {
  onComplete: (score: number) => void;
  onReset: () => void;
}

const wordBank = [
  { word: "BEAUTIFUL", hint: "Hermoso/a", scrambled: "FUTIUAEBL" },
  { word: "IMPORTANT", hint: "Importante", scrambled: "TATNPROMI" },
  { word: "CHOCOLATE", hint: "Chocolate", scrambled: "CCHOLATOE" },
  { word: "KNOWLEDGE", hint: "Conocimiento", scrambled: "DGELENOWK" },
  { word: "YESTERDAY", hint: "Ayer", scrambled: "ESYTREDAY" },
  { word: "AUGHTER", hint: "Risa", scrambled: "GHLAUTER" },
  { word: "QUESTION", hint: "Pregunta", scrambled: "TEUQSONI" },
  { word: "STRENGTH", hint: "Fuerza", scrambled: "GTHSTREN" },
  { word: "THOUGHT", hint: "Pensamiento", scrambled: "HTOUGHT" },
  { word: "THROUGH", hint: "A través", scrambled: "HGUROHT" }
];

const getRandomWords = (count: number) => {
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
  
  const shuffled = [...wordBank].sort(() => seededRandom(seed + Math.random()) - 0.5);
  return shuffled.slice(0, count);
};

export const WordBuilderGame = ({ onComplete, onReset }: WordBuilderGameProps) => {
  const [score, setScore] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [userWord, setUserWord] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [words, setWords] = useState<typeof wordBank>([]);
  const { toast } = useToast();

  useEffect(() => {
    const selectedWords = getRandomWords(6);
    setWords(selectedWords);
    if (selectedWords.length > 0) {
      setAvailableLetters(selectedWords[0].scrambled.split(''));
    }
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && words.length > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleComplete();
    }
  }, [timeLeft, words]);

  const handleLetterClick = (letter: string, index: number) => {
    setUserWord([...userWord, letter]);
    setAvailableLetters(availableLetters.filter((_, i) => i !== index));
  };

  const handleRemoveLetter = (index: number) => {
    const letter = userWord[index];
    setAvailableLetters([...availableLetters, letter]);
    setUserWord(userWord.filter((_, i) => i !== index));
  };

  const handleShuffle = () => {
    setAvailableLetters([...availableLetters].sort(() => Math.random() - 0.5));
  };

  const handleCheck = () => {
    const userAnswer = userWord.join('');
    const correctWord = words[currentWord].word;
    
    if (userAnswer === correctWord) {
      const timeBonus = Math.floor(timeLeft / 5);
      const points = 25 + timeBonus;
      setScore(score + points);
      toast({
        title: "¡Correcto! 🎉",
        description: `+${points} puntos (${timeBonus} bonus)`,
      });
      
      setTimeout(() => {
        if (currentWord < words.length - 1) {
          setCurrentWord(currentWord + 1);
          setUserWord([]);
          setAvailableLetters(words[currentWord + 1].scrambled.split(''));
        } else {
          handleComplete();
        }
      }, 1500);
    } else {
      toast({
        title: "Incorrecto",
        description: "Intenta de nuevo",
        variant: "destructive",
      });
    }
  };

  const handleComplete = () => {
    onComplete(score);
  };

  if (words.length === 0) {
    return <div className="text-center p-8">Cargando...</div>;
  }

  const progress = ((currentWord + 1) / words.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={onReset}>
            <RotateCcw className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold">Constructor de Palabras</h2>
            <p className="text-sm text-muted-foreground">
              Palabra {currentWord + 1} de {words.length}
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
          {/* Hint */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Pista:</p>
            <h3 className="text-2xl font-semibold">{words[currentWord].hint}</h3>
          </div>

          {/* User Word Display */}
          <div className="min-h-[80px] flex items-center justify-center gap-2 bg-muted/30 rounded-lg p-4">
            {userWord.length === 0 ? (
              <p className="text-muted-foreground">Forma la palabra aquí...</p>
            ) : (
              userWord.map((letter, index) => (
                <Button
                  key={index}
                  onClick={() => handleRemoveLetter(index)}
                  className="h-14 w-14 text-2xl font-bold"
                  variant="default"
                >
                  {letter}
                </Button>
              ))
            )}
          </div>

          {/* Available Letters */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {availableLetters.map((letter, index) => (
              <Button
                key={index}
                onClick={() => handleLetterClick(letter, index)}
                className="h-14 w-14 text-2xl font-bold"
                variant="outline"
              >
                {letter}
              </Button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleShuffle}
              variant="outline"
              className="flex-1"
            >
              <Shuffle className="mr-2 h-4 w-4" />
              Mezclar
            </Button>
            <Button
              onClick={handleCheck}
              className="flex-1"
              disabled={userWord.length === 0}
            >
              Verificar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
