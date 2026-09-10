import React, { useRef, useEffect, useState } from 'react';
import { Terminal, Keyboard, Sparkles, Eye, Braces, Info, Sliders, ChevronDown, RotateCcw, FileCode } from 'lucide-react';
import { ComboVFX } from './ComboVFX';
import { IntelliSensePopup } from './IntelliSensePopup';
import { detectIntelliSenseTrigger } from '../utils/javaIntelliSense';

export function CodeEditor({
  targetCode,
  parsedStructure,
  typedChars,
  textBeforeCursor,
  currentIndex,
  closingStack = [],
  streak,
  maxStreak,
  comboMultiplier,
  comboTierName,
  comboColor,
  comboEvent,
  isExamMode,
  isCompleted,
  onKeyDown,
  onPasteText,
  onInsertText,
  snippetTitle,
  snippetFileName,
  snippetFilePath,
  snippetDescription,
  snippetCategory,
  jumpToLineIdx,
  onReloadFile
}) {
  const containerRef = useRef(null);
  const hiddenInputRef = useRef(null);
  const caretRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const [isFocused, setIsFocused] = useState(true);

  // Ghost code opacity state (default 40% faint watermark, clearly NOT normal text)
  const [ghostOpacity, setGhostOpacity] = useState(() => {
    const saved = localStorage.getItem('vargas_ghost_opacity');
    return saved ? Number(saved) : 0.40;
  });
  const [showOpacityMenu, setShowOpacityMenu] = useState(false);

  const handleOpacityChange = (newVal) => {
    const val = Math.max(0.15, Math.min(0.95, newVal));
    setGhostOpacity(val);
    localStorage.setItem('vargas_ghost_opacity', String(val));
  };

  const lastTypedTimeRef = useRef(0);
  const [isCaretVisible, setIsCaretVisible] = useState(true);

  // Jump and center caret in view
  const jumpToCaret = (behavior = 'smooth') => {
    if (caretRef.current) {
      caretRef.current.scrollIntoView({
        behavior,
        block: 'center',
        inline: 'nearest'
      });
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus({ preventScroll: true });
      }
    }
  };

  // Auto-focus input and center on where typing starts without snap-backs
  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus({ preventScroll: true });
    }
    const timer = setTimeout(() => {
      jumpToCaret('auto');
    }, 120);
    return () => clearTimeout(timer);
  }, [targetCode]);

  // Jump to specific line when requested from outline
  useEffect(() => {
    if (jumpToLineIdx !== undefined && jumpToLineIdx !== null && containerRef.current) {
      const lineEl = containerRef.current.querySelector(`[data-line="${jumpToLineIdx}"]`);
      if (lineEl) {
        lineEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (hiddenInputRef.current) {
        hiddenInputRef.current.focus({ preventScroll: true });
      }
    }
  }, [jumpToLineIdx]);

  const handleContainerClick = () => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus({ preventScroll: true });
      setIsFocused(true);
    }
  };

  // Scroll to caret keeping typing focus around vertical center when typing down
  useEffect(() => {
    if (caretRef.current && containerRef.current) {
      const isTyping = Date.now() - lastTypedTimeRef.current < 1500;
      if (isTyping) {
        const caretRect = caretRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        const relativeY = caretRect.top - containerRect.top;
        const containerH = containerRect.height;

        // When caret goes past 55% of the viewport (or above 20% if jumping up),
        // smoothly center it so upcoming lines below remain comfortably visible
        if (relativeY > containerH * 0.55 || relativeY < containerH * 0.20) {
          caretRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
      }
    }
  }, [currentIndex]);

  // Synchronize scroll between main viewport and line numbers column
  const handleScroll = () => {
    if (caretRef.current && containerRef.current) {
      const caretRect = caretRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const visible =
        caretRect.top >= containerRect.top - 30 &&
        caretRect.bottom <= containerRect.bottom + 30;
      setIsCaretVisible(visible);
    }
  };

  const [intelliSenseIndex, setIntelliSenseIndex] = useState(0);
  const [isIntelliSenseDismissed, setIsIntelliSenseDismissed] = useState(false);

  // IntelliSense trigger detection
  const recentTyped = textBeforeCursor ? textBeforeCursor.slice(-30) : '';
  const detectedTrigger = !isExamMode ? detectIntelliSenseTrigger(recentTyped) : null;
  const intelliSenseData = isIntelliSenseDismissed ? null : detectedTrigger;

  useEffect(() => {
    setIsIntelliSenseDismissed(false);
    setIntelliSenseIndex(0);
  }, [detectedTrigger?.objectPath, detectedTrigger?.memberQuery]);

  const handleSelectIntelliSense = (item) => {
    if (!item?.insertText) return;
    const query = intelliSenseData?.memberQuery || '';
    let toInsert = item.insertText;
    if (query && item.insertText.toLowerCase().startsWith(query.toLowerCase())) {
      toInsert = item.insertText.slice(query.length);
    }
    if (onInsertText) {
      onInsertText(toInsert);
    }
    setIsIntelliSenseDismissed(true);
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus({ preventScroll: true });
    }
  };

  const handleKeyDownWrapper = (e) => {
    lastTypedTimeRef.current = Date.now();

    // If IntelliSense popup is active with suggestions, intercept navigation & completion
    if (intelliSenseData && intelliSenseData.suggestions?.length > 0) {
      const suggestions = intelliSenseData.suggestions;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIntelliSenseIndex((prev) => (prev + 1) % suggestions.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIntelliSenseIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        const selected = suggestions[intelliSenseIndex] || suggestions[0];
        handleSelectIntelliSense(selected);
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsIntelliSenseDismissed(true);
        return;
      }
    }

    if (onKeyDown) {
      onKeyDown(e);
    }
  };

  const handlePasteWrapper = (e) => {
    const text = e.clipboardData?.getData('text');
    if (text && onPasteText) {
      e.preventDefault();
      onPasteText(text);
    }
  };

  const isCommentChar = parsedStructure?.isCommentChar || [];
  const isBoilerplateChar = parsedStructure?.isBoilerplateChar || [];
  const isNonTypeableChar = parsedStructure?.isNonTypeableChar || [];
  const lineInfoList = parsedStructure?.lineInfoList || [];

  // Map from fromIdx to typedChar (tracks exactly which characters the user typed)
  const typedMap = new Map();
  for (let i = 0; i < typedChars.length; i++) {
    const entry = typedChars[i];
    if (entry.fromIdx !== undefined) {
      typedMap.set(entry.fromIdx, entry);
    }
  }

  // Break targetCode into lines with index mappings
  const lines = (targetCode || '').split('\n');
  let charCounter = 0;

  const renderedLines = lines.map((lineText, lineIdx) => {
    const lineChars = [];
    const lineStartIdx = charCounter;
    const info = lineInfoList[lineIdx] || {};

    const isClassHeader = info.isClassHeader || false;
    const isClassFooter = info.isClassFooter || false;
    const isEntireLineComment = info.isFullComment || false;

    for (let c = 0; c < lineText.length; c++) {
      const globalIdx = charCounter;
      const expectedChar = lineText[c];
      const isCharComment = isCommentChar[globalIdx] || false;
      const isCharBoilerplate = isBoilerplateChar[globalIdx] || false;
      const isNonTypeable = isNonTypeableChar[globalIdx] || false;
      const isCurrent = globalIdx === currentIndex;
      const typedEntry = typedMap.get(globalIdx);
      const isTyped = typedEntry !== undefined;

      lineChars.push({
        char: expectedChar,
        globalIdx,
        isCharComment,
        isCharBoilerplate,
        isNonTypeable,
        isCurrent,
        isTyped,
        isCorrect: typedEntry ? typedEntry.isCorrect : true,
        isAutoClosed: typedEntry ? Boolean(typedEntry.isAutoClosed) : false,
        userChar: typedEntry ? typedEntry.char : expectedChar
      });

      charCounter++;
    }

    const hasNewline = lineIdx < lines.length - 1;
    const newlineGlobalIdx = hasNewline ? charCounter : null;
    const isNewlineCurrent = newlineGlobalIdx === currentIndex;
    const isNewlineNonTypeable = hasNewline ? (isNonTypeableChar[newlineGlobalIdx] || false) : false;

    if (hasNewline) {
      charCounter++;
    }

    return {
      lineIdx,
      lineText,
      lineChars,
      isClassHeader,
      isClassFooter,
      isEntireLineComment,
      hasNewline,
      newlineGlobalIdx,
      isNewlineCurrent,
      isNewlineNonTypeable
    };
  });

  return (
    <div className="code-editor-outer">
      {/* Editor Top Bar */}
      <div className="editor-top-bar">
        <div className="editor-tab-left">
          <FileCode size={15} color="var(--pastel-lavender)" />
          <span className="editor-tab-title">{snippetFileName || 'Examen1.java'}</span>
          <span className="editor-file-path" title={snippetFilePath || 'src/assets/AI/Primer Parcial/Examen1.java'}>
            {snippetFilePath || 'src/assets/AI/Primer Parcial/Examen1.java'}
          </span>
          <span className="editor-category-tag">{snippetCategory || 'Primer Parcial - Vargas'}</span>
          <div className="ide-smart-badge" title="Auto-cierre () [] {}, autocompletado y copy/paste libre">
            <Braces size={13} />
            <span>Smart IDE Activo</span>
          </div>
        </div>

        <div className="editor-top-right">
          {/* Reload File Button */}
          {onReloadFile && (
            <button
              type="button"
              className="btn-reload-file"
              onClick={onReloadFile}
              title="Recargar archivo Examen1.java directamente desde el disco"
            >
              <RotateCcw size={12} />
              <span>Recargar Archivo</span>
            </button>
          )}

          {/* Ghost Text Intensity Control */}
          {!isExamMode && (
            <div className="opacity-control-wrap">
              <button
                type="button"
                className="btn-opacity-trigger"
                onClick={() => setShowOpacityMenu(!showOpacityMenu)}
                title="Ajustar visibilidad del código de ayuda"
              >
                <Eye size={13} />
                <span>Guía: {Math.round(ghostOpacity * 100)}%</span>
                <ChevronDown size={11} />
              </button>

              {showOpacityMenu && (
                <div className="opacity-dropdown animate-pop">
                  <div className="opacity-dropdown-header">
                    <Sliders size={12} />
                    <span>Intensidad de Guía Fantasma</span>
                  </div>

                  {/* Range Slider */}
                  <div className="opacity-slider-row">
                    <input
                      type="range"
                      min="0.15"
                      max="0.95"
                      step="0.05"
                      value={ghostOpacity}
                      onChange={(e) => handleOpacityChange(Number(e.target.value))}
                      className="opacity-range-input"
                    />
                    <span className="opacity-percent-label">{Math.round(ghostOpacity * 100)}%</span>
                  </div>

                  {/* Presets */}
                  <div className="opacity-presets-grid">
                    {[
                      { label: 'Tenue', val: 0.25 },
                      { label: 'Normal', val: 0.40 },
                      { label: 'Nítido', val: 0.65 },
                      { label: 'Sólido', val: 0.85 }
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

          {closingStack && closingStack.length > 0 && (
            <div className="pending-bracket-badge animate-pop">
              <span>Auto-par: <strong>{closingStack.map((s) => s.char).reverse().join(' ')}</strong></span>
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
              <span>GUÍA FANTASMA ACTIVA</span>
            </div>
          )}
        </div>
      </div>

      {/* Snippet Description / Exam Objective */}
      <div className="snippet-prompt-box">
        <div className="prompt-content">
          <span className="prompt-label">Práctica de Examen:</span>
          <span className="prompt-text">
            {snippetDescription || 'Escribe el código Java. El texto tenue es la guía fantasma para memoria muscular.'}
          </span>
        </div>
        <div className="comment-rule-hint">
          <Info size={13} color="var(--text-muted)" />
          <span>( , [ , &#123; se auto-cierran • Puedes copiar y pegar (Ctrl+V) libremente</span>
        </div>
      </div>

      {/* Main Interactive Canvas (Single Unified Editor!) */}
      <div
        ref={containerRef}
        className={`editor-viewport ${!isFocused ? 'unfocused' : ''} ${isExamMode ? 'mode-exam' : ''}`}
        onClick={handleContainerClick}
        onScroll={handleScroll}
      >
        {/* Hidden key & paste interceptor */}
        <input
          ref={hiddenInputRef}
          type="text"
          className="hidden-keystroke-capture"
          onKeyDown={handleKeyDownWrapper}
          onPaste={handlePasteWrapper}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />

        {/* Floating return to active writing position if user scrolled away */}
        {!isCaretVisible && (
          <button
            type="button"
            className="btn-jump-floating animate-pop"
            onClick={(e) => {
              e.stopPropagation();
              jumpToCaret('smooth');
            }}
            title="Volver a la posición de escritura activa"
          >
            <span>📍 Ir a donde escribo</span>
            <kbd className="jump-kbd">↵</kbd>
          </button>
        )}

        {/* Combo floating visual effects */}
        <div className="editor-combo-float">
          <ComboVFX
            streak={streak}
            comboMultiplier={comboMultiplier}
            comboTierName={comboTierName}
            comboEvent={comboEvent}
          />
        </div>

        {/* Unfocused banner */}
        {!isFocused && !isCompleted && (
          <div className="unfocused-banner animate-pop">
            <Keyboard size={16} />
            <span>Haz clic aquí para escribir</span>
          </div>
        )}

        {/* Code Lines Rendering */}
        <div className="code-content-wrapper">
          {renderedLines.map((lineData) => {
            const isLineActive =
              currentIndex >= (lineData.lineChars[0]?.globalIdx ?? 0) &&
              currentIndex <= (lineData.newlineGlobalIdx ?? Infinity);

            // Special styling for comment lines (Headers / Questions)
            if (lineData.isEntireLineComment) {
              return (
                <div
                  key={lineData.lineIdx}
                  data-line={lineData.lineIdx}
                  className="code-line comment-full-line"
                >
                  <div className="line-number">{lineData.lineIdx + 1}</div>
                  <div className="line-code comment-text">
                    {lineData.lineText}
                  </div>
                </div>
              );
            }

            // Special rendering for class wrapper header
            if (lineData.isClassHeader) {
              return (
                <div
                  key={lineData.lineIdx}
                  data-line={lineData.lineIdx}
                  className="code-line class-boilerplate-line"
                >
                  <div className="line-number">{lineData.lineIdx + 1}</div>
                  <div className="line-code class-boilerplate-text">
                    <span className="kw">public class</span>{' '}<span className="cls-name">Examen1</span>{' '}<span className="brace">&#123;</span>
                  </div>
                </div>
              );
            }

            // Special rendering for class closing brace "}" at the bottom
            if (lineData.isClassFooter) {
              return (
                <div
                  key={lineData.lineIdx}
                  data-line={lineData.lineIdx}
                  className="code-line class-boilerplate-line"
                >
                  <div className="line-number">{lineData.lineIdx + 1}</div>
                  <div className="line-code class-boilerplate-text">
                    <span className="brace">&#125;</span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={lineData.lineIdx}
                data-line={lineData.lineIdx}
                className={`code-line ${isLineActive ? 'active-line' : ''}`}
              >
                {/* Line number gutter */}
                <div className="line-number">{lineData.lineIdx + 1}</div>

                {/* Line characters */}
                <div className="line-code">
                  {lineData.lineChars.map((charData) => {
                    const {
                      char,
                      globalIdx,
                      isCharComment,
                      isCharBoilerplate,
                      isCurrent,
                      isTyped,
                      isCorrect,
                      userChar
                    } = charData;

                    // Inline comment
                    if (isCharComment) {
                      return (
                        <span key={globalIdx} className="char-inline-comment">
                          {char}
                        </span>
                      );
                    }

                    // Boilerplate
                    if (isCharBoilerplate) {
                      return (
                        <span key={globalIdx} className="char-boilerplate">
                          {char}
                        </span>
                      );
                    }

                    // In Exam Mode:
                    if (isExamMode) {
                      if (!isTyped && !isCurrent) {
                        return (
                          <span key={globalIdx} className="char-empty">
                            {' '}
                          </span>
                        );
                      }

                      if (isCurrent) {
                        return (
                          <span
                            key={globalIdx}
                            ref={caretRef}
                            className="char-caret-holder current-exam"
                          >
                            <span className="blinking-caret" />
                          </span>
                        );
                      }

                      return (
                        <span
                          key={globalIdx}
                          className={`char-typed ${isCorrect ? 'exam-correct' : 'exam-error'}${charData.isAutoClosed ? ' auto-closed-bracket' : ''}`}
                          title={charData.isAutoClosed ? 'Auto-cerrado' : undefined}
                        >
                          {userChar === ' ' ? ' ' : userChar}
                        </span>
                      );
                    }

                    // In Practice / Muscle Memory Guide Mode:
                    if (isTyped) {
                      return (
                        <span
                          key={globalIdx}
                          className={`char-typed ${isCorrect ? 'correct' : 'error'}${charData.isAutoClosed ? ' auto-closed-bracket' : ''}`}
                          title={charData.isAutoClosed ? 'Auto-cerrado' : undefined}
                        >
                          {userChar === ' ' && !isCorrect ? '•' : userChar}
                        </span>
                      );
                    }

                    if (isCurrent) {
                      return (
                        <span
                          key={globalIdx}
                          ref={caretRef}
                          className="char-caret-holder current-guide"
                        >
                          <span className="blinking-caret" />

                          {!isExamMode && (
                            <span
                              className="ghost-char under-caret"
                              style={{ opacity: Math.min(1, ghostOpacity + 0.3) }}
                            >
                              {char}
                            </span>
                          )}

                          {/* Java IntelliSense popup attached to active caret */}
                          {intelliSenseData && (
                            <IntelliSensePopup
                              triggerData={intelliSenseData}
                              selectedIndex={intelliSenseIndex}
                              setSelectedIndex={setIntelliSenseIndex}
                              onSelectSuggestion={handleSelectIntelliSense}
                            />
                          )}
                        </span>
                      );
                    }

                    // Future ghost character (faint, semi-transparent italic watermark)
                    return (
                      <span
                        key={globalIdx}
                        className="ghost-char"
                        style={{ opacity: ghostOpacity }}
                      >
                        {char}
                      </span>
                    );
                  })}

                  {/* Newline indicator / caret if at end of line */}
                  {lineData.hasNewline && !lineData.isNewlineNonTypeable && (
                    <span className="char-newline-marker">
                      {lineData.isNewlineCurrent && (
                        <span ref={caretRef} className="char-caret-holder">
                          <span className="blinking-caret" />
                          <span className="ghost-enter-hint">↵</span>
                        </span>
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .code-editor-outer {
          flex: 1;
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          border-left: 1px solid var(--card-border);
          overflow: hidden;
        }

        /* Top Bar */
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

        .editor-file-path {
          font-family: var(--font-mono);
          font-size: 11px;
          color: var(--text-muted);
          background: #F1F5F9;
          padding: 2px 8px;
          border-radius: var(--radius-sm);
          border: 1px solid #E2E8F0;
        }

        .btn-reload-file {
          display: flex;
          align-items: center;
          gap: 5px;
          background: #FFFFFF;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-full);
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 600;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-reload-file:hover {
          color: var(--pastel-lavender);
          border-color: var(--pastel-lavender-border);
          background: var(--pastel-lavender-bg);
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

        /* Opacity Control */
        .opacity-control-wrap {
          position: relative;
        }

        .btn-opacity-trigger {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 4px 9px;
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
          top: 34px;
          right: 0;
          width: 210px;
          background: #FFFFFF;
          border: 1px solid var(--card-border);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-lg);
          padding: 10px;
          z-index: 60;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .opacity-dropdown-header {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
        }

        .opacity-slider-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .opacity-range-input {
          flex: 1;
          accent-color: var(--pastel-lavender);
          cursor: pointer;
        }

        .opacity-percent-label {
          font-family: var(--font-mono);
          font-size: 11px;
          font-weight: 700;
          color: var(--pastel-lavender);
          min-width: 32px;
          text-align: right;
        }

        .opacity-presets-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px;
        }

        .preset-pill {
          padding: 3px 5px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--card-border);
          background: var(--bg-main);
          font-size: 10px;
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

        .pending-bracket-badge {
          font-size: 11px;
          color: var(--pastel-lavender);
          background: var(--pastel-lavender-bg);
          border: 1px solid var(--pastel-lavender-border);
          padding: 2px 8px;
          border-radius: var(--radius-full);
        }

        .guide-status-indicator {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          font-weight: 700;
          color: var(--pastel-mint);
          background: var(--pastel-mint-bg);
          border: 1px solid var(--pastel-mint-border);
          padding: 3px 9px;
          border-radius: var(--radius-full);
        }

        .exam-status-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          color: var(--pastel-peach);
          background: var(--pastel-peach-bg);
          border: 1px solid var(--pastel-peach-border);
          padding: 3px 9px;
          border-radius: var(--radius-full);
        }

        .exam-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--pastel-peach);
          animation: gentlePulse 1.2s infinite ease-in-out;
        }

        /* Snippet prompt */
        .snippet-prompt-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 18px;
          background: #FCFBF9;
          border-bottom: 1px solid var(--card-border);
          font-size: 11px;
          gap: 10px;
          flex-wrap: wrap;
        }

        .prompt-content {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .prompt-label {
          font-weight: 700;
          color: var(--pastel-lavender);
          text-transform: uppercase;
        }

        .prompt-text {
          color: var(--text-secondary);
        }

        .comment-rule-hint {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: var(--text-muted);
        }

        /* Viewport */
        .editor-viewport {
          position: relative;
          flex: 1;
          height: calc(100vh - 230px);
          min-height: 480px;
          overflow-y: auto;
          overflow-x: auto;
          padding: 14px 0;
          background: #FFFFFF;
          cursor: text;
          user-select: none;
        }

        .editor-viewport.unfocused {
          background: #FAF9F6;
        }

        .hidden-keystroke-capture {
          position: fixed;
          opacity: 0;
          pointer-events: none;
          top: -9999px;
          left: -9999px;
          width: 1px;
          height: 1px;
        }

        .btn-jump-floating {
          position: sticky;
          float: right;
          bottom: 16px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1.5px solid var(--pastel-lavender-border);
          color: var(--pastel-lavender);
          font-size: 11px;
          font-weight: 700;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          box-shadow: var(--shadow-lg);
          cursor: pointer;
          z-index: 30;
          transition: var(--transition-fast);
        }

        .btn-jump-floating:hover {
          background: var(--pastel-lavender-bg);
          transform: translateY(-2px);
        }

        .jump-kbd {
          font-family: var(--font-mono);
          font-size: 10px;
          background: var(--pastel-lavender-bg);
          border: 1px solid var(--pastel-lavender-border);
          border-radius: 3px;
          padding: 1px 4px;
          color: var(--pastel-lavender);
        }

        .editor-combo-float {
          position: absolute;
          top: 10px;
          right: 30px;
          z-index: 15;
        }

        .unfocused-banner {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 1px solid var(--pastel-lavender-border);
          color: var(--pastel-lavender);
          font-size: 12px;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          box-shadow: var(--shadow-md);
          z-index: 25;
          cursor: pointer;
        }

        /* Code Lines */
        .code-content-wrapper {
          display: flex;
          flex-direction: column;
          font-family: var(--font-mono);
          font-size: 14px;
          line-height: 24px;
          padding-bottom: 50vh;
        }

        .code-line {
          display: flex;
          align-items: flex-start;
          padding: 0 16px 0 0;
          min-height: 24px;
          transition: background 0.1s ease;
        }

        .code-line.active-line {
          background: rgba(108, 92, 231, 0.05);
          border-left: 3px solid var(--pastel-lavender);
        }

        .code-line.comment-full-line {
          background: #FAF9F6;
          border-top: 1px dashed #EFECE6;
          border-bottom: 1px dashed #EFECE6;
        }

        .code-line.class-boilerplate-line {
          background: rgba(108, 92, 231, 0.02);
          opacity: 0.85;
        }

        .class-boilerplate-text {
          color: var(--text-secondary);
        }

        .class-boilerplate-text .kw {
          color: var(--pastel-lavender);
          font-weight: 700;
        }

        .class-boilerplate-text .cls-name {
          color: var(--text-primary);
          font-weight: 700;
        }

        .class-boilerplate-text .brace {
          color: var(--text-primary);
          font-weight: 700;
        }

        .line-number {
          width: 50px;
          padding-right: 14px;
          text-align: right;
          color: var(--text-muted);
          font-size: 12px;
          user-select: none;
          flex-shrink: 0;
          font-weight: 500;
        }

        .active-line .line-number {
          color: var(--pastel-lavender);
          font-weight: 700;
        }

        .line-code {
          white-space: pre;
          tab-size: 4;
          display: flex;
          flex-wrap: wrap;
          word-break: break-all;
        }

        .line-code.comment-text {
          color: #94A3B8;
          font-style: italic;
          font-weight: 500;
        }

        .char-inline-comment {
          color: #94A3B8;
          font-style: italic;
          font-weight: 500;
        }

        .char-boilerplate {
          color: var(--text-muted);
        }

        /* GHOST CODE: Clear, faint, italic watermark! NOT normal text! */
        .ghost-char {
          color: #94A3B8;
          font-style: italic;
          font-weight: 400;
          user-select: none;
          transition: opacity 0.12s ease;
        }

        /* TYPED CODE: Crisp, bold, solid dark slate text */
        .char-typed.correct {
          color: #0F172A;
          font-style: normal;
          font-weight: 700;
        }

        .char-typed.error {
          color: #EF4444;
          background: rgba(239, 68, 68, 0.15);
          border-radius: 2px;
          text-decoration: underline wavy #EF4444;
          font-weight: 700;
        }

        .char-typed.exam-correct {
          color: #0F172A;
          font-weight: 700;
          font-style: normal;
        }

        .char-typed.exam-error {
          color: #EF4444;
          background: rgba(239, 68, 68, 0.15);
          border-radius: 2px;
          text-decoration: underline wavy #EF4444;
          font-weight: 700;
        }

        .char-caret-holder {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .blinking-caret {
          display: inline-block;
          width: 2.5px;
          height: 18px;
          background-color: var(--caret-color);
          animation: blinkCaret 0.9s infinite;
          margin-right: -2.5px;
          position: relative;
          z-index: 5;
          border-radius: 1px;
        }

        .auto-closed-bracket {
          color: var(--pastel-lavender) !important;
          font-weight: 700;
          opacity: 0.95;
          text-shadow: 0 0 6px rgba(167, 139, 250, 0.4);
        }

        .ghost-char.under-caret {
          color: var(--pastel-lavender);
          font-weight: 700;
          font-style: normal;
          background: rgba(108, 92, 231, 0.14);
          border-radius: 2px;
        }

        .ghost-enter-hint {
          font-size: 11px;
          color: var(--pastel-lavender);
          opacity: 0.7;
          margin-left: 2px;
          font-weight: 700;
        }

        .char-empty {
          display: inline-block;
          width: 8.4px;
        }
      `}</style>
    </div>
  );
}
