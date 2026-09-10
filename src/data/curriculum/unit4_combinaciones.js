// ==============================================================================
// TEMARIO 4: LA TABLA DE ORO (COMBINACIONES VS PERMUTACIONES)
// ==============================================================================

export const UNIT_4_COMBINACIONES = {
  id: 'unit-4',
  title: 'SECCIÓN 4 · LA TABLA DE ORO',
  subtitle: 'Combinaciones vs Permutaciones (SR y CR)',
  color: 'var(--duo-yellow)',
  badge: 'Núcleo del Examen',
  nodes: [
    {
      id: 'node-4-1',
      title: 'Combinaciones: Combi SR vs Combi CR',
      shortDesc: 'L.size() == r con k+1 vs con k',
      icon: 'shuffle',
      xp: 25,
      type: 'class',
      theory: {
        title: 'Clase: Combinaciones (El orden NO importa)',
        concept: 'En combinaciones [1,2] es exactamente lo mismo que [2,1]. Por eso TIENEN parámetro int i para avanzar y no volver atrás. Combi SR avanza con k + 1 (sin repetición). Combi CR repite con k (con repetición). El caso base siempre verifica el tamaño exacto: L.size() == r.',
        codeExample: `// Combi SR (Sin Repetición)
void combiSR(LinkedList<Integer> L, LinkedList<Integer> A, int r, int i) {
    if (L.size() == r) { System.out.println(L); return; }
    for (int k = i; k < A.size(); k++) {
        L.add(A.get(k));
        combiSR(L, A, r, k + 1);                // k + 1: avanza
        L.removeLast();
    }
}

// Combi CR (Con Repetición)
void combiCR(LinkedList<Integer> L, LinkedList<Integer> A, int r, int i) {
    if (L.size() == r) { System.out.println(L); return; }
    for (int k = i; k < A.size(); k++) {
        L.add(A.get(k));
        combiCR(L, A, r, k);                    // k: repite
        L.removeLast();
    }
}`,
        goldenRule: '¡MEMORIZA! Combinación = TIENE i. Combi SR = llama k + 1. Combi CR = llama k.'
      },
      exercises: [
        {
          type: 'choice',
          question: 'En combinaciones, el orden [1,2] y [2,1] es el mismo. ¿Cuál es el caso base de combiSR?',
          options: [
            { text: 'if (L.size() == r) { System.out.println(L); return; }', isCorrect: true },
            { text: 'if (suma(L) == r)', isCorrect: false },
            { text: 'if (k == A.size())', isCorrect: false }
          ],
          explanation: 'Queremos subconjuntos de tamaño exacto r, por eso el corte es L.size() == r.'
        },
        {
          type: 'choice',
          question: '¿Qué única llamada cambia entre Combi SR (Sin Repetición) y Combi CR (Con Repetición)?',
          options: [
            { text: 'Combi SR llama con k + 1. Combi CR llama con k.', isCorrect: true },
            { text: 'Combi CR no lleva removeLast()', isCorrect: false },
            { text: 'Combi SR usa r - 1', isCorrect: false }
          ],
          explanation: '¡REGLA ABSOLUTA DE VARGAS! Combi SR = k + 1 (avanza al siguiente). Combi CR = k (permite repetir el elemento actual).'
        }
      ]
    },
    {
      id: 'node-4-2',
      title: 'Permutaciones: Permut SR vs Permut CR',
      shortDesc: 'k empieza en 0, no lleva i, uso de !contains',
      icon: 'list',
      xp: 25,
      type: 'class',
      theory: {
        title: 'Clase: Permutaciones (El orden SÍ importa)',
        concept: 'En permutaciones [1,2] es DISTINTO de [2,1]. Por eso NO LLEVAN parámetro int i; el for SIEMPRE comienza desde k = 0 para poder volver a tomar elementos anteriores. Permut SR filtra con if (!L.contains(A.get(k))). Permut CR no lleva ningún filtro (es libre).',
        codeExample: `// Permut SR (Sin Repetición)
void permutSR(LinkedList<Integer> L, LinkedList<Integer> A, int r) {
    if (L.size() == r) { System.out.println(L); return; }
    for (int k = 0; k < A.size(); k++) {        // k SIEMPRE empieza en 0
        if (!L.contains(A.get(k))) {            // Filtro para no duplicar
            L.add(A.get(k));
            permutSR(L, A, r);
            L.removeLast();
        }
    }
}

// Permut CR (Con Repetición - Totalmente libre)
void permutCR(LinkedList<Integer> L, LinkedList<Integer> A, int r) {
    if (L.size() == r) { System.out.println(L); return; }
    for (int k = 0; k < A.size(); k++) {        // Sin if de filtro
        L.add(A.get(k));
        permutCR(L, A, r);
        L.removeLast();
    }
}`,
        goldenRule: '¡MEMORIZA! Permutación = NO TIENE i. For k = 0. SR usa !L.contains(A.get(k)). CR es totalmente libre.'
      },
      exercises: [
        {
          type: 'choice',
          question: 'En permutaciones, el orden sí importa ([1,2] != [2,1]). ¿En qué empieza el for?',
          options: [
            { text: 'k = 0  (siempre desde el inicio de A, NO tiene parámetro i)', isCorrect: true },
            { text: 'k = i  (como en combinaciones)', isCorrect: false },
            { text: 'k = 1', isCorrect: false }
          ],
          explanation: 'En permutaciones no existe el parámetro i. Siempre puedes volver a tomar elementos anteriores desde k = 0.'
        },
        {
          type: 'code_blank',
          question: 'En Permutación Sin Repetición (permutSR), ¿cómo evitamos repetir elementos?',
          code: `for (int k = 0; k < A.size(); k++) {
    if (__________________________) {
        L.add(A.get(k));
        permutSR(L, A, r);
        L.removeLast();
    }
}`,
          options: [
            { text: '!L.contains(A.get(k))', isCorrect: true },
            { text: 'k != i', isCorrect: false },
            { text: 'A.get(k) != 0', isCorrect: false },
            { text: 'L.size() < r', isCorrect: false }
          ],
          explanation: '!L.contains(A.get(k)) verifica que el elemento no esté ya dentro de la lista actual.'
        }
      ]
    },
    {
      id: 'node-4-exam',
      title: 'Examen Final: La Tabla de Oro',
      shortDesc: 'Evaluación Maestra de Combinaciones y Permutaciones',
      icon: 'trophy',
      xp: 35,
      type: 'final_exam',
      isFinalExam: true,
      theory: {
        title: 'Examen Final de Sección 4: La Tabla de Oro',
        concept: 'Esta es la sección de mayor puntaje en los exámenes de Vargas. Demuestra que puedes diferenciar en un segundo Combi SR, Combi CR, Permut SR y Permut CR.',
        goldenRule: 'La mnemotecnia definitiva: Combi = tengo i (SR: k+1, CR: k). Permut = no tengo i, k=0 (SR: !contains, CR: libre).'
      },
      exercises: [
        {
          type: 'choice',
          question: '¿Qué algoritmo usa: inicio for k=0, sin parámetro i, y NINGÚN filtro de contains?',
          options: [
            { text: 'Permutación Con Repetición (permutCR)', isCorrect: true },
            { text: 'Permutación Sin Repetición (permutSR)', isCorrect: false },
            { text: 'Combinación Con Repetición (combiCR)', isCorrect: false },
            { text: 'Mochila Exacta', isCorrect: false }
          ],
          explanation: 'permutCR es el más simple: prueba todos los elementos desde k=0 sin filtro porque permite repeticiones libres ([1,1], [1,2], [2,1], [2,2]).'
        },
        {
          type: 'choice',
          question: 'Para la consulta de examen: "Combi SR que suma igual a x", ¿qué añades?',
          options: [
            { text: 'En el caso base L.size()==r: if (suma(L) == x) System.out.println(L); return;', isCorrect: true },
            { text: 'Cambiar el for para sumar x', isCorrect: false },
            { text: 'Añadir x a la lista A', isCorrect: false }
          ],
          explanation: 'El 90% del método queda idéntico; solo agregas el if (suma(L) == x) en el caso base.'
        }
      ]
    }
  ]
};
