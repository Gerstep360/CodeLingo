import { useState, useEffect, useCallback, useRef } from 'react';
import { sounds } from '../utils/soundEffects';
import { parseCodeComments } from '../utils/codeParser';
import { duoStorage } from '../utils/duoStorage';

const BRACKET_PAIRS = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>'
};

function findMatchingCloseIndex(target, openChar, startIdx) {
  const closeChar = BRACKET_PAIRS[openChar];
  if (!closeChar) return -1;

  if (openChar === '<') {
    let depth = 1;
    for (let k = startIdx; k < target.length; k++) {
      const ch = target[k];
      if (ch === '\n' || ch === ';' || ch === '=' || ch === '+' || ch === '-' || ch === '*' || ch === '/') {
        return -1;
      }
      if (ch === '<') depth++;
      else if (ch === '>') {
        depth--;
        if (depth === 0) return k;
      }
    }
    return -1;
  }

  let depth = 1;
  for (let k = startIdx; k < target.length; k++) {
    if (target[k] === openChar) depth++;
    else if (target[k] === closeChar) {
      depth--;
      if (depth === 0) return k;
    }
  }
  return -1;
}

function advanceCursorOverAutoClosed(target, startIdx, history, nonTypeableMap, getNextTypeableIndex) {
  const autoClosedSet = new Set(
    history.filter((e) => e.isAutoClosed).map((e) => e.fromIdx)
  );

  let idx = startIdx;
  while (idx < target.length) {
    if (nonTypeableMap && nonTypeableMap[idx]) {
      const nextT = getNextTypeableIndex(idx);
      if (nextT > idx) {
        idx = nextT;
        continue;
      }
    }

    if (autoClosedSet.has(idx)) {
      idx++;
      continue;
    }

    break;
  }
  return idx;
}

