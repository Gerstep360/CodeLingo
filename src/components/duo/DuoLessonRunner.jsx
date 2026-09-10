import React, { useState } from 'react';
import { X, Check, ArrowRight, Sparkles, Award, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DuoPartyIcon } from './DuoIcons';
import { sounds } from '../../utils/soundEffects';

export function DuoLessonRunner({ node, onClose, onFinishLesson }) {
  const exercises = node?.exercises || [];
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

  const currentExercise = exercises[currentIdx];
  const progressPercent = Math.round(((currentIdx + (isAnswerChecked ? 1 : 0)) / exercises.length) * 100);

  const handleSelectOption = (idx) => {
    if (isAnswerChecked) return;
    setSelectedOptionIdx(idx);
    sounds.playKeyClick();
  };

  const handleCheckAnswer = () => {
    if (selectedOptionIdx === null || isAnswerChecked) return;
    const selected = currentExercise.options[selectedOptionIdx];
    const correct = Boolean(selected?.isCorrect);

    setIsCorrect(correct);
    setIsAnswerChecked(true);

    if (correct) {
      sounds.playComboMilestone(2);
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      sounds.playErrorSound();
    }
  };

  const handleContinue = () => {
    if (currentIdx + 1 < exercises.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswerChecked(false);
      setIsCorrect(false);
    } else {
      // Lesson Complete!
      setIsFinished(true);
      sounds.playExamComplete();
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }
    }
  };

  const handleFinishAndReturn = () => {
    if (onFinishLesson) {
      onFinishLesson(node.id, node.xp || 20);
    }
    onClose();
  };

  return (
    <div className="duo-lesson-modal-overlay">
      <div className="duo-lesson-container">
        {/* Lesson Top Bar */}
        <header className="duo-lesson-header">
          <button
            type="button"
            className="btn-exit-lesson"
            onClick={onClose}
            title="Salir de la lección"
          >
            <X size={24} color="var(--duo-wolf)" />
          </button>

          {/* Duolingo Rounded Glossy Progress Bar */}
          <div className="duo-progress-bar">
            <div className="duo-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>

          <span className="lesson-step-counter">
            {currentIdx + 1}/{exercises.length}
          </span>
        </header>

        {/* Lesson Main Question Body */}
        {!isFinished && currentExercise && (
          <main className="duo-lesson-main">
            <div className="lesson-prompt-wrap">
              <span className="lesson-badge">{node.title}</span>
              <h2 className="lesson-question-title">{currentExercise.question}</h2>
            </div>

            {/* Code Block if any */}
            {currentExercise.code && (
              <div className="lesson-code-block">
                <pre>
                  <code>{currentExercise.code}</code>
                </pre>
              </div>
            )}

            {/* 3D Physical Answer Options */}
            <div className="lesson-options-list">
              {currentExercise.options.map((opt, optIdx) => {
                const isSelected = selectedOptionIdx === optIdx;
                let stateClass = '';
                if (isAnswerChecked) {
                  if (opt.isCorrect) stateClass = 'correct';
                  else if (isSelected && !opt.isCorrect) stateClass = 'wrong';
                  else stateClass = 'locked';
                } else if (isSelected) {
                  stateClass = 'selected';
                }

                const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                return (
                  <div
                    key={opt.text}
                    className={`duo-option-card ${stateClass}`}
                    onClick={() => handleSelectOption(optIdx)}
                  >
                    <span className="duo-option-letter">{letter}</span>
                    <span className="duo-option-text">{opt.text}</span>
                  </div>
                );
              })}
            </div>
          </main>
        )}

        {/* Finished Screen Celebration */}
        {isFinished && (
          <main className="duo-finish-screen animate-pop">
            <div className="finish-owl-badge">
              <DuoPartyIcon size={64} />
            </div>
            <h2 className="finish-title">¡Lección completada!</h2>
            <p className="finish-sub">Has dominado {node.title}. ¡Excelente memoria muscular!</p>

            <div className="finish-stats-grid">
              <div className="stat-card xp">
                <span className="stat-num">+{node.xp || 20}</span>
                <span className="stat-tag">XP GANADO</span>
              </div>
              <div className="stat-card accuracy">
                <span className="stat-num">
                  {Math.round((correctAnswersCount / exercises.length) * 100)}%
                </span>
                <span className="stat-tag">PRECISIÓN</span>
              </div>
            </div>

            <button
              type="button"
              className="duo-btn duo-btn-primary btn-finish-continue"
              onClick={handleFinishAndReturn}
            >
              <span>CONTINUAR</span>
              <ArrowRight size={18} />
            </button>
          </main>
        )}

        {/* Bottom Verification Footer Bar */}
        {!isFinished && (
          <footer className={`duo-lesson-footer ${isAnswerChecked ? (isCorrect ? 'footer-correct' : 'footer-wrong') : ''}`}>
            <div className="footer-content-wrap">
              {isAnswerChecked ? (
                <div className="feedback-feedback-content animate-slide-up">
                  <div className="feedback-text-col">
                    <div className="feedback-title">
                      {isCorrect ? '✓ ¡Excelente respuesta!' : '✕ Solución explicada:'}
                    </div>
                    <div className="feedback-explanation">
                      {currentExercise.explanation}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`duo-btn ${isCorrect ? 'duo-btn-primary' : 'duo-btn-danger'} btn-footer-continue`}
                    onClick={handleContinue}
                  >
                    <span>CONTINUAR</span>
                    <ArrowRight size={18} />
                  </button>
                </div>
              ) : (
                <div className="unverified-action-row">
                  <button
                    type="button"
                    className="duo-btn duo-btn-primary btn-check"
                    disabled={selectedOptionIdx === null}
                    onClick={handleCheckAnswer}
                  >
                    <span>COMPROBAR</span>
                  </button>
                </div>
              )}
            </div>
          </footer>
        )}
      </div>

      <style>{`
        .duo-lesson-modal-overlay {
          position: fixed;
          inset: 0;
          background: #FFFFFF;
          z-index: 100;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .duo-lesson-container {
          max-width: 680px;
          width: 100%;
          min-height: 100vh;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
        }

        /* Top Bar */
        .duo-lesson-header {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 24px 20px 16px;
        }

        .btn-exit-lesson {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }

        .btn-exit-lesson:hover {
          background: var(--duo-polar);
        }

        .lesson-step-counter {
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 800;
          color: var(--duo-wolf);
          min-width: 32px;
          text-align: right;
        }

        /* Main Body */
        .duo-lesson-main {
          flex: 1;
          padding: 24px 20px 140px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .lesson-badge {
          display: inline-block;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          color: var(--duo-blue);
          background: var(--duo-blue-soft);
          padding: 3px 10px;
          border-radius: 999px;
          border: 1px solid #BEE7FF;
          margin-bottom: 8px;
        }

        .lesson-question-title {
          font-size: 22px;
          font-weight: 900;
          color: var(--duo-eel);
          line-height: 1.25;
        }

        .lesson-code-block {
          background: #1E293B;
          color: #F8FAFC;
          border-radius: var(--radius-md);
          padding: 16px 20px;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.5;
          overflow-x: auto;
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
        }

        .lesson-options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .duo-option-text {
          font-family: var(--font-sans);
          font-size: 15px;
          font-weight: 700;
          line-height: 1.3;
        }

        /* Finish Screen */
        .duo-finish-screen {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 20px;
          gap: 16px;
        }

        .finish-owl-badge {
          font-size: 64px;
        }

        .finish-title {
          font-size: 28px;
          font-weight: 900;
          color: var(--duo-green);
        }

        .finish-sub {
          font-size: 15px;
          font-weight: 600;
          color: var(--duo-wolf);
          max-width: 380px;
        }

        .finish-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          width: 100%;
          max-width: 340px;
          margin: 20px 0 10px;
        }

        .stat-card {
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-card.xp {
          border-color: var(--duo-yellow);
          background: var(--duo-yellow-soft);
        }

        .stat-card.accuracy {
          border-color: var(--duo-green);
          background: var(--duo-green-soft);
        }

        .stat-num {
          font-size: 26px;
          font-weight: 900;
          color: var(--duo-eel);
        }

        .stat-tag {
          font-size: 11px;
          font-weight: 800;
          color: var(--duo-wolf);
        }

        .btn-finish-continue {
          width: 100%;
          max-width: 340px;
          min-height: 52px;
        }

        /* Bottom Footer Bar */
        .duo-lesson-footer {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: #FFFFFF;
          border-top: 2px solid var(--duo-swan);
          padding: 18px 24px;
          z-index: 105;
        }

        .footer-correct {
          background: var(--duo-green-soft) !important;
          border-color: #B2FF7E !important;
        }

        .footer-wrong {
          background: var(--duo-red-soft) !important;
          border-color: #FFB3B3 !important;
        }

        .footer-content-wrap {
          max-width: 680px;
          margin: 0 auto;
          width: 100%;
        }

        .unverified-action-row {
          display: flex;
          justify-content: flex-end;
        }

        .btn-check {
          min-width: 160px;
        }

        .feedback-feedback-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .feedback-text-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .feedback-title {
          font-size: 18px;
          font-weight: 900;
          color: var(--duo-eel);
        }

        .footer-correct .feedback-title {
          color: var(--duo-green-text);
        }

        .footer-wrong .feedback-title {
          color: var(--duo-red-text);
        }

        .feedback-explanation {
          font-size: 13px;
          font-weight: 600;
          color: var(--duo-eel);
          line-height: 1.35;
        }

        .btn-footer-continue {
          min-width: 170px;
          flex-shrink: 0;
        }

        @media (max-width: 640px) {
          .feedback-feedback-content {
            flex-direction: column;
            align-items: stretch;
          }
          .btn-footer-continue, .btn-check {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
