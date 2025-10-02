import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { incrementPhrasalVerbsLearned } from "@/utils/updateUserProgress";
import { useDailyLimits } from "@/hooks/useDailyLimits";
import PhrasalVerbSection from "@/components/PhrasalVerbSection";
import { useDailyContent, PhrasalVerb } from "@/hooks/useDailyContent";

type VerbLevel = 'Easy' | 'Intermediate' | 'Hard' | 'UltraHard';

const PhrasalVerbs = () => {
  const { user } = useAuth();
  const { getPhrasalVerbLimits, incrementPhrasalVerbUsage, getPlanName, userPlan } = useDailyLimits();
  const [learnedVerbs, setLearnedVerbs] = useState(new Map<string, Set<number>>());

  const { content: easyVerbs, loading: loadingEasy } = useDailyContent('phrasal_verbs', 'Easy');
  const { content: intermediateVerbs, loading: loadingIntermediate } = useDailyContent('phrasal_verbs', 'Intermediate');
  const { content: hardVerbs, loading: loadingHard } = useDailyContent('phrasal_verbs', 'Hard');
  const { content: ultraHardVerbs, loading: loadingUltraHard } = useDailyContent('phrasal_verbs', 'UltraHard');

  const getAccessibleLevels = (plan: string): VerbLevel[] => {
    switch (plan) {
      case 'free': return ['Easy'];
      case 'basic': return ['Easy', 'Intermediate'];
      case 'medium': return ['Easy', 'Intermediate', 'Hard'];
      case 'pro': return ['Easy', 'Intermediate', 'Hard', 'UltraHard'];
      default: return ['Easy'];
    }
  };

  const accessibleLevels = getAccessibleLevels(userPlan);

  const getVerbsForLevel = (level: VerbLevel): PhrasalVerb[] => {
    switch (level) {
      case 'Easy': return easyVerbs as PhrasalVerb[];
      case 'Intermediate': return intermediateVerbs as PhrasalVerb[];
      case 'Hard': return hardVerbs as PhrasalVerb[];
      case 'UltraHard': return ultraHardVerbs as PhrasalVerb[];
      default: return [];
    }
  };

  const isLevelLoading = (level: VerbLevel) => {
    switch (level) {
      case 'Easy': return loadingEasy;
      case 'Intermediate': return loadingIntermediate;
      case 'Hard': return loadingHard;
      case 'UltraHard': return loadingUltraHard;
      default: return false;
    }
  };

  const handleVerbLearned = async () => {
    if (user) {
      const usageResult = await incrementPhrasalVerbUsage();
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

  const sections: Array<{ key: string; title: string; level: VerbLevel }> = [
    { key: 'Easy', title: 'Verbos Frasales Fáciles', level: 'Easy' },
    { key: 'Intermediate', title: 'Verbos Frasales Intermedios', level: 'Intermediate' },
    { key: 'Hard', title: 'Verbos Frasales Difíciles', level: 'Hard' },
    { key: 'UltraHard', title: 'Verbos Frasales Ultra Difíciles', level: 'UltraHard' }
  ];

  const { phrasalVerbsLearned, dailyLimit, canLearnMore } = getPhrasalVerbLimits();
  const progressValue = dailyLimit > 0 ? (phrasalVerbsLearned / dailyLimit) * 100 : 0;

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
                  <p className="font-medium">Límite diario verbos</p>
                  <p className="text-muted-foreground">
                    {phrasalVerbsLearned} / {dailyLimit} verbos
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

      {/* Phrasal Verb Sections */}
      <div className="space-y-6">
        {sections.map(section => (
          <PhrasalVerbSection
            key={section.key}
            title={section.title}
            level={section.level}
            phrasalVerbs={getVerbsForLevel(section.level)}
            isLocked={!accessibleLevels.includes(section.level)}
            onVerbLearned={handleVerbLearned}
            canLearnMore={canLearnMore}
            remainingWords={dailyLimit - phrasalVerbsLearned}
            learnedVerbs={learnedVerbs.get(section.level) || new Set()}
            onVerbComplete={(verbIndex) => handleVerbComplete(section.level, verbIndex)}
            loading={isLevelLoading(section.level)}
          />
        ))}
      </div>
    </div>
  );
};

export default PhrasalVerbs;