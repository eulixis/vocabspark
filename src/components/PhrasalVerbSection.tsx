import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Volume2, 
  RotateCcw,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star,
  Lock,
  Target,
  Lightbulb
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Example {
  sentence: string;
  translation: string;
  context: string;
}

interface PhrasalVerb {
  verb: string;
  meaning: string;
  examples: Example[];
  level: string;
  category: string;
}

interface PhrasalVerbSectionProps {
  title: string;
  level: string;
  phrasalVerbs: PhrasalVerb[];
  isLocked: boolean;
  onVerbLearned: () => void;
  canLearnMore: boolean;
  remainingWords: number;
  learnedVerbs: Set<number>;
  onVerbComplete: (verbIndex: number) => void;
}

const PhrasalVerbSection = ({ 
  title, 
  level, 
  phrasalVerbs, 
  isLocked, 
  onVerbLearned, 
  canLearnMore, 
  remainingWords,
  learnedVerbs,
  onVerbComplete
}: PhrasalVerbSectionProps) => {
  const { toast } = useToast();
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
  const [showExamples, setShowExamples] = useState(false);
  
  const currentVerb = phrasalVerbs[currentVerbIndex];
  const verbsLearned = phrasalVerbs.filter((_, index) => learnedVerbs.has(index)).length;
  const isCompleted = verbsLearned === phrasalVerbs.length && phrasalVerbs.length > 0;

  const handleNext = async () => {
    // Auto-mark as learned when moving to next verb
    if (!learnedVerbs.has(currentVerbIndex) && canLearnMore) {
      onVerbComplete(currentVerbIndex);
      onVerbLearned();
      
      toast({
        title: "¡Verbo frasal aprendido!",
        description: `Has marcado "${currentVerb.verb}" como aprendido.`,
      });
    }
    
    if (currentVerbIndex < phrasalVerbs.length - 1) {
      setCurrentVerbIndex(currentVerbIndex + 1);
      setShowExamples(false);
    }
  };

  const handlePrevious = () => {
    if (currentVerbIndex > 0) {
      setCurrentVerbIndex(currentVerbIndex - 1);
      setShowExamples(false);
    }
  };

  const handleMarkAsLearned = async () => {
    if (isLocked) {
      toast({
        title: "Nivel no disponible",
        description: `Necesitas un plan superior para acceder a verbos de nivel ${level}.`,
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

    onVerbComplete(currentVerbIndex);
    onVerbLearned();
    
    toast({
      title: "¡Verbo frasal aprendido!",
      description: `Has marcado "${currentVerb.verb}" como aprendido.`,
    });
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-500 text-white";
      case "Intermediate": return "bg-yellow-500 text-white";
      case "Hard": return "bg-orange-500 text-white";
      case "UltraHard": return "bg-red-500 text-white";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Essential": return "bg-success";
      case "Common": return "bg-primary";
      case "Emotions": return "bg-accent";
      case "Daily Life": return "bg-warning";
      default: return "bg-muted";
    }
  };

  const resetSection = () => {
    setCurrentVerbIndex(0);
    setShowExamples(false);
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
            {phrasalVerbs.length} verbos disponibles
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
            ¡Has completado todos los {phrasalVerbs.length} verbos!
          </p>
          <Button variant="outline" onClick={resetSection}>
            Volver a practicar
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (phrasalVerbs.length === 0) {
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

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {verbsLearned} de {phrasalVerbs.length} verbos aprendidos
          </p>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="text-center mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <Badge className={getDifficultyColor(currentVerb.level)}>
                {currentVerb.level}
              </Badge>
              <Badge className={`${getCategoryColor(currentVerb.category)} text-white`}>
                {currentVerb.category}
              </Badge>
            </div>
            {learnedVerbs.has(currentVerbIndex) && (
              <div className="flex items-center text-success">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span className="text-sm">Aprendido</span>
              </div>
            )}
          </div>
          
          <h3 className="text-3xl font-bold text-primary mb-2">
            {currentVerb.verb}
          </h3>
          
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={playPronunciation}
              className="h-8 w-8"
            >
              <Volume2 className="h-4 w-4" />
            </Button>
          </div>

          <p className="text-lg font-medium text-foreground mb-4">
            {currentVerb.meaning}
          </p>
        </div>
        
        {!showExamples ? (
          <div className="text-center py-6">
            <div className="flex justify-center mb-6">
              <Lightbulb className="h-16 w-16 text-warning" />
            </div>
            <p className="text-muted-foreground mb-6">
              ¿Quieres ver ejemplos prácticos de cómo usar este phrasal verb?
            </p>
            <Button
              onClick={() => setShowExamples(true)}
              variant="default"
              size="lg"
            >
              Ver Ejemplos
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-left">
              <h3 className="font-semibold text-lg mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Ejemplos de uso:
              </h3>
              
              {currentVerb.examples.map((example, index) => (
                <div key={index} className="mb-6 p-4 bg-muted/30 rounded-lg">
                  <div className="mb-2">
                    <Badge variant="outline" className="mb-2">
                      {example.context}
                    </Badge>
                  </div>
                  <blockquote className="border-l-4 border-primary pl-4 italic mb-2">
                    "{example.sentence}"
                  </blockquote>
                  <p className="text-muted-foreground">
                    "{example.translation}"
                  </p>
                </div>
              ))}
            </div>
            
            {!learnedVerbs.has(currentVerbIndex) && canLearnMore && (
              <div className="flex justify-center pt-4">
                <Button
                  onClick={handleMarkAsLearned}
                  variant="default"
                  size="lg"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Marcar como Aprendido
                </Button>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-6">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentVerbIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            variant="outline"
            disabled={currentVerbIndex === phrasalVerbs.length - 1}
          >
            Siguiente
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhrasalVerbSection;