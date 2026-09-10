import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Terminal, Braces, Eye, Sparkles, Sliders, ChevronDown, Copy, Check, Columns, RotateCcw, FileCode } from 'lucide-react';
import { ComboVFX } from './ComboVFX';
import { IntelliSensePopup } from './IntelliSensePopup';
import { detectIntelliSenseTrigger } from '../utils/javaIntelliSense';

export function IDEMainEditor({
  userCode,
  setUserCode,
  targetCode,
  activeFunctionName,
  streak,
  maxStreak,
  comboMultiplier,
  comboTierName,
  comboColor,
  comboEvent,
  isExamMode,
  onEditorKeyDown,
  onResetToSkeleton,
  onLoadFullSolution,
  snippetTitle,
  snippetCategory,
  onJumpToLine
}) {
  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Split view is default: clean, professional, NO text overlapping!
  const [splitViewMode, setSplitViewMode] = useState(true);
  const [ghostOpacity, setGhostOpacity] = useState(() => {
    const saved = localStorage.getItem('vargas_ghost_opacity');
    return saved ? Number(saved) : 0.85;
  });
  const [showOpacityMenu, setShowOpacityMenu] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [intelliSenseData, setIntelliSenseData] = useState(null);

  const handleOpacityChange = (newVal) => {
    const val = Math.max(0.2, Math.min(1.0, newVal));
    setGhostOpacity(val);
    localStorage.setItem('vargas_ghost_opacity', String(val));
  };

  // Synchronize scroll between textarea and line numbers
  const handleScroll = () => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  // Detect Java IntelliSense on dot '.'
  const checkIntelliSense = useCallback(() => {
    if (isExamMode || !textareaRef.current) {
      setIntelliSenseData(null);
      return;
    }
    const pos = textareaRef.current.selectionStart;
    const textBefore = userCode.substring(Math.max(0, pos - 30), pos);
    const trigger = detectIntelliSenseTrigger(textBefore);
    setIntelliSenseData(trigger);
  }, [isExamMode, userCode]);

  const handleSelectIntelliSense = (item) => {
    if (!textareaRef.current || !item?.insertText) return;
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;

    const newText = userCode.substring(0, start) + item.insertText + userCode.substring(end);
    textareaRef.current.value = newText;
    const nextPos = start + item.insertText.length;
    textareaRef.current.setSelectionRange(nextPos, nextPos);
    setUserCode(newText);
    setIntelliSenseData(null);
    textareaRef.current.focus();
  };

  const onKeyDown = (e) => {
    onEditorKeyDown(e, textareaRef.current);
    setTimeout(checkIntelliSense, 10);
  };

  const handleCopyReference = () => {
    navigator.clipboard.writeText(targetCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 1800);
  };

  // Line numbers calculation based strictly on userCode
  const userLines = (userCode || '').split('\n');
  const lineNumbers = Array.from({ length: Math.max(1, userLines.length) }, (_, i) => i + 1);

  // Jump to specific line when requested from outline
  useEffect(() => {
    if (onJumpToLine !== undefined && textareaRef.current) {
      const lines = userCode.split('\n');
      const targetLine = Math.min(lines.length, Math.max(0, onJumpToLine));
      let charPos = 0;
      for (let i = 0; i < targetLine; i++) {
        charPos += lines[i].length + 1;
      }

      textareaRef.current.selectionStart = charPos;
      textareaRef.current.selectionEnd = charPos;
      textareaRef.current.focus();

      const lineHeight = 24;
      textareaRef.current.scrollTop = Math.max(0, (targetLine - 4) * lineHeight);
    }
  }, [onJumpToLine, userCode]);

  return (
    <div className="ide-main-editor-container">
      {/* Editor Top Bar */}
      <div className="editor-top-bar">
        <div className="editor-tab-left">
          <Terminal size={15} color="var(--pastel-lavender)" />
          <span className="editor-tab-title">{snippetTitle || 'Java IDE'}</span>
          <span className="editor-category-tag">{snippetCategory || 'Primer Parcial'}</span>
          <div className="ide-smart-badge" title="Auto-cierre () [] {}, indentación inteligente y copy/paste libre">
            <Braces size={13} />
            <span>Smart IDE Activo</span>
          </div>
        </div>

        <div className="editor-top-right">
          {/* Action buttons: Reset to skeleton & Load solution */}
          <button
            type="button"
            className="btn-toolbar-action"
            onClick={onResetToSkeleton}
            title="Limpiar cuerpo de los métodos para practicar de cero"
          >
            <RotateCcw size={12} />
            <span>Plantilla Limpia</span>
          </button>

          <button
            type="button"
            className="btn-toolbar-action"
            onClick={onLoadFullSolution}
            title="Cargar la solución completa en el editor para estudiar"
          >
            <FileCode size={12} />
            <span>Ver Solución</span>
          </button>

          {/* Toggle between Side-by-Side Split or Full Editor */}
          {!isExamMode && (
            <button
              type="button"
              className={`btn-toolbar-toggle ${splitViewMode ? 'active' : ''}`}
              onClick={() => setSplitViewMode(!splitViewMode)}
              title="Mostrar u ocultar la solución de referencia al lado"
            >
              <Columns size={13} />
              <span>{splitViewMode ? 'Guía al Lado (Activa)' : 'Solo Editor'}</span>
            </button>
          )}

          {/* Ghost Guide Opacity Control */}
          {!isExamMode && splitViewMode && (
            <div className="opacity-control-wrap">
              <button
                type="button"
                className="btn-opacity-trigger"
                onClick={() => setShowOpacityMenu(!showOpacityMenu)}
                title="Ajustar visibilidad de la guía"
              >
                <Eye size={13} />
                <span>Guía: {Math.round(ghostOpacity * 100)}%</span>
                <ChevronDown size={11} />
              </button>

              {showOpacityMenu && (
                <div className="opacity-dropdown animate-pop">
                  <div className="opacity-dropdown-header">
                    <Sliders size={12} />
                    <span>Intensidad de Guía de Referencia</span>
                  </div>
                  <div className="opacity-slider-row">
                    <input
                      type="range"
                      min="0.2"
                      max="1.0"
                      step="0.05"
                      value={ghostOpacity}
                      onChange={(e) => handleOpacityChange(Number(e.target.value))}
                      className="opacity-range-input"
                    />
                    <span className="opacity-percent-label">{Math.round(ghostOpacity * 100)}%</span>
                  </div>
                  <div className="opacity-presets-grid">
                    {[
                      { label: 'Tenue', val: 0.40 },
                      { label: 'Normal', val: 0.65 },
                      { label: 'Nítido', val: 0.85 },
                      { label: '100% Sólido', val: 1.0 }
                    ].map((p) => (
                      <button
                        key={p.val}
                        type="button"
                        onClick={() => {
                          handleOpacityChange(p.val);
                          setShowOpacityMenu(false);
                        }}
                        className={`preset-pill ${Math.abs(ghostOpacity - p.val) < 0.04 ? 'active' : ''}`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {isExamMode ? (
            <div className="exam-status-indicator">
              <span className="exam-dot" />
              <span>MODO EXAMEN REAL (GUÍA OCULTA)</span>
            </div>
          ) : (
            <div className="guide-status-indicator">
              <Sparkles size={13} />
              <span>MODO PRÁCTICA GUIADA</span>
            </div>
          )}
        </div>
      </div>

      {/* Editor Subheader Tips */}
      <div className="snippet-prompt-box">
        <div className="prompt-content">
          <span className="prompt-label">IDE Inteligente:</span>
          <span className="prompt-text">
            Al teclear (, [, &#123; se auto-cierran en pantalla. Puedes copiar bloques (Ctrl+C), pegar (Ctrl+V) y navegar con el panel izquierdo.
          </span>
        </div>
      </div>

      {/* Main Canvas: Clean Split View (Editor on Left, Solution Reference on Right) */}
      <div className={`editor-canvas-wrap ${splitViewMode && !isExamMode ? 'split-mode' : ''}`}>
        {/* Line numbers gutter */}
        <div ref={lineNumbersRef} className="line-numbers-column">
          {lineNumbers.map((num) => (
            <div key={num} className="line-num-cell">
              {num}
            </div>
          ))}
        </div>

        {/* Real Code Writing Zone */}
        <div className="editor-interactive-zone">
          <textarea
            ref={textareaRef}
            value={userCode}
            onChange={(e) => {
              setUserCode(e.target.value);
              checkIntelliSense();
            }}
            onKeyDown={onKeyDown}
            onScroll={handleScroll}
            onClick={checkIntelliSense}
            onKeyUp={checkIntelliSense}
            className="ide-real-textarea"
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            placeholder="// Escribe tu código Java aquí..."
          />

          {/* Java IntelliSense Popup on '.' */}
          {intelliSenseData && (
            <IntelliSensePopup
              triggerData={intelliSenseData}
              onSelectSuggestion={handleSelectIntelliSense}
              onClose={() => setIntelliSenseData(null)}
            />
          )}

          {/* Combo VFX */}
          <div className="editor-combo-float">
            <ComboVFX
              streak={streak}
              comboMultiplier={comboMultiplier}
              comboTierName={comboTierName}
              comboEvent={comboEvent}
            />
          </div>
        </div>

        {/* Side-by-Side Solution Reference Panel (NO overlapping, clear, distinct!) */}
        {splitViewMode && !isExamMode && (
          <div className="split-reference-panel" style={{ opacity: ghostOpacity }}>
            <div className="split-ref-header">
              <div className="ref-tag-badge">
                <Sparkles size={12} />
                <span>GUÍA DE SOLUCIÓN DE REFERENCIA (PLANTILLA)</span>
              </div>
              <button
                type="button"
                className="btn-copy-ref"
                onClick={handleCopyReference}
                title="Copiar solución de referencia al portapapeles"
              >
                {copiedRef ? <Check size={12} color="var(--pastel-mint)" /> : <Copy size={12} />}
                <span>{copiedRef ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
            <pre className="split-ref-code">
              <code>{targetCode}</code>
            </pre>
          </div>
        )}
      </div>

      <style>{`
        .ide-main-editor-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          margin: 0 28px 24px 28px;
        }

        .editor-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 18px;
          background: var(--bg-main);
          border-bottom: 1px solid var(--card-border);
          gap: 10px;
          flex-wrap: wrap;
        }

        .editor-tab-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .editor-tab-title {
          font-size: 13px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .editor-category-tag {
          font-size: 11px;
          font-weight: 600;
          background: var(--pastel-lavender-bg);
          color: var(--pastel-lavender);
          border: 1px solid var(--pastel-lavender-border);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .ide-smart-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          color: var(--pastel-mint);
          background: var(--pastel-mint-bg);
          border: 1px solid var(--pastel-mint-border);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .editor-top-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-toolbar-action {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: var(--radius-full);
          border: 1px solid var(--card-border);
          background: #FFFFFF;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-toolbar-action:hover {
          background: var(--bg-main);
          border-color: var(--pastel-lavender);
        }

        .btn-toolbar-toggle {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: var(--radius-full);
          border: 1px solid var(--card-border);
          background: #FFFFFF;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-toolbar-toggle:hover, .btn-toolbar-toggle.active {
          background: var(--pastel-lavender-bg);
          color: var(--pastel-lavender);
          border-color: var(--pastel-lavender-border);
        }

        /* Opacity Control */
        .opacity-control-wrap {
          position: relative;
        }

        .btn-opacity-trigger {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 5px 10px;
          background: #FFFFFF;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-full);
          font-size: 11px;
          font-weight: 700;
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-opacity-trigger:hover {
          background: var(--bg-main);
          border-color: var(--pastel-lavender);
        }

        .opacity-dropdown {
          position: absolute;
          top: 36px;
          right: 0;
          width: 220px;
          background: #FFFFFF;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 12px;
          z-index: 60;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .opacity-dropdown-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .opacity-slider-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .opacity-range-input {
          flex: 1;
          accent-color: var(--pastel-lavender);
          cursor: pointer;
        }

        .opacity-percent-label {
          font-family: var(--font-mono);
          font-size: 12px;
          font-weight: 700;
          color: var(--pastel-lavender);
          min-width: 35px;
          text-align: right;
        }

        .opacity-presets-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px;
        }

        .preset-pill {
          padding: 4px 6px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--card-border);
          background: var(--bg-main);
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .preset-pill:hover, .preset-pill.active {
          background: var(--pastel-lavender-bg);
          color: var(--pastel-lavender);
          border-color: var(--pastel-lavender-border);
        }

        .guide-status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: var(--pastel-mint);
          background: var(--pastel-mint-bg);
          border: 1px solid var(--pastel-mint-border);
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }

        .exam-status-indicator {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          font-weight: 700;
          color: var(--pastel-peach);
          background: var(--pastel-peach-bg);
          border: 1px solid var(--pastel-peach-border);
          padding: 3px 10px;
          border-radius: var(--radius-full);
        }

        .exam-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--pastel-peach);
          animation: gentlePulse 1.2s infinite ease-in-out;
        }

        .snippet-prompt-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 18px;
          background: #FCFBF9;
          border-bottom: 1px solid var(--card-border);
          font-size: 12px;
        }

        .prompt-content {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .prompt-label {
          font-weight: 700;
          color: var(--pastel-lavender);
        }

        .prompt-text {
          color: var(--text-secondary);
        }

        /* Canvas Layout */
        .editor-canvas-wrap {
          display: flex;
          position: relative;
          min-height: 520px;
          height: 600px;
          background: #FFFFFF;
        }

        .line-numbers-column {
          width: 55px;
          background: #FAF9F6;
          border-right: 1px solid var(--card-border);
          padding: 16px 0;
          overflow: hidden;
          user-select: none;
          flex-shrink: 0;
        }

        .line-num-cell {
          height: 24px;
          line-height: 24px;
          font-family: var(--font-mono);
          font-size: 12px;
          color: var(--text-muted);
          text-align: right;
          padding-right: 14px;
          font-weight: 500;
        }

        .editor-interactive-zone {
          position: relative;
          flex: 1;
          height: 100%;
          overflow: hidden;
        }

        /* Real Freeform Code Textarea */
        .ide-real-textarea {
          width: 100%;
          height: 100%;
          padding: 16px 20px;
          margin: 0;
          border: none;
          outline: none;
          resize: none;
          background: #FFFFFF;
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 24px;
          font-weight: 600;
          color: #1E293B; /* Solid high contrast crisp black */
          caret-color: var(--pastel-lavender);
          white-space: pre;
          overflow: auto;
          tab-size: 4;
        }

        .ide-real-textarea::selection {
          background: rgba(108, 92, 231, 0.22);
        }

        .editor-combo-float {
          position: absolute;
          top: 10px;
          right: 30px;
          z-index: 15;
          pointer-events: none;
        }

        /* Side-by-Side Solution Reference Panel (NO overlapping, totally clear!) */
        .split-reference-panel {
          width: 46%;
          border-left: 1.5px solid var(--card-border);
          background: #FAF9F6;
          display: flex;
          flex-direction: column;
          transition: opacity 0.15s ease;
        }

        .split-ref-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 14px;
          background: var(--pastel-lavender-bg);
          border-bottom: 1px solid var(--pastel-lavender-border);
        }

        .ref-tag-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: var(--pastel-lavender);
          letter-spacing: 0.3px;
        }

        .btn-copy-ref {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          background: #FFFFFF;
          border: 1px solid var(--pastel-lavender-border);
          padding: 2px 8px;
          border-radius: 4px;
          cursor: pointer;
        }

        .btn-copy-ref:hover {
          color: var(--pastel-lavender);
        }

        .split-ref-code {
          flex: 1;
          padding: 16px 18px;
          margin: 0;
          overflow: auto;
          font-family: var(--font-mono);
          font-size: 13px;
          line-height: 24px;
          font-style: italic;
          color: #64748B;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
