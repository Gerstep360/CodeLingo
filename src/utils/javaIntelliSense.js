// Java IntelliSense & Autocomplete Definitions for IDE Experience

export const JAVA_INTELLISENSE_MAP = {
  'L': [
    { label: 'add(k)', detail: 'boolean add(E e)', type: 'method', insertText: 'add(', desc: 'Inserta el elemento al final de la lista' },
    { label: 'removeLast()', detail: 'E removeLast()', type: 'method', insertText: 'removeLast()', desc: 'Desapila el último elemento (Backtracking)' },
    { label: 'isEmpty()', detail: 'boolean isEmpty()', type: 'method', insertText: 'isEmpty()', desc: 'Verifica si la lista no contiene elementos' },
    { label: 'size()', detail: 'int size()', type: 'method', insertText: 'size()', desc: 'Retorna el número de elementos en la lista' },
    { label: 'contains(x)', detail: 'boolean contains(Object o)', type: 'method', insertText: 'contains(', desc: 'Verifica si el elemento está en la lista' },
    { label: 'clear()', detail: 'void clear()', type: 'method', insertText: 'clear()', desc: 'Remueve todos los elementos de la lista' },
    { label: 'get(k)', detail: 'E get(int index)', type: 'method', insertText: 'get(', desc: 'Obtiene el elemento en el índice dado' }
  ],
  'A': [
    { label: 'get(k)', detail: 'E get(int index)', type: 'method', insertText: 'get(', desc: 'Obtiene el elemento en el índice k' },
    { label: 'size()', detail: 'int size()', type: 'method', insertText: 'size()', desc: 'Retorna la cantidad total de elementos' },
    { label: 'contains(x)', detail: 'boolean contains(Object o)', type: 'method', insertText: 'contains(', desc: 'Comprueba si el valor existe' }
  ],
  'B': [
    { label: 'get(k)', detail: 'E get(int index)', type: 'method', insertText: 'get(', desc: 'Obtiene el elemento en el índice k' },
    { label: 'size()', detail: 'int size()', type: 'method', insertText: 'size()', desc: 'Retorna la cantidad total de elementos' },
    { label: 'contains(x)', detail: 'boolean contains(Object o)', type: 'method', insertText: 'contains(', desc: 'Comprueba si el valor existe' }
  ],
  'System.out': [
    { label: 'println(...)', detail: 'void println(Object x)', type: 'method', insertText: 'println(', desc: 'Imprime en consola con salto de línea' },
    { label: 'print(...)', detail: 'void print(Object x)', type: 'method', insertText: 'print(', desc: 'Imprime en consola sin salto de línea' }
  ],
  'System': [
    { label: 'out', detail: 'PrintStream out', type: 'property', insertText: 'out.', desc: 'Canal de salida estándar del sistema' }
  ],
  'M': [
    { label: 'length', detail: 'int length', type: 'property', insertText: 'length', desc: 'Número de filas en la matriz' }
  ],
  'S': [
    { label: 'length', detail: 'int length', type: 'property', insertText: 'length', desc: 'Número de filas en la matriz S' }
  ],
  'R': [
    { label: 'length', detail: 'int length', type: 'property', insertText: 'length', desc: 'Número de filas en la matriz R' }
  ],
  'Arrays': [
    { label: 'asList(...)', detail: 'List<T> asList(T... a)', type: 'method', insertText: 'asList(', desc: 'Crea una lista a partir de elementos variables' }
  ],
  'Math': [
    { label: 'floor(x)', detail: 'double floor(double a)', type: 'method', insertText: 'floor(', desc: 'Redondea hacia el entero inferior' },
    { label: 'max(a, b)', detail: 'int max(int a, int b)', type: 'method', insertText: 'max(', desc: 'Retorna el mayor entre dos números' },
    { label: 'min(a, b)', detail: 'int min(int a, int b)', type: 'method', insertText: 'min(', desc: 'Retorna el menor entre dos números' }
  ]
};

// Check if recent typed text just after a dot '.'
export function detectIntelliSenseTrigger(textBeforeCursor) {
  if (!textBeforeCursor) return null;

  // Match something like "L.", "l.", "System.out.", "M.", "M[0].", "l.a"
  const match = textBeforeCursor.match(/([a-zA-Z0-9_]+(?:\[[^\]]*\])?(?:\.[a-zA-Z0-9_]+)*)\.([a-zA-Z0-9_]*)$/);

  if (match) {
    const rawObjectPath = match[1]; // e.g. "L", "System.out", "M[0]", "l"
    const memberQuery = match[2] || ''; // e.g. "add" or ""

    // Clean array access like M[0] -> M
    const cleanObjectPath = rawObjectPath.replace(/\[.*?\]/g, '');

    // Case-insensitive lookup in JAVA_INTELLISENSE_MAP
    const mapKey = Object.keys(JAVA_INTELLISENSE_MAP).find(
      (k) => k.toLowerCase() === cleanObjectPath.toLowerCase()
    );

    if (mapKey) {
      const suggestions = JAVA_INTELLISENSE_MAP[mapKey];
      const filtered = suggestions.filter((s) =>
        s.label.toLowerCase().startsWith(memberQuery.toLowerCase())
      );
      if (filtered.length > 0) {
        return {
          objectPath: rawObjectPath,
          memberQuery,
          suggestions: filtered
        };
      }
    }
  }

  return null;
}
