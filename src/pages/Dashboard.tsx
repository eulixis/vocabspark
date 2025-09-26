import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Navbar from "@/components/Navbar";
import { 
  BookOpen, 
  Gamepad2, 
  MessageSquareText, 
  Crown, 
  Trophy,
  Target,
  Calendar,
  TrendingUp 
} from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

const Dashboard = () => {
  const learningStats = [
    { label: "Palabras aprendidas", value: 247, total: 1000, color: "bg-success" },
    { label: "Verbos frasales", value: 38, total: 150, color: "bg-warning" },
    { label: "Juegos completados", value: 15, total: 50, color: "bg-accent" },
  ];

  const quickActions = [
    {
      title: "Aprender Palabras",
      description: "Amplía tu vocabulario con nuevas palabras",
      icon: MessageSquareText,
      to: "/words",
      color: "bg-gradient-primary"
    },
    {
      title: "Jugar",
      description: "Practica de forma divertida",
      icon: Gamepad2,
      to: "/games",
      color: "bg-gradient-secondary"
    },
    {
      title: "Verbos Frasales",
      description: "Domina las expresiones en inglés",
      icon: BookOpen,
      to: "/phrasal-verbs",
      color: "bg-gradient-primary"
    },
    {
      title: "Obtener Premium",
      description: "Desbloquea todo el contenido",
      icon: Crown,
      to: "/premium",
      color: "bg-gradient-secondary"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-primary">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                ¡Bienvenido de vuelta!
              </h1>
              <p className="text-xl mb-6 text-white/90">
                Continúa tu viaje de aprendizaje de inglés. Estás haciendo un gran progreso.
              </p>
              <div className="flex items-center space-x-4">
                <Trophy className="h-6 w-6 text-warning" />
                <span className="text-lg">Racha de 7 días</span>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Aprendizaje de inglés"
                className="rounded-lg shadow-learning-glow"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Stats */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Target className="h-6 w-6 mr-2 text-primary" />
            Tu Progreso
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningStats.map((stat, index) => (
              <Card key={index} className="shadow-learning-sm hover:shadow-learning-md transition-all duration-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{stat.label}</CardTitle>
                  <CardDescription className="text-2xl font-bold text-foreground">
                    {stat.value}/{stat.total}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress 
                    value={(stat.value / stat.total) * 100} 
                    className="h-3"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    {Math.round((stat.value / stat.total) * 100)}% completado
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <TrendingUp className="h-6 w-6 mr-2 text-primary" />
            Continuar Aprendiendo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.to}>
                <Card className="h-full hover:shadow-learning-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-200`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{action.title}</CardTitle>
                    <CardDescription>{action.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      Comenzar
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;