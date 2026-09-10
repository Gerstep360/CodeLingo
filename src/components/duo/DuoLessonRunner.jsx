import React, { useState } from 'react';
import { X, Check, ArrowRight, Sparkles, Award, RotateCcw, BookOpen, Copy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { DuoPartyIcon, DuoTrophyIcon } from './DuoIcons';
import { sounds } from '../../utils/soundEffects';

export function DuoLessonRunner({ node, onClose, onFinishLesson }) {
  const exercises = node?.exercises || [];
  const [showTheoryModal, setShowTheoryModal] = useState(Boolean(node?.theory));
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [copiedCode, setCopiedCode] = useState(false);

  const currentExercise = exercises[currentIdx];
  const progressPercent = Math.round(((currentIdx + (isAnswerChecked ? 1 : 0)) / exercises.length) * 100);

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

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
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }
    }
  };

  const handleFinishAndReturn = () => {
    if (onFinishLesson) {
      onFinishLesson(node.id, node.xp || (node.isFinalExam ? 35 : 20));
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
            <div className="duo-progress-fill" style={{ width: `${showTheoryModal ? 0 : progressPercent}%` }} />
          </div>

          {/* Button to Re-view Theory Class */}
          {node.theory && !showTheoryModal && (
            <button
              type="button"
              className="btn-toggle-theory"
              onClick={() => setShowTheoryModal(true)}
              title="Repasar la teoría de esta clase"
            >
              <BookOpen size={16} />
              <span>Clase</span>
            </button>
          )}

          <span className="lesson-step-counter">
            {showTheoryModal ? 'Teoría' : `${currentIdx + 1}/${exercises.length}`}
          </span>
        </header>

        {/* 1. CLASE TEÓRICA (Aparece primero para fijar conceptos) */}
        {showTheoryModal && node.theory && (
          <main className="duo-lesson-main animate-pop">
            <div className="theory-card-wrapper">
              <div className={`theory-tag-badge ${node.isFinalExam ? 'badge-exam' : ''}`}>
                {node.isFinalExam ? <DuoTrophyIcon size={16} /> : <BookOpen size={16} />}
                <span>{node.isFinalExam ? 'EXAMEN FINAL DE SECCIÓN' : 'CLASE Y TEORÍA'}</span>
              </div>

              <h2 className="theory-class-title">{node.theory.title || node.title}</h2>
              <p className="theory-concept-text">{node.theory.concept}</p>

              {/* Code Example if present in Theory */}
              {node.theory.codeExample && (
                <div className="theory-code-box">
                  <div className="theory-code-header">
                    <span className="code-lang-tag">Java · Estructura de Examen</span>
                    <button
                      type="button"
                      className="btn-theory-copy"
                      onClick={() => handleCopyCode(node.theory.codeExample)}
                    >
                      {copiedCode ? <Check size={13} color="var(--duo-green)" /> : <Copy size={13} />}
                      <span>{copiedCode ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>
                  <pre><code>{node.theory.codeExample}</code></pre>
                </div>
              )}

              {/* Golden Rule Highlight */}
              {node.theory.goldenRule && (
                <div className="theory-rule-box">
                  <div className="rule-title">
                    <Sparkles size={16} color="#EAB308" />
                    <span>Regla de Oro de Vargas</span>
                  </div>
                  <p className="rule-text">{node.theory.goldenRule}</p>
                </div>
              )}

              <button
                type="button"
                className="duo-btn duo-btn-primary btn-start-questions"
                onClick={() => setShowTheoryModal(false)}
              >
                <span>{node.isFinalExam ? '¡COMENZAR EL EXAMEN! ➔' : 'ENTENDIDO, ¡A LAS PREGUNTAS! ➔'}</span>
              </button>
            </div>
          </main>
        )}

        {/* 2. PREGUNTAS DE LA CLASE */}
        {!showTheoryModal && !isFinished && currentExercise && (
          <main className="duo-lesson-main">
            <div className="lesson-prompt-wrap">
              <div className="lesson-badge-row">
                <span className="lesson-badge">{node.title}</span>
                {node.isFinalExam && <span className="exam-pill-badge">Examen Final (+35 XP)</span>}
              </div>
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

        /* Button to Reopen Theory */
        .btn-toggle-theory {
          display: flex;
          align-items: center;
          gap: 5px;
          background: var(--duo-blue-soft);
          color: var(--duo-blue);
          border: 1px solid #84D8FF;
          border-radius: 999px;
          padding: 4px 10px;
          font-size: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: transform 90ms ease;
        }

        .btn-toggle-theory:hover {
          background: #DDF3FF;
        }

        /* Theory Card Styles */
        .theory-card-wrapper {
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-lg);
          padding: 24px;
          box-shadow: 0 4px 0 var(--duo-swan);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .theory-tag-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: var(--duo-blue);
          background: var(--duo-blue-soft);
          border: 1px solid #84D8FF;
          padding: 4px 12px;
          border-radius: 999px;
          align-self: flex-start;
        }

        .theory-tag-badge.badge-exam {
          color: #B58500;
          background: var(--duo-yellow-soft);
          border-color: #FFE58F;
        }

        .theory-class-title {
          font-size: 24px;
          font-weight: 900;
          color: var(--duo-eel);
          line-height: 1.2;
        }

        .theory-concept-text {
          font-size: 15px;
          font-weight: 600;
          color: var(--duo-wolf);
          line-height: 1.5;
        }

        .theory-code-box {
          background: #1E293B;
          border-radius: var(--radius-md);
          overflow: hidden;
          box-shadow: 0 3px 0 rgba(0,0,0,0.2);
        }

        .theory-code-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          background: #0F172A;
          border-bottom: 1px solid #334155;
        }

        .code-lang-tag {
          font-size: 11px;
          font-weight: 800;
          color: #94A3B8;
        }

        .btn-theory-copy {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255,255,255,0.1);
          color: #E2E8F0;
          border: 1px solid #475569;
          border-radius: 6px;
          padding: 2px 8px;
          font-size: 11px;
          cursor: pointer;
        }

        .btn-theory-copy:hover {
          background: rgba(255,255,255,0.2);
        }

        .theory-code-box pre {
          padding: 14px 16px;
          margin: 0;
          overflow-x: auto;
          color: #F8FAFC;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 1.5;
        }

        .theory-rule-box {
          background: var(--duo-yellow-soft);
          border: 2px solid #FFE58F;
          border-radius: var(--radius-md);
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .rule-title {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 900;
          color: #946C00;
          text-transform: uppercase;
        }

        .rule-text {
          font-size: 13px;
          font-weight: 700;
          color: #594200;
          line-height: 1.4;
          margin: 0;
        }

        .btn-start-questions {
          width: 100%;
          min-height: 48px;
          font-size: 15px;
          margin-top: 8px;
        }

        .lesson-badge-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .exam-pill-badge {
          font-size: 11px;
          font-weight: 900;
          background: var(--duo-yellow-soft);
          color: #946C00;
          border: 1px solid #FFE58F;
          padding: 3px 8px;
          border-radius: 999px;
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
