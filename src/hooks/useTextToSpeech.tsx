import { useState } from 'react';
import { supabase } from '../integrations/supabase/client';

export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const speak = async (text: string) => {
    setIsSpeaking(true);
    setError(null);

    // Prioritize native browser API for speed and cost-efficiency
    if ('speechSynthesis' in window) {
      try {
        // Cancel any previous speech before starting a new one
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Set language for better pronunciation
        utterance.onend = () => {
          setIsSpeaking(false);
        };
        utterance.onerror = (event) => {
          console.error('SpeechSynthesis Error:', event.error);
          setError('Error al reproducir el audio con la API nativa.');
          setIsSpeaking(false);
          // Fallback to Supabase if native fails
          speakWithSupabase(text); 
        };
        window.speechSynthesis.speak(utterance);
      } catch (e: any) {
        setError(e.message || 'Error al generar el audio con la API nativa.');
        setIsSpeaking(false);
        // Fallback to Supabase on catch
        speakWithSupabase(text);
      }
    } else {
      // Fallback to Supabase function if browser API is not available
      await speakWithSupabase(text);
    }
  };

  const speakWithSupabase = async (text: string) => {
    try {
      const { data, error: invokeError } = await supabase.functions.invoke('text-to-speech', {
        body: { text },
      });

      if (invokeError) {
        throw new Error(invokeError.message);
      }
      
      const audioBlob = new Blob([new Uint8Array(data.audioContent.data)], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();

      audio.onended = () => {
        setIsSpeaking(false);
      };
      audio.onerror = () => {
        setError('Error al reproducir el audio de Supabase.');
        setIsSpeaking(false);
      }

    } catch (e: any) {
      setError(e.message || 'Error al generar el audio con Supabase.');
      setIsSpeaking(false);
    }
  }

  return { speak, isSpeaking, error };
};
