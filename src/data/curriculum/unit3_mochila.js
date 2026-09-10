// ==============================================================================
// TEMARIO 3: MOCHILA Y MOCHILA EXACTA
// ==============================================================================

export const UNIT_3_MOCHILA = {
  id: 'unit-3',
  title: 'SECCIÓN 3 · MOCHILA Y SELECCIÓN',
  subtitle: 'Selección de elementos sobre la lista de objetos A',
  color: 'var(--duo-purple)',
  badge: 'Problema Clásico',
  nodes: [
    {
      id: 'node-3-1',
      title: 'Mochila Base',
      shortDesc: 'A.get(k) y combinaciones suma <= max',
      icon: 'briefcase',
      xp: 20,
      type: 'class',
      theory: {
        title: 'Clase: El Algoritmo de la Mochila (Knapsack)',
        concept: 'En Mochila recibes una lista A con pesos de objetos (ej. A = [2, 4, 6, 8]) y una capacidad máxima max. La variable k recorre los índices de 0 a A.size()-1. Se inserta A.get(k) y se avanza la llamada recursiva con k + 1 porque cada objeto solo puede tomarse una vez.',
        codeExample: `void mochila(LinkedList<Integer> L, LinkedList<Integer> A, int max, int i) {
    int s = suma(L);
    if (s > max) return;                         // 1. Cortar si supera max
    if (!L.isEmpty()) System.out.println(L);    // 2. Imprimir subconjunto valido
    for (int k = i; k < A.size(); k++) {        // 3. Recorrer objetos de A
        L.add(A.get(k));                        // k es el índice, add toma A.get(k)
        mochila(L, A, max, k + 1);              // k + 1: no repetir el mismo objeto
        L.removeLast();
    }
}`,
        goldenRule: '¡MEMORIZA! A diferencia de Sumandos donde k es el número (L.add(k)), en Mochila k es el índice (L.add(A.get(k))). La llamada pasa k + 1.'
      },
      exercises: [
        {
          type: 'choice',
          question: '¿Cuál es la diferencia más importante entre SUMANDOS y MOCHILA al insertar en L?',
          options: [
            { text: 'SUMANDOS usa L.add(k) (k es el valor). MOCHILA usa L.add(A.get(k)) (k es el índice en A).', isCorrect: true },
            { text: 'MOCHILA no usa LinkedList', isCorrect: false },
            { text: 'SUMANDOS no usa recursión', isCorrect: false }
          ],
          explanation: 'En Mochila tienes una lista de objetos A = [2,4,6,8]. k recorre las posiciones 0..<A.size(), por eso se añade A.get(k).'
        },
        {
          type: 'choice',
          question: '¿Por qué la llamada recursiva de mochila pasa k + 1?',
          options: [
            { text: 'Porque cada objeto de A se puede tomar como máximo una sola vez', isCorrect: true },
            { text: 'Porque k+1 suma más rápido', isCorrect: false },
            { text: 'Porque el índice de A empieza en 1', isCorrect: false }
          ],
          explanation: 'k + 1 avanza al siguiente objeto disponible en A para no reutilizar el mismo elemento de la posición k.'
        }
      ]
    },
    {
      id: 'node-3-2',
      title: 'Mochila Exacta',
      shortDesc: 'Imprimir SOLO cuando suma == max',
      icon: 'target',
      xp: 20,
      type: 'class',
      theory: {
        title: 'Clase: Mochila Exacta (Subset Sum)',
        concept: 'Mochila Exacta solo imprime cuando el peso de los objetos seleccionados suma EXACTAMENTE max. El esqueleto del for es 100% idéntico al de Mochila Base.',
        codeExample: `void mochilaExacta(LinkedList<Integer> L, LinkedList<Integer> A, int max, int i) {
    int s = suma(L);
    if (s > max) return;
    if (s == max) {                              // ¡Solo imprime en suma EXACTA!
        System.out.println(L);
        return;                                  // Cortar porque con positivos no sumará más
    }
    for (int k = i; k < A.size(); k++) {
        L.add(A.get(k));
        mochilaExacta(L, A, max, k + 1);
        L.removeLast();
    }
}`,
        goldenRule: '¡MEMORIZA! Mochila imprime si (!L.isEmpty()). Mochila Exacta imprime SOLO si (s == max).'
      },
      exercises: [
        {
          type: 'choice',
          question: '¿Cuál es la única diferencia estructural entre MOCHILA y MOCHILA EXACTA?',
          options: [
            { text: 'Mochila imprime si (!L.isEmpty()) con s<=max. Mochila Exacta imprime SOLO si (s == max).', isCorrect: true },
            { text: 'Mochila Exacta no usa removeLast()', isCorrect: false },
            { text: 'Mochila Exacta usa una matriz', isCorrect: false }
          ],
          explanation: 'El esqueleto es 100% idéntico. Solo cambia el if de impresión: en exacta requieres que s == max y luego un return.'
        }
      ]
    },
    {
      id: 'node-3-exam',
      title: 'Examen Final: Mochila',
      shortDesc: 'Evaluación de Dominio de la Unidad 3',
      icon: 'trophy',
      xp: 35,
      type: 'final_exam',
      isFinalExam: true,
      theory: {
        title: 'Examen Final de Sección 3: Mochila y Selección',
        concept: 'Prueba cronometrada sobre índices en listas A, llamadas k+1 y condiciones de suma exacta.',
        goldenRule: 'Completa este examen para acceder a la legendaria Tabla de Oro (Combinaciones vs Permutaciones).'
      },
      exercises: [
        {
          type: 'choice',
          question: 'Si A = [3, 5, 2] y max = 5, ¿cuáles son las soluciones de Mochila Exacta?',
          options: [
            { text: '[3, 2] y [5]', isCorrect: true },
            { text: '[3, 5, 2]', isCorrect: false },
            { text: '[2, 3] y [3, 2]', isCorrect: false }
          ],
          explanation: '3 + 2 = 5 y 5 = 5. Como es combinación sin repetición, [2, 3] no se genera aparte porque los índices avanzan siempre hacia adelante.'
        },
        {
          type: 'choice',
          question: 'Si en el examen te piden "Mochila con como máximo 2 objetos", ¿dónde agregas la condición?',
          options: [
            { text: 'En la poda: if (s > max || L.size() > 2) return;', isCorrect: true },
            { text: 'Modificando A.size() a 2', isCorrect: false },
            { text: 'En el main', isCorrect: false }
          ],
          explanation: 'Cortar con L.size() > 2 poda de inmediato ramas con más de 2 objetos.'
        }
      ]
    }
  ]
};
