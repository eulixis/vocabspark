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
        throw new Error(`Edge function error: ${error.message}`);
      }

      if (data?.audioContent) {
        // Create and play audio with error handling
        const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
        
        audio.onloadstart = () => console.log('Audio loading started');
        audio.oncanplay = () => console.log('Audio can start playing');
        audio.onended = () => {
          setIsPlaying(false);
          console.log('Audio playback completed');
        };
        audio.onerror = (audioError) => {
          setIsPlaying(false);
          console.error('Audio playback error:', audioError);
          toast({
            title: "Error de reproducción",
            description: "No se pudo reproducir el audio generado",
            variant: "destructive"
          });
        };
        
        try {
          await audio.play();
          toast({
            title: "Audio reproducido",
            description: `Pronunciación generada con ${data.provider || 'OpenAI TTS'}`,
          });
        } catch (playError) {
          setIsPlaying(false);
          console.error('Audio play() failed:', playError);
          toast({
            title: "Error de reproducción",
            description: "Tu navegador no pudo reproducir el audio",
            variant: "destructive"
          });
        }
      } else if (data?.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No se recibió contenido de audio');
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsPlaying(false);
      toast({
        title: "Error de audio",
        description: "No se pudo generar el audio. Verifica tu conexión.",
        variant: "destructive"
      });
    }
  };

  return { playText, isPlaying };
};