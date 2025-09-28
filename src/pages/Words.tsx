import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Volume2, 
  RotateCcw,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { incrementWordsLearned } from "@/utils/updateUserProgress";

const Words = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [learnedWords, setLearnedWords] = useState(new Set());

  const vocabulary = [
    {
      word: "Achievement",
      pronunciation: "/əˈtʃiːvmənt/",
      definition: "Logro, algo que se ha hecho o conseguido con éxito",
      example: "Graduating from university was a great achievement.",
      exampleTranslation: "Graduarse de la universidad fue un gran logro.",
      level: "Intermediate"
    },
    {
      word: "Brilliant",
      pronunciation: "/ˈbrɪljənt/",
      definition: "Brillante, muy inteligente o excepcional",
      example: "She came up with a brilliant solution to the problem.",
      exampleTranslation: "Ella ideó una solución brillante al problema.",
      level: "Basic"
    },
    {
      word: "Demonstrate",
      pronunciation: "/ˈdemənstreɪt/",
      definition: "Demostrar, mostrar claramente",
      example: "The teacher will demonstrate how to solve the equation.",
      exampleTranslation: "El profesor demostrará cómo resolver la ecuación.",
      level: "Advanced"
    },
    {
      word: "Fascinating",
      pronunciation: "/ˈfæsɪneɪtɪŋ/",
      definition: "Fascinante, extremadamente interesante",
      example: "The documentary about space was absolutely fascinating.",
      exampleTranslation: "El documental sobre el espacio fue absolutamente fascinante.",
      level: "Intermediate"
    },
    {
      word: "Opportunity",
      pronunciation: "/ˌɒpəˈtjuːnəti/",
      definition: "Oportunidad, momento favorable para hacer algo",
      example: "This job offer is a great opportunity for career growth.",
      exampleTranslation: "Esta oferta de trabajo es una gran oportunidad para el crecimiento profesional.",
      level: "Basic"
    }
  ];

  const currentWord = vocabulary[currentWordIndex];
  const progress = ((currentWordIndex + 1) / vocabulary.length) * 100;

  const handleNext = () => {
    if (currentWordIndex < vocabulary.length - 1) {
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
    const newLearnedWords = new Set(learnedWords);
    newLearnedWords.add(currentWordIndex);
    setLearnedWords(newLearnedWords);
    
    // Update user stats if user is logged in
    if (user) {
      await incrementWordsLearned(user.id);
    }
    
    toast({
      title: "¡Palabra aprendida!",
      description: `Has marcado "${currentWord.word}" como aprendida.`,
    });
    
    if (currentWordIndex < vocabulary.length - 1) {
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
      case "Basic": return "text-success";
      case "Intermediate": return "text-warning";
      case "Advanced": return "text-accent";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <BookOpen className="h-8 w-8 mr-3 text-primary" />
            Vocabulario
          </h1>
          <p className="text-muted-foreground mb-4">
            Aprende nuevas palabras y amplía tu vocabulario en inglés
          </p>
          
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progreso</span>
              <span className="text-sm text-muted-foreground">
                {currentWordIndex + 1} de {vocabulary.length}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        {/* Word Card */}
        <Card className="shadow-learning-lg mb-6">
          <CardHeader className="text-center pb-4">
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
            
            <CardTitle className="text-4xl font-bold text-primary mb-2">
              {currentWord.word}
            </CardTitle>
            
            <div className="flex items-center justify-center space-x-2">
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
          </CardHeader>
          
          <CardContent className="text-center">
            {!showDefinition ? (
              <div className="py-8">
                <p className="text-muted-foreground mb-6">
                  ¿Conoces el significado de esta palabra?
                </p>
                <Button
                  onClick={() => setShowDefinition(true)}
                  variant="gradient"
                  size="lg"
                >
                  Ver Definición
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-left">
                  <h3 className="font-semibold text-lg mb-2">Definición:</h3>
                  <p className="text-foreground mb-4">{currentWord.definition}</p>
                  
                  <h3 className="font-semibold text-lg mb-2">Ejemplo:</h3>
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
                    variant="success"
                    className="flex-1"
                    disabled={learnedWords.has(currentWordIndex)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {learnedWords.has(currentWordIndex) ? "Aprendida" : "Marcar como Aprendida"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentWordIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {learnedWords.size} de {vocabulary.length} palabras aprendidas
            </p>
          </div>
          
          <Button
            onClick={handleNext}
            variant="outline"
            disabled={currentWordIndex === vocabulary.length - 1}
          >
            Siguiente
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

export default Words;