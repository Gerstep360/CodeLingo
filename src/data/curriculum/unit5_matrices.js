// ==============================================================================
// TEMARIO 5: MATRICES Y SUBMATRICES
// ==============================================================================

export const UNIT_5_MATRICES = {
  id: 'unit-5',
  title: 'SECCIÓN 5 · MATRICES Y SUBMATRICES',
  subtitle: 'Determinante por cofactores y los 4 bucles',
  color: 'var(--duo-orange)',
  badge: 'Álgebra & Matrices',
  nodes: [
    {
      id: 'node-5-1',
      title: 'Determinante Genérico & Menor',
      shortDesc: 'Caso base 1x1, menores y signos alternados',
      icon: 'grid',
      xp: 25,
      type: 'class',
      theory: {
        title: 'Clase: Determinante Recursivo por Cofactores',
        concept: 'Calcula el determinante de una matriz cuadrada de orden n. Caso base: si M.length == 1, retorna M[0][0]. En el paso recursivo, expande por la columna 0 alternando signos (+, -, +, - con i % 2 == 0 ? 1 : -1), multiplicando por el pivote M[i][0] y calculando el menor sin la fila i ni la columna 0.',
        codeExample: `int det(int[][] M) {
    if (M.length == 1) return M[0][0];          // Caso base 1x1
    int s = 0;
    for (int i = 0; i < M.length; i++) {
        int signo = (i % 2 == 0) ? 1 : -1;      // Signo alternado
        s += signo * M[i][0] * det(menor(M, i, 0));
    }
    return s;
}`,
        goldenRule: '¡MEMORIZA! Caso base 1x1 = return M[0][0]. Signo alternado = (i % 2 == 0 ? 1 : -1). Multiplica por pivote M[i][0] y det(menor).'
      },
      exercises: [
        {
          type: 'choice',
          question: '¿Cuál es el caso base del determinante recursivo?',
          options: [
            { text: 'if (M.length == 1) return M[0][0];', isCorrect: true },
            { text: 'if (M.length == 0) return 0;', isCorrect: false },
            { text: 'if (M[0][0] == 0) return 1;', isCorrect: false }
          ],
          explanation: 'Una matriz 1x1 tiene un único número, cuyo determinante es el mismo valor M[0][0].'
        },
        {
          type: 'code_blank',
          question: '¿Cómo se alterna el signo (+, -, +, -) para cada cofactor en la expansión?',
          code: `for (int i = 0; i < M.length; i++) {
    s += (____________ ? 1 : -1) * M[i][0] * det(menor(M, i, 0));
}`,
          options: [
            { text: 'i % 2 == 0', isCorrect: true },
            { text: 'i > 0', isCorrect: false },
            { text: 'M[i][0] > 0', isCorrect: false }
          ],
          explanation: 'i=0 da +1, i=1 da -1, i=2 da +1, i=3 da -1. Por tanto: i % 2 == 0 ? 1 : -1.'
        }
      ]
    },
    {
      id: 'node-5-2',
      title: 'Submatrices: Los 4 Bucles',
      shortDesc: 'Esquina inicial (i,j) y esquina final (p,q)',
      icon: 'maximize-2',
      xp: 25,
      type: 'class',
      theory: {
        title: 'Clase: Los 4 Bucles de Submatrices',
        concept: 'Toda submatriz queda definida por dos puntos: la esquina superior izquierda (i, j) y la esquina inferior derecha (p, q). Por eso se usan 4 bucles for anidados donde p empieza en i y q empieza en j.',
        codeExample: `void submatrices(int[][] M) {
    int m = M.length, n = M[0].length;
    for (int i = 0; i < m; i++)
      for (int j = 0; j < n; j++)               // Esquina inicial (i, j)
        for (int p = i; p < m; p++)
          for (int q = j; q < n; q++)           // Esquina final (p, q)
            if (p - i == q - j)                 // C1: Solo cuadradas
                mostrar(M, i, j, p, q);
}`,
        goldenRule: '¡MEMORIZA! 4 bucles: i, j, p=i, q=j. Es cuadrada cuando (p - i == q - j).'
      },
      exercises: [
        {
          type: 'choice',
          question: '¿Por qué submatrices usa 4 bucles for anidados?',
          options: [
            { text: 'Los primeros 2 (i, j) eligen la esquina inicial; los otros 2 (p, q) eligen la esquina final.', isCorrect: true },
            { text: 'Porque una matriz tiene 4 dimensiones', isCorrect: false },
            { text: 'Porque recorre 4 matrices distintas', isCorrect: false }
          ],
          explanation: 'Fórmula mental: (i, j) = esquina superior izquierda, (p, q) = esquina inferior derecha (donde p empieza en i y q en j).'
        },
        {
          type: 'code_blank',
          question: 'Consulta 1 (Vargas): ¿Cuándo una submatriz entre (i,j) y (p,q) es cuadrada?',
          code: `static boolean cuadrada(int i, int j, int p, int q) {
    return ___________________;
}`,
          options: [
            { text: 'p - i == q - j  (igual cantidad de filas que de columnas)', isCorrect: true },
            { text: 'p == q', isCorrect: false },
            { text: 'i == j && p == q', isCorrect: false },
            { text: 'p + i == q + j', isCorrect: false }
          ],
          explanation: 'Saltos verticales (p - i) deben ser iguales a los saltos horizontales (q - j).'
        }
      ]
    },
    {
      id: 'node-5-exam',
      title: 'Examen Final: Matrices',
      shortDesc: 'Evaluación de Dominio de la Unidad 5',
      icon: 'trophy',
      xp: 35,
      type: 'final_exam',
      isFinalExam: true,
      theory: {
        title: 'Examen Final de Sección 5: Matrices y Submatrices',
        concept: 'Prueba final de evaluación de matrices. Verifica tu dominio de menores, cofactores y filtros de submatrices.',
        goldenRule: '¡Has llegado al examen final del temario de matrices! Puntos dobles de XP.'
      },
      exercises: [
        {
          type: 'choice',
          question: '¿Qué dimensiones tiene la matriz devuelta por menor(M, fila, col)?',
          options: [
            { text: '(n - 1) x (n - 1), eliminando la fila y la columna indicadas', isCorrect: true },
            { text: 'n x n con ceros en la fila y columna', isCorrect: false },
            { text: '1 x 1', isCorrect: false }
          ],
          explanation: 'El menor de una matriz cuadrada de orden n tiene orden (n - 1).'
        },
        {
          type: 'choice',
          question: 'En submatrices, para la consulta C2 ("cuya suma sea igual a x"), ¿qué función auxiliar se evalúa?',
          options: [
            { text: 'if (sumaSub(M, i, j, p, q) == x) mostrar(M, i, j, p, q);', isCorrect: true },
            { text: 'if (det(M) == x)', isCorrect: false },
            { text: 'if (M[i][j] + M[p][q] == x)', isCorrect: false }
          ],
          explanation: 'Se recorren todos los elementos entre i..p y j..q con un doble for auxiliar y se compara con x.'
        }
      ]
    }
  ]
};
