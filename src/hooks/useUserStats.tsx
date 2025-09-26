import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UserStats {
  id: string;
  user_id: string;
  words_learned: number;
  games_completed: number;
  phrasal_verbs_learned: number;
  current_streak: number;
  total_study_days: number;
  level_progress: number;
  created_at: string;
  updated_at: string;
}

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user stats:', error);
        setError(error.message);
      } else {
        setStats(data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error fetching stats');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = async (updates: Partial<Omit<UserStats, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user || !stats) return;

    try {
      const { data, error } = await supabase
        .from('user_stats')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating stats:', error);
        setError(error.message);
      } else {
        setStats(data);
      }
    } catch (err) {
      console.error('Error updating stats:', err);
      setError('Error updating stats');
    }
  };

  return {
    stats,
    loading,
    error,
    refetch: fetchUserStats,
    updateStats
  };
};