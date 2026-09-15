import { useRef, useState } from 'react';
import { codeTokens } from '../components/training/trainingSequence';

function isTokenExpected(token, expectedTokens, searchIndex) {
  // Allow harmless structural Java tokens (braces on control blocks, public modifier)
  if (token === '{' || token === '}' || token === 'public') return true;

  const minIdx = Math.max(0, searchIndex - 5);
  const maxIdx = Math.min(expectedTokens.length - 1, searchIndex + 5);

  for (let k = minIdx; k <= maxIdx; k++) {
    const exp = expectedTokens[k];
    if (!exp) continue;
    if (exp === token) return true;
    if (exp.toLowerCase() === token.toLowerCase()) return true;
    if (/^[A-Za-z_$][\w$]*$/.test(token) && exp.toLowerCase().startsWith(token.toLowerCase())) return true;
  }
  return false;
}

export function useTrainingTyping(target, options = null) {
  const storageKey = typeof options === 'string'
    ? options
    : options?.draftKey || (options?.lessonId ? `vargas_code_draft_${options.lessonId}_${options.stageId || 'default'}` : null);

  const [value, setValue] = useState(() => {
    if (!storageKey) return '';
    try {
      return localStorage.getItem(storageKey) || '';
    } catch {
      return '';
    }
  });

  const tracking = useRef({
    start: null,
    inserted: 0,
    errors: 0,
    previous: value || '',
    pasted: false
  });

  function change(next, { generated = false } = {}) {
    const state = tracking.current;
    if (state.start === null && next.length) state.start = performance.now();
    const before = codeTokens(state.previous);
    const after = codeTokens(next);
    const expected = codeTokens(target);
    let left = 0;
    while (left < before.length && left < after.length && before[left] === after[left]) left++;
    let right = 0;
    while (right < before.length - left && right < after.length - left && before[before.length - 1 - right] === after[after.length - 1 - right]) right++;
    const added = after.slice(left, after.length - right);
    state.inserted += generated ? 0 : added.length;
    state.errors += generated ? 0 : added.filter((token, i) => !isTokenExpected(token, expected, left + i)).length;
    state.previous = next;
    setValue(next);

    if (storageKey) {
      try {
        if (next) {
          localStorage.setItem(storageKey, next);
        } else {
          localStorage.removeItem(storageKey);
        }
      } catch {}
    }
  }

  function metrics() {
    const state = tracking.current;
    const seconds = state.start === null ? 0 : (performance.now() - state.start) / 1000;
    return {
      accuracy: state.inserted ? Math.max(0, 1 - state.errors / state.inserted) : 0,
      mistakes: state.errors,
      elapsedSeconds: seconds,
      cpm: seconds ? Math.round(value.length * 60 / seconds) : 0,
      pasted: state.pasted
    };
  }

  function clearDraft() {
    if (storageKey) {
      try { localStorage.removeItem(storageKey); } catch {}
    }
  }

  function reset() {
    clearDraft();
    tracking.current = { start: null, inserted: 0, errors: 0, previous: '', pasted: false };
    setValue('');
  }

  return { value, change, metrics, reset, clearDraft, tracking };
}


