import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { incrementWordsLearned } from "@/utils/updateUserProgress";
import { useDailyLimits } from "@/hooks/useDailyLimits";
import VocabularySection from "@/components/VocabularySection";
import { useDailyContent, VocabularyWord } from "@/hooks/useDailyContent";

type WordLevel = 'Easy' | 'Intermediate' | 'Hard' | 'UltraHard';

const Words = () => {
  const { user } = useAuth();
  const { getDailyLimits, incrementDailyUsage, getPlanName, userPlan } = useDailyLimits();
  const [learnedWords, setLearnedWords] = useState<Map<string, Set<number>>>(new Map());

  const { content: easyWords, loading: loadingEasy } = useDailyContent('vocabulary', 'Easy');
  const { content: intermediateWords, loading: loadingIntermediate } = useDailyContent('vocabulary', 'Intermediate');
  const { content: hardWords, loading: loadingHard } = useDailyContent('vocabulary', 'Hard');
  const { content: ultraHardWords, loading: loadingUltraHard } = useDailyContent('vocabulary', 'UltraHard');

  const getAccessibleLevels = (plan: string): WordLevel[] => {
    switch (plan) {
      case 'free': return ['Easy'];
      case 'basic': return ['Easy', 'Intermediate'];
      case 'medium': return ['Easy', 'Intermediate', 'Hard'];
      case 'pro': return ['Easy', 'Intermediate', 'Hard', 'UltraHard'];
      default: return ['Easy'];
    }
  };

  const accessibleLevels = getAccessibleLevels(userPlan);

  const getWordsForLevel = (level: WordLevel): VocabularyWord[] => {
    switch (level) {
      case 'Easy': return easyWords as VocabularyWord[];
      case 'Intermediate': return intermediateWords as VocabularyWord[];
      case 'Hard': return hardWords as VocabularyWord[];
      case 'UltraHard': return ultraHardWords as VocabularyWord[];
      default: return [];
    }
  };

  const isLevelLoading = (level: WordLevel) => {
    switch (level) {
      case 'Easy': return loadingEasy;
      case 'Intermediate': return loadingIntermediate;
      case 'Hard': return loadingHard;
      case 'UltraHard': return loadingUltraHard;
      default: return false;
    }
  };

  const handleWordLearned = async () => {
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
    { key: 'Easy', title: 'Vocabulario Fácil', level: 'Easy' as WordLevel },
    { key: 'Intermediate', title: 'Vocabulario Intermedio', level: 'Intermediate' as WordLevel },
    { key: 'Hard', title: 'Vocabulario Difícil', level: 'Hard' as WordLevel },
    { key: 'UltraHard', title: 'Vocabulario Ultra Difícil', level: 'UltraHard' as WordLevel }
  ];

  const { wordsLearned, dailyLimit, canLearnMore } = getDailyLimits();
  const progressValue = dailyLimit > 0 ? (wordsLearned / dailyLimit) * 100 : 0;

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

        {/* Daily Limits Card */}
        <Card className="mb-6 bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-sm">
                  <p className="font-medium">Límite diario</p>
                  <p className="text-muted-foreground">
                    {wordsLearned} / {dailyLimit} palabras
                  </p>
                </div>
                <Progress 
                  value={progressValue} 
                  className="w-24 h-2" 
                />
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={userPlan === 'free' ? 'secondary' : 'default'} className="text-xs">
                  Plan {getPlanName(userPlan)}
                </Badge>
                {!canLearnMore && (
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
            words={getWordsForLevel(section.level)}
            isLocked={!accessibleLevels.includes(section.level)}
            onWordLearned={handleWordLearned}
            canLearnMore={canLearnMore}
            remainingWords={dailyLimit - wordsLearned}
            learnedWords={learnedWords.get(section.level) || new Set()}
            onWordComplete={(wordIndex) => handleWordComplete(section.level, wordIndex)}
            loading={isLevelLoading(section.level)}
          />
        ))}
      </div>
    </div>
  );
};

export default Words;
