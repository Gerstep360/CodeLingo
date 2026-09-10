import React, { useState } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Volume2,
  VolumeX,
  Code2,
  FileCode,
  Sparkles,
  Award
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export function Header({
  timer,
  isExamMode,
  setIsExamMode,
  onOpenCustomCodeModal,
  snippets,
  currentSnippetId,
  onSelectSnippet
}) {
  const [isMuted, setIsMuted] = useState(sounds.isMuted);
  const [showTimeMenu, setShowTimeMenu] = useState(false);

  const handleToggleMute = () => {
    const nextMute = sounds.toggleMute();
    setIsMuted(nextMute);
  };

  const timeOptions = [15, 30, 45, 60];

  return (
    <header className="header-container">
      {/* Brand / Logo */}
      <div className="brand-section">
        <div className="brand-logo-badge">
          <Code2 size={20} color="var(--pastel-lavender)" />
        </div>
        <div>
          <div className="brand-title-wrap">
            <h1 className="brand-title">Vargas CodeSprint</h1>
            <span className="brand-version-pill">v1.0</span>
          </div>
          <p className="brand-subtitle">Simulador de Memoria Muscular & Exámenes de Código</p>
        </div>
      </div>

      {/* Center: Quick Time Selector */}
      <div className="header-time-center">
        <div className="time-select-relative">
          <button
            onClick={() => setShowTimeMenu(!showTimeMenu)}
            className="timer-badge-btn"
            title="Cambiar duración del examen"
          >
            <Clock size={13} />
            <span>Examen: {timer.minutesSetting} min</span>
          </button>

          {showTimeMenu && (
            <div className="time-dropdown">
              <div className="time-dropdown-header">Duración</div>
              {timeOptions.map((mins) => (
                <button
                  key={mins}
                  onClick={() => {
                    timer.setMinutes(mins);
                    setShowTimeMenu(false);
                  }}
                  className={`time-dropdown-item ${timer.minutesSetting === mins ? 'selected' : ''}`}
                >
                  {mins} minutos {mins === 45 && '(Examen Vargas)'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Snippet Picker & Utilities (Leaves space for FloatingTimer) */}
      <div className="header-actions">
        {/* Snippet Picker */}
        <div className="snippet-picker-wrap">
          <select
            value={currentSnippetId}
            onChange={(e) => onSelectSnippet(e.target.value)}
            className="snippet-select"
          >
            {snippets.map((snip) => (
              <option key={snip.id} value={snip.id}>
                {snip.title}
              </option>
            ))}
          </select>
        </div>

        {/* Custom Code Button */}
        <button
          onClick={onOpenCustomCodeModal}
          className="btn-custom-code"
          title="Pegar código personalizado"
        >
          <FileCode size={14} />
          <span>Mi Código</span>
        </button>

        {/* Sound Toggle */}
        <button
          onClick={handleToggleMute}
          className={`btn-icon-square ${isMuted ? 'muted' : ''}`}
          title={isMuted ? 'Activar sonido de teclas' : 'Silenciar sonido'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      </div>

      <style>{`
        .header-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 28px;
          background: var(--card-bg);
          border-bottom: 1px solid var(--card-border);
          gap: 20px;
          flex-wrap: wrap;
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-logo-badge {
          width: 38px;
          height: 38px;
          border-radius: var(--radius-md);
          background: var(--pastel-lavender-bg);
          border: 1px solid var(--pastel-lavender-border);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .brand-title-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .brand-title {
          font-size: 18px;
          font-weight: 800;
          color: var(--text-primary);
          letter-spacing: -0.3px;
        }

        .brand-version-pill {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: var(--radius-full);
          background: var(--pastel-mint-bg);
          color: var(--pastel-mint);
          border: 1px solid var(--pastel-mint-border);
        }

        .brand-subtitle {
          font-size: 12px;
          color: var(--text-secondary);
          margin-top: 1px;
        }

        /* Timer Box */
        .timer-wrapper {
          display: flex;
          align-items: center;
        }

        .timer-box {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-main);
          border: 1px solid var(--card-border);
          padding: 6px 14px;
          border-radius: var(--radius-full);
          transition: var(--transition-fast);
        }

        .timer-box.timer-urgent {
          background: var(--pastel-peach-bg);
          border-color: var(--pastel-peach-border);
          animation: gentlePulse 1.2s infinite ease-in-out;
        }

        .timer-icon-wrap {
          color: var(--text-secondary);
          display: flex;
          align-items: center;
        }

        .timer-digits {
          font-family: var(--font-mono);
          font-size: 18px;
          font-weight: 700;
          color: var(--text-primary);
          letter-spacing: 0.5px;
          min-width: 60px;
        }

        .timer-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-left: 4px;
        }

        .timer-btn {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-full);
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          color: var(--text-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .timer-btn:hover {
          background: var(--bg-subtle);
        }

        .timer-btn-play {
          background: var(--pastel-mint-bg);
          color: var(--pastel-mint);
          border-color: var(--pastel-mint-border);
        }

        .timer-btn-pause {
          background: var(--pastel-peach-bg);
          color: var(--pastel-peach);
          border-color: var(--pastel-peach-border);
        }

        .time-select-relative {
          position: relative;
        }

        .timer-badge-btn {
          font-size: 11px;
          font-weight: 700;
          padding: 4px 8px;
          border-radius: var(--radius-full);
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .timer-badge-btn:hover {
          background: var(--bg-subtle);
          color: var(--text-primary);
        }

        .time-dropdown {
          position: absolute;
          top: 36px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--card-bg);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-md);
          padding: 6px;
          width: 170px;
          z-index: 50;
        }

        .time-dropdown-header {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-muted);
          padding: 4px 8px;
          text-transform: uppercase;
        }

        .time-dropdown-item {
          width: 100%;
          text-align: left;
          background: transparent;
          border: none;
          padding: 6px 10px;
          font-size: 12px;
          color: var(--text-primary);
          border-radius: var(--radius-sm);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .time-dropdown-item:hover {
          background: var(--bg-main);
        }

        .time-dropdown-item.selected {
          background: var(--pastel-lavender-bg);
          color: var(--pastel-lavender);
          font-weight: 600;
        }

        /* Right controls */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-right: 230px;
        }

        .mode-toggle-group {
          display: flex;
          background: var(--bg-main);
          border: 1px solid var(--card-border);
          padding: 3px;
          border-radius: var(--radius-full);
          gap: 2px;
        }

        .mode-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: var(--radius-full);
          border: none;
          background: transparent;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .mode-btn:hover {
          color: var(--text-primary);
        }

        .mode-btn-active {
          background: var(--card-bg);
          color: var(--pastel-lavender);
          box-shadow: var(--shadow-sm);
        }

        .mode-btn-active.exam {
          background: var(--pastel-peach-bg);
          color: var(--pastel-peach);
        }

        .snippet-select {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
          background: var(--bg-main);
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          padding: 7px 12px;
          cursor: pointer;
          outline: none;
          max-width: 180px;
        }

        .btn-custom-code {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-primary);
          background: var(--pastel-mint-bg);
          border: 1px solid var(--pastel-mint-border);
          padding: 7px 14px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-custom-code:hover {
          background: #d9f0e4;
        }

        .btn-icon-square {
          width: 34px;
          height: 34px;
          border-radius: var(--radius-md);
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-icon-square:hover {
          background: var(--bg-main);
          color: var(--text-primary);
        }

        .btn-icon-square.muted {
          color: var(--pastel-peach);
          background: var(--pastel-peach-bg);
          border-color: var(--pastel-peach-border);
        }
      `}</style>
    </header>
  );
}
