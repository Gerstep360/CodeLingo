import { useEffect, useRef, useState } from 'react';
import { X, Volume2, VolumeX, Trophy, Moon, Sun, Zap, ChevronLeft } from 'lucide-react';
import { readProgress, saveAttempt, stageXp } from '../../learning/progress';
import { duoStorage } from '../../utils/duoStorage';
import { sounds } from '../../utils/soundEffects';
import confetti from 'canvas-confetti';
import { getSequence, shouldSkipNext } from './trainingSequence';
import ObserveStage from './stages/ObserveStage';
import TraceStage from './stages/TraceStage';
import RecognizeStage from './stages/RecognizeStage';
import FillTokenStage from './stages/FillTokenStage';
import FillLineStage from './stages/FillLineStage';
import OrderBlocksStage from './stages/OrderBlocksStage';
import GhostCodeStage from './stages/GhostCodeStage';
import GuidedTypingStage from './stages/GuidedTypingStage';
import RecallStage from './stages/RecallStage';
import SpeedrunStage from './stages/SpeedrunStage';
import './training.css';

const STAGES = {
  observe: ObserveStage, trace: TraceStage, recognize: RecognizeStage,
  'fill-token': FillTokenStage, 'fill-line': FillLineStage, 'order-blocks': OrderBlocksStage,
  'ghost-code': GhostCodeStage, 'guided-typing': GuidedTypingStage, recall: RecallStage, speedrun: SpeedrunStage
};

export function TrainingRunner(props) { return <TrainingSession key={props.lessonData?.id} {...props} />; }

