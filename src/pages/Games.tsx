import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Gamepad2, 
  Target, 
  Clock,
  Trophy,
  RefreshCw,
  CheckCircle,
  X,
  Headphones,
  BookOpen,
  Zap,
  Star,
  Lock,
  Crown,
  Type,
  Volume2,
  Brain,
  Timer,
  Shuffle,
  Layers
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { incrementGamesCompleted } from "@/utils/updateUserProgress";
import { supabase } from "@/integrations/supabase/client";

const Games = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentGame, setCurrentGame] = useState("wordMatch");
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [userPlan, setUserPlan] = useState<string>("free");
  const [currentQuestions, setCurrentQuestions] = useState<any[]>([]);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  // Fetch user plan
  useEffect(() => {
    const fetchUserPlan = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('premium_plan')
          .eq('user_id', user.id)
          .single();
        
        if (data && !error) {
          setUserPlan(data.premium_plan || 'free');
        }
      } catch (error) {
        console.error('Error fetching user plan:', error);
      }
    };
    
    fetchUserPlan();
  }, [user]);

  const allGames = [
    // Free games (available to everyone)
    {
      id: "wordMatch",
      title: "Coincidencia de Palabras",
      description: "Relaciona las palabras en inglés con su traducción",
      icon: Target,
      color: "bg-gradient-primary",
      difficulty: "Easy",
      requiredPlan: "free"
    },
    {
      id: "fillBlanks",
      title: "Completar Oraciones",
      description: "Completa las oraciones con la palabra correcta",
      icon: Type,
      color: "bg-gradient-secondary",
      difficulty: "Easy",
      requiredPlan: "free"
    },
    
    // Basic plan games
    {
      id: "pronunciation",
      title: "Pronunciación",
      description: "Escucha y selecciona la palabra correcta",
      icon: Volume2,
      color: "bg-tier-basic",
      difficulty: "Intermediate",
      requiredPlan: "basic"
    },
    {
      id: "speedWords",
      title: "Palabras Rápidas",
      description: "Responde lo más rápido que puedas",
      icon: Timer,
      color: "bg-gradient-primary",
      difficulty: "Intermediate", 
      requiredPlan: "basic"
    },

    // Medium plan games
    {
      id: "listeningComp",
      title: "Comprensión Auditiva",
      description: "Escucha y responde preguntas complejas",
      icon: Headphones,
      color: "bg-tier-medium",
      difficulty: "Hard",
      requiredPlan: "medium"
    },
    {
      id: "wordBuilder",
      title: "Constructor de Palabras",
      description: "Forma palabras con letras desordenadas",
      icon: Layers,
      color: "bg-gradient-secondary",
      difficulty: "Hard",
      requiredPlan: "medium"
    },
    {
      id: "contextClues",
      title: "Pistas de Contexto",
      description: "Deduce el significado por el contexto",
      icon: Brain,
      color: "bg-tier-medium",
      difficulty: "Hard",
      requiredPlan: "medium"
    },
    {
      id: "phrasalChallenge",
      title: "Desafío Phrasal Verbs",
      description: "Domina los verbos frasales más difíciles",
      icon: Zap,
      color: "bg-gradient-primary",
      difficulty: "Hard",
      requiredPlan: "medium"
    },

    // Pro plan games
    {
      id: "nativeSpeed",
      title: "Velocidad Nativa",
      description: "Comprende inglés a velocidad nativa",
      icon: Star,
      color: "bg-tier-pro",
      difficulty: "Ultra Hard",
      requiredPlan: "pro"
    },
    {
      id: "idiomsExpert",
      title: "Experto en Idioms",
      description: "Domina las expresiones más complejas",
      icon: Crown,
      color: "bg-tier-pro",
      difficulty: "Ultra Hard",
      requiredPlan: "pro"
    },
    {
      id: "businessEnglish",
      title: "Inglés de Negocios",
      description: "Vocabulario profesional avanzado",
      icon: Trophy,
      color: "bg-gradient-secondary",
      difficulty: "Ultra Hard",
      requiredPlan: "pro"
    },
    {
      id: "masterChallenge",
      title: "Desafío Maestro",
      description: "El reto definitivo para expertos",
      icon: Shuffle,
      color: "bg-tier-pro",
      difficulty: "Ultra Hard",
      requiredPlan: "pro"
    }
  ];

  const getAvailableGames = () => {
    const planHierarchy = {
      free: ["free"],
      basic: ["free", "basic"], 
      medium: ["free", "basic", "medium"],
      pro: ["free", "basic", "medium", "pro"]
    };
    
    const allowedPlans = planHierarchy[userPlan as keyof typeof planHierarchy] || ["free"];
    return allGames.filter(game => allowedPlans.includes(game.requiredPlan));
  };

  const games = getAvailableGames();

  const gameQuestions = {
    wordMatch: [
      {
        question: "Selecciona la traducción correcta de 'Achievement'",
        options: ["Logro", "Intento", "Problema", "Solución"],
        correct: "Logro"
      },
      {
        question: "¿Qué significa 'Brilliant'?",
        options: ["Oscuro", "Brillante", "Pequeño", "Grande"],
        correct: "Brillante"
      },
      {
        question: "Traducción de 'Opportunity'",
        options: ["Problema", "Oportunidad", "Dificultad", "Obstáculo"],
        correct: "Oportunidad"
      }
    ],
    fillBlanks: [
      {
        question: "I need to _____ my homework before dinner.",
        options: ["finish", "start", "forget", "skip"],
        correct: "finish"
      },
      {
        question: "She _____ to the store every morning.",
        options: ["went", "goes", "going", "gone"],
        correct: "goes"
      },
      {
        question: "The weather is _____ beautiful today.",
        options: ["very", "much", "more", "most"],
        correct: "very"
      }
    ],
    pronunciation: [
      {
        question: "¿Cómo se pronuncia 'Thought'?",
        options: ["θɔːt", "taʊt", "θruː", "θɪŋk"],
        correct: "θɔːt"
      },
      {
        question: "Selecciona la pronunciación de 'Colonel'",
        options: ["ˈkɜːrnəl", "kəˈloʊnəl", "ˈkoʊlənəl", "ˈkɒlənəl"],
        correct: "ˈkɜːrnəl"
      }
    ],
    speedWords: [
      {
        question: "Fast translation: 'Book'",
        options: ["Libro", "Mesa", "Casa", "Perro"],
        correct: "Libro"
      },
      {
        question: "Quick! 'Water' means:",
        options: ["Fuego", "Aire", "Agua", "Tierra"],
        correct: "Agua"
      }
    ],
    listeningComp: [
      {
        question: "After listening: What did John do yesterday?",
        options: ["Went shopping", "Studied English", "Played soccer", "Cooked dinner"],
        correct: "Studied English"
      }
    ],
    wordBuilder: [
      {
        question: "Unscramble: TEUFRUR",
        options: ["FUTURE", "FURNITURE", "FEATURE", "CAPTURE"],
        correct: "FUTURE"
      }
    ],
    contextClues: [
      {
        question: "The CEO was very 'perspicacious' in his analysis. This means:",
        options: ["Confused", "Sharp-minded", "Lazy", "Angry"],
        correct: "Sharp-minded"
      }
    ],
    phrasalChallenge: [
      {
        question: "What does 'call off' mean?",
        options: ["Cancel", "Telephone", "Shout", "Remember"],
        correct: "Cancel"
      }
    ],
    nativeSpeed: [
      {
        question: "Native speed: 'I'd've done it if I could've'",
        options: ["I would have done it if I could have", "I did it because I could", "I will do it when I can", "I should do it now"],
        correct: "I would have done it if I could have"
      }
    ],
    idiomsExpert: [
      {
        question: "What does 'Beat around the bush' mean?",
        options: ["Hit plants", "Avoid the main topic", "Win a competition", "Work in garden"],
        correct: "Avoid the main topic"
      }
    ],
    businessEnglish: [
      {
        question: "In a merger, what does 'due diligence' refer to?",
        options: ["Working hard", "Legal investigation", "Being punctual", "Paying bills"],
        correct: "Legal investigation"
      }
    ],
    masterChallenge: [
      {
        question: "Identify the grammatical error: 'Between you and I, this is challenging'",
        options: ["No error", "Should be 'you and me'", "Should be 'you and myself'", "Should be 'yourself and I'"],
        correct: "Should be 'you and me'"
      }
    ]
  };

  const currentQuestionData = currentQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / currentQuestions.length) * 100;

  const startGame = () => {
    const initialQuestions = [...(gameQuestions[currentGame as keyof typeof gameQuestions] || gameQuestions.wordMatch)];
    setCurrentQuestions(initialQuestions);
    setGameStarted(true);
    setScore(0);
    setCurrentQuestion(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setShowResult(false);
    
    // Start timer
    const gameTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(gameTimer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(gameTimer);
  };

  const handleTimeUp = () => {
    if (!showResult) {
      setShowResult(true);
      toast({
        title: "¡Tiempo agotado!",
        description: "Se acabó el tiempo para esta pregunta.",
        variant: "destructive",
      });
      
      // Move question to end and continue after delay
      setTimeout(() => {
        moveCurrentQuestionToEnd();
        nextQuestion();
      }, 2000);
    }
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    
    if (timer) {
      clearInterval(timer);
    }
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === currentQuestionData.correct;
    if (isCorrect) {
      setScore(score + 10);
      toast({
        title: "¡Correcto!",
        description: "Respuesta correcta. +10 puntos",
      });
      // Continue to next question after delay
      setTimeout(() => {
        nextQuestion();
      }, 1500);
    } else {
      toast({
        title: "Incorrecto",
        description: `La respuesta correcta es: ${currentQuestionData.correct}`,
        variant: "destructive",
      });
      // Move incorrect question to end and continue after delay
      setTimeout(() => {
        moveCurrentQuestionToEnd();
        nextQuestion();
      }, 2500);
    }
  };

  const moveCurrentQuestionToEnd = () => {
    const updatedQuestions = [...currentQuestions];
    const currentQ = updatedQuestions[currentQuestion];
    updatedQuestions.splice(currentQuestion, 1);
    updatedQuestions.push(currentQ);
    setCurrentQuestions(updatedQuestions);
  };

  const nextQuestion = async () => {
    if (currentQuestion < currentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(30);
      
      // Start new timer
      const gameTimer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(gameTimer);
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setTimer(gameTimer);
    } else {
      // Game completed
      setGameStarted(false);
      
      // Update user stats if user is logged in
      if (user) {
        await incrementGamesCompleted(user.id);
      }
      
      toast({
        title: "¡Juego completado!",
        description: `Puntuación final: ${score} puntos`,
      });
    }
  };

  const handleGameSelect = (gameId: string) => {
    if (isGameLocked(allGames.find(g => g.id === gameId))) return;
    
    setCurrentGame(gameId);
    startGame();
  };

  const isGameLocked = (game: any) => {
    const planHierarchy = {
      free: ["free"],
      basic: ["free", "basic"], 
      medium: ["free", "basic", "medium"],
      pro: ["free", "basic", "medium", "pro"]
    };
    
    const allowedPlans = planHierarchy[userPlan as keyof typeof planHierarchy] || ["free"];
    return !allowedPlans.includes(game.requiredPlan);
  };

  const resetGame = () => {
    if (timer) {
      clearInterval(timer);
    }
    setGameStarted(false);
    setScore(0);
    setCurrentQuestion(0);
    setTimeLeft(30);
    setSelectedAnswer(null);
    setShowResult(false);
    setCurrentQuestions([]);
  };

  const getAnswerStyle = (option: string) => {
    if (!showResult) return "hover:bg-accent/50";
    if (option === currentQuestionData.correct) return "bg-success text-success-foreground";
    if (option === selectedAnswer && option !== currentQuestionData.correct) {
      return "bg-destructive text-destructive-foreground";
    }
    return "bg-muted";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4 flex items-center">
            <Gamepad2 className="h-8 w-8 mr-3 text-primary" />
            Juegos Interactivos
          </h1>
          <p className="text-muted-foreground mb-6">
            Practica tu inglés de manera divertida con estos juegos educativos
          </p>
          
          {/* Plan Statistics */}
          <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Tu Plan Actual: {
                    userPlan === "free" ? "Noob (Gratis)" :
                    userPlan === "basic" ? "Básico" :
                    userPlan === "medium" ? "Medium" :
                    userPlan === "pro" ? "Pro" : "Noob"
                  }</h3>
                  <p className="text-sm text-muted-foreground">
                    Juegos disponibles: {games.length} de {allGames.length}
                  </p>
                </div>
                <div className="text-right">
                  {userPlan !== "pro" && (
                    <Button variant="outline" size="sm" asChild>
                      <a href="/premium">
                        <Crown className="h-4 w-4 mr-2" />
                        Mejorar Plan
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {!gameStarted ? (
          <>
            {/* Game Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {allGames.map((game) => {
                const locked = isGameLocked(game);
                return (
                  <Card 
                    key={game.id}
                    className={`transition-all duration-300 ${
                      locked 
                        ? 'opacity-60 cursor-not-allowed' 
                        : `cursor-pointer hover:shadow-learning-lg hover:-translate-y-1 ${
                            currentGame === game.id ? 'ring-2 ring-primary' : ''
                          }`
                    }`}
                    onClick={() => !locked && handleGameSelect(game.id)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start mb-3">
                        <div className={`w-12 h-12 rounded-lg ${game.color} flex items-center justify-center`}>
                          {locked ? <Lock className="h-6 w-6 text-white" /> : <game.icon className="h-6 w-6 text-white" />}
                        </div>
                        <Badge 
                          variant={
                            game.difficulty === "Easy" ? "secondary" :
                            game.difficulty === "Intermediate" ? "default" :
                            game.difficulty === "Hard" ? "destructive" : "outline"
                          }
                          className="text-xs"
                        >
                          {game.difficulty}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{game.title}</CardTitle>
                      <CardDescription>{game.description}</CardDescription>
                      {locked && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Requiere plan {game.requiredPlan === "basic" ? "Básico" : 
                                        game.requiredPlan === "medium" ? "Medium" : "Pro"}
                        </p>
                      )}
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
          </>
        ) : (
          <Card className="shadow-learning-lg">
            <CardHeader>
              {/* Game Stats */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-primary">
                    <Trophy className="h-5 w-5 mr-1" />
                    <span className="font-bold">{score} pts</span>
                  </div>
                  <div className="flex items-center text-warning">
                    <Clock className="h-5 w-5 mr-1" />
                    <span className="font-bold">{timeLeft}s</span>
                  </div>
                </div>
                <Button
                  onClick={resetGame}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reiniciar
                </Button>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progreso</span>
                  <span className="text-sm text-muted-foreground">
                    Pregunta {currentQuestion + 1} de {currentQuestions.length}
                  </span>
                </div>
                <Progress value={progress} className="h-3" />
              </div>

              <CardTitle className="text-xl text-center">
                {currentQuestionData.question}
              </CardTitle>
            </CardHeader>

            <CardContent>
              {/* Answer Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {currentQuestionData.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    variant="outline"
                    className={`h-16 text-lg ${getAnswerStyle(option)}`}
                    disabled={showResult}
                  >
                    {option}
                    {showResult && option === currentQuestionData.correct && (
                      <CheckCircle className="h-5 w-5 ml-2" />
                    )}
                    {showResult && option === selectedAnswer && option !== currentQuestionData.correct && (
                      <X className="h-5 w-5 ml-2" />
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

export default Games;