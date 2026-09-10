import examen1Raw from '../assets/AI/Primer Parcial/Examen1.java?raw';
import examenEntrenamientoRaw from '../assets/AI/Primer Parcial/ExamenEntrenamiento.java?raw';

// Helper to extract sections from Examen1.java
function extractSection(fullCode, startComment, endComment) {
  if (!fullCode) return '';
  const startIdx = fullCode.indexOf(startComment);
  if (startIdx === -1) return '';
  if (!endComment) {
    return fullCode.substring(startIdx).trim();
  }
  const endIdx = fullCode.indexOf(endComment, startIdx);
  if (endIdx === -1) return fullCode.substring(startIdx).trim();
  return fullCode.substring(startIdx, endIdx).trim();
}

const sumandosSection = extractSection(
  examen1Raw,
  '// 1. SUMANDOS',
  '// 2. MOCHILA'
);

const mochilaSection = extractSection(
  examen1Raw,
  '// 2. MOCHILA',
  '// 3. COMBINACION SIN REPETICION'
);

const combiPermutSection = extractSection(
  examen1Raw,
  '// 3. COMBINACION SIN REPETICION',
  '// 4. DETERMINANTE GENERICO'
);

const determinanteSection = extractSection(
  examen1Raw,
  '// 4. DETERMINANTE GENERICO',
  '// 5. MOSTRAR UNA SUBMATRIZ'
);

const submatricesSection = extractSection(
  examen1Raw,
  '// 5. MOSTRAR UNA SUBMATRIZ',
  '// MAIN'
);

const mainSection = extractSection(
  examen1Raw,
  '// MAIN',
  ''
);

export const DEFAULT_SNIPPETS = [
  {
    id: 'examen-entrenamiento-completo',
    title: '⭐ ExamenEntrenamiento.java (Con Todas las Consultas C1, C2, C3)',
    fileName: 'ExamenEntrenamiento.java',
    filePath: 'src/assets/AI/Primer Parcial/ExamenEntrenamiento.java',
    category: 'Primer Parcial - Vargas',
    description: 'Archivo completo oficial con todas las consultas (C1, C2, C3) para Sumandos, Factores, Mochila, Combi y Permut.',
    language: 'java',
    code: examenEntrenamientoRaw
  },
  {
    id: 'examen-1-completo',
    title: 'Examen1.java (Primer Parcial - Completo)',
    fileName: 'Examen1.java',
    filePath: 'src/assets/AI/Primer Parcial/Examen1.java',
    category: 'Primer Parcial - Vargas',
    description: 'Archivo oficial Examen1.java (399 líneas) con todos los ejercicios: Sumandos, Factores, Mochila, Combinatoria, Matrices y Main.',
    language: 'java',
    code: examen1Raw
  },
  {
    id: 'examen-1-sumandos-factores',
    title: '1. Sumandos y Factores (Examen1.java)',
    fileName: 'Examen1.java',
    filePath: 'src/assets/AI/Primer Parcial/Examen1.java',
    category: 'Primer Parcial - Vargas',
    description: 'Descomposición en sumandos y factores primos con backtracking recursivo.',
    language: 'java',
    code: sumandosSection || examen1Raw
  },
  {
    id: 'examen-1-mochila',
    title: '2. Mochila y Mochila Exacta (Examen1.java)',
    fileName: 'Examen1.java',
    filePath: 'src/assets/AI/Primer Parcial/Examen1.java',
    category: 'Primer Parcial - Vargas',
    description: 'Combinaciones de elementos con suma <= max y suma exacta == max.',
    language: 'java',
    code: mochilaSection || examen1Raw
  },
  {
    id: 'examen-1-combi-permut',
    title: '3. Combinaciones y Permutaciones (Examen1.java)',
    fileName: 'Examen1.java',
    filePath: 'src/assets/AI/Primer Parcial/Examen1.java',
    category: 'Primer Parcial - Vargas',
    description: 'Combinatoria con y sin repetición, permutaciones con y sin repetición en LinkedList.',
    language: 'java',
    code: combiPermutSection || examen1Raw
  },
  {
    id: 'examen-1-determinante',
    title: '4. Determinante Genérico y Menor (Examen1.java)',
    fileName: 'Examen1.java',
    filePath: 'src/assets/AI/Primer Parcial/Examen1.java',
    category: 'Primer Parcial - Vargas',
    description: 'Cálculo de determinante nxn por cofactores y matriz menor complementaria.',
    language: 'java',
    code: determinanteSection || examen1Raw
  },
  {
    id: 'examen-1-submatrices',
    title: '5. Submatrices y Consultas (Examen1.java)',
    fileName: 'Examen1.java',
    filePath: 'src/assets/AI/Primer Parcial/Examen1.java',
    category: 'Primer Parcial - Vargas',
    description: 'Generación de todas las submatrices (i,j) a (p,q) y consultas: cuadradas, suma=x, contiene x.',
    language: 'java',
    code: submatricesSection || examen1Raw
  },
  {
    id: 'examen-1-main',
    title: '6. Método Main y Pruebas (Examen1.java)',
    fileName: 'Examen1.java',
    filePath: 'src/assets/AI/Primer Parcial/Examen1.java',
    category: 'Primer Parcial - Vargas',
    description: 'Instanciación y llamadas de prueba para cada uno de los algoritmos del examen.',
    language: 'java',
    code: mainSection || examen1Raw
  }
];
