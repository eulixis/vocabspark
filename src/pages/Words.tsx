import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
import { useDailyLimits } from "@/hooks/useDailyLimits";

const Words = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { getDailyLimits, incrementDailyUsage, getPlanName, userPlan } = useDailyLimits();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showDefinition, setShowDefinition] = useState(false);
  const [learnedWords, setLearnedWords] = useState(new Set());

  const vocabularyByPlan = {
    free: [ // Easy words for Noob users
      {
        word: "Cat",
        pronunciation: "/kæt/",
        definition: "Gato, animal doméstico peludo",
        example: "The cat is sleeping on the sofa.",
        exampleTranslation: "El gato está durmiendo en el sofá.",
        level: "Easy"
      },
      {
        word: "Book",
        pronunciation: "/bʊk/",
        definition: "Libro, objeto para leer",
        example: "I read a good book yesterday.",
        exampleTranslation: "Leí un buen libro ayer.",
        level: "Easy"
      },
      {
        word: "Happy",
        pronunciation: "/ˈhæpi/",
        definition: "Feliz, que siente alegría",
        example: "She looks very happy today.",
        exampleTranslation: "Ella se ve muy feliz hoy.",
        level: "Easy"
      },
      {
        word: "Water",
        pronunciation: "/ˈwɔːtər/",
        definition: "Agua, líquido transparente esencial",
        example: "Please drink more water.",
        exampleTranslation: "Por favor bebe más agua.",
        level: "Easy"
      },
      {
        word: "House",
        pronunciation: "/haʊs/",
        definition: "Casa, lugar donde se vive",
        example: "Their house has a beautiful garden.",
        exampleTranslation: "Su casa tiene un jardín hermoso.",
        level: "Easy"
      }
    ],
    basic: [ // Intermediate words for Basic users
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
        level: "Intermediate"
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
        level: "Intermediate"
      },
      {
        word: "Consider",
        pronunciation: "/kənˈsɪdər/",
        definition: "Considerar, pensar cuidadosamente sobre algo",
        example: "You should consider all your options before deciding.",
        exampleTranslation: "Deberías considerar todas tus opciones antes de decidir.",
        level: "Intermediate"
      }
    ],
    medium: [ // Hard words for Medium users
      {
        word: "Demonstrate",
        pronunciation: "/ˈdemənstreɪt/",
        definition: "Demostrar, mostrar claramente",
        example: "The teacher will demonstrate how to solve the equation.",
        exampleTranslation: "El profesor demostrará cómo resolver la ecuación.",
        level: "Hard"
      },
      {
        word: "Comprehensive",
        pronunciation: "/ˌkɒmprɪˈhensɪv/",
        definition: "Comprensivo, completo y detallado",
        example: "The report provides a comprehensive analysis of the market.",
        exampleTranslation: "El informe proporciona un análisis comprensivo del mercado.",
        level: "Hard"
      },
      {
        word: "Substantial",
        pronunciation: "/səbˈstænʃəl/",
        definition: "Sustancial, considerable en importancia o tamaño",
        example: "There was a substantial increase in profits this year.",
        exampleTranslation: "Hubo un aumento sustancial en las ganancias este año.",
        level: "Hard"
      },
      {
        word: "Nevertheless",
        pronunciation: "/ˌnevərðəˈles/",
        definition: "Sin embargo, a pesar de eso",
        example: "The weather was bad; nevertheless, we went hiking.",
        exampleTranslation: "El clima estaba malo; sin embargo, fuimos de excursión.",
        level: "Hard"
      },
      {
        word: "Circumstances",
        pronunciation: "/ˈsɜːrkəmstænsɪz/",
        definition: "Circunstancias, condiciones que afectan una situación",
        example: "Under these circumstances, we must postpone the meeting.",
        exampleTranslation: "Bajo estas circunstancias, debemos posponer la reunión.",
        level: "Hard"
      }
    ],
    pro: [ // UltraHard words for Pro users
      {
        word: "Quintessential",
        pronunciation: "/ˌkwɪntɪˈsenʃəl/",
        definition: "Quintaesencial, que representa la esencia perfecta de algo",
        example: "She is the quintessential professional in her field.",
        exampleTranslation: "Ella es la profesional quintaesencial en su campo.",
        level: "UltraHard"
      },
      {
        word: "Juxtaposition",
        pronunciation: "/ˌdʒʌkstəpəˈzɪʃən/",
        definition: "Yuxtaposición, colocación de elementos contrastantes lado a lado",
        example: "The juxtaposition of old and new architecture creates visual interest.",
        exampleTranslation: "La yuxtaposición de arquitectura antigua y nueva crea interés visual.",
        level: "UltraHard"
      },
      {
        word: "Ubiquitous",
        pronunciation: "/juːˈbɪkwɪtəs/",
        definition: "Ubicuo, que existe o está presente en todas partes",
        example: "Smartphones have become ubiquitous in modern society.",
        exampleTranslation: "Los teléfonos inteligentes se han vuelto ubicuos en la sociedad moderna.",
        level: "UltraHard"
      },
      {
        word: "Serendipitous",
        pronunciation: "/ˌserənˈdɪpɪtəs/",
        definition: "Serendípico, que ocurre de manera afortunada por casualidad",
        example: "Their meeting was serendipitous and led to a great collaboration.",
        exampleTranslation: "Su encuentro fue serendípico y llevó a una gran colaboración.",
        level: "UltraHard"
      },
      {
        word: "Perspicacious",
        pronunciation: "/ˌpɜːrspɪˈkeɪʃəs/",
        definition: "Perspicaz, que tiene una percepción muy aguda y discernimiento",
        example: "Her perspicacious analysis revealed the root of the problem.",
        exampleTranslation: "Su análisis perspicaz reveló la raíz del problema.",
        level: "UltraHard"
      }
    ]
  };

  const vocabulary = vocabularyByPlan[userPlan as keyof typeof vocabularyByPlan] || vocabularyByPlan.free;

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
    // Check daily limits
    const limits = getDailyLimits();
    
    if (!limits.canLearnMore) {
      toast({
        title: "Límite diario alcanzado",
        description: `Has alcanzado tu límite de ${limits.dailyLimit} palabras por día con el plan ${getPlanName(userPlan)}.`,
        variant: "destructive"
      });
      return;
    }

    const newLearnedWords = new Set(learnedWords);
    newLearnedWords.add(currentWordIndex);
    setLearnedWords(newLearnedWords);
    
    // Update daily usage and user stats if user is logged in
    if (user) {
      const usageResult = await incrementDailyUsage();
      if (usageResult.success) {
        await incrementWordsLearned(user.id);
      }
    }
    
    const newLimits = getDailyLimits();
    toast({
      title: "¡Palabra aprendida!",
      description: `Has marcado "${currentWord.word}" como aprendida. Te quedan ${newLimits.remainingWords - 1} palabras hoy.`,
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
      case "Easy": return "text-green-600";
      case "Intermediate": return "text-yellow-600";
      case "Hard": return "text-orange-600";
      case "UltraHard": return "text-red-600";
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

          {/* Daily Limits */}
          <Card className="mb-6 bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-sm">
                    <p className="font-medium">Límite diario</p>
                    <p className="text-muted-foreground">
                      {getDailyLimits().wordsLearned} / {getDailyLimits().dailyLimit} palabras
                    </p>
                  </div>
                  <Progress 
                    value={(getDailyLimits().wordsLearned / getDailyLimits().dailyLimit) * 100} 
                    className="w-24 h-2" 
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={userPlan === 'free' ? 'secondary' : 'default'} className="text-xs">
                    Plan {getPlanName(userPlan)}
                  </Badge>
                  {!getDailyLimits().canLearnMore && (
                    <Badge variant="destructive" className="text-xs">
                      Límite alcanzado
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
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
                    disabled={learnedWords.has(currentWordIndex) || !getDailyLimits().canLearnMore}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {learnedWords.has(currentWordIndex) 
                      ? "Aprendida" 
                      : !getDailyLimits().canLearnMore 
                        ? "Límite diario alcanzado"
                        : "Marcar como Aprendida"
                    }
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