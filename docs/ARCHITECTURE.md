# Arquitectura

## Del JSON a la lección

1. `src/content/primer-parcial` contiene curso, clases, bases, ejercicios y auxiliares.
2. `contentLoader.js` descubre los JSON con `import.meta.glob`, excluye `templates`, agrupa por directorio y ordena clases y variantes por `order`.
3. `curriculumAdapter.js` transforma el contenido en unidades y nodos, y calcula sus bloqueos. Los auxiliares son nodos propios antes del algoritmo base.
4. `App.jsx` resuelve rutas dentro de `HashRouter`: `/#/path`, `/#/class/:classId`, `/#/lesson/:nodeId`, `/#/practice`, `/#/editor`.
5. `DuoClassPage` presenta auxiliares, base, variantes y desafíos. `HelperLessons` comparte las tarjetas de auxiliares con el camino de aprendizaje.
6. `DuoLessonPage` obtiene el contenido y abre el runner. `TrainingRunner` convierte `trainingSequence` en etapas y registra resultados.

## Componentes del motor

- `trainingSequence.js`: nombres de etapas, adaptación por dominio y saltos por rendimiento.
- `stages/`: presentación y ejercicios. `HelperObserveStage` muestra propósito, entrada/salida y bloques de auxiliares.
- `CodeInput`: edición Java con indentación y selección. `useTrainingTyping`: texto, métricas y borrador.
- `learning/javaComparison.js`: comparación de tokens y diferencias. `semanticEvaluator.js`: fragmentos críticos y feedback.
- `learning/progress.js`: dominio, XP, resultados y repasos. `ExamRunner`: simulacro con feedback al terminar.

## Estado y persistencia

El progreso didáctico vive en localStorage bajo `vargas_learning_v2`. El progreso del camino y preferencias generales usan `duoStorage`; el tema usa `vargas_theme`. Las sesiones del runner se guardan con prefijo `vargas_session_`. No hay sincronización con servidor: los datos pertenecen al navegador actual.

## Presentación

Las pantallas reutilizan los tokens del proyecto y los criterios de `DUOLINGO_UI_UX_SPEC.md`: tipografía redondeada, jerarquía clara, bordes con profundidad y CTA principal verde. Los auxiliares usan SVG de Lucide, código desplegable y ejemplos concretos; sus estilos están aislados en `helper-lessons.css`, `class-page.css` y `helper-observe.css`.

## Validación

`npm run check` ejecuta validador de contenido, pruebas del motor, lint y build. `scripts/helpers-browser-check.cjs` comprueba rutas hash, auxiliares, matrices, temas, ancho móvil e indentación en un servidor local de Vite. Requiere Playwright y Edge; puede recibir su módulo mediante `PLAYWRIGHT_MODULE`.
