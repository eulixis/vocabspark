import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Gamepad2, 
  Target, 
  Lock,
  Crown,
  Type,
  Volume2,
  Brain,
  Timer,
  Shuffle,
  Layers,
  Headphones,
  Zap,
  Star,
  Trophy
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { incrementGamesCompleted } from "@/utils/updateUserProgress";
import { supabase } from "@/integrations/supabase/client";
import { GameWrapper } from "@/components/games/GameWrapper";

const Games = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [userPlan, setUserPlan] = useState<string>("free");

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

  const handleGameSelect = (gameId: string) => {
    const game = allGames.find(g => g.id === gameId);
    if (isGameLocked(game)) return;
    
    setCurrentGame(gameId);
    setGameStarted(true);
  };

  const handleGameComplete = async (score: number) => {
    setGameStarted(false);
    
    if (user) {
      await incrementGamesCompleted(user.id);
    }
    
    toast({
      title: "¡Juego completado!",
      description: `Puntuación final: ${score} puntos`,
    });
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
    setGameStarted(false);
    setCurrentGame(null);
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
          currentGame && <GameWrapper gameId={currentGame} onComplete={handleGameComplete} onReset={resetGame} />
        )}
      </div>
    );
  };

export default Games;