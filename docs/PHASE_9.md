# Fase 9 — Motor de etapas

## Implementado

TrainingRunner recibe classData, lessonData y masteryData; recorre trainingSequence, monta cada etapa con estado nuevo y entrega resultados por etapa a onComplete. DuoLessonRunner usa este motor para bases y variantes identificadas por rawAlgorithmId. Los nodos anteriores sin algoritmo conservan su controlador.

Se conservan los IDs y el callback existente de XP/progreso. Cerrar una sesión incompleta no otorga XP ni completa el nodo. La finalización se entrega una sola vez. No se cambia localStorage ni el Java canónico. El progreso dentro de una sesión todavía no se guarda al recargar.

Los diez componentes de etapas existen y tienen comportamiento inicial. Se respetan los pasos teachBeforePractice de los JSON. Las bases conceptuales con typingEnabled=false solo ejecutan explicación, traza y reconocimiento: su code.template se muestra como referencia, pero no se exige como código ejecutable.

Se añadieron trazas pedagógicas a Combinaciones, Permutaciones y Submatrices. Las dos primeras indican explícitamente que ejemplifican la variante sin repetición.

## Archivos creados

- src/components/training/TrainingRunner.jsx
- src/components/training/trainingSequence.js
- src/components/training/training.css
- src/components/training/stages/: ObserveStage, TraceStage, RecognizeStage, FillTokenStage, FillLineStage, OrderBlocksStage, GhostCodeStage, GuidedTypingStage, RecallStage, SpeedrunStage; AnswerStage y TypingStage compartidos.
- scripts/validate-training.mjs
- scripts/training-browser-check.cjs
- docs/PHASE_9.md y capturas training-desktop.png / training-mobile.png.

## Archivos modificados

- src/components/duo/DuoLessonRunner.jsx
- src/content/primer-parcial/04-combinaciones/base.json (traza)
- src/content/primer-parcial/05-permutaciones/base.json (traza)
- src/content/primer-parcial/07-submatrices/base.json (traza)

Los cambios previos del adaptador, la ruta y el resto del contenido se conservaron.

## Validación

- node scripts/validate-training.mjs: 36 secuencias y regresiones de comparación Java. Incluye contenido auxiliar; no representa 36 nodos de la ruta.
- npm run lint: sin errores; advertencias anteriores del proyecto.
- npx oxlint src/components/training: sin advertencias.
- npm run build: correcto; aviso de bundle mayor de 500 kB.
- Prueba Playwright en Edge: 1280x900 y 390x844; ruta real, primeras ocho etapas, traza, respuesta incorrecta/correcta, Ctrl+Enter, reinicio de estado, Escape, Recall sin referencia, Speedrun y callback final único.

Para repetir la prueba de navegador, iniciar npm run dev -- --host 127.0.0.1 y ejecutar node scripts/training-browser-check.cjs. Requiere Playwright y Edge; PLAYWRIGHT_MODULE permite indicar la ruta a un módulo Playwright instalado fuera del proyecto. No añade dependencias de producción.

## Pendiente en fases posteriores

Esta entrega establece el controlador de la fase 9 y versiones iniciales de etapas; no declara completas las fases 10–20.

- Observe: resaltado semántico por bloques y navegación más granular.
- Trace: representación visual de listas, pila y matrices; ahora avanza por pasos textuales.
- Recognize: actualmente respuesta escrita; faltan alternativas pedagógicas y atajos 1–4.
- Fill: priorización de fragmentos y feedback específico; el fallback de token es básico.
- Order: selección de líneas con deshacer; no drag-and-drop.
- Ghost: ocultamiento determinista de líneas; falta selección semántica de huecos.
- Guided: referencia y escritura libre; falta integración fina con TypingEngine y feedback por tecla.
- Recall/Speedrun: comparación de tokens y tiempo de intento; faltan precisión por pulsación, objetivos, récords y evaluación semántica. No se compila Java ni se aceptan implementaciones equivalentes.
- masteryData ya se propaga, pero no adapta dificultad ni persiste dominio; corresponde a las fases posteriores.
- Speedrun de clase y examen de clase siguen en el controlador anterior; su comportamiento pendiente no forma parte de esta fase.