function TrainingSession({ classData, lessonData, masteryData = {}, onClose, onComplete }) {
  const [initialMastery] = useState(() => readProgress()[lessonData.id] || masteryData);

  // getSequence ahora recibe el nivel de mastery para adaptar los pasos desde el inicio
  const [sequence] = useState(() => getSequence(lessonData, initialMastery.mastery || 0));

  const sessionKey = 'vargas_session_' + lessonData.id;
  const signature = JSON.stringify([lessonData.code, sequence]);

  const [muted, setMuted] = useState(() => sounds.isMuted);
  const [theme, setTheme] = useState(() => {
    return document.documentElement.getAttribute('data-theme') || localStorage.getItem('vargas_theme') || 'dark';
  });

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-mode');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-mode');
    }
    try { localStorage.setItem('vargas_theme', nextTheme); } catch {}
  };

  const [record, setRecord] = useState(initialMastery);
  const [results, setResults] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(sessionKey) || 'null');
      return saved?.signature === signature && Array.isArray(saved.results) && saved.results.length <= sequence.length
        ? saved.results : [];
    } catch { return []; }
  });

  // Toast de paso saltado
  const [skipToast, setSkipToast] = useState(null);
  const skipToastTimer = useRef(null);

  const panel = useRef(null);
  const completed = useRef(false);
  const acceptedStep = useRef(-1);

  const index = results.length;
  const stage = sequence[index];
  const Stage = STAGES[stage?.kind];
  const invalid = !sequence.length || sequence.some(item => !STAGES[item.kind]);
  const finished = !invalid && index === sequence.length;

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; previous?.focus?.(); };
  }, []);

  useEffect(() => { panel.current?.focus(); panel.current?.scrollTo(0, 0); }, [index]);

  useEffect(() => {
    try { localStorage.setItem(sessionKey, JSON.stringify({ signature, results })); } catch { /* Storage may be unavailable. */ }
  }, [sessionKey, signature, results]);

  // Limpiar timer de toast al desmontar
  useEffect(() => () => clearTimeout(skipToastTimer.current), []);

  function showSkipToast(skippedStage) {
    clearTimeout(skipToastTimer.current);
    setSkipToast(skippedStage);
    skipToastTimer.current = setTimeout(() => setSkipToast(null), 2400);
  }

  // Retroceder al paso anterior (deshace tambien pasos auto-saltados)
  function goBack() {
    if (index === 0) return;
    setResults(previous => {
      // Si el ultimo paso fue saltado, seguir quitando hasta que no lo sea
      let cut = previous.length - 1;
      while (cut > 0 && previous[cut]?.skipped) cut--;
      return previous.slice(0, cut);
    });
    acceptedStep.current = index - 2;
  }

  function keyDown(event) {
    if (event.key === 'Escape') { event.preventDefault(); onClose(); return; }
    // Alt+ArrowLeft: volver al paso anterior (no interfiere con escritura)
    if (event.altKey && event.key === 'ArrowLeft' && !event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      goBack();
      return;
    }
    if (event.defaultPrevented) return;
    if (event.key === 'Tab') {
      const items = [...panel.current.querySelectorAll('button:not(:disabled), input, textarea, [tabindex="0"]')];
      const first = items[0], last = items.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    if (event.key === 'Enter' && document.activeElement === panel.current) {
      event.preventDefault(); panel.current.querySelector('.duo-btn-primary:not(:disabled)')?.click();
    }
  }

  function finish() {
    if (completed.current) return;
    completed.current = true;
    try {
      localStorage.removeItem(sessionKey);
      duoStorage.clearActiveLesson();
      duoStorage.clearLessonDrafts(lessonData.id);
    } catch { /* Optional persistence. */ }
    const earnedXp = results.reduce((sum, result) => sum + stageXp(result), 0);
    if (record.status === 'MASTERED' && initialMastery.status !== 'MASTERED' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
      confetti({ particleCount: 70, spread: 60 });
    onComplete?.({ lessonId: lessonData.id, stages: results, earnedXp });
    onClose();
  }

  function handleComplete(result) {
    if (!result?.correct || acceptedStep.current === index) return;
    acceptedStep.current = index;

    const enriched = { ...result, stageId: stage.id, kind: stage.kind };

    // Calcular cuantos pasos saltar por rendimiento perfecto en sesion
    let newResults = [enriched];
    let nextIdx = index + 1;

    while (nextIdx < sequence.length) {
      const nextStage = sequence[nextIdx];
      if (shouldSkipNext({ ...enriched, kind: stage.kind }, nextStage)) {
        // Saltar este paso: agregar resultado sintetico de "saltado"
        const skippedResult = {
          correct: true, stageId: nextStage.id, kind: nextStage.kind,
          skipped: true, accuracy: 1, hintsUsed: 0, criticalMistakes: 0,
          elapsedSeconds: 0, cpm: 0,
        };
        newResults.push(skippedResult);
        showSkipToast(nextStage.id);
        nextIdx++;
      } else {
        break;
      }
    }

    setRecord(saveAttempt(lessonData.id, result));
    if (result.correct) sounds.playComboMilestone(2);
    setResults(previous => [...previous, ...newResults]);
  }

  const stageLabel = {
    'guided-typing': 'Construir con ayuda',
    'fill-token': 'Completar tokens',
    'fill-line': 'Completar lineas',
    recall: 'Memoria activa',
    speedrun: 'Contra el reloj',
    observe: 'Teoria',
    trace: 'Trazado',
    recognize: 'Reconocer',
  };

  return (
    <div className="training-overlay">
      <div className="training-panel" role="dialog" aria-modal="true" aria-labelledby="training-title" tabIndex={-1} ref={panel} onKeyDown={keyDown}>
        <header className="training-header">
          <button className="btn-exit-lesson" onClick={onClose} aria-label="Salir de la leccion"><X size={24} /></button>
          <button
            className="btn-exit-lesson"
            onClick={goBack}
            disabled={index === 0}
            aria-label="Paso anterior (Alt+←)"
            title="Paso anterior (Alt+←)"
            style={{ opacity: index === 0 ? 0.3 : 1 }}
          >
            <ChevronLeft size={22} />
          </button>
          <progress aria-label="Progreso de la leccion" max={sequence.length || 1} value={index} />
          <span>{index}/{sequence.length}</span>
          <button className="btn-exit-lesson" aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'} onClick={() => { sounds.setMuted(!muted); setMuted(!muted); try { localStorage.setItem('vargas_sound_muted', String(!muted)); } catch {} }}>{muted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
          <button className="btn-exit-lesson" aria-label={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'} title={theme === 'dark' ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'} onClick={toggleTheme}>{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
        </header>

        {/* Toast de salto adaptativo */}
        {skipToast && (
          <div className="skip-toast" role="status" aria-live="polite">
            <Zap size={15} />
            <span>Paso saltado: <strong>{stageLabel[skipToast] || skipToast}</strong> — lo dominas</span>
          </div>
        )}

        <main className="training-main">
          <p id="training-title" className="training-caption">{classData?.shortTitle} · {lessonData?.title}</p>
          {invalid
            ? <p role="alert">No se puede abrir esta leccion: su secuencia contiene etapas sin configurar.</p>
            : finished
              ? <>
                  <h2><Trophy size={28} className="icon-inline" />Leccion completada</h2>
                  <p>Completaste {results.filter(r => !r.skipped).length} etapas{results.some(r => r.skipped) ? ` (${results.filter(r => r.skipped).length} saltadas por tu rendimiento)` : ''}. Sigue practicando para afianzar lo aprendido.</p>
                  <button className="duo-btn duo-btn-primary" onClick={finish}>Volver a la ruta</button>
                </>
              : <Stage
                  key={stage.key}
                  stageId={stage.id}
                  classData={classData}
                  lessonData={lessonData}
                  masteryData={record}
                  onAttempt={result => { setRecord(saveAttempt(lessonData.id, result)); if (result.correct) sounds.playComboMilestone(2); }}
                  onComplete={handleComplete}
                />
          }
        </main>
      </div>
    </div>
  );
}
