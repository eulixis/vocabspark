import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const { toast } = useToast();

  // Browser-based TTS fallback
  const playWithBrowserTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => {
        setIsPlaying(false);
        console.warn('Browser TTS failed');
      };

      // Stop any ongoing speech and speak
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    } else {
      setIsPlaying(false);
      toast({
        title: "Audio no disponible",
        description: "Tu navegador no soporta síntesis de voz",
        variant: "destructive"
      });
    }
  };

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
        console.warn('Edge function error, falling back to browser TTS:', error);
        playWithBrowserTTS(text);
        return;
      }

      // Check if we should use browser TTS
      if (data?.useBrowserTTS) {
        console.log('Cloud TTS unavailable, using browser TTS');
        playWithBrowserTTS(text);
        return;
      }

      if (data?.audioContent) {
        try {
          // Create audio element and play
          const audio = new Audio(`data:audio/mpeg;base64,${data.audioContent}`);
          
          audio.onended = () => setIsPlaying(false);
          audio.onerror = (audioError) => {
            console.warn('Audio playback failed, falling back to browser TTS:', audioError);
            playWithBrowserTTS(text);
          };
          
          await audio.play();
          
          // Show success toast with provider info
          if (data.provider) {
            toast({
              title: "Audio reproducido",
              description: `Audio generado con ${data.provider}`,
            });
          }
        } catch (playError) {
          console.warn('Audio play failed, using browser TTS:', playError);
          playWithBrowserTTS(text);
        }
      } else {
        console.warn('No audio content received, using browser TTS');
        playWithBrowserTTS(text);
      }
    } catch (error) {
      console.warn('TTS error, falling back to browser TTS:', error);
      playWithBrowserTTS(text);
    }
  };

  return { playText, isPlaying };
};