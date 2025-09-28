import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Volume2, 
  RotateCcw,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  Lock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Word {
  word: string;
  pronunciation: string;
  definition: string;
  example: string;
  exampleTranslation: string;
  level: string;
}

interface VocabularySectionProps {
  title: string;
  level: string;
  words: Word[];
  isLocked: boolean;
  onWordLearned: () => void;
  canLearnMore: boolean;
  remainingWords: number;
  learnedWords: Set<number>;
  onWordComplete: (wordIndex: number) => void;
}

const VocabularySection = ({ 
  title, 
  level, 
  words, 
  isLocked, 
  onWordLearned, 
  canLearnMore, 
  remainingWords,
  learnedWords,
  onWordComplete
}: VocabularySectionProps) => {
  const { toast } = useToast();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  
  const currentWord = words[currentWordIndex];
  const progress = words.length > 0 ? ((currentWordIndex + 1) / words.length) * 100 : 0;
  const wordsLearned = words.filter((_, index) => learnedWords.has(index)).length;
  const isCompleted = wordsLearned === words.length && words.length > 0;

  const handleNext = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1);
      setShowDefinition(false);
    }
  };

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1);
      setShowDefinition(false);
    }
  };

  const handleMarkAsLearned = async () => {
    if (isLocked) {
      toast({
        title: "Nivel no disponible",
        description: `Necesitas un plan superior para acceder a palabras de nivel ${level}.`,
        variant: "destructive"
      });
      return;
    }

    if (!canLearnMore) {
      toast({
        title: "Límite diario alcanzado",
        description: "Has alcanzado tu límite diario de palabras.",
        variant: "destructive"
      });
      return;
    }

    onWordComplete(currentWordIndex);
    onWordLearned();
    
    // Show notification only when remaining words < 3
    if (remainingWords <= 3) {
      toast({
        title: "¡Palabra aprendida!",
        description: `Has marcado "${currentWord.word}" como aprendida. Te quedan ${remainingWords - 1} palabras hoy.`,
      });
    } else {
      toast({
        title: "¡Palabra aprendida!",
        description: `Has marcado "${currentWord.word}" como aprendida.`,
      });
    }
    
    if (currentWordIndex < words.length - 1) {
      setTimeout(() => handleNext(), 1000);
    }
  };

  const playPronunciation = () => {
    toast({
      title: "Pronunciación",
      description: "Función de audio próximamente disponible",
    });
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Easy": return "text-green-600";
      case "Intermediate": return "text-yellow-600";
      case "Hard": return "text-orange-600";
      case "UltraHard": return "text-red-600";
      default: return "text-muted-foreground";
    }
  };

  const resetSection = () => {
    setCurrentWordIndex(0);
    setShowDefinition(false);
  };

  if (isLocked) {
    return (
      <Card className="mb-6 opacity-60">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 mr-2 text-muted-foreground" />
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <CardDescription>
            Requiere plan superior para desbloquear
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            {words.length} palabras disponibles
          </p>
          <Button variant="outline" disabled>
            <Lock className="h-4 w-4 mr-2" />
            Bloqueado
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isCompleted) {
    return (
      <Card className="mb-6 opacity-75 bg-muted/50">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-6 w-6 mr-2 text-success" />
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
          <CardDescription>
            Sección Aprendida
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">
            ¡Has completado todas las {words.length} palabras!
          </p>
          <Button variant="outline" onClick={resetSection}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Volver a practicar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (words.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 shadow-learning-lg">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl">{title}</CardTitle>
          <Badge variant="secondary" className={getLevelColor(level)}>
            {level}
          </Badge>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progreso</span>
            <span className="text-sm text-muted-foreground">
              {currentWordIndex + 1} de {words.length}
            </span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {wordsLearned} de {words.length} palabras aprendidas
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-center mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className={`text-sm font-semibold px-3 py-1 rounded-full bg-muted ${getLevelColor(currentWord.level)}`}>
              {currentWord.level}
            </span>
            {learnedWords.has(currentWordIndex) && (
              <div className="flex items-center text-success">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span className="text-sm">Aprendida</span>
              </div>
            )}
          </div>
          
          <h3 className="text-3xl font-bold text-primary mb-2">
            {currentWord.word}
          </h3>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <span className="text-muted-foreground">{currentWord.pronunciation}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={playPronunciation}
              className="h-8 w-8"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {!showDefinition ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-6">
              ¿Conoces el significado de esta palabra?
            </p>
            <Button
              onClick={() => setShowDefinition(true)}
              variant="default"
              size="lg"
            >
              Ver Definición
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-left">
              <h4 className="font-semibold text-lg mb-2">Definición:</h4>
              <p className="text-foreground mb-4">{currentWord.definition}</p>
              
              <h4 className="font-semibold text-lg mb-2">Ejemplo:</h4>
              <blockquote className="border-l-4 border-primary pl-4 italic mb-2">
                "{currentWord.example}"
              </blockquote>
              <p className="text-muted-foreground">
                "{currentWord.exampleTranslation}"
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                onClick={() => setShowDefinition(false)}
                variant="outline"
                className="flex-1"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Revisar
              </Button>
              <Button
                onClick={handleMarkAsLearned}
                variant="default"
                className="flex-1"
                disabled={learnedWords.has(currentWordIndex) || !canLearnMore}
              >
                <Star className="h-4 w-4 mr-2" />
                {learnedWords.has(currentWordIndex) 
                  ? "Aprendida" 
                  : !canLearnMore 
                    ? "Límite diario alcanzado"
                    : "Marcar como Aprendida"
                }
              </Button>
            </div>
          </div>
        )}
        
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentWordIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            variant="outline"
            disabled={currentWordIndex === words.length - 1}
          >
            Siguiente
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VocabularySection;