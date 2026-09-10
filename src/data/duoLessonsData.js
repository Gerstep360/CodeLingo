// DUOLINGO CURRICULUM DATA — Base oficial de GUIA_MEMORIZACION_INTENSIVA.md
// Diseñado para dominar y reconstruir los 10 algoritmos del examen de Vargas

export const DUO_UNITS = [
  {
    id: 'unit-1',
    title: 'SECCIÓN 1 · EL PATRÓN CENTRAL',
    subtitle: 'Backtracking: La idea que une casi todo',
    color: 'var(--duo-green)',
    nodes: [
      {
        id: 'node-1-1',
        title: 'El Ciclo Sagrado',
        shortDesc: 'Elegir → Bajar → Volver',
        icon: 'zap',
        xp: 15,
        type: 'lesson',
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
        xp: 15,
        type: 'lesson',
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
      }
    ]
  },
  {
    id: 'unit-2',
    title: 'SECCIÓN 2 · DESCOMPOSICIÓN RECURSIVA',
    subtitle: 'Sumandos, Factores y sus 3 Consultas de Examen',
    color: 'var(--duo-blue)',
    nodes: [
      {
        id: 'node-2-1',
        title: 'Sumandos Base',
        shortDesc: 'Generar sumas no decrecientes de n',
        icon: 'plus',
        xp: 20,
        type: 'lesson',
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
        type: 'lesson',
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
        type: 'lesson',
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
      }
    ]
  },
  {
    id: 'unit-3',
    title: 'SECCIÓN 3 · MOCHILA Y MOCHILA EXACTA',
    subtitle: 'Selección de elementos sobre la lista A',
    color: 'var(--duo-purple)',
    nodes: [
      {
        id: 'node-3-1',
        title: 'Mochila Base',
        shortDesc: 'A.get(k) y combinaciones suma <= max',
        icon: 'briefcase',
        xp: 20,
        type: 'lesson',
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
        type: 'lesson',
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
      }
    ]
  },
  {
    id: 'unit-4',
    title: 'SECCIÓN 4 · LA TABLA DE ORO',
    subtitle: 'Combinaciones vs Permutaciones (SR y CR)',
    color: 'var(--duo-yellow)',
    nodes: [
      {
        id: 'node-4-1',
        title: 'Combinaciones: Combi SR vs Combi CR',
        shortDesc: 'L.size() == r con k+1 vs con k',
        icon: 'shuffle',
        xp: 25,
        type: 'lesson',
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
        type: 'lesson',
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
        id: 'node-4-3',
        title: 'El Test Maestro de la Tabla',
        shortDesc: 'Combi SR, Combi CR, Permut SR, Permut CR',
        icon: 'award',
        xp: 30,
        type: 'lesson',
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
  },
  {
    id: 'unit-5',
    title: 'SECCIÓN 5 · MATRICES Y SUBMATRICES',
    subtitle: 'Determinante por cofactores y los 4 bucles',
    color: 'var(--duo-orange)',
    nodes: [
      {
        id: 'node-5-1',
        title: 'Determinante Genérico & Menor',
        shortDesc: 'Caso base 1x1, menores y signos alternados',
        icon: 'grid',
        xp: 25,
        type: 'lesson',
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
        type: 'lesson',
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
      }
    ]
  }
];

// 10 Preguntas de rescate rápido del Test Final de Memoria (GUIA_MEMORIZACION_INTENSIVA.md lines 1422-1450)
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

// Las 4 Frases para recuperar todo (de GUIA_MEMORIZACION_INTENSIVA.md lines 1193-1218)
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

// Tabla de Oro consolidada
export const DUO_GOLDEN_TABLE = [
  { algo: 'Combi SR', start: 'k = i', call: 'k + 1', filter: 'ninguno', desc: 'Elegir r elementos sin repetir' },
  { algo: 'Combi CR', start: 'k = i', call: 'k', filter: 'ninguno', desc: 'Elegir r elementos pudiendo repetir' },
  { algo: 'Permut SR', start: 'k = 0', call: 'sin i', filter: '!L.contains(...)', desc: 'El orden importa, sin duplicar' },
  { algo: 'Permut CR', start: 'k = 0', call: 'sin i', filter: 'ninguno (libre)', desc: 'Todas las secuencias de tamaño r' }
];
