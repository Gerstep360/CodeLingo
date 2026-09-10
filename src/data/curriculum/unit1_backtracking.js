// ==============================================================================
// TEMARIO 1: EL PATRÓN CENTRAL DE BACKTRACKING
// ==============================================================================
// Cada unidad contiene:
// 1. Clases modulares (Teoría con concepto, código y regla de oro + Preguntas)
// 2. Examen Final de Sección (Evaluación de dominio con +35 XP)
// ==============================================================================

export const UNIT_1_BACKTRACKING = {
  id: 'unit-1',
  title: 'SECCIÓN 1 · EL PATRÓN CENTRAL',
  subtitle: 'Backtracking: La idea que une casi todo',
  color: 'var(--duo-green)',
  badge: 'Fundamentos',
  nodes: [
    {
      id: 'node-1-1',
      title: 'El Ciclo Sagrado',
      shortDesc: 'Elegir → Bajar → Volver',
      icon: 'zap',
      xp: 20,
      type: 'class',
      theory: {
        title: 'Clase 1: El Ciclo Sagrado de Backtracking',
        concept: 'Backtracking es explorar todas las opciones posibles de forma ordenada en un árbol recursivo. Para listas en Java, siempre se sigue la regla de 3 pasos: AGREGO (L.add), BAJO (llamada recursiva) y QUITO (L.removeLast()).',
        codeExample: `for (int k = i; k <= n; k++) {
    L.add(k);             // 1. AGREGO (Elegir)
    sumandos(L, n, k);    // 2. BAJO   (Recursión)
    L.removeLast();       // 3. QUITO  (Deshacer para volver)
}`,
        goldenRule: '¡MEMORIZA! AGREGO -> BAJO -> QUITO. Si falta L.removeLast(), la lista jamás retrocede y el árbol de soluciones queda completamente arruinado.'
      },
      exercises: [
        {
          type: 'choice',
          question: '¿Cuáles son las 3 palabras mágicas que resumen el backtracking de listas en Java?',
          options: [
            { text: 'AGREGO → BAJO → QUITO  (Elegir → Recursión → Deshacer)', isCorrect: true },
            { text: 'LEO → COPIO → REINICIO', isCorrect: false },
            { text: 'ORDENO → BUSCO → IMPRIMO', isCorrect: false },
            { text: 'DIVIDO → CONQUISTO → RETORNO', isCorrect: false }
          ],
          explanation: 'Memoriza: AGREGO (L.add) → BAJO (llamada recursiva) → QUITO (L.removeLast()). Sin removeLast() no puedes volver a probar otra opción.'
        },
        {
          type: 'code_blank',
          question: 'Completa la línea después de la llamada recursiva para restaurar el estado anterior:',
          code: `for (int k = i; k <= n; k++) {
    L.add(k);             // 1. ELEGIR
    algoritmo(L, n, k);   // 2. BAJAR
    _________________;    // 3. VOLVER
}`,
          options: [
            { text: 'L.removeLast()', isCorrect: true },
            { text: 'L.clear()', isCorrect: false },
            { text: 'L.removeFirst()', isCorrect: false },
            { text: 'L = new LinkedList<>()', isCorrect: false }
          ],
          explanation: 'L.removeLast() desapila el último elemento insertado para dejar la lista lista para el siguiente valor del for.'
        },
        {
          type: 'choice',
          question: 'En el esqueleto de 4 pasos de Vargas, ¿cuál es el orden correcto?',
          options: [
            { text: '1. Medir estado actual → 2. Cortar si no sirve → 3. Comprobar solución → 4. Probar opciones', isCorrect: true },
            { text: '1. Probar opciones → 2. Imprimir → 3. Borrar todo → 4. Salir', isCorrect: false },
            { text: '1. Medir estado → 2. For infinito → 3. Imprimir si suma par → 4. Return', isCorrect: false }
          ],
          explanation: 'Siempre: Medir (int s=suma(L)) → Cortar (if s>n return) → Comprobar (if s==n imprimir) → Probar opciones (for con add, llamada, removeLast).'
        }
      ]
    },
    {
      id: 'node-1-2',
      title: 'El Secreto de removeLast()',
      shortDesc: 'Retroceder en el árbol recursivo',
      icon: 'repeat',
      xp: 20,
      type: 'class',
      theory: {
        title: 'Clase 2: El Secreto y Mecánica de removeLast()',
        concept: 'Cada nivel de la recursión comparte la misma lista L por referencia en memoria. Si no desapilas con removeLast(), las modificaciones de una rama contaminarán todas las ramas posteriores.',
        codeExample: `// Traza de memoria:
L = [1, 1];
L.add(2);        // L = [1, 1, 2] -> Explora rama
L.removeLast();   // L = [1, 1]    -> Regresa al estado exacto previo`,
        goldenRule: 'removeLast() desapila exactamente el elemento que pusiste en este nivel, permitiendo probar el siguiente k del for.'
      },
      exercises: [
        {
          type: 'choice',
          question: '¿Qué pasaría si olvidas escribir L.removeLast() dentro del for?',
          options: [
            { text: 'La lista acumula elementos sin retroceder, arruinando todas las ramas siguientes', isCorrect: true },
            { text: 'El compilador de Java dará error de sintaxis', isCorrect: false },
            { text: 'El programa imprime más rápido', isCorrect: false }
          ],
          explanation: 'removeLast() no es un detalle secundario: es el corazón del backtracking. Permite volver al estado anterior.'
        },
        {
          type: 'trace',
          question: 'Si L = [1, 1], se ejecuta L.add(2) y luego L.removeLast(), ¿cómo queda L?',
          options: [
            { text: 'L = [1, 1]', isCorrect: true },
            { text: 'L = [1, 1, 2]', isCorrect: false },
            { text: 'L = [1]', isCorrect: false },
            { text: 'L = []', isCorrect: false }
          ],
          explanation: 'L.add(2) pone el 2 al final ([1, 1, 2]), y L.removeLast() quita exactamente ese 2, regresando a [1, 1].'
        }
      ]
    },
    {
      id: 'node-1-exam',
      title: 'Examen Final: Patrón Central',
      shortDesc: 'Evaluación de Dominio de la Unidad 1',
      icon: 'trophy',
      xp: 35,
      type: 'final_exam',
      isFinalExam: true,
      theory: {
        title: 'Examen Final de Sección 1: El Patrón Central',
        concept: 'Ha llegado la prueba de fuego de la Unidad 1. Demuestra que dominas los 4 pasos del esqueleto de Vargas y el ciclo sagrado antes de avanzar a Descomposición Recursiva.',
        goldenRule: 'Examen de alta retención. Si apruebas, desbloquearás la Unidad 2 con +35 XP.'
      },
      exercises: [
        {
          type: 'choice',
          question: '¿Cuál es la función exacta de "cortar si no sirve" en el paso 2 del esqueleto?',
          options: [
            { text: 'Poda (pruning): Evita calcular subárboles enteros que ya superaron el límite de la solución', isCorrect: true },
            { text: 'Detener el programa para siempre', isCorrect: false },
            { text: 'Borrar la memoria RAM', isCorrect: false }
          ],
          explanation: 'La poda (ej. if (s > n) return;) evita explorar miles de ramas infructíferas.'
        },
        {
          type: 'choice',
          question: '¿Por qué en Java se utiliza LinkedList en lugar de ArrayList para el backtracking tradicional de Vargas?',
          options: [
            { text: 'LinkedList dispone de los métodos add() y removeLast() directamente orientados a pila (LIFO)', isCorrect: true },
            { text: 'ArrayList no permite números enteros', isCorrect: false },
            { text: 'LinkedList usa menos memoria en todos los casos', isCorrect: false }
          ],
          explanation: 'LinkedList implementa Deque y ofrece removeLast() de forma clara y semántica.'
        }
      ]
    }
  ]
};
