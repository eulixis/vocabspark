import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  const playText = async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "No hay texto para reproducir",
        variant: "destructive"
      });
      return;
    }

    setIsPlaying(true);

    try {
      const { data, error } = await supabase.functions.invoke('text-to-speech', {
        body: { text }
      });

      if (error) {
        throw error;
      }

      if (data?.audioContent) {
        // Create audio element and play
        const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
        
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          toast({
            title: "Error de audio",
            description: "No se pudo reproducir el audio",
            variant: "destructive"
          });
        };
        
        await audio.play();
      }
    } catch (error) {
      console.error('Error playing text:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el audio. Inténtalo de nuevo.",
        variant: "destructive"
      });
      setIsPlaying(false);
    }
  };

  return { playText, isPlaying };
};