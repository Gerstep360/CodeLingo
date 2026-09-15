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

export function getSequence(lesson) {
  if (!Array.isArray(lesson?.trainingSequence) || !lesson.trainingSequence.length) return [];
  const sequence = lesson.typingEnabled === false ? lesson.trainingSequence.filter(id => ['observe', 'trace', 'recognize'].includes(stageKind(id))) : lesson.trainingSequence;
  return sequence.map((id, index) => ({ id, kind: stageKind(id), key: `${index}:${id}` }));
}
