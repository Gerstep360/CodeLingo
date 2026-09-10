import React, { useState } from 'react';
import { Zap, CheckCircle2, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DuoTrophyIcon } from './DuoIcons';
import { DUO_FLASH_QUIZ_QUESTIONS } from '../../data/duoLessonsData';
import { sounds } from '../../utils/soundEffects';

export function DuoFlashQuiz({ onCompleteQuiz }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const question = DUO_FLASH_QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx) => {
    if (isAnswerChecked) return;
    setSelectedIdx(idx);
    sounds.playKeyClick();
  };

  const handleCheck = () => {
    if (selectedIdx === null || isAnswerChecked) return;
    const isCorrect = Boolean(question.options[selectedIdx]?.isCorrect);
    setIsAnswerChecked(true);

    if (isCorrect) {
      sounds.playComboMilestone(2);
      setScore((prev) => prev + 1);
    } else {
      sounds.playErrorSound();
    }
  };

  const handleNext = () => {
    if (currentIdx + 1 < DUO_FLASH_QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedIdx(null);
      setIsAnswerChecked(false);
    } else {
      setIsFinished(true);
      sounds.playExamComplete();
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      } catch (err) {}
      if (onCompleteQuiz) {
        onCompleteQuiz(score * 10);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setIsAnswerChecked(false);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="duo-flash-quiz-container">
      {/* Top Banner */}
      <div className="flash-quiz-banner">
        <div className="banner-left">
          <span className="flash-badge">
            <Zap size={14} fill="currentColor" />
            <span>TEST FLASH DE 10 PREGUNTAS</span>
          </span>
          <h2 className="banner-title">Evaluación de Memoria Muscular</h2>
          <p className="banner-desc">
            Las 10 preguntas fundamentales de la guía para verificar si tienes el mapa mental antes de entrar al examen.
          </p>
        </div>
        <div className="banner-right-score">
          <span className="score-num">{score} / {DUO_FLASH_QUIZ_QUESTIONS.length}</span>
          <span className="score-label">Aciertos</span>
        </div>
      </div>

      {/* Question Card */}
      {!isFinished && question && (
        <div className="flash-card-body animate-pop">
          <div className="flash-progress-row">
            <span className="q-counter">Pregunta {currentIdx + 1} de {DUO_FLASH_QUIZ_QUESTIONS.length}</span>
            <div className="duo-progress-bar mini">
              <div
                className="duo-progress-fill"
                style={{ width: `${Math.round(((currentIdx + (isAnswerChecked ? 1 : 0)) / DUO_FLASH_QUIZ_QUESTIONS.length) * 100)}%` }}
              />
            </div>
          </div>

          <h3 className="flash-question-text">{question.question}</h3>

          <div className="flash-options-list">
            {question.options.map((opt, optIdx) => {
              const isSelected = selectedIdx === optIdx;
              let stateClass = '';
              if (isAnswerChecked) {
                if (opt.isCorrect) stateClass = 'correct';
                else if (isSelected) stateClass = 'wrong';
                else stateClass = 'locked';
              } else if (isSelected) {
                stateClass = 'selected';
              }

              return (
                <div
                  key={opt.text}
                  className={`duo-option-card ${stateClass}`}
                  onClick={() => handleSelectOption(optIdx)}
                >
                  <span className="duo-option-letter">{String.fromCharCode(65 + optIdx)}</span>
                  <span className="duo-option-text">{opt.text}</span>
                </div>
              );
            })}
          </div>

          {/* Explanation Box when answered */}
          {isAnswerChecked && (
            <div className="flash-explanation-box animate-slide-up">
              <div className="exp-title">
                {question.options[selectedIdx]?.isCorrect ? '✓ ¡Correcto!' : '✕ Ojo a este detalle:'}
              </div>
              <p className="exp-body">{question.answerDetail}</p>
            </div>
          )}

          {/* Action Row */}
          <div className="flash-action-row">
            {!isAnswerChecked ? (
              <button
                type="button"
                className="duo-btn duo-btn-primary btn-flash-action"
                disabled={selectedIdx === null}
                onClick={handleCheck}
              >
                <span>COMPROBAR</span>
              </button>
            ) : (
              <button
                type="button"
                className="duo-btn duo-btn-primary btn-flash-action"
                onClick={handleNext}
              >
                <span>{currentIdx + 1 === DUO_FLASH_QUIZ_QUESTIONS.length ? 'VER RESULTADOS' : 'SIGUIENTE PREGUNTA'}</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Finished Summary */}
      {isFinished && (
        <div className="flash-finish-card animate-pop">
          <div className="finish-icon">
            <DuoTrophyIcon size={56} />
          </div>
          <h2 className="finish-title">¡Test Flash Completado!</h2>
          <p className="finish-score-summary">
            Puntuación final: <strong>{score} de {DUO_FLASH_QUIZ_QUESTIONS.length}</strong> ({Math.round((score / DUO_FLASH_QUIZ_QUESTIONS.length) * 100)}% de retención).
          </p>
          <p className="finish-advice">
            {score >= 8
              ? '🎉 ¡Excelente! Tienes el mapa mental claro en tu cabeza. ¡A por el 100 en el examen!'
              : '💡 Te recomendamos repasar la Guía Mental y volver a probar este test antes de entrar al examen.'}
          </p>

          <button
            type="button"
            className="duo-btn duo-btn-secondary btn-restart"
            onClick={handleRestart}
          >
            <RotateCcw size={16} />
            <span>Repetir Test Flash</span>
          </button>
        </div>
      )}

      <style>{`
        .duo-flash-quiz-container {
          max-width: 640px;
          margin: 0 auto;
          padding: 24px 16px 80px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .flash-quiz-banner {
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          box-shadow: 0 4px 0 var(--duo-swan);
          gap: 20px;
        }

        .flash-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 900;
          color: var(--duo-orange);
          background: var(--duo-orange-soft);
          padding: 3px 10px;
          border-radius: 999px;
          margin-bottom: 8px;
        }

        .banner-title {
          font-size: 20px;
          font-weight: 900;
          color: var(--duo-eel);
          line-height: 1.2;
        }

        .banner-desc {
          font-size: 13px;
          font-weight: 600;
          color: var(--duo-wolf);
          margin-top: 4px;
          line-height: 1.35;
        }

        .banner-right-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: var(--duo-polar);
          border: 1px solid var(--duo-swan);
          padding: 12px 18px;
          border-radius: var(--radius-md);
          flex-shrink: 0;
        }

        .score-num {
          font-size: 24px;
          font-weight: 900;
          color: var(--duo-green);
        }

        .score-label {
          font-size: 11px;
          font-weight: 800;
          color: var(--duo-wolf);
        }

        /* Card Body */
        .flash-card-body {
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-lg);
          padding: 28px 24px;
          box-shadow: 0 4px 0 var(--duo-swan);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .flash-progress-row {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .q-counter {
          font-size: 13px;
          font-weight: 800;
          color: var(--duo-wolf);
          min-width: 140px;
        }

        .duo-progress-bar.mini {
          height: 10px;
        }

        .flash-question-text {
          font-size: 18px;
          font-weight: 900;
          color: var(--duo-eel);
          line-height: 1.3;
        }

        .flash-options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .flash-explanation-box {
          background: var(--duo-blue-soft);
          border: 1px solid #BFE4FF;
          border-radius: var(--radius-md);
          padding: 14px 16px;
        }

        .exp-title {
          font-size: 14px;
          font-weight: 900;
          color: var(--duo-blue);
          margin-bottom: 4px;
        }

        .exp-body {
          font-size: 13px;
          font-weight: 600;
          color: var(--duo-eel);
          line-height: 1.35;
        }

        .flash-action-row {
          display: flex;
          justify-content: flex-end;
          padding-top: 8px;
        }

        .btn-flash-action {
          min-width: 180px;
        }

        /* Finish Card */
        .flash-finish-card {
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-lg);
          padding: 40px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
          box-shadow: 0 4px 0 var(--duo-swan);
        }

        .finish-icon {
          font-size: 54px;
        }

        .finish-score-summary {
          font-size: 17px;
          color: var(--duo-eel);
        }

        .finish-advice {
          font-size: 14px;
          font-weight: 600;
          color: var(--duo-wolf);
          max-width: 440px;
          line-height: 1.4;
        }

        .btn-restart {
          margin-top: 10px;
          min-width: 200px;
        }
      `}</style>
    </div>
  );
}
