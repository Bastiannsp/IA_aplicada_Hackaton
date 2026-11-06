'use client';
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
const subscribeToBrowser = () => () => {};
const browserSnapshot = () => typeof window !== 'undefined';
const serverSnapshot = () => false;
const FEMALE_VOICE_HINTS = ['sabina', 'helena', 'paulina', 'laura', 'mónica', 'monica', 'sofia', 'sofía', 'elena', 'isabela', 'female', 'mujer'];

export function useVoice(lang = 'es-CL') {
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const browserAvailable = useSyncExternalStore(subscribeToBrowser, browserSnapshot, serverSnapshot);
  const ttsSupported = browserAvailable && 'speechSynthesis' in window;
  const sttSupported = browserAvailable && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
  const recRef = useRef<any>(null);

  useEffect(() => {
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
      const spanishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith('es'));
      const voice =
        spanishVoices.find((v) => FEMALE_VOICE_HINTS.some((hint) => v.name.toLowerCase().includes(hint))) ||
        spanishVoices.find((v) => v.lang.toLowerCase() === 'es-cl') ||
        spanishVoices[0] ||
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
      setVoiceError('');
      if (!SR) {
        setVoiceError('Tu navegador no permite dictado por voz. Prueba con Chrome o Edge.');
        return;
      }
      if (listening) {
        recRef.current?.stop();
        return;
      }
      const rec = new SR();
      rec.lang = lang === 'es-CL' ? 'es-ES' : lang;
      rec.interimResults = false;
      rec.maxAlternatives = 1;
      rec.onresult = (e: any) => onResult(e.results[0][0].transcript);
      rec.onstart = () => setListening(true);
      rec.onend = () => setListening(false);
      rec.onerror = (e: any) => {
        setListening(false);
        const messages: Record<string, string> = {
          'not-allowed': 'Permite el acceso al micrófono en tu navegador para dictar.',
          'service-not-allowed': 'El servicio de dictado no está permitido en este navegador.',
          'no-speech': 'No detecté voz. Toca el botón e intenta hablar de nuevo.',
          network: 'No se pudo conectar al servicio de dictado. Revisa tu conexión.',
        };
        setVoiceError(messages[e.error] ?? 'No se pudo iniciar el dictado. Intenta nuevamente.');
      };
      recRef.current = rec;
      try {
        rec.start();
      } catch {
        setListening(false);
        setVoiceError('No se pudo iniciar el dictado. Revisa el permiso del micrófono e intenta nuevamente.');
      }
    },
    [lang, listening],
  );

  return { speak, stop, toggle, speakingId, isSpeaking: speakingId !== null, listen, listening, voiceError, ttsSupported, sttSupported };
}
