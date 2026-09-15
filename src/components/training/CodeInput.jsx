import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { Code2, Keyboard } from 'lucide-react';
import { editCode } from '../../learning/editorCommands';
import { sanitizeCode } from '../../learning/javaComparison';

export default function CodeInput({
  value = '',
  onChange,
  readOnly = false,
  onSubmit,
  id = 'training-code',
  label = 'Código Java',
  onEdit,
  errorLine = null
}) {
  const input = useRef(null);
  const gutter = useRef(null);
  const pendingSelection = useRef(null);
  const [captureTab, setCaptureTab] = useState(true);

  // Undo / Redo history stack
  const historyRef = useRef([{ value: value || '', start: 0, end: 0 }]);
  const historyIndexRef = useRef(0);
  const isUndoRedoRef = useRef(false);
  const lastTypingTimeRef = useRef(0);

  useEffect(() => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }
    const current = historyRef.current[historyIndexRef.current];
    if (!current || current.value !== value) {
      historyRef.current = [{
        value: value || '',
        start: input.current?.selectionStart || 0,
        end: input.current?.selectionEnd || 0
      }];
      historyIndexRef.current = 0;
    }
  }, [value]);

  useLayoutEffect(() => {
    if (pendingSelection.current) {
      const { start, end } = pendingSelection.current;
      input.current?.setSelectionRange(start, end);
      pendingSelection.current = null;
    }
  }, [value]);

  useEffect(() => {
    if (errorLine && input.current && !readOnly) {
      const lines = value.split('\n');
      if (errorLine <= lines.length) {
        let charIndex = 0;
        for (let l = 0; l < errorLine - 1; l++) {
          charIndex += lines[l].length + 1;
        }
        const lineLen = lines[errorLine - 1]?.length || 0;
        input.current.setSelectionRange(charIndex, charIndex + lineLen);
        input.current.focus();
      }
    }
  }, [errorLine]);

  function pushHistory(newValue, start, end, isBatchable = false) {
    const now = performance.now();
    const current = historyRef.current[historyIndexRef.current];
    if (current && current.value === newValue) return;

    if (
      isBatchable &&
      current &&
      Math.abs(newValue.length - current.value.length) === 1 &&
      now - lastTypingTimeRef.current < 500 &&
      !/\s/.test(newValue.slice(Math.max(0, start - 1), start))
    ) {
      historyRef.current[historyIndexRef.current] = { value: newValue, start, end };
    } else {
      const nextHistory = historyRef.current.slice(0, historyIndexRef.current + 1);
      nextHistory.push({ value: newValue, start, end });
      if (nextHistory.length > 200) nextHistory.shift();
      historyRef.current = nextHistory;
      historyIndexRef.current = nextHistory.length - 1;
    }
    lastTypingTimeRef.current = now;
  }

  function handleUndo() {
    if (readOnly || historyIndexRef.current <= 0) return;
    historyIndexRef.current--;
    const prev = historyRef.current[historyIndexRef.current];
    if (prev) {
      isUndoRedoRef.current = true;
      pendingSelection.current = { start: prev.start, end: prev.end };
      onChange(prev.value, { generated: true });
      onEdit?.(prev.value);
      input.current?.setSelectionRange(prev.start, prev.end);
    }
  }

  function handleRedo() {
    if (readOnly || historyIndexRef.current >= historyRef.current.length - 1) return;
    historyIndexRef.current++;
    const next = historyRef.current[historyIndexRef.current];
    if (next) {
      isUndoRedoRef.current = true;
      pendingSelection.current = { start: next.start, end: next.end };
      onChange(next.value, { generated: true });
      onEdit?.(next.value);
      input.current?.setSelectionRange(next.start, next.end);
    }
  }

  function replace(edit) {
    const cleanVal = sanitizeCode(edit.value);
    pushHistory(cleanVal, edit.start, edit.end, false);
    pendingSelection.current = { ...edit, value: cleanVal };
    if (cleanVal === value) {
      input.current?.setSelectionRange(edit.start, edit.end);
      pendingSelection.current = null;
    }
    onChange(cleanVal, { generated: true });
    onEdit?.(cleanVal);
  }

  return (
    <div className="code-workbench">
      <div className="code-toolbar">
        <span>
          <Code2 size={16} />
          <label htmlFor={id}>{label}</label>
        </span>
        <button
          type="button"
          aria-pressed={captureTab}
          onClick={() => setCaptureTab(!captureTab)}
        >
          <Keyboard size={15} /> Tab: {captureTab ? 'indentar' : 'navegar'}
        </button>
      </div>
      <div className="code-writing-area">
        <div className="code-gutter" ref={gutter} aria-hidden="true">
          {value.split('\n').map((_, i) => (
            <div
              key={i}
              className={`code-gutter-line ${errorLine === i + 1 ? 'has-error' : ''}`}
              title={errorLine === i + 1 ? `Error en línea ${i + 1}` : undefined}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <textarea
          ref={input}
          id={id}
          aria-describedby={id + '-help'}
          value={value}
          readOnly={readOnly}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
          onChange={event => {
            const cleanVal = sanitizeCode(event.target.value);
            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;
            pushHistory(cleanVal, start, end, true);
            onChange(cleanVal);
            onEdit?.(cleanVal);
          }}
          onScroll={event => {
            gutter.current.scrollTop = event.target.scrollTop;
          }}
          onKeyDown={event => {
            if (event.isComposing) return;
            const isCtrlOrMeta = event.ctrlKey || event.metaKey;

            if (event.key === 'Escape') {
              event.stopPropagation();
              setCaptureTab(false);
              return;
            }

            if (isCtrlOrMeta && event.key === 'Enter') {
              event.preventDefault();
              event.stopPropagation();
              onSubmit?.();
              return;
            }

            // Undo: Ctrl+Z (without Shift)
            if (isCtrlOrMeta && (event.key === 'z' || event.key === 'Z') && !event.shiftKey) {
              event.preventDefault();
              event.stopPropagation();
              handleUndo();
              return;
            }

            // Redo: Ctrl+Y or Ctrl+Shift+Z
            if (
              isCtrlOrMeta &&
              (event.key === 'y' ||
                event.key === 'Y' ||
                ((event.key === 'z' || event.key === 'Z') && event.shiftKey))
            ) {
              event.preventDefault();
              event.stopPropagation();
              handleRedo();
              return;
            }

            if (readOnly || isCtrlOrMeta || event.altKey) return;
            if (event.key === 'Tab' && !captureTab) return;

            const start = event.currentTarget.selectionStart;
            const end = event.currentTarget.selectionEnd;
            const edit = editCode(value, start, end, event.key, event.shiftKey);
            if (edit) {
              event.preventDefault();
              event.stopPropagation();
              replace(edit);
            }
          }}
        />
      </div>
      <p id={id + '-help'} className="code-help">
        Tab indenta · Shift+Tab desindenta · Ctrl+Z/Y deshace/rehace · Ctrl+Enter comprueba · Esc libera Tab para navegar
      </p>
    </div>
  );
}


