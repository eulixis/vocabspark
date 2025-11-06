import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  example: string;
  level: string;
}

export interface PhrasalVerb {
  id: string;
  verb: string;
  meaning: string;
  example: string;
  level: string;
}

export interface GameQuestion {
  id: string;
  game_type: string;
  question: string;
  correct_answer: string;
  options: string[];
}

type ContentItem = VocabularyWord | PhrasalVerb | GameQuestion;

export const useDailyContent = (contentType: 'vocabulary' | 'phrasal_verbs' | 'game_questions', level?: string, gameType?: string) => {
  const { user } = useAuth();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyContent();
  }, [contentType, level, gameType]);

  const fetchDailyContent = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0];

      // Check if we have daily content for today
      const { data: dailyData, error: dailyError } = await supabase
        .from('daily_content')
        .select('content_ids')
        .eq('content_date', today)
        .eq('content_type', contentType)
        .maybeSingle();

      if (dailyError && dailyError.code !== 'PGRST116') {
        console.error('Error fetching daily content:', dailyError);
      }

      let query = supabase.from(contentType).select('*');

      if (dailyData?.content_ids) {
        // Use pre-selected daily content
        const { data, error } = await query.in('id', dailyData.content_ids as string[]);
        
        if (error) {
          console.error('Error fetching content:', error);
        } else {
          setContent((data || []) as ContentItem[]);
        }
        setLoading(false);
        return;
      }

      // Select random content and save for the day
      let baseQuery: any = supabase.from(contentType).select('*');
      
      if (level) {
        baseQuery = baseQuery.eq('level', level);
      }
      if (gameType) {
        baseQuery = baseQuery.eq('game_type', gameType);
      }

      const { data: allContent, error: contentError } = await baseQuery;

      if (contentError) {
        console.error('Error fetching content:', contentError);
        setLoading(false);
        return;
      }

      if (allContent && allContent.length > 0) {
        // Define palabras por nivel según plan
        const wordsPerLevel: { [key: string]: number } = {
          'Easy': 5,
          'Intermediate': 15,
          'Hard': 20,
          'UltraHard': 60
        };
        
        const itemsToSelect = wordsPerLevel[level || ''] || 10;
        
        // Shuffle and select random items
        const shuffled = [...allContent].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(itemsToSelect, shuffled.length));
        const selectedIds = selected.map((item: any) => item.id);

        // Save daily selection
        if (user) {
          await supabase
            .from('daily_content')
            .insert({
              user_id: user.id,
              content_date: today,
              content_type: contentType,
              content_ids: selectedIds
            });
        }

        setContent(selected as ContentItem[]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error in fetchDailyContent:', error);
      setLoading(false);
    }
  };

  return { content, loading, refresh: fetchDailyContent };
};
