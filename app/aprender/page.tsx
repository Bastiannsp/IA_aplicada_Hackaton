'use client';
import { useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, GraduationCap, RotateCcw, XCircle } from 'lucide-react';
import ListenButton from '@/components/ListenButton';
import PageHeader from '@/components/PageHeader';
import { lessons } from '@/data/mockData';
import type { Lesson } from '@/types';

const CARD = 'rounded-3xl border border-slate-200 bg-white p-5 shadow-md';
const LETTERS = ['A', 'B', 'C', 'D'];

interface LessonViewProps {
  lesson: Lesson;
  onCorrect: (id: string) => void;
  onBack: () => void;
}

function LessonView({ lesson, onCorrect, onBack }: LessonViewProps) {
  const [picked, setPicked] = useState<number | null>(null);
  const { quiz } = lesson;
  const answered = picked !== null;
  const isCorrect = picked === quiz.correctIndex;

  function choose(i: number) {
    if (answered) return;
    setPicked(i);
    if (i === quiz.correctIndex) onCorrect(lesson.id);
  }

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="inline-flex min-h-14 items-center gap-2 text-lg font-bold text-[#0B3D91]">
        <ArrowLeft className="h-6 w-6" aria-hidden /> Volver a las lecciones
      </button>

      <section className={CARD}>
        <h2 className="text-2xl font-bold">{lesson.title}</h2>
        <p className="mt-3 text-xl leading-relaxed">{lesson.body}</p>
      </section>

      <ListenButton text={`${lesson.title}. ${lesson.body}`} id={`lesson-${lesson.id}`} label="Escuchar Lección" className="w-full" />

      <section className={CARD}>
        <p className="text-base font-bold text-[#C8102E]">Pon a prueba lo aprendido</p>
        <h2 id="quiz-pregunta" className="mt-1 text-2xl font-bold">{quiz.question}</h2>

        <div role="group" aria-labelledby="quiz-pregunta" className="mt-4 space-y-3">
          {quiz.options.map((opt, i) => {
            const isThisCorrect = i === quiz.correctIndex;
            const isThisWrongPick = answered && i === picked && !isThisCorrect;
            let state = 'border-slate-300 bg-white';
            if (answered && isThisCorrect) state = 'border-emerald-700 bg-emerald-100 text-emerald-950';
            else if (isThisWrongPick) state = 'border-red-700 bg-red-100 text-red-950';
            else if (answered) state = 'border-slate-200 bg-slate-50 text-slate-500';

            return (
              <button
                key={i}
                type="button"
                onClick={() => choose(i)}
                disabled={answered}
                className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 p-3 text-left text-lg font-bold transition active:scale-[0.99] ${state}`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B3D91]/10 text-base text-[#0B3D91]">
                  {LETTERS[i]}
                </span>
                <span className="flex-1">{opt}</span>
                {answered && isThisCorrect && (
                  <span className="flex items-center gap-1 text-base">
                    <CheckCircle2 className="h-6 w-6" aria-hidden /> Correcta
                  </span>
                )}
                {isThisWrongPick && (
                  <span className="flex items-center gap-1 text-base">
                    <XCircle className="h-6 w-6" aria-hidden /> Incorrecta
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div aria-live="polite" className="mt-4">
          {answered && (
            <div className={`rounded-2xl p-4 text-lg ${isCorrect ? 'bg-emerald-50 text-emerald-950' : 'bg-amber-100 text-amber-950'}`}>
              <p className="font-bold">
                {isCorrect ? '¡Muy bien!' : `Casi. La respuesta correcta es: ${quiz.options[quiz.correctIndex]}.`}
              </p>
              <p className="mt-1">{quiz.feedback}</p>
              {!isCorrect && (
                <button
                  type="button"
                  onClick={() => setPicked(null)}
                  className="mt-3 inline-flex min-h-14 items-center gap-2 rounded-full border-2 border-[#0B3D91] bg-white px-5 text-lg font-bold text-[#0B3D91]"
                >
                  <RotateCcw className="h-5 w-5" aria-hidden /> Intentar de nuevo
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function AprenderPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const selected = lessons.find((l) => l.id === selectedId) ?? null;

  function markDone(id: string) {
    setDone((d) => (d.includes(id) ? d : [...d, id]));
  }

  function select(id: string | null) {
    setSelectedId(id);
    window.scrollTo(0, 0);
  }

  return (
    <div>
      <PageHeader
        title="Aprender"
        subtitle="Lecciones cortas para leer con más seguridad"
        Icon={GraduationCap}
      >
        {!selected && (
          <div className="rounded-2xl bg-white/15 p-3">
            <p className="text-base font-bold">Completaste {done.length} de {lessons.length}</p>
            <div aria-hidden className="mt-2 h-3 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white transition-all"
                style={{ width: `${(done.length / lessons.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </PageHeader>

      <div className="px-5 pt-5">
        {!selected && (
          <ul className="space-y-4">
            {lessons.map((l, i) => {
              const completed = done.includes(l.id);
              return (
                <li key={l.id}>
                  <button
                    type="button"
                    onClick={() => select(l.id)}
                    className={`${CARD} flex min-h-14 w-full items-center gap-4 text-left transition active:scale-[0.98]`}
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#0B3D91]/10 text-2xl font-bold text-[#0B3D91]">
                      {i + 1}
                    </span>
                    <span className="flex-1">
                      <span className="block text-xl font-bold leading-snug">{l.title}</span>
                      <span className="mt-1 flex items-center gap-1 text-sm text-slate-600">
                        {completed ? (
                          <><CheckCircle2 className="h-4 w-4 text-emerald-700" aria-hidden /> <span className="font-bold text-emerald-800">Completada</span></>
                        ) : (
                          <><BookOpen className="h-4 w-4" aria-hidden /> Lectura corta · 1 pregunta</>
                        )}
                      </span>
                    </span>
                    <ChevronRight className="h-6 w-6 shrink-0 text-slate-500" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {selected && <LessonView key={selected.id} lesson={selected} onCorrect={markDone} onBack={() => select(null)} />}
      </div>
    </div>
  );
}