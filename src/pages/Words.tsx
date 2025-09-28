import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { incrementWordsLearned } from "@/utils/updateUserProgress";
import { useDailyLimits } from "@/hooks/useDailyLimits";
import VocabularySection from "@/components/VocabularySection";

const Words = () => {
  const { user } = useAuth();
  const { getDailyLimits, incrementDailyUsage, getPlanName, userPlan } = useDailyLimits();
  const [learnedWords, setLearnedWords] = useState(new Map<string, Set<number>>());

  // All vocabulary organized by level
  const vocabularyData = {
    Easy: [
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
    Intermediate: [
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
    Hard: [
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
    UltraHard: [
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

  const getAccessibleLevels = (plan: string) => {
    switch (plan) {
      case 'free': return ['Easy'];
      case 'basic': return ['Easy', 'Intermediate'];
      case 'medium': return ['Easy', 'Intermediate', 'Hard'];
      case 'pro': return ['Easy', 'Intermediate', 'Hard', 'UltraHard'];
      default: return ['Easy'];
    }
  };

  const accessibleLevels = getAccessibleLevels(userPlan);

  const handleWordLearned = async () => {
    const limits = getDailyLimits();
    
    if (user) {
      const usageResult = await incrementDailyUsage();
      if (usageResult.success) {
        await incrementWordsLearned(user.id);
      }
    }
  };

  const handleWordComplete = (level: string, wordIndex: number) => {
    setLearnedWords(prev => {
      const newMap = new Map(prev);
      const currentSet = newMap.get(level) || new Set();
      currentSet.add(wordIndex);
      newMap.set(level, currentSet);
      return newMap;
    });
  };

  const sections = [
    { key: 'Easy', title: 'Vocabulario Fácil', level: 'Easy' },
    { key: 'Intermediate', title: 'Vocabulario Intermedio', level: 'Intermediate' },
    { key: 'Hard', title: 'Vocabulario Difícil', level: 'Hard' },
    { key: 'UltraHard', title: 'Vocabulario Ultra Difícil', level: 'UltraHard' }
  ];

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

      {/* Vocabulary Sections */}
      <div className="space-y-6">
        {sections.map(section => (
          <VocabularySection
            key={section.key}
            title={section.title}
            level={section.level}
            words={vocabularyData[section.key as keyof typeof vocabularyData]}
            isLocked={!accessibleLevels.includes(section.level)}
            onWordLearned={handleWordLearned}
            canLearnMore={getDailyLimits().canLearnMore}
            remainingWords={getDailyLimits().remainingWords}
            learnedWords={learnedWords.get(section.level) || new Set()}
            onWordComplete={(wordIndex) => handleWordComplete(section.level, wordIndex)}
          />
        ))}
      </div>
    </div>
  );
};

export default Words;