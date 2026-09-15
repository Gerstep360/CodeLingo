// ==============================================================================
// CODELINGO — ADAPTADOR DE COMPATIBILIDAD DE CURRÍCULO (FASE 6)
// ==============================================================================
// Transforma el árbol JSON normalizado de contentLoader (7 clases Primer Parcial)
// en la estructura consumida por DuoLearningPath, DuoLessonRunner y App.jsx.
// ==============================================================================

import { contentTree, getClasses, getAlgorithmById } from './contentLoader';

// Paleta Duolingo oficial para cada una de las 7 clases (DUOLINGO_UI_UX_SPEC)
const CLASS_COLORS = {
  '01-sumandos': '#58CC02',      // Feather Green
  '02-factores': '#1CB0F6',      // Macaw Blue
  '03-mochila': '#FF9600',       // Fox Orange
  '04-combinaciones': '#00CD9C', // Emerald
  '05-permutaciones': '#CE82FF', // Beetle Purple
  '06-determinante': '#FF4B4B',  // Cardinal Red
  '07-submatrices': '#2B70C9'    // Humpback Deep Blue
};

/**
 * Genera ejercicios interactivos estilo Duolingo a partir de la data JSON del algoritmo.
 */
function buildExercisesForAlgorithm(algo, classData, isBase = false) {
  const exercises = [];

  // 1. Si el JSON incluye microDrills (como los mejorados por el usuario)
  if (Array.isArray(algo.microDrills) && algo.microDrills.length > 0) {
    algo.microDrills.forEach((drill, idx) => {
      if (drill.type === 'contrast' || drill.type === 'choice') {
        const distractors = ['i', 'k', '0', 'L.size()', 'k + 1', 'false'].filter(
          (d) => d !== drill.answer
        );
        exercises.push({
          type: 'choice',
          question: drill.prompt,
          options: [
            { text: drill.answer, isCorrect: true },
            { text: distractors[0] || 'Ninguno', isCorrect: false },
            { text: distractors[1] || 'Ambos', isCorrect: false }
          ],
          explanation: `Respuesta correcta: ${drill.answer}`
        });
      } else if (drill.type === 'fill-line' || drill.type === 'fill-token') {
        exercises.push({
          type: 'code_blank',
          question: drill.prompt,
          options: [
            { text: drill.answer, isCorrect: true },
            { text: '// línea omitida', isCorrect: false },
            { text: 'return;', isCorrect: false }
          ],
          explanation: `Línea canónica exacta: ${drill.answer}`
        });
      }
    });
  }

  // 2. Pregunta basada en la Regla de Oro
  if (algo.logic?.goldenRule) {
    exercises.push({
      type: 'choice',
      question: `¿Cuál es la REGLA DE ORO de ${algo.title || algo.shortTitle}?`,
      options: [
        { text: algo.logic.goldenRule, isCorrect: true },
        { text: 'Recorrer la lista en orden descendente.', isCorrect: false },
        { text: 'Reiniciar la memoria en cada nivel recursivo.', isCorrect: false }
      ],
      explanation: algo.logic.idea || algo.logic.goldenRule
    });
  }

  // 3. Preguntas basadas en Deltas (para variantes)
  if (Array.isArray(algo.logic?.delta) && algo.logic.delta.length > 0) {
    algo.logic.delta.forEach((d) => {
      const questionText = d.reason
        ? `¿Por qué se aplica este cambio en ${algo.title}? "${d.reason}"`
        : `¿Cuál es el cambio clave en ${algo.title} respecto a la base?`;

      const correctText = d.after
        ? `${d.before ? `${d.before}  →  ` : ''}${d.after}`
        : d.reason;

      exercises.push({
        type: 'choice',
        question: questionText,
        options: [
          { text: correctText, isCorrect: true },
          { text: 'Se mantiene idéntico a la base sin modificaciones.', isCorrect: false },
          { text: 'Se reemplaza por una llamada iterativa con cola.', isCorrect: false }
        ],
        explanation: d.reason || 'Delta canónico del Ingeniero Vargas.'
      });
    });
  }

  // 4. Preguntas basadas en Fragmentos Críticos
  if (Array.isArray(algo.criticalFragments) && algo.criticalFragments.length > 0) {
    algo.criticalFragments.forEach((cf) => {
      exercises.push({
        type: 'code_blank',
        question: `Identifica el fragmento crítico de ${algo.title} (${cf.concept || 'lógica canónica'}):`,
        options: [
          { text: cf.expected, isCorrect: true },
          { text: '// llamada alternativa', isCorrect: false },
          { text: 'L.clear();', isCorrect: false }
        ],
        explanation: cf.errorMessage || `Fragmento esperado: ${cf.expected}`
      });
    });
  }

  // 5. Pregunta de Modelo Mental si existe
  const mentalPhrase = algo.logic?.mentalModel || classData.mentalModel?.phrase;
  if (mentalPhrase && exercises.length < 3) {
    exercises.push({
      type: 'choice',
      question: `¿Cuál es la secuencia mental de ${classData.title}?`,
      options: [
        { text: mentalPhrase, isCorrect: true },
        { text: 'LEER → CALCULAR → IMPRIMIR → RETORNAR', isCorrect: false },
        { text: 'DIVIDIR → ORDENAR → COMBINAR', isCorrect: false }
      ],
      explanation: `Esquema de memoria: ${mentalPhrase}`
    });
  }

  return exercises;
}

