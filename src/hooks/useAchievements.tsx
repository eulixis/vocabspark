import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useUserStats } from './useUserStats';
import { useToast } from '@/hooks/use-toast';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement_type: string;
  requirement_value: number;
  created_at: string;
}

interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement: Achievement;
}

export const useAchievements = () => {
  const { user } = useAuth();
  const { stats } = useUserStats();
  const { toast } = useToast();
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAchievements();
      fetchUserAchievements();
    }
  }, [user]);

  useEffect(() => {
    if (user && stats && allAchievements.length > 0) {
      checkForNewAchievements();
    }
  }, [stats, allAchievements, user]);

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement_value', { ascending: true });

      if (error) {
        console.error('Error fetching achievements:', error);
      } else {
        setAllAchievements(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUserAchievements = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      if (error) {
        console.error('Error fetching user achievements:', error);
      } else {
        setUserAchievements(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkForNewAchievements = async () => {
    if (!user || !stats) return;

    const currentAchievementIds = userAchievements.map(ua => ua.achievement_id);
    const newAchievements: Achievement[] = [];

    // Check each achievement to see if user qualifies
    for (const achievement of allAchievements) {
      if (currentAchievementIds.includes(achievement.id)) continue;

      let qualifies = false;
      
      switch (achievement.requirement_type) {
        case 'words_learned':
          qualifies = (stats.words_learned || 0) >= achievement.requirement_value;
          break;
        case 'games_completed':
          qualifies = (stats.games_completed || 0) >= achievement.requirement_value;
          break;
        case 'current_streak':
          qualifies = (stats.current_streak || 0) >= achievement.requirement_value;
          break;
        case 'total_study_days':
          qualifies = (stats.total_study_days || 0) >= achievement.requirement_value;
          break;
        case 'phrasal_verbs_learned':
          qualifies = (stats.phrasal_verbs_learned || 0) >= achievement.requirement_value;
          break;
      }

      if (qualifies) {
        newAchievements.push(achievement);
      }
    }

    // Award new achievements
    for (const achievement of newAchievements) {
      await awardAchievement(achievement.id);
    }
  };

  const awardAchievement = async (achievementId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievementId
        });

      if (!error) {
        // Refetch user achievements to update the list
        await fetchUserAchievements();
        
        // Find the achievement details for the toast
        const achievement = allAchievements.find(a => a.id === achievementId);
        if (achievement) {
          toast({
            title: "¡Nuevo logro desbloqueado! 🏆",
            description: `${achievement.title}: ${achievement.description}`,
          });
        }
      }
    } catch (error) {
      console.error('Error awarding achievement:', error);
    }
  };

  return {
    userAchievements,
    allAchievements,
    loading,
    refetch: fetchUserAchievements,
    checkForNewAchievements
  };
};