import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, Trophy, RotateCcw, ArrowRight, X, Flame, Target, Gauge, Clock } from 'lucide-react';

export function ExamSummaryModal({
  isOpen,
  onClose,
  onRetry,
  onNext,
  wpm,
  cpm,
  accuracy,
  totalErrors,
  maxStreak,
  timeTakenFormatted,
  isExamMode,
  snippetTitle
}) {
  useEffect(() => {
    if (isOpen) {
      // Fire soft pastel confetti
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#7D70BA', '#4EAC85', '#E56B6F', '#DCA134', '#4A90E2']
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Calculate grade
  let grade = 'A';
  let gradeTitle = '¡Excelente!';
  let gradeColor = 'var(--pastel-mint)';
  let gradeBg = 'var(--pastel-mint-bg)';

  if (accuracy >= 97 && wpm >= 40) {
    grade = 'A+';
    gradeTitle = '¡Memoria Impecable!';
    gradeColor = 'var(--pastel-lavender)';
    gradeBg = 'var(--pastel-lavender-bg)';
  } else if (accuracy >= 90) {
    grade = 'A';
    gradeTitle = '¡Gran Rendimiento!';
    gradeColor = 'var(--pastel-mint)';
    gradeBg = 'var(--pastel-mint-bg)';
  } else if (accuracy >= 80) {
    grade = 'B';
    gradeTitle = '¡Buen Trabajo!';
    gradeColor = 'var(--pastel-honey)';
    gradeBg = 'var(--pastel-honey-bg)';
  } else {
    grade = 'C';
    gradeTitle = 'Sigue Practicando';
    gradeColor = 'var(--pastel-peach)';
    gradeBg = 'var(--pastel-peach-bg)';
  }

  return (
    <div className="summary-backdrop" onClick={onClose}>
      <div className="summary-card animate-pop" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="summary-header">
          <div className="summary-grade-badge" style={{ backgroundColor: gradeBg, borderColor: gradeColor }}>
            <span className="grade-letter" style={{ color: gradeColor }}>{grade}</span>
          </div>
          <div>
            <h2 className="summary-title">{gradeTitle}</h2>
            <p className="summary-subtitle">
              {isExamMode ? 'Evaluación de Examen Real (Sin Guía)' : 'Sesión de Entrenamiento de Memoria Muscular'}
            </p>
            <p className="summary-snippet-name">{snippetTitle}</p>
          </div>
          <button className="summary-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="summary-grid">
          <div className="stat-card">
            <div className="stat-icon mint">
              <Gauge size={16} />
            </div>
            <div className="stat-info">
              <span className="stat-val">{wpm}</span>
              <span className="stat-tag">Palabras / Min (WPM)</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon sky">
              <Target size={16} />
            </div>
            <div className="stat-info">
              <span className="stat-val">{accuracy}%</span>
              <span className="stat-tag">Precisión Final</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon honey">
              <Flame size={16} />
            </div>
            <div className="stat-info">
              <span className="stat-val">{maxStreak}</span>
              <span className="stat-tag">Racha Máxima de Combo</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon peach">
              <Clock size={16} />
            </div>
            <div className="stat-info">
              <span className="stat-val">{timeTakenFormatted}</span>
              <span className="stat-tag">Tiempo Transcurrido</span>
            </div>
          </div>
        </div>

        {/* Additional Detail Row */}
        <div className="summary-details-banner">
          <div className="detail-item">
            <span className="detail-label">Pulsaciones Totales (CPM):</span>
            <span className="detail-value">{cpm}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Errores Registrados:</span>
            <span className="detail-value">{totalErrors}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Modo:</span>
            <span className="detail-value highlight">
              {isExamMode ? 'Examen de Memoria Pura' : 'Memoria Muscular Guiada'}
            </span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="summary-actions">
          <button onClick={onRetry} className="btn-retry">
            <RotateCcw size={15} />
            <span>Reintentar</span>
          </button>
          {onNext && (
            <button onClick={onNext} className="btn-next">
              <span>Siguiente Ejercicio</span>
              <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>

      <style>{`
        .summary-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(43, 47, 56, 0.45);
          backdrop-filter: blur(2px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 120;
          padding: 20px;
        }

        .summary-card {
          background: #FFFFFF;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-lg);
          width: 100%;
          max-width: 540px;
          overflow: hidden;
        }

        .summary-header {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 22px 26px;
          background: var(--bg-main);
          border-bottom: 1px solid var(--card-border);
          position: relative;
        }

        .summary-grade-badge {
          width: 52px;
          height: 52px;
          border-radius: var(--radius-md);
          border: 2px solid;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .grade-letter {
          font-size: 24px;
          font-weight: 800;
        }

        .summary-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .summary-subtitle {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .summary-snippet-name {
          font-size: 12px;
          font-weight: 600;
          color: var(--pastel-lavender);
          margin-top: 2px;
        }

        .summary-close-btn {
          position: absolute;
          top: 18px;
          right: 18px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          padding: 20px 26px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 14px;
          background: var(--bg-main);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
        }

        .stat-icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon.mint {
          background: var(--pastel-mint-bg);
          color: var(--pastel-mint);
          border: 1px solid var(--pastel-mint-border);
        }

        .stat-icon.sky {
          background: var(--pastel-sky-bg);
          color: var(--pastel-sky);
          border: 1px solid var(--pastel-sky-border);
        }

        .stat-icon.honey {
          background: var(--pastel-honey-bg);
          color: var(--pastel-honey);
          border: 1px solid var(--pastel-honey-border);
        }

        .stat-icon.peach {
          background: var(--pastel-peach-bg);
          color: var(--pastel-peach);
          border: 1px solid var(--pastel-peach-border);
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-val {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.1;
        }

        .stat-tag {
          font-size: 10px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .summary-details-banner {
          display: flex;
          justify-content: space-between;
          padding: 12px 26px;
          background: #FCFBF9;
          border-top: 1px solid var(--card-border);
          border-bottom: 1px solid var(--card-border);
          font-size: 12px;
        }

        .detail-item {
          display: flex;
          gap: 6px;
        }

        .detail-label {
          color: var(--text-secondary);
        }

        .detail-value {
          font-weight: 700;
          color: var(--text-primary);
        }

        .detail-value.highlight {
          color: var(--pastel-lavender);
        }

        .summary-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 18px 26px;
        }

        .btn-retry {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 18px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          color: var(--text-primary);
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-retry:hover {
          background: var(--bg-main);
        }

        .btn-next {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--pastel-lavender-border);
          background: var(--pastel-lavender);
          color: #FFFFFF;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-next:hover {
          background: #5b4bcf;
        }
      `}</style>
    </div>
  );
}
