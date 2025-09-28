import { useState } from 'react';
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

    // Check if browser supports speech synthesis
    if (!('speechSynthesis' in window)) {
      toast({
        title: "No compatible",
        description: "Tu navegador no soporta síntesis de voz",
        variant: "destructive"
      });
      return;
    }

    setIsPlaying(true);

    try {
      // Stop any ongoing speech
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Configure for perfect Spanish pronunciation
      utterance.lang = 'es-ES';
      utterance.rate = 0.8; // Slightly slower for better comprehension
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      // Try to get a Spanish voice
      const voices = window.speechSynthesis.getVoices();
      const spanishVoice = voices.find(voice => 
        voice.lang.startsWith('es') || 
        voice.name.toLowerCase().includes('spanish') ||
        voice.name.toLowerCase().includes('español')
      );
      
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.onstart = () => {
        console.log('Speech started');
      };

      utterance.onend = () => {
        setIsPlaying(false);
        console.log('Speech completed');
      };

      utterance.onerror = (event) => {
        setIsPlaying(false);
        console.error('Speech error:', event.error);
        toast({
          title: "Error de audio",
          description: "No se pudo reproducir el audio",
          variant: "destructive"
        });
      };

      // Speak the text
      window.speechSynthesis.speak(utterance);
      
      toast({
        title: "Audio reproducido",
        description: "Reproduciendo con pronunciación en español",
      });

    } catch (error) {
      console.error('TTS error:', error);
      setIsPlaying(false);
      toast({
        title: "Error de audio",
        description: "No se pudo generar el audio",
        variant: "destructive"
      });
    }
  };

  return { playText, isPlaying };
};