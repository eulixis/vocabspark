import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { incrementPhrasalVerbsLearned } from "@/utils/updateUserProgress";
import { useDailyLimits } from "@/hooks/useDailyLimits";
import PhrasalVerbSection from "@/components/PhrasalVerbSection";

const PhrasalVerbs = () => {
  const { user } = useAuth();
  const { getDailyLimits, incrementDailyUsage, getPlanName, userPlan } = useDailyLimits();
  const [learnedVerbs, setLearnedVerbs] = useState(new Map<string, Set<number>>());

  // Phrasal verbs with cumulative counts based on plan tiers:
  // Free: 5 verbs (Easy)
  // Basic: 15 additional verbs (Intermediate) = 20 total - 5 previous
  // Medium: 20 additional verbs (Hard) = 40 total - 20 previous  
  // Pro: 30 additional verbs (UltraHard) = 70 total - 40 previous
  
  const phrasalVerbsData = {
    Easy: Array.from({ length: 5 }, (_, i) => ({
      verb: `Easy Verb`,
      meaning: `Significado fácil`,
      examples: [
        {
          sentence: `Easy example sentence.`,
          translation: `Oración de ejemplo fácil.`,
          context: "Basic usage"
        }
      ],
      level: "Easy",
      category: "Essential"
    })),
    Intermediate: Array.from({ length: 15 }, (_, i) => ({
      verb: `Intermediate Verb`,
      meaning: `Significado intermedio`,
      examples: [
        {
          sentence: `Intermediate example sentence.`,
          translation: `Oración de ejemplo intermedia.`,
          context: "Common usage"
        }
      ],
      level: "Intermediate",
      category: "Common"
    })),
    Hard: Array.from({ length: 20 }, (_, i) => ({
      verb: `Hard Verb`,
      meaning: `Significado difícil`,
      examples: [
        {
          sentence: `Hard example sentence.`,
          translation: `Oración de ejemplo difícil.`,
          context: "Advanced usage"
        }
      ],
      level: "Hard",
      category: "Advanced"
    })),
    UltraHard: Array.from({ length: 30 }, (_, i) => ({
      verb: `Ultra Hard Verb`,
      meaning: `Significado ultra difícil`,
      examples: [
        {
          sentence: `Ultra hard example sentence.`,
          translation: `Oración de ejemplo ultra difícil.`,
          context: "Expert usage"
        }
      ],
      level: "UltraHard",
      category: "Expert"
    }))
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

  const handleVerbLearned = async () => {
    const limits = getDailyLimits();
    
    if (user) {
      const usageResult = await incrementDailyUsage();
      if (usageResult.success) {
        await incrementPhrasalVerbsLearned(user.id);
      }
    }
  };

  const handleVerbComplete = (level: string, verbIndex: number) => {
    setLearnedVerbs(prev => {
      const newMap = new Map(prev);
      const currentSet = newMap.get(level) || new Set();
      currentSet.add(verbIndex);
      newMap.set(level, currentSet);
      return newMap;
    });
  };

  const sections = [
    { key: 'Easy', title: 'Verbos Frasales Fáciles', level: 'Easy' },
    { key: 'Intermediate', title: 'Verbos Frasales Intermedios', level: 'Intermediate' },
    { key: 'Hard', title: 'Verbos Frasales Difíciles', level: 'Hard' },
    { key: 'UltraHard', title: 'Verbos Frasales Ultra Difíciles', level: 'UltraHard' }
  ];

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

      {/* Phrasal Verb Sections */}
      <div className="space-y-6">
        {sections.map(section => (
          <PhrasalVerbSection
            key={section.key}
            title={section.title}
            level={section.level}
            phrasalVerbs={phrasalVerbsData[section.key as keyof typeof phrasalVerbsData]}
            isLocked={!accessibleLevels.includes(section.level)}
            onVerbLearned={handleVerbLearned}
            canLearnMore={getDailyLimits().canLearnMore}
            remainingWords={getDailyLimits().remainingWords}
            learnedVerbs={learnedVerbs.get(section.level) || new Set()}
            onVerbComplete={(verbIndex) => handleVerbComplete(section.level, verbIndex)}
          />
        ))}
      </div>
    </div>
  );
};

export default PhrasalVerbs;