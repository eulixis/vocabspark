import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Check,
  Zap,
  Star,
  Trophy,
  Sparkles,
  Infinity,
  BookOpen,
  Gamepad2,
  HeadphonesIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Premium = () => {
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState("medium");

  const plans = [
    {
      id: "basic",
      name: "Plan Básico",
      price: "$9.99",
      period: "/mes",
      description: "Perfecto para comenzar tu aprendizaje",
      color: "border-tier-basic",
      bgColor: "bg-tier-basic",
      features: [
        "Acceso a 500 palabras",
        "3 juegos básicos",
        "50 verbos frasales",
        "Progreso básico",
        "Soporte por email"
      ],
      limitations: [
        "Anuncios incluidos",
        "Contenido limitado"
      ]
    },
    {
      id: "medium",
      name: "Plan Medium",
      price: "$19.99",
      period: "/mes",
      description: "La opción más popular para estudiantes dedicados",
      color: "border-tier-medium",
      bgColor: "bg-tier-medium",
      popular: true,
      features: [
        "Acceso a 2000 palabras",
        "Todos los juegos disponibles",
        "200 verbos frasales",
        "Estadísticas avanzadas",
        "Sin anuncios",
        "Audio pronunciación",
        "Modo offline básico"
      ],
      limitations: []
    },
    {
      id: "pro",
      name: "Plan Pro",
      price: "$39.99",
      period: "/mes",
      description: "Para usuarios que quieren dominar el inglés",
      color: "border-tier-pro",
      bgColor: "bg-tier-pro",
      features: [
        "Acceso ilimitado a todo",
        "Contenido exclusivo",
        "Modo offline completo",
        "Certificados de progreso",
        "Sesiones de tutoría 1-a-1",
        "Soporte prioritario 24/7",
        "Acceso anticipado a nuevas funciones",
        "Personalización avanzada"
      ],
      limitations: []
    }
  ];

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = (plan: any) => {
    toast({
      title: "¡Suscripción iniciada!",
      description: `Te has suscrito al ${plan.name}. Redirigiendo al pago...`,
    });
    
    // Here would be the actual subscription logic
    setTimeout(() => {
      toast({
        title: "Funcionalidad próximamente",
        description: "La integración de pagos estará disponible pronto con Supabase.",
      });
    }, 2000);
  };

  const premiumFeatures = [
    {
      icon: BookOpen,
      title: "Contenido Ilimitado",
      description: "Accede a miles de palabras, expresiones y lecciones"
    },
    {
      icon: Gamepad2,
      title: "Juegos Avanzados",
      description: "Practica con juegos interactivos y desafiantes"
    },
    {
      icon: HeadphonesIcon,
      title: "Audio Nativo",
      description: "Escucha pronunciación de hablantes nativos"
    },
    {
      icon: Trophy,
      title: "Certificaciones",
      description: "Obtén certificados al completar niveles"
    },
    {
      icon: Zap,
      title: "Aprendizaje Adaptativo",
      description: "IA que se adapta a tu ritmo de aprendizaje"
    },
    {
      icon: Sparkles,
      title: "Contenido Exclusivo",
      description: "Acceso a material premium y actualizaciones"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Hero Section */}
      <div className="bg-gradient-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Crown className="h-20 w-20 mx-auto mb-6 text-warning" />
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Desbloquea tu Potencial
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
            Accede a contenido premium, funciones avanzadas y acelera tu aprendizaje del inglés
          </p>
          <Badge className="bg-warning text-warning-foreground text-lg px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Más de 10,000 estudiantes ya mejoraron su inglés
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">
            ¿Por qué elegir Premium?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-learning-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-primary flex items-center justify-center mb-4`}>
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
        </section>

        {/* Pricing Section */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-4">
            Elige tu Plan Perfecto
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Selecciona el plan que mejor se adapte a tus necesidades de aprendizaje. 
            Puedes cambiar o cancelar en cualquier momento.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <Card 
                key={plan.id}
                className={`relative hover:shadow-learning-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                  selectedPlan === plan.id ? `ring-2 ${plan.color}` : ''
                } ${plan.popular ? 'ring-2 ring-tier-medium' : ''}`}
                onClick={() => handleSelectPlan(plan.id)}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-tier-medium text-white px-6 py-2">
                      <Star className="h-4 w-4 mr-1" />
                      Más Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>
                  <CardDescription className="text-base">{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <Check className="h-5 w-5 text-success mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    {plan.limitations.map((limitation, index) => (
                      <div key={index} className="flex items-center text-muted-foreground">
                        <span className="text-sm">• {limitation}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    className="w-full"
                    variant={plan.popular ? "gradient" : selectedPlan === plan.id ? "default" : "outline"}
                    size="lg"
                  >
                    {selectedPlan === plan.id ? "Seleccionado" : "Seleccionar Plan"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Todos los planes incluyen garantía de devolución de 30 días
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
              <span>✓ Cancela en cualquier momento</span>
              <span>✓ Sin compromisos a largo plazo</span>
              <span>✓ Soporte 24/7</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Premium;