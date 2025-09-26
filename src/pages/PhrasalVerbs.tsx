import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Volume2, 
  CheckCircle,
  ArrowLeft,
  ArrowRight,
  Lightbulb,
  Target,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PhrasalVerbs = () => {
  const { toast } = useToast();
  const [currentVerbIndex, setCurrentVerbIndex] = useState(0);
  const [showExamples, setShowExamples] = useState(false);
  const [masteredVerbs, setMasteredVerbs] = useState(new Set());

  const phrasalVerbs = [
    {
      verb: "Break down",
      meaning: "Averiarse, dejar de funcionar",
      examples: [
        {
          sentence: "My car broke down on the highway.",
          translation: "Mi auto se averió en la autopista.",
          context: "Mechanical failure"
        },
        {
          sentence: "She broke down in tears after the news.",
          translation: "Ella se desplomó en lágrimas después de la noticia.",
          context: "Emotional collapse"
        }
      ],
      difficulty: "Intermediate",
      category: "Common"
    },
    {
      verb: "Give up",
      meaning: "Rendirse, abandonar",
      examples: [
        {
          sentence: "Don't give up on your dreams.",
          translation: "No te rindas con tus sueños.",
          context: "Motivation"
        },
        {
          sentence: "I gave up smoking last year.",
          translation: "Dejé de fumar el año pasado.",
          context: "Quit a habit"
        }
      ],
      difficulty: "Basic",
      category: "Essential"
    },
    {
      verb: "Look forward to",
      meaning: "Esperar con ansias",
      examples: [
        {
          sentence: "I'm looking forward to the weekend.",
          translation: "Estoy esperando con ansias el fin de semana.",
          context: "Anticipation"
        },
        {
          sentence: "She looks forward to meeting you.",
          translation: "Ella espera con ansias conocerte.",
          context: "Future plans"
        }
      ],
      difficulty: "Intermediate",
      category: "Emotions"
    },
    {
      verb: "Run out of",
      meaning: "Quedarse sin algo",
      examples: [
        {
          sentence: "We ran out of milk.",
          translation: "Se nos acabó la leche.",
          context: "Depletion"
        },
        {
          sentence: "Time is running out.",
          translation: "El tiempo se está agotando.",
          context: "Urgency"
        }
      ],
      difficulty: "Basic",
      category: "Daily Life"
    },
    {
      verb: "Put up with",
      meaning: "Soportar, tolerar",
      examples: [
        {
          sentence: "I can't put up with this noise anymore.",
          translation: "Ya no puedo soportar más este ruido.",
          context: "Tolerance"
        },
        {
          sentence: "She puts up with a lot at work.",
          translation: "Ella soporta mucho en el trabajo.",
          context: "Endurance"
        }
      ],
      difficulty: "Advanced",
      category: "Emotions"
    }
  ];

  const currentVerb = phrasalVerbs[currentVerbIndex];
  const progress = ((currentVerbIndex + 1) / phrasalVerbs.length) * 100;

  const handleNext = () => {
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

  const handleMarkAsMastered = () => {
    const newMasteredVerbs = new Set(masteredVerbs);
    newMasteredVerbs.add(currentVerbIndex);
    setMasteredVerbs(newMasteredVerbs);
    
    toast({
      title: "¡Verbo dominado!",
      description: `Has marcado "${currentVerb.verb}" como dominado.`,
    });
    
    if (currentVerbIndex < phrasalVerbs.length - 1) {
      setTimeout(() => handleNext(), 1000);
    }
  };

  const playPronunciation = () => {
    toast({
      title: "Pronunciación",
      description: "Función de audio próximamente disponible",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Basic": return "bg-tier-basic text-white";
      case "Intermediate": return "bg-tier-medium text-white";
      case "Advanced": return "bg-tier-pro text-white";
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <BookOpen className="h-8 w-8 mr-3 text-primary" />
            Verbos Frasales
          </h1>
          <p className="text-muted-foreground mb-4">
            Domina los phrasal verbs más importantes del inglés con ejemplos prácticos
          </p>
          
          {/* Progress */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progreso</span>
              <span className="text-sm text-muted-foreground">
                {currentVerbIndex + 1} de {phrasalVerbs.length}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>
        </div>

        {/* Verb Card */}
        <Card className="shadow-learning-lg mb-6">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-2">
                <Badge className={getDifficultyColor(currentVerb.difficulty)}>
                  {currentVerb.difficulty}
                </Badge>
                <Badge className={`${getCategoryColor(currentVerb.category)} text-white`}>
                  {currentVerb.category}
                </Badge>
              </div>
              {masteredVerbs.has(currentVerbIndex) && (
                <div className="flex items-center text-success">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  <span className="text-sm">Dominado</span>
                </div>
              )}
            </div>
            
            <CardTitle className="text-4xl font-bold text-primary mb-2">
              {currentVerb.verb}
            </CardTitle>
            
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={playPronunciation}
                className="h-8 w-8"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>

            <CardDescription className="text-lg font-medium text-foreground">
              {currentVerb.meaning}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            {!showExamples ? (
              <div className="py-8">
                <div className="flex justify-center mb-6">
                  <Lightbulb className="h-16 w-16 text-warning" />
                </div>
                <p className="text-muted-foreground mb-6">
                  ¿Quieres ver ejemplos prácticos de cómo usar este phrasal verb?
                </p>
                <Button
                  onClick={() => setShowExamples(true)}
                  variant="gradient"
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
                
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <Button
                    onClick={() => setShowExamples(false)}
                    variant="outline"
                    className="flex-1"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Revisar Definición
                  </Button>
                  <Button
                    onClick={handleMarkAsMastered}
                    variant="success"
                    className="flex-1"
                    disabled={masteredVerbs.has(currentVerbIndex)}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    {masteredVerbs.has(currentVerbIndex) ? "Dominado" : "Marcar como Dominado"}
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
            disabled={currentVerbIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {masteredVerbs.size} de {phrasalVerbs.length} verbos dominados
            </p>
          </div>
          
          <Button
            onClick={handleNext}
            variant="outline"
            disabled={currentVerbIndex === phrasalVerbs.length - 1}
          >
            Siguiente
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  };

export default PhrasalVerbs;