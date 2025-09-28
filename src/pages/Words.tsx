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

  // Vocabulary with cumulative word counts based on plan tiers:
  // Free: 5 words (Easy)
  // Basic: 15 additional words (Intermediate) = 20 total - 5 previous
  // Medium: 20 additional words (Hard) = 40 total - 20 previous  
  // Pro: 30 additional words (UltraHard) = 70 total - 40 previous
  
  const vocabularyData = {
    Easy: Array.from({ length: 5 }, (_, i) => ({
      word: `Easy${i + 1}`,
      pronunciation: `/ˈiːzi${i + 1}/`,
      definition: `Easy word number ${i + 1} definition`,
      example: `This is an easy example sentence ${i + 1}.`,
      exampleTranslation: `Esta es una oración de ejemplo fácil ${i + 1}.`,
      level: "Easy"
    })),
    Intermediate: Array.from({ length: 15 }, (_, i) => ({
      word: `Intermediate${i + 1}`,
      pronunciation: `/ˌɪntərˈmiːdiət${i + 1}/`,
      definition: `Intermediate word number ${i + 1} definition`,
      example: `This is an intermediate example sentence ${i + 1}.`,
      exampleTranslation: `Esta es una oración de ejemplo intermedia ${i + 1}.`,
      level: "Intermediate"
    })),
    Hard: Array.from({ length: 20 }, (_, i) => ({
      word: `Hard${i + 1}`,
      pronunciation: `/hɑːrd${i + 1}/`,
      definition: `Hard word number ${i + 1} definition`,
      example: `This is a hard example sentence ${i + 1}.`,
      exampleTranslation: `Esta es una oración de ejemplo difícil ${i + 1}.`,
      level: "Hard"
    })),
    UltraHard: Array.from({ length: 30 }, (_, i) => ({
      word: `UltraHard${i + 1}`,
      pronunciation: `/ˌʌltrəˈhɑːrd${i + 1}/`,
      definition: `Ultra hard word number ${i + 1} definition`,
      example: `This is an ultra hard example sentence ${i + 1}.`,
      exampleTranslation: `Esta es una oración de ejemplo ultra difícil ${i + 1}.`,
      level: "UltraHard"
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