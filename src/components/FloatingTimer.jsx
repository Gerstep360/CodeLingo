import React from 'react';
import { Clock, Play, Pause, RotateCcw, Sparkles, Award } from 'lucide-react';

export function FloatingTimer({ timer, isExamMode, onToggleExamMode }) {
  const isUrgent = timer.secondsRemaining <= 300 && timer.secondsRemaining > 0;

  return (
    <div className={`floating-timer-container ${isUrgent ? 'urgent' : ''} animate-pop`}>
      <div className="floating-timer-icon">
        <Clock size={16} />
      </div>

      <div className="floating-timer-digits">
        {timer.formattedTime}
      </div>

      <div className="floating-timer-controls">
        <button
          type="button"
          onClick={timer.toggle}
          className={`btn-timer-icon ${timer.isRunning ? 'pause' : 'play'}`}
          title={timer.isRunning ? 'Pausar' : 'Iniciar'}
        >
          {timer.isRunning ? <Pause size={13} /> : <Play size={13} />}
        </button>

        <button
          type="button"
          onClick={timer.reset}
          className="btn-timer-icon"
          title="Reiniciar temporizador"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      <button
        type="button"
        onClick={() => onToggleExamMode(!isExamMode)}
        className={`floating-mode-badge ${isExamMode ? 'exam' : 'guide'}`}
        title={isExamMode ? 'Modo Examen Activo (Guía Oculta)' : 'Modo Guía Fantasma Activo'}
      >
        {isExamMode ? <Award size={13} /> : <Sparkles size={13} />}
        <span>{isExamMode ? 'Examen Real' : 'Guía Fantasma'}</span>
      </button>

      <style>{`
        .floating-timer-container {
          position: fixed;
          top: 14px;
          right: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border: 1.5px solid var(--pastel-lavender-border);
          box-shadow: 0 4px 20px rgba(108, 92, 231, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          z-index: 999;
          user-select: none;
          transition: var(--transition-fast);
        }

        .floating-timer-container:hover {
          box-shadow: 0 6px 24px rgba(108, 92, 231, 0.2);
        }

        .floating-timer-container.urgent {
          border-color: var(--pastel-peach);
          background: var(--pastel-peach-bg);
          animation: gentlePulse 1.2s infinite ease-in-out;
        }

        .floating-timer-icon {
          color: var(--pastel-lavender);
          display: flex;
          align-items: center;
        }

        .floating-timer-digits {
          font-family: var(--font-mono);
          font-size: 16px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: 0.5px;
          min-width: 52px;
        }

        .floating-timer-controls {
          display: flex;
          align-items: center;
          gap: 4px;
          border-left: 1px solid var(--card-border);
          padding-left: 8px;
        }

        .btn-timer-icon {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1px solid var(--card-border);
          background: #FFFFFF;
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-timer-icon:hover {
          background: var(--bg-main);
        }

        .btn-timer-icon.play {
          background: var(--pastel-mint-bg);
          color: var(--pastel-mint);
          border-color: var(--pastel-mint-border);
        }

        .btn-timer-icon.pause {
          background: var(--pastel-peach-bg);
          color: var(--pastel-peach);
          border-color: var(--pastel-peach-border);
        }

        .floating-mode-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          border: none;
          font-size: 11px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          cursor: pointer;
          margin-left: 4px;
          transition: var(--transition-fast);
        }

        .floating-mode-badge.guide {
          background: var(--pastel-lavender-bg);
          color: var(--pastel-lavender);
          border: 1px solid var(--pastel-lavender-border);
        }

        .floating-mode-badge.exam {
          background: var(--pastel-peach-bg);
          color: var(--pastel-peach);
          border: 1px solid var(--pastel-peach-border);
        }
      `}</style>
    </div>
  );
}
