import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Sparkles,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Download,
  Code2,
  Compass,
  X
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
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const timeOptions = [15, 30, 45, 60];

  const handleSelectFunctionAndCloseMobile = (fn) => {
    onSelectOutlineFunction(fn);
    setIsOutlineOpen(false);
  };

  return (
    <div className="duo-exam-page">
      {/* 1. Duolingo 3D Control Header */}
      <header className="duo-exam-header">
        {/* Left Section: Timer + Start/Pause */}
        <div className="exam-header-left">
          {/* Big 3D Play/Pause Button */}
          <button
            type="button"
            className={`duo-btn ${timer.isRunning ? 'duo-btn-danger' : 'duo-btn-primary'} btn-timer-toggle`}
            onClick={() => (timer.isRunning ? timer.pause() : timer.start())}
          >
            {timer.isRunning ? <Pause size={17} /> : <Play size={17} fill="#FFFFFF" />}
            <span className="btn-timer-label">{timer.isRunning ? 'PAUSAR' : 'INICIAR EXAMEN'}</span>
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

        {/* Right: Actions & Toggles */}
        <div className="exam-header-right">
          {/* Outline Toggle for Mobile & Compact screens */}
          <button
            type="button"
            className={`duo-btn ${isOutlineOpen ? 'duo-btn-primary' : 'duo-btn-secondary'} btn-outline-toggle`}
            onClick={() => setIsOutlineOpen(!isOutlineOpen)}
            title="Navegar entre algoritmos y funciones"
          >
            <Compass size={15} />
            <span className="btn-label-text">
              {isOutlineOpen ? 'Ocultar' : 'Funciones'} ({engine.outlineFunctions?.length || 0})
            </span>
          </button>

          <button
            type="button"
            className={`duo-btn ${isExamMode ? 'duo-btn-danger' : 'duo-btn-secondary'} btn-mode-toggle`}
            onClick={() => onToggleExamMode(!isExamMode)}
          >
            <Sparkles size={15} />
            <span className="mode-label-desktop">{isExamMode ? 'MODO EXAMEN (A CIEGAS)' : 'MODO GUÍA (FANTASMA)'}</span>
            <span className="mode-label-mobile">{isExamMode ? 'EXAMEN' : 'GUÍA'}</span>
          </button>

          <button
            type="button"
            className="duo-btn duo-btn-secondary btn-export-backup"
            onClick={duoStorage.exportBackup}
            title="Exportar copia de seguridad en JSON para llevar a la nube"
          >
            <Download size={14} />
            <span className="btn-label-text">Respaldar</span>
          </button>
        </div>
      </header>

      {/* 2. Duolingo Metrics Bar (Chunky 3D Cards) */}
      <div className="duo-metrics-bar">
        <div className="duo-metric-card">
          <div className="m-icon-wrap blue">
            <Zap size={18} color="#FFFFFF" />
          </div>
          <div className="m-info">
            <span className="m-val">{engine.wpm}</span>
            <span className="m-label">PALABRAS/MIN</span>
          </div>
        </div>

        <div className="duo-metric-card">
          <div className="m-icon-wrap green">
            <CheckCircle2 size={18} color="#FFFFFF" />
          </div>
          <div className="m-info">
            <span className="m-val">{engine.accuracy}%</span>
            <span className="m-label">PRECISIÓN</span>
          </div>
        </div>

        <div className="duo-metric-card">
          <div className="m-icon-wrap red">
            <AlertTriangle size={18} color="#FFFFFF" />
          </div>
          <div className="m-info">
            <span className="m-val">{engine.totalErrors}</span>
            <span className="m-label">ERRORES</span>
          </div>
        </div>

        <div className="duo-metric-card">
          <div className="m-icon-wrap orange">
            <DuoFlameIcon size={20} color="#FFFFFF" />
          </div>
          <div className="m-info">
            <span className="m-val">{engine.streak}</span>
            <span className="m-label">RACHA TECLAS</span>
          </div>
        </div>
      </div>

      {/* 3. Single Unified IDE Workspace */}
      <div className="duo-ide-workspace-frame">
        {/* Desktop or Toggled Outline Sidebar */}
        <div className={`outline-drawer-wrapper ${isOutlineOpen ? 'drawer-open' : 'drawer-closed'}`}>
          <div className="drawer-mobile-header">
            <div className="drawer-title-box">
              <Compass size={16} color="var(--duo-blue)" />
              <span>Navegador de Algoritmos</span>
            </div>
            <button
              type="button"
              className="btn-close-drawer"
              onClick={() => setIsOutlineOpen(false)}
            >
              <X size={16} />
            </button>
          </div>
          <CodeOutlineSidebar
            outlineFunctions={engine.outlineFunctions}
            activeFunction={activeFunctionName}
            onSelectFunction={handleSelectFunctionAndCloseMobile}
          />
        </div>

        {/* The IDE Editor */}
        <div className="editor-frame-wrapper">
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
          gap: 12px;
          flex-wrap: wrap;
        }

        .exam-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .btn-timer-toggle {
          min-width: 140px;
          min-height: 42px;
          padding: 0 14px;
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
          padding: 8px 12px;
          cursor: pointer;
          font-family: var(--font-mono);
          font-size: 14px;
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
          font-size: 11px;
          color: var(--duo-wolf);
          font-family: var(--font-sans);
        }

        .duo-timer-dropdown {
          position: absolute;
          top: 46px;
          left: 0;
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-md);
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          padding: 8px;
          z-index: 60;
          width: 210px;
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
          padding: 7px 9px;
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
          min-height: 42px;
          padding: 0 12px;
        }

        .exam-header-center {
          flex: 1;
          min-width: 200px;
          max-width: 420px;
        }

        .duo-snippet-select-box {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--duo-polar);
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-md);
          padding: 4px 10px;
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
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-outline-toggle {
          min-height: 42px;
          font-size: 12px;
          padding: 0 12px;
        }

        .btn-mode-toggle {
          min-height: 42px;
          font-size: 12px;
          padding: 0 12px;
        }

        .mode-label-mobile {
          display: none;
        }

        .btn-export-backup {
          min-height: 42px;
          font-size: 12px;
          padding: 0 12px;
        }

        /* Metrics Bar */
        .duo-metrics-bar {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        .duo-metric-card {
          background: #FFFFFF;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-lg);
          padding: 12px 14px;
          box-shadow: 0 4px 0 var(--duo-swan);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .m-icon-wrap {
          width: 36px;
          height: 36px;
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
          font-size: 20px;
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
          position: relative;
          border: 2px solid var(--duo-swan);
          border-radius: var(--radius-lg);
          overflow: hidden;
          box-shadow: 0 4px 0 var(--duo-swan);
          background: #FFFFFF;
          min-height: 540px;
        }

        .drawer-mobile-header {
          display: none;
        }

        .outline-drawer-wrapper {
          display: flex;
          transition: all 200ms ease;
        }

        .editor-frame-wrapper {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          height: 100%;
        }

        /* Tablet & Mobile Responsiveness (< 900px) */
        @media (max-width: 900px) {
          .duo-metrics-bar {
            grid-template-columns: repeat(2, 1fr);
          }

          /* Outline drawer on smaller screens turns into toggleable panel */
          .outline-drawer-wrapper.drawer-closed {
            display: none;
          }

          .outline-drawer-wrapper.drawer-open {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            width: 290px;
            max-width: 85vw;
            z-index: 50;
            background: #FFFFFF;
            border-right: 2px solid var(--duo-swan);
            box-shadow: 4px 0 16px rgba(0,0,0,0.15);
          }

          .drawer-mobile-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px 14px;
            background: var(--duo-polar);
            border-bottom: 1px solid var(--duo-swan);
            font-weight: 800;
            font-size: 13px;
            color: var(--duo-eel);
          }

          .drawer-title-box {
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .btn-close-drawer {
            background: transparent;
            border: none;
            color: var(--duo-wolf);
            cursor: pointer;
            padding: 4px;
          }
        }

        /* Mobile (< 640px) */
        @media (max-width: 640px) {
          .duo-exam-page {
            padding: 10px 10px 80px;
            gap: 10px;
          }

          .duo-exam-header {
            padding: 10px 12px;
            gap: 10px;
          }

          .exam-header-left {
            width: 100%;
            justify-content: space-between;
          }

          .btn-timer-toggle {
            flex: 1;
            min-width: 120px;
          }

          .exam-header-center {
            width: 100%;
            max-width: 100%;
          }

          .exam-header-right {
            width: 100%;
            justify-content: space-between;
          }

          .btn-outline-toggle, .btn-mode-toggle, .btn-export-backup {
            flex: 1;
            justify-content: center;
            padding: 0 8px;
          }

          .mode-label-desktop {
            display: none;
          }

          .mode-label-mobile {
            display: inline;
          }

          .duo-metrics-bar {
            gap: 8px;
          }

          .duo-metric-card {
            padding: 8px 10px;
            gap: 8px;
          }

          .m-icon-wrap {
            width: 30px;
            height: 30px;
          }

          .m-val {
            font-size: 17px;
          }

          .m-label {
            font-size: 9px;
          }

          .duo-ide-workspace-frame {
            min-height: 480px;
          }
        }
      `}</style>
    </div>
  );
}
