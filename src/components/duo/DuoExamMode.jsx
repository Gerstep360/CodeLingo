import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  Award,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Download,
  Upload,
  Code2
} from 'lucide-react';
import { DuoFlameIcon } from './DuoIcons';
import { CodeOutlineSidebar } from '../CodeOutlineSidebar';
import { CodeEditor } from '../CodeEditor';
import { duoStorage } from '../../utils/duoStorage';

export function DuoExamMode({
  timer,
  isExamMode,
  onToggleExamMode,
  engine,
  snippets,
  currentSnippetId,
  onSelectSnippet,
  currentSnippet,
  activeFunctionName,
  onSelectOutlineFunction,
  jumpToLineIdx,
  onReloadFile,
  onOpenCustomModal
}) {
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const timeOptions = [15, 30, 45, 60];

  return (
    <div className="duo-exam-page">
      {/* 1. Duolingo 3D Control Header */}
      <header className="duo-exam-header">
        <div className="exam-header-left">
          {/* Big 3D Play/Pause Button */}
          <button
            type="button"
            className={`duo-btn ${timer.isRunning ? 'duo-btn-danger' : 'duo-btn-primary'} btn-timer-toggle`}
            onClick={() => (timer.isRunning ? timer.pause() : timer.start())}
          >
            {timer.isRunning ? <Pause size={18} /> : <Play size={18} fill="#FFFFFF" />}
            <span>{timer.isRunning ? 'PAUSAR' : 'INICIAR EXAMEN'}</span>
          </button>

          {/* 3D Physical Timer Display */}
          <div className="timer-pill-wrap">
            <button
              type="button"
              className="duo-timer-pill"
              onClick={() => setShowTimeDropdown(!showTimeDropdown)}
              title="Ajustar tiempo del examen"
            >
              <Clock size={16} color="var(--duo-orange)" />
              <span className="timer-digits">{timer.formattedTime}</span>
              <span className="timer-unit">({timer.minutesSetting}m)</span>
            </button>

            {showTimeDropdown && (
              <div className="duo-timer-dropdown animate-pop">
                <span className="dropdown-label">DURACIÓN DEL EXAMEN</span>
                {timeOptions.map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`dropdown-opt ${timer.minutesSetting === m ? 'active' : ''}`}
                    onClick={() => {
                      timer.setMinutes(m);
                      setShowTimeDropdown(false);
                    }}
                  >
                    <span>{m} Minutos</span>
                    {m === 45 && <span className="vargas-badge">Examen Vargas</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="duo-btn duo-btn-secondary btn-icon-reset"
            onClick={timer.reset}
            title="Reiniciar temporizador"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Center: File Snippet Picker */}
        <div className="exam-header-center">
          <div className="duo-snippet-select-box">
            <Code2 size={16} color="var(--duo-blue)" />
            <select
              value={currentSnippetId}
              onChange={(e) => onSelectSnippet(e.target.value)}
              className="duo-snippet-select"
            >
              {snippets.map((snip) => (
                <option key={snip.id} value={snip.id}>
                  {snip.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Exam Mode Switch & Backup Export */}
        <div className="exam-header-right">
          <button
            type="button"
            className={`duo-btn ${isExamMode ? 'duo-btn-danger' : 'duo-btn-secondary'} btn-mode-toggle`}
            onClick={() => onToggleExamMode(!isExamMode)}
          >
            <Sparkles size={16} />
            <span>{isExamMode ? 'MODO EXAMEN (A CIEGAS)' : 'MODO GUÍA (FANTASMA)'}</span>
          </button>

          <button
            type="button"
            className="duo-btn duo-btn-secondary btn-export-backup"
            onClick={duoStorage.exportBackup}
            title="Exportar copia de seguridad en JSON para llevar a la nube"
          >
            <Download size={15} />
            <span>Respaldar</span>
          </button>
        </div>
      </header>

      {/* 2. Duolingo Metrics Bar (Chunky 3D Cards) */}
      <div className="duo-metrics-bar">
        <div className="duo-metric-card">
          <div className="m-icon-wrap blue">
            <Zap size={20} color="#FFFFFF" />
          </div>
          <div className="m-info">
            <span className="m-val">{engine.wpm}</span>
            <span className="m-label">PALABRAS/MIN (WPM)</span>
          </div>
        </div>

        <div className="duo-metric-card">
          <div className="m-icon-wrap green">
            <CheckCircle2 size={20} color="#FFFFFF" />
          </div>
          <div className="m-info">
            <span className="m-val">{engine.accuracy}%</span>
            <span className="m-label">PRECISIÓN</span>
          </div>
        </div>

        <div className="duo-metric-card">
          <div className="m-icon-wrap red">
            <AlertTriangle size={20} color="#FFFFFF" />
          </div>
          <div className="m-info">
            <span className="m-val">{engine.totalErrors}</span>
            <span className="m-label">ERRORES</span>
          </div>
        </div>

        <div className="duo-metric-card">
          <div className="m-icon-wrap orange">
            <DuoFlameIcon size={22} color="#FFFFFF" />
          </div>
          <div className="m-info">
            <span className="m-val">{engine.streak}</span>
            <span className="m-label">RACHA DE TECLAS</span>
          </div>
        </div>
      </div>

      {/* 3. Single Unified IDE Workspace */}
      <div className="duo-ide-workspace-frame">
        <CodeOutlineSidebar
          outlineFunctions={engine.outlineFunctions}
          activeFunction={activeFunctionName}
          onSelectFunction={onSelectOutlineFunction}
        />

        <CodeEditor
          targetCode={engine.targetCode}
          parsedStructure={engine.parsedStructure}
          typedChars={engine.typedChars}
          textBeforeCursor={engine.textBeforeCursor}
          currentIndex={engine.currentIndex}
          closingStack={engine.closingStack}
          streak={engine.streak}
          maxStreak={engine.maxStreak}
          comboMultiplier={engine.comboMultiplier}
          comboTierName={engine.comboTierName}
          comboColor={engine.comboColor}
          comboEvent={engine.comboEvent}
          isExamMode={isExamMode}
          isCompleted={engine.isCompleted}
          onKeyDown={engine.handleKeyDown}
          onPasteText={engine.handlePasteText}
          onInsertText={engine.handleInsertText}
          snippetTitle={currentSnippet.title}
          snippetFileName={currentSnippet.fileName || 'Examen1.java'}
          snippetFilePath={currentSnippet.filePath || 'src/assets/AI/Primer Parcial/Examen1.java'}
          snippetDescription={currentSnippet.description}
          snippetCategory={currentSnippet.category}
          jumpToLineIdx={jumpToLineIdx}
          onReloadFile={onReloadFile}
        />
      </div>

      <style>{`
        .duo-exam-page {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          padding: 16px 20px;
          gap: 16px;
          min-height: 100vh;
        }

        /* Top Header */
        .duo-exam-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-lg);
          padding: 12px 18px;
          box-shadow: 0 4px 0 var(--duo-swan);
          gap: 16px;
          flex-wrap: wrap;
        }

        .exam-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .btn-timer-toggle {
          min-width: 160px;
          min-height: 44px;
        }

        .timer-pill-wrap {
          position: relative;
        }

        .duo-timer-pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--duo-polar);
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-md);
          padding: 8px 14px;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 15px;
          font-weight: 800;
          color: var(--duo-eel);
          box-shadow: 0 3px 0 var(--duo-swan);
          transition: background 120ms ease;
        }

        .duo-timer-pill:hover {
          background: var(--duo-blue-soft);
          border-color: var(--duo-blue);
        }

        .timer-unit {
          font-size: 12px;
          color: var(--duo-wolf);
          font-family: var(--font-sans);
        }

        .duo-timer-dropdown {
          position: absolute;
          top: 48px;
          left: 0;
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-md);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          padding: 10px;
          z-index: 60;
          width: 220px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .dropdown-label {
          font-size: 10px;
          font-weight: 900;
          color: var(--duo-wolf);
          letter-spacing: 0.6px;
          padding: 2px 6px;
        }

        .dropdown-opt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          border-radius: 8px;
          border: 1px solid transparent;
          background: transparent;
          font-size: 13px;
          font-weight: 700;
          color: var(--duo-eel);
          cursor: pointer;
        }

        .dropdown-opt:hover {
          background: var(--duo-polar);
        }

        .dropdown-opt.active {
          background: var(--duo-blue-soft);
          color: var(--duo-blue);
          border-color: #A0DBFF;
        }

        .vargas-badge {
          font-size: 10px;
          background: var(--duo-yellow-soft);
          color: #946C00;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: 800;
        }

        .btn-icon-reset {
          min-height: 44px;
          padding: 0 14px;
        }

        .exam-header-center {
          flex: 1;
          max-width: 420px;
        }

        .duo-snippet-select-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--duo-polar);
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-md);
          padding: 4px 12px;
          box-shadow: 0 2px 0 var(--duo-swan);
        }

        .duo-snippet-select {
          flex: 1;
          border: none;
          background: transparent;
          font-family: var(--font-sans);
          font-size: 13px;
          font-weight: 700;
          color: var(--duo-eel);
          outline: none;
          cursor: pointer;
          height: 34px;
        }

        .exam-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .btn-mode-toggle {
          min-height: 44px;
          font-size: 12px;
        }

        .btn-export-backup {
          min-height: 44px;
          font-size: 12px;
        }

        /* Metrics Bar */
        .duo-metrics-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }

        .duo-metric-card {
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-lg);
          padding: 14px 18px;
          box-shadow: 0 4px 0 var(--duo-swan);
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .m-icon-wrap {
          width: 40px;
          height: 40px;
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .m-icon-wrap.blue { background: var(--duo-blue); }
        .m-icon-wrap.green { background: var(--duo-green); }
        .m-icon-wrap.red { background: var(--duo-red); }
        .m-icon-wrap.orange { background: var(--duo-orange); }

        .m-info {
          display: flex;
          flex-direction: column;
        }

        .m-val {
          font-size: 22px;
          font-weight: 900;
          color: var(--duo-eel);
          line-height: 1.1;
        }

        .m-label {
          font-size: 10px;
          font-weight: 800;
          color: var(--duo-wolf);
          letter-spacing: 0.5px;
          margin-top: 2px;
        }

        /* IDE Workspace Frame */
        .duo-ide-workspace-frame {
          flex: 1;
          display: flex;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 4px 0 var(--duo-swan);
          background: #FFFFFF;
          min-height: 580px;
        }

        @media (max-width: 900px) {
          .duo-metrics-bar {
            grid-template-columns: 1fr 1fr;
          }
        }
      `}</style>
    </div>
  );
}
