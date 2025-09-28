import { supabase } from '@/integrations/supabase/client';

interface StatsUpdate {
  words_learned?: number;
  games_completed?: number;
  phrasal_verbs_learned?: number;
  current_streak?: number;
  total_study_days?: number;
  level_progress?: number;
}

export const updateUserProgress = async (userId: string, updates: StatsUpdate) => {
  try {
    // Update user stats
    const { data, error } = await supabase
      .from('user_stats')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user stats:', error);
      return { error };
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in updateUserProgress:', error);
    return { error };
  }
};

// Helper functions for common progress updates
export const incrementWordsLearned = async (userId: string, increment: number = 1) => {
  try {
    const { data: currentStats } = await supabase
      .from('user_stats')
      .select('words_learned')
      .eq('user_id', userId)
      .single();

    const newValue = (currentStats?.words_learned || 0) + increment;
    return await updateUserProgress(userId, { words_learned: newValue });
  } catch (error) {
    console.error('Error incrementing words learned:', error);
    return { error };
  }
};

export const incrementGamesCompleted = async (userId: string, increment: number = 1) => {
  try {
    const { data: currentStats } = await supabase
      .from('user_stats')
      .select('games_completed')
      .eq('user_id', userId)
      .single();

    const newValue = (currentStats?.games_completed || 0) + increment;
    return await updateUserProgress(userId, { games_completed: newValue });
  } catch (error) {
    console.error('Error incrementing games completed:', error);
    return { error };
  }
};

export const incrementPhrasalVerbsLearned = async (userId: string, increment: number = 1) => {
  try {
    const { data: currentStats } = await supabase
      .from('user_stats')
      .select('phrasal_verbs_learned')
      .eq('user_id', userId)
      .single();

    const newValue = (currentStats?.phrasal_verbs_learned || 0) + increment;
    return await updateUserProgress(userId, { phrasal_verbs_learned: newValue });
  } catch (error) {
    console.error('Error incrementing phrasal verbs learned:', error);
    return { error };
  }
};

export const updateStreak = async (userId: string, newStreak: number) => {
  return await updateUserProgress(userId, { current_streak: newStreak });
};

export const incrementStudyDays = async (userId: string, increment: number = 1) => {
  try {
    const { data: currentStats } = await supabase
      .from('user_stats')
      .select('total_study_days')
      .eq('user_id', userId)
      .single();

    const newValue = (currentStats?.total_study_days || 0) + increment;
    return await updateUserProgress(userId, { total_study_days: newValue });
  } catch (error) {
    console.error('Error incrementing study days:', error);
    return { error };
  }
};