import { useState, useEffect, useCallback, useRef } from 'react';
import { sounds } from '../utils/soundEffects';
import { generateExamSkeleton } from '../utils/codeSkeleton';

export function useIDEEngine(targetCode = '', isExamMode = false, onFinish = null, onFirstKey = null) {
  const normalizedTarget = (targetCode || '').replace(/\r\n/g, '\n');

  // Generate clean skeleton template (empty method bodies for practice)
  const skeletonCode = generateExamSkeleton(normalizedTarget);

  // Initialize with skeleton so user actually has blank methods to code into!
  const [userCode, setUserCode] = useState(skeletonCode || normalizedTarget);
  const [activeFunctionName, setActiveFunctionName] = useState('sumandos');
  const [cursorIndex, setCursorIndex] = useState(0);

  // Typing analytics
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [totalKeystrokes, setTotalKeystrokes] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [comboEvent, setComboEvent] = useState(null);

  // Parse target functions for the non-linear outline
  const [outlineFunctions, setOutlineFunctions] = useState([]);

  useEffect(() => {
    const lines = normalizedTarget.split('\n');
    const funcs = [];
    const methodRegex = /static\s+([\w<>\[\]]+)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/;

    lines.forEach((line, lineIdx) => {
      const match = line.match(methodRegex);
      if (match) {
        funcs.push({
          returnType: match[1],
          name: match[2],
          params: match[3],
          lineIdx,
          fullSignature: line.trim()
        });
      } else if (line.includes('public static void main')) {
        funcs.push({
          returnType: 'void',
          name: 'main',
          params: 'String[] args',
          lineIdx,
          fullSignature: 'public static void main(String[] args)'
        });
      }
    });

    setOutlineFunctions(funcs);
  }, [normalizedTarget]);

  // Reset engine with clean skeleton
  const resetEngine = useCallback((newTarget = null) => {
    const target = newTarget !== null ? newTarget : targetCode;
    const norm = target.replace(/\r\n/g, '\n');
    const skel = generateExamSkeleton(norm);
    setUserCode(skel || norm);
    setCursorIndex(0);
    setStreak(0);
    setMaxStreak(0);
    setTotalKeystrokes(0);
    setHasStarted(false);
    setStartTime(null);
    setEndTime(null);
    setComboEvent(null);
  }, [targetCode]);

  // Helper to load complete solution directly if user wants
  const loadFullSolution = useCallback(() => {
    setUserCode(normalizedTarget);
  }, [normalizedTarget]);

  // Check combo milestone
  const checkComboMilestone = useCallback((newStreak) => {
    const milestones = [
      { count: 10, title: '¡BUEN RITMO!', level: 1 },
      { count: 25, title: '¡GRAN RACHA!', level: 2 },
      { count: 50, title: '¡SUPER COMBO! ', level: 3 },
      { count: 100, title: '¡MEGA FRENZY! ', level: 4 },
      { count: 150, title: '¡MODO DIOS! ', level: 5 }
    ];

    const match = milestones.find((m) => m.count === newStreak);
    if (match) {
      sounds.playComboMilestone(match.level);
      setComboEvent({
        id: Date.now(),
        title: match.title,
        streak: newStreak,
        level: match.level
      });
      setTimeout(() => {
        setComboEvent((curr) => (curr && curr.streak === newStreak ? null : curr));
      }, 1500);
    }
  }, []);

  // Real IDE Keystroke Handler: Auto-pairs () [] {} "", step-overs, indentation
  const handleEditorKeyDown = useCallback((e, textarea) => {
    if (!textarea) return;

    if (!hasStarted) {
      setHasStarted(true);
      setStartTime(Date.now());
      if (onFirstKey) onFirstKey();
    }

    setTotalKeystrokes((k) => k + 1);

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;

    const pairs = {
      '(': ')',
      '[': ']',
      '{': '}',
      '"': '"',
      "'": "'"
    };

    // 1. AUTO-CLOSE DELIMITERS: When typing (, [, {, ", '
    if (pairs[e.key]) {
      e.preventDefault();
      sounds.playKeyClick();
      const closeChar = pairs[e.key];
      const selectedText = val.substring(start, end);

      const updatedText =
        val.substring(0, start) +
        e.key +
        selectedText +
        closeChar +
        val.substring(end);

      // Apply directly to DOM so it is 100% visible IMMEDIATELY
      textarea.value = updatedText;
      const nextPos = start + 1 + selectedText.length;
      textarea.setSelectionRange(start + 1, start + 1);

      setUserCode(updatedText);
      setCursorIndex(nextPos);

      // Increase streak
      setStreak((s) => {
        const next = s + 1;
        setMaxStreak((m) => Math.max(m, next));
        checkComboMilestone(next);
        return next;
      });
      return;
    }

    // 2. STEP-OVER: If next character is already the closing delimiter and user types it
    if ([')', ']', '}', '"', "'"].includes(e.key) && start === end && val[start] === e.key) {
      e.preventDefault();
      sounds.playKeyClick();
      textarea.setSelectionRange(start + 1, start + 1);
      setCursorIndex(start + 1);

      setStreak((s) => {
        const next = s + 1;
        setMaxStreak((m) => Math.max(m, next));
        checkComboMilestone(next);
        return next;
      });
      return;
    }

    // 3. TAB KEY: 4 spaces indent without losing focus
    if (e.key === 'Tab') {
      e.preventDefault();
      sounds.playKeyClick();
      const spaces = '    ';
      const updatedText = val.substring(0, start) + spaces + val.substring(end);

      textarea.value = updatedText;
      textarea.setSelectionRange(start + 4, start + 4);
      setUserCode(updatedText);
      setCursorIndex(start + 4);
      return;
    }

    // 4. ENTER KEY: Smart Indentation
    if (e.key === 'Enter') {
      sounds.playKeyClick();
      const currentLineStart = val.lastIndexOf('\n', start - 1) + 1;
      const currentLine = val.substring(currentLineStart, start);
      const indentMatch = currentLine.match(/^\s*/);
      let indent = indentMatch ? indentMatch[0] : '';

      // If user presses Enter right between { and }, expand!
      if (val[start - 1] === '{' && val[start] === '}') {
        e.preventDefault();
        const newText =
          val.substring(0, start) +
          '\n' +
          indent +
          '    \n' +
          indent +
          val.substring(end);

        const newCursor = start + 1 + indent.length + 4;
        textarea.value = newText;
        textarea.setSelectionRange(newCursor, newCursor);
        setUserCode(newText);
        setCursorIndex(newCursor);
        return;
      }

      // If previous char is '{', increase indent
      if (val[start - 1] === '{') {
        indent += '    ';
      }

      e.preventDefault();
      const newText = val.substring(0, start) + '\n' + indent + val.substring(end);
      const newPos = start + 1 + indent.length;
      textarea.value = newText;
      textarea.setSelectionRange(newPos, newPos);
      setUserCode(newText);
      setCursorIndex(newPos);
      return;
    }

    // 5. BACKSPACE PAIR DELETE: If backspacing right after () or [] or {}
    if (e.key === 'Backspace' && start === end && start > 0) {
      const prevChar = val[start - 1];
      const nextChar = val[start];
      if (
        (prevChar === '(' && nextChar === ')') ||
        (prevChar === '[' && nextChar === ']') ||
        (prevChar === '{' && nextChar === '}') ||
        (prevChar === '"' && nextChar === '"') ||
        (prevChar === "'" && nextChar === "'")
      ) {
        e.preventDefault();
        sounds.playKeyClick();
        const newText = val.substring(0, start - 1) + val.substring(start + 1);
        textarea.value = newText;
        textarea.setSelectionRange(start - 1, start - 1);
        setUserCode(newText);
        setCursorIndex(start - 1);
        return;
      }
    }

    // Regular keypress
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      sounds.playKeyClick();
      setStreak((s) => {
        const next = s + 1;
        setMaxStreak((m) => Math.max(m, next));
        checkComboMilestone(next);
        return next;
      });
    }
  }, [checkComboMilestone, hasStarted, onFirstKey]);

  // Similarity & Progress calculation (comparing non-empty code lines)
  const calculateProgress = useCallback(() => {
    if (!normalizedTarget) return 100;
    const targetLines = normalizedTarget
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('//'));

    const userLines = userCode
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0 && !l.startsWith('//') && !l.includes('Escribe tu'));

    if (targetLines.length === 0) return 100;

    let matched = 0;
    for (const tLine of targetLines) {
      if (userLines.some((uLine) => uLine === tLine)) {
        matched++;
      }
    }

    return Math.min(100, Math.round((matched / targetLines.length) * 100));
  }, [normalizedTarget, userCode]);

  const progressPercent = calculateProgress();

  // Real-time Analytics
  const nowTime = endTime || Date.now();
  const elapsedMinutes = startTime ? Math.max(0.01, (nowTime - startTime) / 60000) : 0.01;
  const wpm = hasStarted ? Math.round((totalKeystrokes / 5) / elapsedMinutes) : 0;
  const cpm = hasStarted ? Math.round(totalKeystrokes / elapsedMinutes) : 0;
  const accuracy = Math.max(85, Math.min(100, progressPercent > 0 ? 95 : 100));

  // Combo multiplier
  let comboMultiplier = 1;
  let comboTierName = 'COMBO x1';
  let comboColor = 'var(--pastel-lavender)';

  if (streak >= 100) {
    comboMultiplier = 4;
    comboTierName = ' MEGA FRENZY x4';
    comboColor = 'var(--pastel-peach)';
  } else if (streak >= 50) {
    comboMultiplier = 3;
    comboTierName = ' SUPER x3';
    comboColor = 'var(--pastel-honey)';
  } else if (streak >= 25) {
    comboMultiplier = 2;
    comboTierName = ' RITMO x2';
    comboColor = 'var(--pastel-mint)';
  } else if (streak >= 10) {
    comboMultiplier = 1.5;
    comboTierName = ' COMBO x1.5';
    comboColor = 'var(--pastel-lavender)';
  }

  return {
    userCode,
    setUserCode,
    targetCode: normalizedTarget,
    skeletonCode,
    outlineFunctions,
    activeFunctionName,
    setActiveFunctionName,
    cursorIndex,
    setCursorIndex,
    streak,
    maxStreak,
    totalKeystrokes,
    wpm,
    cpm,
    accuracy,
    progressPercent,
    comboMultiplier,
    comboTierName,
    comboColor,
    comboEvent,
    handleEditorKeyDown,
    resetEngine,
    loadFullSolution
  };
}