export function useTypingEngine(targetCode = '', isExamMode = false, onFinish = null, onFirstKey = null, snippetId = 'default') {
  // Parse comments, boilerplate, and structure
  const parsed = parseCodeComments(targetCode);
  const { normalized, isNonTypeableChar, getNextTypeableIndex } = parsed;

  // Calculate total typeable code characters
  let totalTypeable = 0;
  for (let i = 0; i < normalized.length; i++) {
    if (!isNonTypeableChar[i]) totalTypeable++;
  }

  // Initial typeable index (starts at imports if present, or first method)
  const initialIndex = getNextTypeableIndex(0);

  const savedDraft = snippetId ? duoStorage.getEditorDraft(snippetId, isExamMode) : null;

  // Core typing state
  const [typedChars, setTypedChars] = useState(() => savedDraft?.typedChars || []);
  const [currentIndex, setCurrentIndex] = useState(() => (savedDraft?.currentIndex !== undefined ? savedDraft.currentIndex : initialIndex));
  const [totalErrors, setTotalErrors] = useState(() => savedDraft?.totalErrors || 0);
  const [streak, setStreak] = useState(() => savedDraft?.streak || 0);
  const [maxStreak, setMaxStreak] = useState(() => savedDraft?.maxStreak || 0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasStarted, setHasStarted] = useState(() => Boolean(savedDraft?.hasStarted));
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [comboEvent, setComboEvent] = useState(null);

  useEffect(() => {
    if (!snippetId || isCompleted) return;
    if (typedChars.length > 0) {
      duoStorage.saveEditorDraft(snippetId, isExamMode, {
        typedChars,
        currentIndex,
        totalErrors,
        streak,
        maxStreak,
        hasStarted
      });
    }
  }, [snippetId, isExamMode, typedChars, currentIndex, totalErrors, streak, maxStreak, hasStarted, isCompleted]);

  // List of functions in the code for non-linear outline jumping
  const [outlineFunctions, setOutlineFunctions] = useState([]);

  useEffect(() => {
    const lines = normalized.split('\n');
    const funcs = [];
    let charPos = 0;

    lines.forEach((line, lineIdx) => {
      const isMethod =
        (line.includes('static ') || line.includes('public static ')) &&
        line.includes('(');

      if (isMethod) {
        const match = line.match(
          /(?:public\s+)?static\s+([\w<>\[\]]+)\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/
        );
        if (match) {
          const startIndex = charPos;
          // Find matching closing brace '}' for this method
          let depth = 0;
          let hasOpened = false;
          let endIndex = startIndex;

          for (let k = startIndex; k < normalized.length; k++) {
            if (normalized[k] === '{') {
              depth++;
              hasOpened = true;
            } else if (normalized[k] === '}') {
              depth--;
              if (hasOpened && depth === 0) {
                endIndex = k;
                break;
              }
            }
          }

          const codeSnippet = normalized.substring(startIndex, endIndex + 1);

          funcs.push({
            returnType: match[1],
            name: match[2],
            params: match[3],
            startIndex,
            endIndex,
            lineIdx,
            fullSignature: line.trim(),
            codeSnippet
          });
        }
      }
      charPos += line.length + 1;
    });

    setOutlineFunctions(funcs);
  }, [normalized]);

  // Non-linear jump to any function or line index
  const jumpToIndex = useCallback((targetIndex) => {
    const idx = Math.max(0, Math.min(normalized.length - 1, targetIndex));
    const nextTypeable = getNextTypeableIndex(idx);
    setCurrentIndex(nextTypeable);
  }, [normalized.length, getNextTypeableIndex]);

  // Refs to avoid stale closures
  const stateRef = useRef({
    currentIndex,
    typedChars,
    normalized,
    isNonTypeableChar,
    streak,
    maxStreak,
    totalErrors,
    isCompleted,
    hasStarted,
    startTime,
    totalTypeable
  });

  useEffect(() => {
    stateRef.current = {
      currentIndex,
      typedChars,
      normalized,
      isNonTypeableChar,
      streak,
      maxStreak,
      totalErrors,
      isCompleted,
      hasStarted,
      startTime,
      totalTypeable
    };
  });

  // Reset engine when target code changes
  const resetEngine = useCallback((newCode = null) => {
    if (snippetId) {
      duoStorage.clearEditorDraft(snippetId, isExamMode);
    }
    const code = (newCode !== null ? newCode : targetCode);
    const newParsed = parseCodeComments(code);
    const startIdx = newParsed.getNextTypeableIndex(0);

    setTypedChars([]);
    setCurrentIndex(startIdx);
    setTotalErrors(0);
    setStreak(0);
    setMaxStreak(0);
    setIsCompleted(false);
    setHasStarted(false);
    setStartTime(null);
    setEndTime(null);
    setComboEvent(null);
  }, [targetCode, snippetId, isExamMode]);

  // Automatically reset and update typing state when targetCode changes (e.g. file edit or snippet switch)
  const prevCodeRef = useRef(targetCode);
  useEffect(() => {
    if (prevCodeRef.current !== targetCode) {
      prevCodeRef.current = targetCode;
      resetEngine(targetCode);
    }
  }, [targetCode, resetEngine]);

  // Check combo milestone
  const checkComboMilestone = useCallback((newStreak) => {
    const milestones = [
      { count: 10, title: '¡BUEN RITMO!', level: 1 },
      { count: 25, title: '¡GRAN RACHA!', level: 2 },
      { count: 50, title: '¡SUPER COMBO!', level: 3 },
      { count: 100, title: '¡MEGA FRENZY!', level: 4 },
      { count: 150, title: '¡MODO DIOS!', level: 5 }
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

  // Handle typing input
  const handleKeyDown = useCallback((e) => {
    const {
      currentIndex: idx,
      typedChars: history,
      normalized: target,
      isNonTypeableChar: nonTypeableMap,
      streak: currentStreak,
      maxStreak: currentMax,
      totalErrors: errors,
      isCompleted: finished,
      hasStarted: started
    } = stateRef.current;

    if (finished || !target || idx >= target.length) return;

    // Ignore special non-character modifier keys
    if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape'].includes(e.key)) {
      return;
    }

    if (['Tab', ' '].includes(e.key)) {
      e.preventDefault();
    }

    // Start timer on first keypress
    if (!started) {
      const now = Date.now();
      setHasStarted(true);
      setStartTime(now);
      if (onFirstKey) onFirstKey();
    }

    let currentIdx = idx;

    // 1. ARROW KEYS NAVIGATION (Up, Down, Left, Right)
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();

      if (e.key === 'ArrowLeft') {
        let prev = currentIdx - 1;
        while (prev >= 0 && nonTypeableMap[prev]) {
          prev--;
        }
        if (prev >= 0) {
          setCurrentIndex(prev);
        }
        return;
      }

      if (e.key === 'ArrowRight') {
        let next = currentIdx + 1;
        while (next < target.length && nonTypeableMap[next]) {
          next++;
        }
        if (next < target.length) {
          setCurrentIndex(next);
        }
        return;
      }

      if (e.key === 'ArrowUp') {
        const lastNL = target.lastIndexOf('\n', currentIdx - 1);
        if (lastNL !== -1) {
          const currentLineStart = lastNL + 1;
          const col = currentIdx - currentLineStart;
          const prevNL = target.lastIndexOf('\n', lastNL - 1);
          const prevLineStart = prevNL === -1 ? 0 : prevNL + 1;
          const prevLineLen = lastNL - prevLineStart;
          let targetPos = prevLineStart + Math.min(col, prevLineLen);
          if (nonTypeableMap[targetPos]) {
            targetPos = getNextTypeableIndex(targetPos);
          }
          if (targetPos < target.length) {
            setCurrentIndex(targetPos);
          }
        }
        return;
      }

      if (e.key === 'ArrowDown') {
        const nextNL = target.indexOf('\n', currentIdx);
        if (nextNL !== -1) {
          const lastNL = target.lastIndexOf('\n', currentIdx - 1);
          const currentLineStart = lastNL === -1 ? 0 : lastNL + 1;
          const col = currentIdx - currentLineStart;
          const nextLineStart = nextNL + 1;
          const afterNextNL = target.indexOf('\n', nextLineStart);
          const nextLineLen = (afterNextNL === -1 ? target.length : afterNextNL) - nextLineStart;
          let targetPos = nextLineStart + Math.min(col, nextLineLen);
          if (nonTypeableMap[targetPos]) {
            targetPos = getNextTypeableIndex(targetPos);
          }
          if (targetPos < target.length) {
            setCurrentIndex(targetPos);
          }
        }
        return;
      }
    }

    // 2. BACKSPACE HANDLING
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (currentIdx > 0 && history.length > 0) {
        const targetDeleteIdx = currentIdx - 1;
        const entryToDelete = history.find((h) => h.fromIdx === targetDeleteIdx);

        if (entryToDelete) {
          const deletedOpenIdx = entryToDelete.fromIdx;
          const newHistory = history.filter(
            (h) => h.fromIdx !== targetDeleteIdx && h.linkedOpenIdx !== deletedOpenIdx
          );
          setTypedChars(newHistory);
          setCurrentIndex(targetDeleteIdx);
        } else {
          let prev = currentIdx - 1;
          while (prev >= 0 && nonTypeableMap[prev]) {
            prev--;
          }
          if (prev >= 0) {
            setCurrentIndex(prev);
          }
        }
      }
      return;
    }

    let expectedChar = target[currentIdx];

    // 3. ENTER KEY HANDLING (Always clean, never corrupts characters)
    if (e.key === 'Enter') {
      e.preventDefault();

      // If at exact newline in target code:
      if (expectedChar === '\n') {
        sounds.playKeyClick();
        const nextStreak = currentStreak + 1;
        setStreak(nextStreak);
        setMaxStreak(Math.max(currentMax, nextStreak));
        checkComboMilestone(nextStreak);

        const newHistory = [
          ...history,
          {
            char: '\n',
            isCorrect: true,
            expected: '\n',
            fromIdx: currentIdx
          }
        ];

        let nextIndex = currentIdx + 1;
        if (nonTypeableMap[nextIndex]) {
          nextIndex = getNextTypeableIndex(nextIndex);
        } else {
          let autoSpaces = 0;
          while (target[nextIndex + autoSpaces] === ' ') {
            autoSpaces++;
          }
          if (autoSpaces > 0) {
            for (let i = 0; i < autoSpaces; i++) {
              newHistory.push({
                char: ' ',
                isCorrect: true,
                expected: ' ',
                isAutoIndented: true,
                fromIdx: nextIndex + i
              });
            }
            nextIndex += autoSpaces;
          }
        }

        nextIndex = advanceCursorOverAutoClosed(target, nextIndex, newHistory, nonTypeableMap, getNextTypeableIndex);
        setTypedChars(newHistory);
        setCurrentIndex(nextIndex);
        return;
      }

      // If user pressed Enter when expectedChar is NOT '\n' (e.g. wants to advance to next line):
      // Cleanly complete remainder of this line without corrupting text or inserting error newlines!
      const nextNewlineIdx = target.indexOf('\n', currentIdx);
      if (nextNewlineIdx !== -1) {
        sounds.playKeyClick();
        const newHistory = [...history];

        for (let k = currentIdx; k < nextNewlineIdx; k++) {
          if (!nonTypeableMap[k] && !newHistory.some((h) => h.fromIdx === k)) {
            newHistory.push({
              char: target[k],
              isCorrect: true,
              expected: target[k],
              fromIdx: k
            });
          }
        }

        newHistory.push({
          char: '\n',
          isCorrect: true,
          expected: '\n',
          fromIdx: nextNewlineIdx
        });

        let nextIndex = nextNewlineIdx + 1;
        if (nonTypeableMap[nextIndex]) {
          nextIndex = getNextTypeableIndex(nextIndex);
        } else {
          let autoSpaces = 0;
          while (target[nextIndex + autoSpaces] === ' ') {
            autoSpaces++;
          }
          if (autoSpaces > 0) {
            for (let i = 0; i < autoSpaces; i++) {
              newHistory.push({
                char: ' ',
                isCorrect: true,
                expected: ' ',
                isAutoIndented: true,
                fromIdx: nextIndex + i
              });
            }
            nextIndex += autoSpaces;
          }
        }

        nextIndex = advanceCursorOverAutoClosed(target, nextIndex, newHistory, nonTypeableMap, getNextTypeableIndex);
        setTypedChars(newHistory);
        setCurrentIndex(nextIndex);

        if (nextIndex >= target.length) {
          setIsCompleted(true);
          setEndTime(Date.now());
          sounds.playExamComplete();
          if (onFinish) onFinish();
        }
        return;
      }
    }

    // 4. TAB KEY HANDLING (Indentation)
    if (e.key === 'Tab') {
      e.preventDefault();
      if (expectedChar === ' ') {
        let spacesCount = 0;
        while (target[currentIdx + spacesCount] === ' ' && spacesCount < 4) {
          spacesCount++;
        }
        if (spacesCount > 0) {
          const newEntries = [];
          for (let s = 0; s < spacesCount; s++) {
            newEntries.push({
              char: ' ',
              isCorrect: true,
              expected: ' ',
              fromIdx: currentIdx + s
            });
          }
          const updatedHistory = [...history, ...newEntries];
          let nextIdx = advanceCursorOverAutoClosed(
            target,
            currentIdx + spacesCount,
            updatedHistory,
            nonTypeableMap,
            getNextTypeableIndex
          );

          const nextStreak = currentStreak + spacesCount;
          setTypedChars(updatedHistory);
          setCurrentIndex(nextIdx);
          setStreak(nextStreak);
          if (nextStreak > currentMax) setMaxStreak(nextStreak);
          sounds.playKeyClick();
          checkComboMilestone(nextStreak);

          if (nextIdx >= target.length) {
            setIsCompleted(true);
            setEndTime(Date.now());
            sounds.playExamComplete();
            if (onFinish) onFinish();
          }
          return;
        }
      }
    }

    // Standard character key
    let inputChar = e.key;
    if (inputChar.length > 1) return;

    // 5. HABIT STEP-OVER FOR CLOSING DELIMITERS
    const CLOSING_DELIMITERS = [')', ']', '}', '>'];
    if (CLOSING_DELIMITERS.includes(inputChar)) {
      if (expectedChar !== inputChar) {
        let checkIdx = currentIdx - 1;
        while (checkIdx >= 0 && (target[checkIdx] === ' ' || target[checkIdx] === '\t')) {
          checkIdx--;
        }
        if (checkIdx >= 0 && target[checkIdx] === inputChar) {
          const wasAutoClosed = history.some(
            (h) => h.fromIdx === checkIdx && h.isAutoClosed && h.char === inputChar
          );
          if (wasAutoClosed) {
            sounds.playKeyClick();
            return;
          }
        }
      }
    }

    // 6. OPTIONAL BRACE TOLERANCE
    // If user types '{' at control header (after ')', 'else', etc.) when target has no brace:
    if (inputChar === '{' && expectedChar !== '{') {
      if (expectedChar === ' ' && target[currentIdx + 1] === '{') {
        history.push({
          char: ' ',
          isCorrect: true,
          expected: ' ',
          isAutoIndented: true,
          fromIdx: currentIdx
        });
        currentIdx++;
        expectedChar = target[currentIdx];
      } else {
        let prevIdx = currentIdx - 1;
        while (prevIdx >= 0 && (target[prevIdx] === ' ' || target[prevIdx] === '\t' || target[prevIdx] === '\n')) {
          prevIdx--;
        }
        const prevChar = prevIdx >= 0 ? target[prevIdx] : '';
        if (prevChar === ')' || prevChar === 'e' || prevChar === '>' || expectedChar === '\n' || expectedChar === ' ') {
          sounds.playKeyClick();
          return;
        }
      }
    }

    // Harmless closing brace '}' for optional blocks:
    if (inputChar === '}' && expectedChar !== '}') {
      sounds.playKeyClick();
      return;
    }

    // 7. FLEXIBLE WHITESPACE TOLERANCE
    // A. Target expects space(s), but user typed the next character directly
    if (expectedChar === ' ' && inputChar !== ' ') {
      let skipSpaces = 0;
      while (currentIdx + skipSpaces < target.length && target[currentIdx + skipSpaces] === ' ') {
        skipSpaces++;
      }
      if (currentIdx + skipSpaces < target.length) {
        const nextChar = target[currentIdx + skipSpaces];
        const isNextLetter = /[a-zA-Z]/.test(nextChar);
        const isInputLetter = /[a-zA-Z]/.test(inputChar);
        if (inputChar === nextChar || (isInputLetter && isNextLetter && inputChar.toLowerCase() === nextChar.toLowerCase())) {
          for (let s = 0; s < skipSpaces; s++) {
            history.push({
              char: ' ',
              isCorrect: true,
              expected: ' ',
              isAutoIndented: true,
              fromIdx: currentIdx + s
            });
          }
          currentIdx += skipSpaces;
          expectedChar = target[currentIdx];
        }
      }
    }
    // B. User typed space where target has none (harmless extra space)
    if (inputChar === ' ' && expectedChar !== ' ') {
      sounds.playKeyClick();
      return;
    }


    // 8. CASE-INSENSITIVE MATCHING FOR VARIABLES AND LETTERS
    const isInputLetter = /[a-zA-Z]/.test(inputChar);
    const isExpectedLetter = /[a-zA-Z]/.test(expectedChar);
    const isCaseMatch = isInputLetter && isExpectedLetter && inputChar.toLowerCase() === expectedChar.toLowerCase();
    const isMatch = inputChar === expectedChar || isCaseMatch;

    if (isMatch) {
      sounds.playKeyClick();
      const nextStreak = currentStreak + 1;
      const nextMax = Math.max(currentMax, nextStreak);
      setStreak(nextStreak);
      setMaxStreak(nextMax);
      checkComboMilestone(nextStreak);

      const newHistory = [
        ...history,
        {
          char: expectedChar, // Preserve valid expected case for clean Java code
          isCorrect: true,
          expected: expectedChar,
          fromIdx: currentIdx
        }
      ];

      // AUTO-CLOSE DELIMITERS
      if (['(', '[', '{', '<'].includes(inputChar)) {
        const closeIdx = findMatchingCloseIndex(target, inputChar, currentIdx + 1);
        if (closeIdx !== -1) {
          const closeChar = BRACKET_PAIRS[inputChar];
          newHistory.push({
            char: closeChar,
            isCorrect: true,
            expected: closeChar,
            fromIdx: closeIdx,
            isAutoClosed: true,
            linkedOpenIdx: currentIdx
          });
        }
      }

      let nextIndex = currentIdx + 1;

      nextIndex = advanceCursorOverAutoClosed(
        target,
        nextIndex,
        newHistory,
        nonTypeableMap,
        getNextTypeableIndex
      );

      setTypedChars(newHistory);
      setCurrentIndex(nextIndex);

      if (nextIndex >= target.length) {
        setIsCompleted(true);
        setEndTime(Date.now());
        sounds.playExamComplete();
        if (onFinish) onFinish();
      }
    } else {
      // Real typo / error
      sounds.playErrorSound();
      setStreak(0);
      setTotalErrors(errors + 1);

      const newHistory = [
        ...history,
        {
          char: inputChar,
          isCorrect: false,
          expected: expectedChar,
          fromIdx: currentIdx
        }
      ];

      let nextIndex = currentIdx + 1;
      nextIndex = advanceCursorOverAutoClosed(
        target,
        nextIndex,
        newHistory,
        nonTypeableMap,
        getNextTypeableIndex
      );

      setTypedChars(newHistory);
      setCurrentIndex(nextIndex);

      if (nextIndex >= target.length) {
        setIsCompleted(true);
        setEndTime(Date.now());
        sounds.playExamComplete();
        if (onFinish) onFinish();
      }
    }
  }, [checkComboMilestone, getNextTypeableIndex, onFinish, onFirstKey]);

  // Handle clipboard paste
  const handlePasteText = useCallback((pastedText) => {
    if (!pastedText) return;
    const {
      currentIndex: idx,
      typedChars: history,
      normalized: target,
      isNonTypeableChar: nonTypeableMap,
      streak: currentStreak,
      maxStreak: currentMax
    } = stateRef.current;

    let currentIdx = idx;
    const newHistory = [...history];
    let matchedCount = 0;

    for (let i = 0; i < pastedText.length; i++) {
      if (currentIdx >= target.length) break;
      const pChar = pastedText[i];
      if (pChar === '\r') continue;

      const expected = target[currentIdx];
      if (pChar === expected) {
        newHistory.push({
          char: pChar,
          isCorrect: true,
          expected,
          fromIdx: currentIdx
        });

        // Auto-close if pasted text contains opening bracket
        if (['(', '[', '{', '<'].includes(pChar)) {
          const closeIdx = findMatchingCloseIndex(target, pChar, currentIdx + 1);
          if (closeIdx !== -1) {
            const closeChar = BRACKET_PAIRS[pChar];
            if (!newHistory.some((h) => h.fromIdx === closeIdx)) {
              newHistory.push({
                char: closeChar,
                isCorrect: true,
                expected: closeChar,
                fromIdx: closeIdx,
                isAutoClosed: true,
                linkedOpenIdx: currentIdx
              });
            }
          }
        }

        matchedCount++;
        currentIdx++;
        currentIdx = advanceCursorOverAutoClosed(
          target,
          currentIdx,
          newHistory,
          nonTypeableMap,
          getNextTypeableIndex
        );
      }
    }

    if (matchedCount > 0) {
      sounds.playKeyClick();
      setTypedChars(newHistory);
      setCurrentIndex(currentIdx);
      const nextStreak = currentStreak + matchedCount;
      setStreak(nextStreak);
      setMaxStreak(Math.max(currentMax, nextStreak));
    }
  }, [getNextTypeableIndex]);

  // Autocomplete batch insert helper for IntelliSense
  const handleInsertText = useCallback((text) => {
    if (!text) return;
    const {
      currentIndex: idx,
      typedChars: history,
      normalized: target,
      isNonTypeableChar: nonTypeableMap,
      streak: currentStreak,
      maxStreak: currentMax
    } = stateRef.current;

    if (!target || idx >= target.length) return;

    let currentIdx = idx;
    const newHistory = [...history];
    let insertedCount = 0;

    for (let i = 0; i < text.length; i++) {
      if (currentIdx >= target.length) break;
      const ch = text[i];
      let expected = target[currentIdx];

      // If expected is space and ch is not, auto-fill space
      if (expected === ' ' && ch !== ' ') {
        newHistory.push({
          char: ' ',
          isCorrect: true,
          expected: ' ',
          isAutoIndented: true,
          fromIdx: currentIdx
        });
        currentIdx++;
        expected = target[currentIdx];
      }

      // Check case-insensitive match
      const isInputLetter = /[a-zA-Z]/.test(ch);
      const isExpectedLetter = /[a-zA-Z]/.test(expected);
      const isCaseMatch = isInputLetter && isExpectedLetter && ch.toLowerCase() === expected.toLowerCase();
      const isMatch = ch === expected || isCaseMatch;

      if (isMatch) {
        newHistory.push({
          char: expected,
          isCorrect: true,
          expected,
          fromIdx: currentIdx
        });

        // Auto-close if ch is opener
        if (['(', '[', '{', '<'].includes(ch)) {
          const closeIdx = findMatchingCloseIndex(target, ch, currentIdx + 1);
          if (closeIdx !== -1) {
            const closeChar = BRACKET_PAIRS[ch];
            if (!newHistory.some((h) => h.fromIdx === closeIdx)) {
              newHistory.push({
                char: closeChar,
                isCorrect: true,
                expected: closeChar,
                fromIdx: closeIdx,
                isAutoClosed: true,
                linkedOpenIdx: currentIdx
              });
            }
          }
        }

        insertedCount++;
        currentIdx++;
        currentIdx = advanceCursorOverAutoClosed(
          target,
          currentIdx,
          newHistory,
          nonTypeableMap,
          getNextTypeableIndex
        );
      } else {
        // If user is typing closing delimiter and it's already auto-closed right here
        if ([')', ']', '}', '>'].includes(ch)) {
          const alreadyClosed = newHistory.find(
            (h) => h.fromIdx === currentIdx && h.isAutoClosed && h.char === ch
          );
          if (alreadyClosed) {
            currentIdx++;
            currentIdx = advanceCursorOverAutoClosed(
              target,
              currentIdx,
              newHistory,
              nonTypeableMap,
              getNextTypeableIndex
            );
            continue;
          }
        }
        // If mismatch and not auto-closed, stop inserting
        break;
      }
    }

    if (insertedCount > 0) {
      sounds.playKeyClick();
      setTypedChars(newHistory);
      setCurrentIndex(currentIdx);
      const nextStreak = currentStreak + insertedCount;
      setStreak(nextStreak);
      if (nextStreak > currentMax) setMaxStreak(nextStreak);
      checkComboMilestone(nextStreak);

      stateRef.current.currentIndex = currentIdx;
      stateRef.current.typedChars = newHistory;
      stateRef.current.streak = nextStreak;

      if (currentIdx >= target.length) {
        setIsCompleted(true);
        setEndTime(Date.now());
        sounds.playExamComplete();
        if (onFinish) onFinish();
      }
    }
  }, [checkComboMilestone, getNextTypeableIndex, onFinish]);

  const textBeforeCursor = typedChars.map((c) => c.char).join('');

  // Real-time Analytics
  const nowTime = endTime || Date.now();
  const elapsedMinutes = startTime ? Math.max(0.01, (nowTime - startTime) / 60000) : 0.01;
  const correctCount = typedChars.filter((c) => c.isCorrect).length;
  const totalTyped = typedChars.length;

  const wpm = hasStarted ? Math.round((correctCount / 5) / elapsedMinutes) : 0;
  const cpm = hasStarted ? Math.round(correctCount / elapsedMinutes) : 0;
  const accuracy = totalTyped > 0 ? Math.max(0, Math.round(((totalTyped - totalErrors) / totalTyped) * 100)) : 100;
  const progressPercent = totalTypeable > 0 ? Math.min(100, Math.round((correctCount / totalTypeable) * 100)) : 0;

  // Combo multiplier
  let comboMultiplier = 1;
  let comboTierName = 'COMBO x1';
  let comboColor = 'var(--pastel-lavender)';

  if (streak >= 100) {
    comboMultiplier = 4;
    comboTierName = 'MEGA FRENZY x4';
    comboColor = 'var(--pastel-peach)';
  } else if (streak >= 50) {
    comboMultiplier = 3;
    comboTierName = 'SUPER x3';
    comboColor = 'var(--pastel-honey)';
  } else if (streak >= 25) {
    comboMultiplier = 2;
    comboTierName = 'RITMO x2';
    comboColor = 'var(--pastel-mint)';
  } else if (streak >= 10) {
    comboMultiplier = 1.5;
    comboTierName = 'COMBO x1.5';
    comboColor = 'var(--pastel-lavender)';
  }

  const closingStack = typedChars
    .filter((e) => e.isAutoClosed && e.fromIdx >= currentIndex)
    .map((e) => ({ char: e.char, openIdx: e.linkedOpenIdx, closeIdx: e.fromIdx }));

  return {
    targetCode: normalized,
    parsedStructure: parsed,
    typedChars,
    textBeforeCursor,
    currentIndex,
    closingStack,
    outlineFunctions,
    totalErrors,
    streak,
    maxStreak,
    isCompleted,
    hasStarted,
    wpm,
    cpm,
    accuracy,
    progressPercent,
    comboMultiplier,
    comboTierName,
    comboColor,
    comboEvent,
    handleKeyDown,
    handlePasteText,
    handleInsertText,
    jumpToIndex,
    resetEngine
  };
}