/**
 * Transforma el árbol JSON en la lista DUO_UNITS jerárquica para la interfaz.
 */
function buildAdaptedUnits() {
  const classes = getClasses();

  return classes.map((classData, idx) => {
    const classNum = idx + 1;
    const unitColor = CLASS_COLORS[classData.dirName] || classData.color || '#58CC02';
    const base = classData.base;
    const baseNodeId = `node-${classData.id}-base`;

    // 1. Nodo Base
    const baseExercises = base ? buildExercisesForAlgorithm(base, classData, true) : [];
    const baseNode = {
      id: baseNodeId,
      unitId: `unit-${classData.id}`,
      classId: classData.id,
      nodeRole: 'base',
      rawAlgorithmId: base?.id,
      title: `${classData.shortTitle || classData.title} Base`,
      shortDesc: base?.logic?.idea || 'Algoritmo padre canónico',
      icon: 'star',
      xp: 25,
      type: 'class',
      theory: base
        ? {
            title: `${classData.title} — Algoritmo Base`,
            concept: base.logic?.idea || 'Estructura canónica del algoritmo padre.',
            codeExample: base.code?.target || '',
            goldenRule: base.logic?.goldenRule || '',
            anchors: base.logic?.anchors || [],
            mentalModel: classData.mentalModel?.phrase || ''
          }
        : null,
      exercises: baseExercises
    };

    // 2. Nodos Variantes
    const variantNodes = classData.variants.map((v) => {
      const vNodeId = `node-${v.id}`;
      const vExercises = buildExercisesForAlgorithm(v, classData, false);

      return {
        id: vNodeId,
        unitId: `unit-${classData.id}`,
        classId: classData.id,
        nodeRole: 'variant',
        rawAlgorithmId: v.id,
        title: v.title || v.shortTitle,
        shortDesc: v.logic?.idea || v.logic?.goldenRule || 'Variación sobre la base',
        icon: 'sparkles',
        xp: 25,
        type: 'class',
        delta: v.logic?.delta || [],
        compareWithBase: v.compareWithBase || null,
        theory: {
          title: `${classData.title} — ${v.title}`,
          concept: v.logic?.idea || 'Variación respecto al algoritmo base.',
          codeExample: v.code?.target || '',
          goldenRule: v.logic?.goldenRule || '',
          delta: v.logic?.delta || [],
          mentalModel: v.logic?.mentalModel || classData.mentalModel?.phrase || ''
        },
        exercises: vExercises
      };
    });

    // 3. Nodo Speedrun de la Clase
    const speedrunNode = {
      id: `node-${classData.id}-speedrun`,
      unitId: `unit-${classData.id}`,
      classId: classData.id,
      nodeRole: 'speedrun',
      title: ` Speedrun: ${classData.shortTitle || classData.title}`,
      shortDesc: 'Mecanografía rápida de precisión (≥95% WPM objetivo)',
      icon: 'zap',
      xp: 35,
      type: 'speedrun',
      theory: null,
      exercises: [
        {
          type: 'choice',
          question: `Objetivo Speedrun: Reconstruir la familia de ${classData.title} a máxima velocidad manteniendo exactitud canónica. ¿Listo?`,
          options: [
            { text: '¡Comenzar Speedrun de Clase!', isCorrect: true },
            { text: 'Repasar teoría primero', isCorrect: false }
          ],
          explanation: 'La precisión está primero. Luego la velocidad.'
        }
      ]
    };

    // 4. Nodo Examen de la Clase
    const examNode = {
      id: `node-${classData.id}-exam`,
      unitId: `unit-${classData.id}`,
      classId: classData.id,
      nodeRole: 'exam',
      isFinalExam: true,
      title: ` Examen: ${classData.shortTitle || classData.title}`,
      shortDesc: 'Evaluación cronometrada sin pistas de la clase completa',
      icon: 'award',
      xp: 50,
      type: 'final_exam',
      theory: null,
      exercises: [
        {
          type: 'choice',
          question: `Examen Oficial de ${classData.title} (Primer Parcial). Cero pistas, pantalla limpia.`,
          options: [
            { text: 'Iniciar Examen de Clase', isCorrect: true },
            { text: 'Cancelar', isCorrect: false }
          ],
          explanation: 'Examen de clase según especificación canónica.'
        }
      ]
    };

    const allNodesInUnit = [baseNode, ...variantNodes, speedrunNode, examNode];

    return {
      id: `unit-${classData.id}`,
      classId: classData.id,
      dirName: classData.dirName,
      order: classData.order,
      unitIndex: classNum,
      title: `TEMA ${classNum} · ${classData.title.toUpperCase()}`,
      subtitle: classData.objective,
      parcial: 'Primer Parcial',
      color: unitColor,
      badge: `Tema ${classNum} · Parcial 1`,
      mentalModel: classData.mentalModel,
      baseNodeId,
      variantNodeIds: variantNodes.map((v) => v.id),
      speedrunNodeId: speedrunNode.id,
      examNodeId: examNode.id,
      nodes: allNodesInUnit
    };
  });
}

