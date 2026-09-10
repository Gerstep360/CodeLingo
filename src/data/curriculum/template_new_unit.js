// ==============================================================================
// PLANTILLA MODULAR PARA AGREGAR NUEVAS SECCIONES / TEMARIOS A CODELINGO
// ==============================================================================
// Instrucciones para añadir un nuevo tema:
// 1. Duplica este archivo como 'unit6_mi_tema.js' en esta misma carpeta.
// 2. Define tus clases con su 'theory' (concepto, código, regla de oro) y 'exercises'.
// 3. Agrega al final el nodo con 'isFinalExam: true' para el examen final de la sección.
// 4. Impórtalo en 'src/data/curriculum/index.js' y agrégalo al arreglo ALL_UNITS.
// ==============================================================================

export const TEMPLATE_NUEVO_TEMARIO = {
  id: 'unit-template',
  title: 'SECCIÓN X · NOMBRE DE TU TEMARIO',
  subtitle: 'Breve descripción del objetivo de aprendizaje',
  color: 'var(--duo-blue)', // Colores disponibles: var(--duo-green), var(--duo-blue), var(--duo-purple), var(--duo-yellow), var(--duo-orange)
  badge: 'Nuevo Tema',
  nodes: [
    // CLASE 1:
    {
      id: 'node-x-1',
      title: 'Título de la Clase 1',
      shortDesc: 'Resumen en 4 palabras del concepto',
      icon: 'zap', // 'zap', 'plus', 'repeat', 'help-circle', 'hash', 'briefcase', 'target', 'shuffle', 'list', 'grid'
      xp: 20,
      type: 'class',
      theory: {
        title: 'Clase: Nombre del Concepto',
        concept: 'Explicación clara y didáctica de lo que el alumno debe entender antes de resolver las preguntas.',
        codeExample: `// Código Java de muestra para la clase
void miMetodo(int n) {
    // 1. Caso base
    if (n == 0) return;
    // 2. Paso recursivo
    miMetodo(n - 1);
}`,
        goldenRule: 'Regla mnemotécnica que el alumno debe recordar para no equivocarse en el examen.'
      },
      exercises: [
        {
          type: 'choice', // 'choice' o 'code_blank' o 'trace'
          question: '¿Pregunta sobre el concepto explicado en la clase?',
          options: [
            { text: 'Opción correcta explicada', isCorrect: true },
            { text: 'Opción incorrecta o distractor', isCorrect: false },
            { text: 'Otra opción incorrecta', isCorrect: false }
          ],
          explanation: 'Explicación que aparecerá tanto si acierta como si falla para reforzar el aprendizaje.'
        }
      ]
    },

    // EXAMEN FINAL DE LA SECCIÓN:
    {
      id: 'node-x-exam',
      title: 'Examen Final: Nombre del Tema',
      shortDesc: 'Evaluación final del temario para desbloquear el siguiente',
      icon: 'trophy',
      xp: 35,
      type: 'final_exam',
      isFinalExam: true,
      theory: {
        title: 'Examen Final de Sección',
        concept: 'Preguntas integrales para evaluar el dominio completo de este tema.',
        goldenRule: 'Responde correctamente para conseguir la insignia de la sección.'
      },
      exercises: [
        {
          type: 'choice',
          question: '¿Pregunta integradora de examen?',
          options: [
            { text: 'Respuesta correcta integral', isCorrect: true },
            { text: 'Respuesta incorrecta', isCorrect: false }
          ],
          explanation: 'Retroalimentación profunda del examen.'
        }
      ]
    }
  ]
};
