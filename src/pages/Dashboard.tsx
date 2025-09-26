import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Gamepad2, 
  MessageSquareText, 
  Crown, 
  Trophy,
  Target,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface UserStats {
  words_learned: number;
  games_completed: number;
  phrasal_verbs_learned: number;
  current_streak: number;
  level_progress: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>({
    words_learned: 0,
    games_completed: 0,
    phrasal_verbs_learned: 0,
    current_streak: 0,
    level_progress: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user stats:', error);
        } else if (data) {
          setUserStats(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [user]);

  const quickActions = [
    {
      title: "Palabras",
      description: "Aprende vocabulario nuevo",
      icon: BookOpen,
      link: "/words",
      color: "bg-blue-500"
    },
    {
      title: "Juegos",
      description: "Practica jugando",
      icon: Gamepad2,
      link: "/games",
      color: "bg-green-500"
    },
    {
      title: "Verbos Frasales",
      description: "Domina expresiones",
      icon: MessageSquareText,
      link: "/phrasal-verbs",
      color: "bg-purple-500"
    },
    {
      title: "Premium",
      description: "Mejora tu plan",
      icon: Crown,
      link: "/premium",
      color: "bg-gradient-to-r from-yellow-400 to-orange-500"
    }
  ];

  const getLevelName = (progress: number) => {
    if (progress < 25) return "Principiante";
    if (progress < 50) return "Básico";
    if (progress < 75) return "Intermedio";
    return "Avanzado";
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          ¡Hola, {user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          {userStats.words_learned === 0 ? 
            "¡Bienvenido! Comienza tu viaje de aprendizaje hoy" :
            "Continúa aprendiendo inglés hoy"
          }
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5" />
            <span>Tu Progreso</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Nivel Actual</span>
                <span>{getLevelName(userStats.level_progress)}</span>
              </div>
              <Progress value={userStats.level_progress} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary">{userStats.words_learned}</div>
                <div className="text-xs text-muted-foreground">Palabras</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">{userStats.games_completed}</div>
                <div className="text-xs text-muted-foreground">Juegos</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">{userStats.current_streak}</div>
                <div className="text-xs text-muted-foreground">Días</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">¿Qué quieres hacer hoy?</h2>
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.link}>
              <Card className="hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="p-4 text-center space-y-2">
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mx-auto`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-medium text-sm">{action.title}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Today's Goal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Meta de Hoy</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Aprender 5 palabras nuevas</span>
              <Badge variant="secondary">{Math.min(userStats.words_learned, 5)}/5</Badge>
            </div>
            <Progress value={(Math.min(userStats.words_learned, 5) / 5) * 100} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {userStats.words_learned >= 5 ? 
                "¡Felicidades! Has completado tu meta de hoy" :
                `¡Sigue así! Solo faltan ${5 - userStats.words_learned} palabras más.`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;