// Unidades adaptadas en memoria
export const DUO_UNITS = buildAdaptedUnits();

// Helper: Obtener todos los nodos en una lista plana
export function getAllNodes() {
  return DUO_UNITS.flatMap((u) => u.nodes);
}

// Helper: Buscar nodo por ID
export function getNodeById(nodeId) {
  return getAllNodes().find((n) => n.id === nodeId) || null;
}

// Helper: Buscar unidad por ID
export function getUnitById(unitId) {
  return DUO_UNITS.find((u) => u.id === unitId || u.classId === unitId) || null;
}

// Helper: Determinar si un nodo es examen
export function isFinalExamNode(node) {
  return Boolean(node?.isFinalExam || node?.type === 'final_exam' || node?.nodeRole === 'exam');
}

/**
 * Reglas de Desbloqueo (FASE 8):
 * 1. Base: Desbloqueado si es Unidad 1 o la unidad anterior completó su base o examen.
 * 2. Variantes: BLOQUEADAS hasta dominar la Base. Al dominar la Base, se desbloquean TODAS en paralelo.
 * 3. Speedrun y Examen: BLOQUEADOS hasta completar la Base Y todas las Variantes de la clase.
 * 4. Siguiente Clase: Desbloqueada tras completar el examen o la base+variantes de la clase actual.
 */
export function getNodeLockStatus(nodeId, completedNodeIds = []) {
  const node = getNodeById(nodeId);
  if (!node) return { isLocked: true, reason: 'Nodo no encontrado' };

  const unit = getUnitById(node.unitId);
  if (!unit) return { isLocked: true, reason: 'Unidad no encontrada' };

  const isCompleted = completedNodeIds.includes(node.id);
  if (isCompleted) {
    return { isLocked: false, isCompleted: true };
  }

  // Verificar si la unidad previa está aprobada (la Unidad 1 siempre está accesible)
  const unitIndex = unit.unitIndex - 1;
  if (unitIndex > 0) {
    const prevUnit = DUO_UNITS[unitIndex - 1];
    const prevUnitExamDone = completedNodeIds.includes(prevUnit.examNodeId);
    const prevUnitBaseDone = completedNodeIds.includes(prevUnit.baseNodeId);
    if (!prevUnitExamDone && !prevUnitBaseDone) {
      return {
        isLocked: true,
        reason: `Debes completar primero el ${prevUnit.title} del Primer Parcial.`
      };
    }
  }

  // Regla 1: Nodo Base
  if (node.nodeRole === 'base') {
    return { isLocked: false, isCompleted: false };
  }

  // Regla 2: Nodos Variantes (bloqueados hasta completar la Base de esta misma clase)
  const isBaseDone = completedNodeIds.includes(unit.baseNodeId);
  if (node.nodeRole === 'variant') {
    if (!isBaseDone) {
      return {
        isLocked: true,
        reason: `Aprende primero el ${unit.title} Base antes de desbloquear sus variantes.`
      };
    }
    // Una vez aprendida la base, las variantes se practican en cualquier orden
    return { isLocked: false, isCompleted: false };
  }

  // Regla 3: Speedrun y Examen de Clase (requieren Base + TODAS las variantes)
  if (node.nodeRole === 'speedrun' || node.nodeRole === 'exam') {
    if (!isBaseDone) {
      return {
        isLocked: true,
        reason: `Debes dominar el Algoritmo Base de ${unit.title}.`
      };
    }
    const missingVariants = unit.variantNodeIds.filter((vId) => !completedNodeIds.includes(vId));
    if (missingVariants.length > 0) {
      return {
        isLocked: true,
        reason: `Completa todas las variantes (${missingVariants.length} pendiente(s)) para desbloquear ${node.title}.`
      };
    }
    return { isLocked: false, isCompleted: false };
  }

  return { isLocked: false, isCompleted: false };
}
