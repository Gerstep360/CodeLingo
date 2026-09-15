// ==============================================================================
// CODELINGO — CARGADOR AUTOMÁTICO DE CONTENIDO (FASE 5)
// ==============================================================================
// Descubre dinámicamente todo el contenido modular JSON en /src/content/ia-vargas/
// usando import.meta.glob de Vite, valida integridad y arma el árbol normalizado.
// ==============================================================================

// Carga eagerly todos los archivos JSON del directorio primer-parcial
const jsonModules = import.meta.glob('/src/content/primer-parcial/**/*.json', {
  eager: true,
  import: 'default'
});

/**
 * Normaliza y valida el contenido de IA-Vargas para el Primer Parcial.
 */
function buildContentTree() {
  let courseData = null;
  const classesMap = new Map();
  const allJsonById = new Map();
  const duplicates = [];

  // 1. Clasificación inicial por rutas
  for (const [path, data] of Object.entries(jsonModules)) {
    if (!data || typeof data !== 'object') continue;

    // Registrar ID único y validar duplicados (ignorando templates)
    if (!path.includes('/templates/') && data.id) {
      if (allJsonById.has(data.id)) {
        duplicates.push({ id: data.id, path1: allJsonById.get(data.id).path, path2: path });
      } else {
        allJsonById.set(data.id, { data, path });
      }
    }

    // Detectar course.json
    if (path.endsWith('/course.json')) {
      courseData = data;
      continue;
    }

    // Ignorar plantillas
    if (path.includes('/templates/')) {
      continue;
    }

    // Identificar clase contenedora: /src/content/primer-parcial/<dirName>/...
    const match = path.match(/\/(?:primer-parcial|ia-vargas)\/([^/]+)\/(.+)$/);
    if (!match) continue;

    const [, dirName, subPath] = match;

    if (!classesMap.has(dirName)) {
      classesMap.set(dirName, {
        dirName,
        classData: null,
        baseData: null,
        shared: [],
        variants: [],
        rawFiles: {}
      });
    }

    const classEntry = classesMap.get(dirName);
    classEntry.rawFiles[subPath] = data;

    if (subPath === 'class.json') {
      classEntry.classData = data;
    } else if (subPath === 'base.json') {
      classEntry.baseData = data;
    } else if (subPath.startsWith('shared/')) {
      classEntry.shared.push(data);
    } else if (subPath.startsWith('exercises/')) {
      classEntry.variants.push(data);
    }
  }

  if (duplicates.length > 0 && import.meta.env.DEV) {
    console.error(' [ContentLoader] IDs duplicados encontrados en el contenido:', duplicates);
  }

  // 2. Construir clases ordenadas
  const normalizedClasses = [];

  for (const [dirName, entry] of classesMap.entries()) {
    const classInfo = entry.classData || {
      id: dirName,
      title: dirName,
      shortTitle: dirName,
      order: 99
    };

    const base = entry.baseData;
    if (!base && import.meta.env.DEV) {
      console.warn(` [ContentLoader] La clase en "${dirName}" no tiene base.json canónico.`);
    }

    // Ordenar variantes: por 'order' si existe o por título
    const sortedVariants = entry.variants.sort((a, b) => {
      const orderA = typeof a.order === 'number' ? a.order : 99;
      const orderB = typeof b.order === 'number' ? b.order : 99;
      if (orderA !== orderB) return orderA - orderB;
      return (a.title || '').localeCompare(b.title || '');
    });

    normalizedClasses.push({
      ...classInfo,
      dirName,
      id: classInfo.id || dirName,
      order: classInfo.order ?? 99,
      title: classInfo.title || dirName,
      shortTitle: classInfo.shortTitle || classInfo.title || dirName,
      icon: classInfo.icon || 'code',
      color: classInfo.color || 'blue',
      objective: classInfo.objective || '',
      mentalModel: classInfo.mentalModel || { phrase: '', corePattern: '' },
      base,
      shared: entry.shared,
      variants: sortedVariants,
      exam: classInfo.classExam || classInfo.exam || { enabled: true, randomOrder: true, timeLimitSeconds: 300 }
    });
  }

  // Ordenar clases según su campo order
  normalizedClasses.sort((a, b) => a.order - b.order);

  return {
    course: courseData || {
      id: 'ia-vargas-primer-parcial',
      parcial: 1,
      title: 'IA — Primer Parcial: Algoritmos Canónicos Vargas',
      classes: normalizedClasses.map((c) => c.dirName)
    },
    classes: normalizedClasses
  };
}

// Estructura en memoria lista y evaluada
export const contentTree = buildContentTree();

/**
 * Obtiene todas las clases normalizadas del curso (las 7 de Primer Parcial).
 */
export function getClasses() {
  return contentTree.classes;
}

/**
 * Busca una clase por su ID.
 */
export function getClassById(classId) {
  return contentTree.classes.find((c) => c.id === classId || c.dirName === classId) || null;
}

/**
 * Busca un algoritmo especifico (base, variante o auxiliar shared) por su ID.
 */
export function getAlgorithmById(algorithmId) {
  for (const c of contentTree.classes) {
    if (c.base && c.base.id === algorithmId) {
      return { ...c.base, classId: c.id, className: c.title, isBase: true };
    }
    const foundVar = c.variants.find((v) => v.id === algorithmId);
    if (foundVar) {
      return { ...foundVar, classId: c.id, className: c.title, isBase: false };
    }
    // Tambien buscar en auxiliares (shared/)
    const foundShared = (c.shared || []).find((s) => s.id === algorithmId);
    if (foundShared) {
      return { ...foundShared, classId: c.id, className: c.title, isBase: false, isShared: true };
    }
  }
  return null;
}

/**
 * Devuelve todos los algoritmos del curso en lista plana (incluye auxiliares shared).
 */
export function getAllAlgorithms() {
  const result = [];
  for (const c of contentTree.classes) {
    // Auxiliares primero (se muestran al inicio del selector)
    for (const s of (c.shared || [])) {
      if (s.code?.target) {
        result.push({ ...s, classId: c.id, className: c.title, isBase: false, isShared: true });
      }
    }
    if (c.base) {
      result.push({ ...c.base, classId: c.id, className: c.title, isBase: true });
    }
    for (const v of c.variants) {
      result.push({ ...v, classId: c.id, className: c.title, isBase: false });
    }
  }
  return result;
}
