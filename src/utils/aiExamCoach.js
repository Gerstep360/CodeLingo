// AI Pattern Recognition & Memory Coach for Java Algorithms and Exams

export const AI_PATTERNS = [
  {
    id: 'sumandos',
    match: ['sumandos'],
    title: '1. Sumandos (Descomposición)',
    concept: 'Backtracking Clásico',
    aiInsight: '💡 Patrón Base: Inicia suma acumulada `suma(L)`. Si `s > n` poda con return. Si `s == n` imprime. El bucle corre de `k = i` hasta `n`. Añade `k`, llama recursivo con `k`, y al volver hace `removeLast()`.',
    cheatCode: 'L.add(k); sumandos(L,n,k); L.removeLast();',
    relationship: 'Patrón raíz para problemas aditivos.'
  },
  {
    id: 'factores',
    match: ['factores'],
    title: '1. Factores (Descomposición en Primos)',
    concept: 'Copia Inteligente de Sumandos',
    aiInsight: '🤖 Atajo de Memoria IA: ¡Es idéntico a `sumandos`! Solo haz 2 cambios: cambia `suma(L)` por `prod(L)`, y antes de añadir `k` valida `if (n % k == 0)`. Todo lo demás es exactamente igual.',
    cheatCode: 'if(n%k==0) { L.add(k); factores(L,n,k); L.removeLast(); }',
    relationship: 'Clon de sumandos sustituyendo suma por multiplicación y módulo.'
  },
  {
    id: 'mochila',
    match: ['mochila', 'mochilaExacta'],
    title: '2. Problema de la Mochila y Mochila Exacta',
    concept: 'Combinatoria con Poda de Peso',
    aiInsight: '🤖 Atajo de Memoria IA: `mochilaExacta` es una copia directa de `mochila`. La única diferencia: `mochila` imprime si `!L.isEmpty()`, mientras que `mochilaExacta` imprime solo si `s == max`. En ambos el bucle avanza con `k + 1`.',
    cheatCode: 'mochila: if(!L.isEmpty()) print | mochilaExacta: if(s==max) print',
    relationship: 'Mochila Exacta = Mochila cambiando la condición de impresión.'
  },
  {
    id: 'combi',
    match: ['combiSR', 'combiCR'],
    title: '3. Combinaciones: Sin Repetición vs Con Repetición',
    concept: 'Control de Puntero Recursivo',
    aiInsight: '🤖 Atajo de Memoria IA: Compara `combiSR` y `combiCR`. Tienen el mismo código línea por línea, excepto UN solo carácter: en `combiSR` pasas `k + 1` (no permite repetir), y en `combiCR` pasas `k` (permite reutilizar el mismo elemento).',
    cheatCode: 'combiSR: combiSR(L,A,r, k+1 ) vs combiCR: combiCR(L,A,r, k )',
    relationship: 'Diferencia de 1 caracter: k+1 vs k.'
  },
  {
    id: 'permut',
    match: ['permutSR', 'permutCR'],
    title: '3. Permutaciones: Sin Repetición vs Con Repetición',
    concept: 'Control de Selección Global (k = 0)',
    aiInsight: '🤖 Atajo de Memoria IA: En permutaciones el bucle siempre comienza en `k = 0`. Para `permutSR` colocas `if (!L.contains(A.get(k)))`. Para `permutCR`, ¡simplemente quitas ese `if` y agregas directamente!',
    cheatCode: 'permutSR tiene if(!L.contains(...)) | permutCR agrega directo',
    relationship: 'Permutación con repetición es la versión simplificada sin filtro contains.'
  },
  {
    id: 'det',
    match: ['det', 'menor'],
    title: '4. Determinante de Matriz por Laplace',
    concept: 'Recursión de Matriz con Matriz Menor',
    aiInsight: '💡 Patrón Clave: Caso base `if(M.length == 1) return M[0][0]`. Sumatorio alternando signo `(i%2==0 ? 1 : -1) * M[i][0] * det(menor(M,i,0))`. La función `menor` solo ignora la fila `fi` y la columna `co`.',
    cheatCode: 's += (i%2==0 ? 1 : -1) * M[i][0] * det(menor(M,i,0));',
    relationship: 'Determinante reduce recursivamente la dimensión en n-1.'
  },
  {
    id: 'submatrices',
    match: ['subMatrices', 'consulta', 'consulta1', 'consulta2', 'consulta3', 'sumaSub', 'contiene', 'cuadrada'],
    title: '5. Submatrices y Consultas (Cuadradas, Suma, Contiene)',
    concept: 'Plantilla de 4 Bucles Anidados (i, j, p, q)',
    aiInsight: '🤖 Atajo de Memoria IA: ¡Todas las consultas usan la MISMA plantilla de 4 bucles (`i` a filas, `j` a columnas, `p` desde `i`, `q` desde `j`)! Para consulta1 validas `p-i == q-j`. Para consulta2 `sumaSub(...) == x`. Para consulta3 `contiene(...)`. Copia la plantilla y solo cambia el `if`.',
    cheatCode: 'for(i) for(j) for(p=i..) for(q=j..) if(condicion) mostrar(M,i,j,p,q);',
    relationship: 'Un solo esqueleto de 4 bucles resuelve todas las preguntas de submatrices.'
  }
];

export function getAIPatternForLine(currentCodeLine, targetCode, currentIndex) {
  if (!targetCode) return AI_PATTERNS[0];

  // Look around the current cursor in code
  const nearbyCode = targetCode.substring(Math.max(0, currentIndex - 150), Math.min(targetCode.length, currentIndex + 200));

  for (const pattern of AI_PATTERNS) {
    for (const kw of pattern.match) {
      if (nearbyCode.includes(kw)) {
        return pattern;
      }
    }
  }

  return AI_PATTERNS[0];
}
