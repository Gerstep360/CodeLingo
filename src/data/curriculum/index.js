export { DUO_UNITS, getAllNodes, getNodeById, getUnitById, isFinalExamNode } from '../../content/curriculumAdapter';

// ------------------------------------------------------------------------------
// BANCO DE PREGUNTAS: TEST FLASH (10 Preguntas de Rescate Rápido)
// ------------------------------------------------------------------------------
export const DUO_FLASH_QUIZ_QUESTIONS = [
  {
    id: 'fq-1',
    question: '1. ¿Cuáles son las tres acciones del backtracking?',
    options: [
      { text: 'add → recursión → removeLast  (agrego, bajo, quito)', isCorrect: true },
      { text: 'ordenar → partir → juntar', isCorrect: false },
      { text: 'leer → calcular → imprimir', isCorrect: false }
    ],
    answerDetail: 'add añade a L, la recursión explora esa rama, y removeLast deshace el cambio para probar la siguiente opción.'
  },
  {
    id: 'fq-2',
    question: '2. ¿Combi SR (Sin Repetición) llama con k o con k + 1?',
    options: [
      { text: 'k + 1  (avanza al siguiente elemento)', isCorrect: true },
      { text: 'k  (permitiría repetir el mismo)', isCorrect: false }
    ],
    answerDetail: 'k + 1 asegura que cada posición se elija a lo sumo una vez.'
  },
  {
    id: 'fq-3',
    question: '3. ¿Combi CR (Con Repetición) llama con k o con k + 1?',
    options: [
      { text: 'k  (permite volver a elegir el mismo)', isCorrect: true },
      { text: 'k + 1', isCorrect: false }
    ],
    answerDetail: 'Al pasar k, la recursión puede volver a tomar A[k] en el siguiente nivel.'
  },
  {
    id: 'fq-4',
    question: '4. ¿Permut SR lleva el parámetro int i?',
    options: [
      { text: 'NO  (vuelve a recorrer desde k = 0)', isCorrect: true },
      { text: 'SÍ  (para no volver atrás)', isCorrect: false }
    ],
    answerDetail: 'En permutaciones el orden importa ([1,2] != [2,1]). No lleva i porque siempre explora desde k = 0.'
  },
  {
    id: 'fq-5',
    question: '5. ¿Qué evita repetir valores en Permut SR?',
    options: [
      { text: '!L.contains(A.get(k))', isCorrect: true },
      { text: 'k + 1', isCorrect: false },
      { text: 'i != k', isCorrect: false }
    ],
    answerDetail: 'Se verifica que el elemento de A[k] aún no esté dentro de L.'
  },
  {
    id: 'fq-6',
    question: '6. ¿Qué diferencia L.add(k) de L.add(A.get(k))?',
    options: [
      { text: 'k es un valor directo (Sumandos); A.get(k) es el elemento en la posición k de A (Mochila/Combi)', isCorrect: true },
      { text: 'Solo la velocidad de ejecución', isCorrect: false }
    ],
    answerDetail: 'En Sumandos k es el sumando numérico. En Mochila k es el índice del elemento en A.'
  },
  {
    id: 'fq-7',
    question: '7. ¿Cuándo corta sumandos?',
    options: [
      { text: 'Cuando s > n (corta con return); imprime cuando s == n', isCorrect: true },
      { text: 'Cuando la lista está vacía', isCorrect: false }
    ],
    answerDetail: 'Si la suma parcial supera n, ya ninguna rama puede sumar n, así que corta con return.'
  },
  {
    id: 'fq-8',
    question: '8. ¿Qué condición extra tiene Factores respecto a Sumandos?',
    options: [
      { text: 'n % k == 0  (solo probar divisores exactos) e iniciar en 2', isCorrect: true },
      { text: 'k es impar', isCorrect: false }
    ],
    answerDetail: 'Solo se consideran divisores de n (n % k == 0) y no se empieza en 1 para evitar recursión infinita.'
  },
  {
    id: 'fq-9',
    question: '9. ¿Cuál es el caso base del determinante?',
    options: [
      { text: 'if (M.length == 1) return M[0][0];', isCorrect: true },
      { text: 'if (M.length == 2)', isCorrect: false }
    ],
    answerDetail: 'Una matriz 1x1 tiene como determinante su único elemento M[0][0].'
  },
  {
    id: 'fq-10',
    question: '10. ¿Qué representan i, j, p, q en Submatrices?',
    options: [
      { text: '(i, j) es la esquina superior izquierda; (p, q) es la esquina inferior derecha', isCorrect: true },
      { text: 'Las dimensiones de 4 matrices distintas', isCorrect: false }
    ],
    answerDetail: 'i, j fijan el punto de inicio y p, q fijan el punto de fin de la submatriz.'
  }
];

// ------------------------------------------------------------------------------
// LAS 4 FRASES PARA RECUPERAR TODO
// ------------------------------------------------------------------------------
export const DUO_RECOVERY_PHRASES = [
  {
    title: '1. BACKTRACKING',
    iconKey: 'backtrack',
    phrase: 'AGREGO → LLAMO → QUITO',
    detail: 'L.add(...) → llamada(...) → L.removeLast(). Siempre en ese orden.'
  },
  {
    title: '2. COMBINACIÓN',
    iconKey: 'dice',
    phrase: 'TENGO i · SR = k+1 · CR = k',
    detail: 'El orden no importa. Sin repetición avanza con k+1; con repetición repite con k.'
  },
  {
    title: '3. PERMUTACIÓN',
    iconKey: 'shuffle',
    phrase: 'NO TENGO i · VUELVO A k=0',
    detail: 'El orden sí importa. SR usa !contains para filtrar; CR es completamente libre.'
  },
  {
    title: '4. SUBMATRIZ',
    iconKey: 'matrix',
    phrase: 'INICIO: i, j · FINAL: p, q',
    detail: '4 bucles for. Es cuadrada cuando (p - i == q - j).'
  }
];

// ------------------------------------------------------------------------------
// LA TABLA DE ORO CONSOLIDADA
// ------------------------------------------------------------------------------
export const DUO_GOLDEN_TABLE = [
  { algo: 'Combi SR', start: 'k = i', call: 'k + 1', filter: 'ninguno', desc: 'Elegir r elementos sin repetir' },
  { algo: 'Combi CR', start: 'k = i', call: 'k', filter: 'ninguno', desc: 'Elegir r elementos pudiendo repetir' },
  { algo: 'Permut SR', start: 'k = 0', call: 'sin i', filter: '!L.contains(...)', desc: 'El orden importa, sin duplicar' },
  { algo: 'Permut CR', start: 'k = 0', call: 'sin i', filter: 'ninguno (libre)', desc: 'Todas las secuencias de tamaño r' }
];
