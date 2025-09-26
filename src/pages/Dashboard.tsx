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

const Dashboard = () => {
  const { user } = useAuth();

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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          ¡Hola, {user?.email?.split('@')[0]}! 👋
        </h1>
        <p className="text-muted-foreground">
          Continúa aprendiendo inglés hoy
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
                <span>Principiante</span>
              </div>
              <Progress value={25} className="h-2" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary">15</div>
                <div className="text-xs text-muted-foreground">Palabras</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">3</div>
                <div className="text-xs text-muted-foreground">Juegos</div>
              </div>
              <div>
                <div className="text-lg font-bold text-primary">2</div>
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
              <Badge variant="secondary">2/5</Badge>
            </div>
            <Progress value={40} className="h-2" />
            <p className="text-xs text-muted-foreground">
              ¡Sigue así! Solo faltan 3 palabras más.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;