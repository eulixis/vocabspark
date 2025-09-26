import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Smartphone, Globe, Users, Star, ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

const Index = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Vocabulario Extenso",
      description: "Aprende miles de palabras con definiciones, ejemplos y pronunciación"
    },
    {
      icon: Smartphone,
      title: "App Nativa",
      description: "Disponible para Android con funciones offline"
    },
    {
      icon: Globe,
      title: "Verbos Frasales",
      description: "Domina las expresiones más comunes del inglés"
    },
    {
      icon: Users,
      title: "Juegos Interactivos",
      description: "Practica de forma divertida con juegos educativos"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                LearnEnglish
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Iniciar Sesión</Button>
              </Link>
              <Link to="/register">
                <Button variant="gradient">Registrarse</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Aprende Inglés de Forma
                <span className="block text-warning">Inteligente</span>
              </h1>
              <p className="text-xl mb-8 text-white/90">
                La aplicación móvil que revoluciona el aprendizaje del inglés con juegos interactivos, 
                vocabulario extenso y verbos frasales. ¡Disponible para Android!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/register">
                  <Button size="lg" variant="secondary" className="text-lg px-8">
                    Comenzar Gratis
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8 border-white text-white hover:bg-white hover:text-primary">
                    Ya tengo cuenta
                  </Button>
                </Link>
              </div>
              <div className="flex items-center mt-8 space-x-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-warning fill-current" />
                  <Star className="h-5 w-5 text-warning fill-current" />
                  <Star className="h-5 w-5 text-warning fill-current" />
                  <Star className="h-5 w-5 text-warning fill-current" />
                  <Star className="h-5 w-5 text-warning fill-current" />
                  <span className="ml-2 text-white/90">4.9/5 en reviews</span>
                </div>
                <div className="text-white/90">
                  <span className="font-bold">10,000+</span> estudiantes activos
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Aprende inglés con LearnEnglish"
                className="rounded-2xl shadow-learning-glow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Por qué elegir LearnEnglish?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Nuestra aplicación combina lo mejor de la tecnología móvil con métodos de aprendizaje probados
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-learning-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-secondary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para dominar el inglés?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Únete a miles de estudiantes que ya están mejorando su inglés con nuestra app
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary" className="text-lg px-12 py-4">
              Comenzar mi viaje de aprendizaje
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">LearnEnglish</span>
            </div>
            <div className="text-muted-foreground text-center md:text-right">
              <p>&copy; 2024 LearnEnglish. Todos los derechos reservados.</p>
              <p className="text-sm mt-1">Aprende inglés de forma inteligente</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
