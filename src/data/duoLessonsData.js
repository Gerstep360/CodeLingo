// ==============================================================================
// RE-EXPORT DE COMPATIBILIDAD — CODELINGO VARGAS MODE (FASE 6)
// ==============================================================================
// Las 7 unidades oficiales del Primer Parcial se alimentan automáticamente
// de la nueva arquitectura JSON canónica en 'src/content/ia-vargas/'
// a través del adaptador de currículo.
// ==============================================================================

export {
  DUO_UNITS,
  getAllNodes,
  getNodeById,
  getUnitById,
  isFinalExamNode,
  getNodeLockStatus
} from '../content/curriculumAdapter';

export {
  DUO_FLASH_QUIZ_QUESTIONS,
  DUO_RECOVERY_PHRASES,
  DUO_GOLDEN_TABLE
} from './curriculum';
