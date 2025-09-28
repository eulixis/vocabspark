import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface DailyUsage {
  id: string;
  user_id: string;
  date: string;
  words_learned_today: number;
  created_at: string;
  updated_at: string;
}

interface DailyLimits {
  wordsLearned: number;
  dailyLimit: number;
  canLearnMore: boolean;
  remainingWords: number;
}

const PLAN_LIMITS = {
  free: 5,      // Sin premium: 5 palabras
  basic: 20,    // Plan básico: 20 palabras
  medium: 40,   // Plan medium: 40 palabras
  pro: 70       // Plan pro: 70 palabras
};

export const useDailyLimits = () => {
  const { user } = useAuth();
  const [dailyUsage, setDailyUsage] = useState<DailyUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPlan, setUserPlan] = useState<string>('free');

  useEffect(() => {
    if (user) {
      fetchUserProfile();
      fetchDailyUsage();
    }
  }, [user]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('premium_plan')
        .eq('user_id', user.id)
        .single();

      if (data && !error) {
        setUserPlan(data.premium_plan || 'free');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchDailyUsage = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('daily_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching daily usage:', error);
      } else {
        setDailyUsage(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const incrementDailyUsage = async () => {
    if (!user) return { success: false };

    try {
      const today = new Date().toISOString().split('T')[0];
      const currentCount = dailyUsage?.words_learned_today || 0;
      const newCount = currentCount + 1;

      if (dailyUsage) {
        // Update existing record
        const { data, error } = await supabase
          .from('daily_usage')
          .update({ words_learned_today: newCount })
          .eq('user_id', user.id)
          .eq('date', today)
          .select()
          .single();

        if (error) {
          console.error('Error updating daily usage:', error);
          return { success: false };
        }

        setDailyUsage(data);
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('daily_usage')
          .insert({
            user_id: user.id,
            date: today,
            words_learned_today: newCount
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating daily usage:', error);
          return { success: false };
        }

        setDailyUsage(data);
      }

      return { success: true };
    } catch (error) {
      console.error('Error incrementing daily usage:', error);
      return { success: false };
    }
  };

  const getDailyLimits = (): DailyLimits => {
    const wordsLearned = dailyUsage?.words_learned_today || 0;
    const dailyLimit = PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free;
    const canLearnMore = wordsLearned < dailyLimit;
    const remainingWords = Math.max(0, dailyLimit - wordsLearned);

    return {
      wordsLearned,
      dailyLimit,
      canLearnMore,
      remainingWords
    };
  };

  const getPlanName = (plan: string): string => {
    const planNames = {
      free: 'Noob',
      basic: 'Básico',
      medium: 'Medium',
      pro: 'Pro'
    };
    return planNames[plan as keyof typeof planNames] || 'Noob';
  };

  return {
    dailyUsage,
    loading,
    userPlan,
    getDailyLimits,
    incrementDailyUsage,
    refetch: fetchDailyUsage,
    getPlanName
  };
};