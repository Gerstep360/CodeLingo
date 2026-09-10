// ==============================================================================
// TEMARIO 2: DESCOMPOSICIÓN RECURSIVA (SUMANDOS, FACTORES Y 3 CONSULTAS)
// ==============================================================================

export const UNIT_2_DESCOMPOSICION = {
  id: 'unit-2',
  title: 'SECCIÓN 2 · DESCOMPOSICIÓN RECURSIVA',
  subtitle: 'Sumandos, Factores y sus 3 Consultas de Examen',
  color: 'var(--duo-blue)',
  badge: 'Recursión Numérica',
  nodes: [
    {
      id: 'node-2-1',
      title: 'Sumandos Base',
      shortDesc: 'Generar sumas no decrecientes de n',
      icon: 'plus',
      xp: 20,
      type: 'class',
      theory: {
        title: 'Clase: Sumandos Base de n',
        concept: 'El objetivo es hallar todas las sumas de números positivos que den n. Para evitar duplicados en desorden (ej. 1+2 vs 2+1), el bucle empieza en k = i y la llamada recursiva pasa k para permitir repetir el mismo valor (ej. 1+1+1+1).',
        codeExample: `void sumandos(LinkedList<Integer> L, int n, int i) {
    int s = suma(L);
    if (s > n) return;                           // 1. Cortar
    if (s == n) { System.out.println(L); return; } // 2. Imprimir
    for (int k = i; k <= n; k++) {               // 3. Opciones
        L.add(k);
        sumandos(L, n, k);                       // Pasa k (repite)
        L.removeLast();
    }
}`,
        goldenRule: '¡MEMORIZA! Llamar con k permite repetición y garantiza orden no decreciente. Corta cuando s > n.'
      },
      exercises: [
        {
          type: 'choice',
          question: 'En el método sumandos(L, n, i), ¿cuándo se corta la recursión inmediatamente?',
          options: [
            { text: 'if (s > n) return;  (porque ya se pasó de la suma)', isCorrect: true },
            { text: 'if (s < n) return;', isCorrect: false },
            { text: 'if (L.isEmpty()) return;', isCorrect: false }
          ],
          explanation: 'Si la suma actual s ya superó a n, añadir más números positivos jamás sumará n. Cortar con return evita trabajo inútil.'
        },
        {
          type: 'code_blank',
          question: 'En el for de sumandos, la llamada recursiva pasa:',
          code: `for (int k = i; k <= n; k++) {
    L.add(k);
    sumandos(L, n, _____);
    L.removeLast();
}`,
          options: [
            { text: 'k  (permite repetir el mismo sumando)', isCorrect: true },
            { text: 'k + 1  (no permitiría repetir sumandos)', isCorrect: false },
            { text: 'i  (bucle infinito)', isCorrect: false },
            { text: 'n  (terminaría al primer paso)', isCorrect: false }
          ],
          explanation: 'Llamar con k permite repetición ([1,1,1,1] para n=4) y mantiene los números ordenados de forma no decreciente.'
        }
      ]
    },
    {
      id: 'node-2-2',
      title: '3 Consultas de Sumandos',
      shortDesc: 'Exactamente r, Contiene x, Sin Repetir',
      icon: 'help-circle',
      xp: 20,
      type: 'class',
      theory: {
        title: 'Clase: Las 3 Variantes Típicas de Examen de Vargas',
        concept: 'Vargas casi siempre toma el base y le añade una consulta: C1 (longitud exacta r), C2 (contiene elemento x), o C3 (sin repetir números).',
        codeExample: `// C1: Con exactamente r elementos
if (s > n || L.size() > r) return;
if (s == n && L.size() == r) { System.out.println(L); return; }

// C2: Que contenga el número x
if (s == n && L.contains(x)) { System.out.println(L); return; }

// C3: Sin repetir sumandos
sumandos(L, n, k + 1); // ¡Solo cambia k por k + 1!`,
        goldenRule: '¡MEMORIZA! C1 usa L.size()==r. C2 usa L.contains(x). C3 simplemente cambia la llamada a k + 1.'
      },
      exercises: [
        {
          type: 'choice',
          question: 'Consulta 1 (Vargas): "Mostrar sumandos de n con exactamente r números". ¿Cuál es el cambio?',
          options: [
            { text: 'Cortar si (s > n || L.size() > r), e imprimir solo si (L.size() == r)', isCorrect: true },
            { text: 'Cambiar el for para que empiece en r', isCorrect: false },
            { text: 'Sumar r a cada número', isCorrect: false }
          ],
          explanation: 'Solo verificas L.size() == r al llegar a la suma n, y cortas antes si L.size() supera r.'
        },
        {
          type: 'choice',
          question: 'Consulta 3 (Vargas): "Sumandos sin repetir números". ¿Qué única línea cambia en el base?',
          options: [
            { text: 'Cambiar sumandos(L, n, k) por sumandos(L, n, k + 1)', isCorrect: true },
            { text: 'Poner if (!L.contains(k)) antes del add', isCorrect: false },
            { text: 'Iniciar el for en k = 0', isCorrect: false }
          ],
          explanation: '¡Regla de memoria de Vargas! k = puedo repetir; k + 1 = NO puedo repetir.'
        }
      ]
    },
    {
      id: 'node-2-3',
      title: 'Factores de n',
      shortDesc: 'Producto de divisores: if (n % k == 0)',
      icon: 'hash',
      xp: 20,
      type: 'class',
      theory: {
        title: 'Clase: Descomposición en Factores (Multiplicación)',
        concept: 'Descomponer n en factores que multiplicados den n. Se inicia con i = 2 (multiplicar por 1 causaría un bucle infinito) y dentro del for solo se prueban divisores exactos con n % k == 0.',
        codeExample: `void factores(LinkedList<Integer> L, int n, int i) {
    int p = producto(L);
    if (p > n) return;
    if (p == n) { System.out.println(L); return; }
    for (int k = i; k <= n; k++) {
        if (n % k == 0) {       // ¡Filtro clave!
            L.add(k);
            factores(L, n, k);
            L.removeLast();
        }
    }
}`,
        goldenRule: '¡MEMORIZA! Inicia en 2 (no en 1). Filtro n % k == 0 antes de agregar.'
      },
      exercises: [
        {
          type: 'choice',
          question: '¿Por qué la llamada inicial para factores debe ser factores(L, 12, 2) y NO empezar en i = 1?',
          options: [
            { text: 'Porque multiplicar por 1 no cambia el producto y causaría repetición infinita', isCorrect: true },
            { text: 'Porque 1 no es divisible entre ningún número', isCorrect: false },
            { text: 'Porque Java no permite 1 en un LinkedList', isCorrect: false }
          ],
          explanation: 'Si permites k=1, prod * 1 = prod siempre, causando recursión infinita [1,1,1,1,1...].'
        },
        {
          type: 'code_blank',
          question: '¿Qué condición crucial diferencia a FACTORES de SUMANDOS dentro del for?',
          code: `for (int k = i; k <= n; k++) {
    if (_______________) {
        L.add(k);
        factores(L, n, k);
        L.removeLast();
    }
}`,
          options: [
            { text: 'n % k == 0  (solo probar divisores exactos)', isCorrect: true },
            { text: 'k % 2 == 0  (solo números pares)', isCorrect: false },
            { text: 'k <= n / 2', isCorrect: false }
          ],
          explanation: 'En factores solo pruebas divisores exactos de n con n % k == 0.'
        }
      ]
    },
    {
      id: 'node-2-exam',
      title: 'Examen Final: Descomposición',
      shortDesc: 'Evaluación de Dominio de la Unidad 2',
      icon: 'trophy',
      xp: 35,
      type: 'final_exam',
      isFinalExam: true,
      theory: {
        title: 'Examen Final de Sección 2: Descomposición',
        concept: 'Prueba cronometrada sobre Sumandos, Factores y sus 3 variantes de examen. Asegura tu comprensión de sumas no decrecientes y productos de divisores.',
        goldenRule: 'Si respondes correctamente ambas preguntas, desbloquearás la Sección de Mochila con +35 XP.'
      },
      exercises: [
        {
          type: 'choice',
          question: 'Para n=6, ¿cuál de las siguientes salidas corresponde a sumandos sin repetir números (C3)?',
          options: [
            { text: '[1, 2, 3] y [1, 5] y [2, 4] y [6]', isCorrect: true },
            { text: '[1, 1, 1, 1, 1, 1] y [2, 2, 2]', isCorrect: false },
            { text: '[3, 2, 1] y [1, 2, 3]', isCorrect: false }
          ],
          explanation: 'Al llamar con k+1 nunca se repite ningún dígito, por lo que combinaciones como [1,1,...] o [2,2,2] quedan excluidas.'
        },
        {
          type: 'choice',
          question: '¿Cuál es el valor neutro inicial para medir el acumulado en Factores vs Sumandos?',
          options: [
            { text: 'En Sumandos el neutro es 0; en Factores el neutro es 1 (L.isEmpty() ? 1 : prod)', isCorrect: true },
            { text: 'Ambos usan 0', isCorrect: false },
            { text: 'Ambos usan 1', isCorrect: false }
          ],
          explanation: 'Para la suma el neutro es 0, pero para la multiplicación si inicias en 0 cualquier producto dará 0.'
        }
      ]
    }
  ]
};
