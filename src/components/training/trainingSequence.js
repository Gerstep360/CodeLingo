export const INTRO_CHAPTERS = {
  welcome: null,
  'meaning-from-zero': 'chapter1_meaning', vocabulary: 'chapter2_words',
  'concrete-example': 'chapter3_example', 'plan-before-code': 'chapter4_plan',
  'line-by-line': 'chapter5_lineByLine', 'full-code-explained': 'chapter6_fullCode',
  'base-recap': 'step1_baseRecap', 'variant-goal': 'step2_newGoal',
  'what-stays': 'step3_whatStays', 'delta-explained': 'step4_change',
  'worked-example': 'step5_workedExample', 'base-vs-variant': 'step6_compareCode',
  'build-from-base': 'step7_buildTogether',
};

export function stageKind(stage) {
  if (Object.hasOwn(INTRO_CHAPTERS, stage) || stage === 'observe') return 'observe';
  if (stage === 'manual-trace') return 'trace';
  if (['guided-copy', 'guided-rebuild', 'guided-typing'].includes(stage)) return 'guided-typing';
  if (['ghost-30', 'ghost-60', 'ghost-code'].includes(stage)) return 'ghost-code';
  return stage;
}

export { codeTokens, sameCode, normalizeTokens, findCodeMismatch } from '../../learning/javaComparison.js';

// ============================================================
// PASOS QUE SE CONSIDERAN "PURE-OBSERVE" (lectura pasiva)
// ============================================================
const OBSERVE_STEPS = new Set([
  'meaning-from-zero', 'concrete-example', 'plan-before-code',
  'line-by-line', 'full-code-explained', 'vocabulary',
  'base-recap', 'variant-goal', 'what-stays', 'delta-explained',
  'worked-example', 'base-vs-variant', 'build-from-base', 'observe',
]);

// Pasos de escritura asistida (con referencia visible)
const ASSISTED_WRITING = new Set(['guided-copy', 'guided-rebuild', 'guided-typing']);

/**
 * Construye la secuencia adaptativa de pasos para una leccion.
 *
 * Reglas:
 *  mastery === 0  -> Primer encuentro: secuencia completa.
 *  mastery >= 0.3 -> Ya vio el codigo antes: omite todos los observe pasivos, empieza en guided-copy.
 *  mastery >= 0.55-> Conoce la estructura: omite guided-copy, empieza en fill-token / fill-line.
 *  mastery >= 0.85-> Dominado: solo recall + speedrun.
 *
 * @param {object} lesson - El objeto de leccion con trainingSequence y code.
 * @param {number} mastery - Nivel actual de dominio [0,1].
 * @returns {Array<{id, kind, key}>}
 */
export function getSequence(lesson, mastery = 0) {
  if (!Array.isArray(lesson?.trainingSequence) || !lesson.trainingSequence.length) return [];

  let sequence = lesson.typingEnabled === false
    ? lesson.trainingSequence.filter(id => ['observe', 'trace', 'recognize'].includes(stageKind(id)))
    : lesson.trainingSequence;

  // Sin codigo target -> solo pasos pasivos
  if (!lesson.code?.target) {
    sequence = sequence.filter(id => OBSERVE_STEPS.has(id) || stageKind(id) === 'observe');
  } else if (mastery >= 0.85) {
    // Ya lo domina: ir directo a recall + speedrun si existen en la secuencia original
    const hasRecall = sequence.includes('recall');
    const hasSpeedrun = sequence.includes('speedrun');
    if (hasRecall || hasSpeedrun) {
      sequence = [
        ...(hasRecall ? ['recall'] : []),
        ...(hasSpeedrun ? ['speedrun'] : []),
      ];
    }
  } else if (mastery >= 0.55) {
    // Sabe la estructura: omite observe y assisted-writing, empieza en fill-token/fill-line
    sequence = sequence.filter(id => {
      if (OBSERVE_STEPS.has(id)) return false;
      if (ASSISTED_WRITING.has(stageKind(id))) return false;
      return true;
    });
    if (!sequence.length) sequence = ['recall'];
  } else if (mastery >= 0.3) {
    // Conoce algo: omite todos los pasos pasivos de introduccion
    sequence = sequence.filter(id => !OBSERVE_STEPS.has(id));
    if (!sequence.length) sequence = ['guided-copy', 'recall'];
  }
  // mastery < 0.3 -> secuencia completa (sin cambios)

  return sequence.map((id, index) => ({ id, kind: stageKind(id), key: `${index}:${id}` }));
}

/**
 * Dado el resultado de un paso ya completado, determina si el siguiente paso
 * es redundante y puede saltarse por rendimiento en sesion.
 *
 * Un paso se salta si el paso anterior era escritura asistida perfecta (0 errores,
 * 0 pistas, accuracy >= 0.98) y el siguiente es la misma categoria o mas facil.
 *
 * @param {object} completedResult - Resultado del paso recien completado.
 * @param {{id, kind}} nextStage - El proximo paso en la secuencia.
 * @returns {boolean} true si se debe saltar el siguiente paso.
 */
export function shouldSkipNext(completedResult, nextStage) {
  if (!completedResult?.correct) return false;
  if (!nextStage) return false;

  const wasPerfect = (
    (completedResult.hintsUsed || 0) === 0 &&
    (completedResult.criticalMistakes || 0) === 0 &&
    (completedResult.accuracy ?? 1) >= 0.98
  );

  if (!wasPerfect) return false;

  const completedKind = completedResult.kind || '';
  const nextKind = nextStage.kind;

  // guided-typing perfecto -> saltar fill-token y fill-line (son lo mismo con menos ayuda)
  if (ASSISTED_WRITING.has(completedKind) && (nextKind === 'fill-token' || nextKind === 'fill-line')) return true;

  // fill-token perfecto -> saltar fill-line
  if (completedKind === 'fill-token' && nextKind === 'fill-line') return true;

  return false;
}
