'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
export function useVoice(lang = 'es-CL') {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const recRef = useRef<any>(null);

  useEffect(() => {
    setTtsSupported('speechSynthesis' in window);
    setSttSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    return () => {
      window.speechSynthesis?.cancel();
      recRef.current?.abort?.();
    };
  }, []);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeakingId(null);
  }, []);

  const speak = useCallback(
    (text: string, id = 'default') => {
      if (!('speechSynthesis' in window) || !text) return;
      window.speechSynthesis.cancel(); // evita cola de audios
      const u = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const voice =
        voices.find((v) => v.lang === 'es-CL') ||
        voices.find((v) => v.lang.startsWith('es')) ||
        null;
      if (voice) u.voice = voice;
      u.lang = voice?.lang ?? lang;
      u.rate = 0.9; // ritmo pausado para adulto mayor
      u.onend = () => setSpeakingId(null);
      u.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(u);
    },
    [lang],
  );

  /** Alterna entre "Escuchar" y "Detener audio" para un mismo id. */
  const toggle = useCallback(
    (text: string, id = 'default') => (speakingId === id ? stop() : speak(text, id)),
    [speakingId, speak, stop],
  );

  const listen = useCallback(
    (onResult: (transcript: string) => void) => {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) return;
      if (listening) {
        recRef.current?.stop();
        return;
      }
      const rec = new SR();
      rec.lang = lang;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e: any) => onResult(e.results[0][0].transcript);
      rec.onend = () => setListening(false);
      rec.onerror = () => setListening(false);
      recRef.current = rec;
      setListening(true);
      rec.start();
    },
    [lang, listening],
  );

  return { speak, stop, toggle, speakingId, isSpeaking: speakingId !== null, listen, listening, ttsSupported, sttSupported };
}
