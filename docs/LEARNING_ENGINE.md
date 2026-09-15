# Motor de aprendizaje

## Etapas

`trainingSequence.js` convierte los nombres del JSON en categorías del runner:

| Categoría | Actividad |
| --- | --- |
| observe | Propósito, vocabulario, ejemplo, explicación por bloques y comparación base/variante. |
| trace | Recorrer estados de ejecución definidos en trace.steps. |
| recognize | Identificar una respuesta entre opciones. |
| fill-token / fill-line | Completar una parte concreta. |
| order-blocks | Reconstruir el orden de bloques. |
| guided-typing | Escribir con apoyo; incluye guided-copy y guided-rebuild. |
| ghost-code | Reconstruir con partes ocultas; incluye ghost-30 y ghost-60. |
| recall / speedrun | Escribir desde memoria o con tiempo. |

Los auxiliares tienen un observador específico: propósito, ejemplo entrada/salida y bloques explicados antes de la práctica.

## Adaptación y reanudación

Al inicio, dominio menor a 0.30 conserva la secuencia completa; desde 0.30 omite observaciones; desde 0.55 omite también escritura asistida; desde 0.85 prioriza recall/speedrun si existen. Un ejercicio perfecto puede saltar prácticas siguientes que el motor considera redundantes. Las sesiones se guardan con una firma del código y secuencia para evitar reanudar pasos incompatibles. El runner permite regresar al paso anterior.

## Escritura y corrección

`CodeInput` soporta Tab, Shift+Tab, indentación al pulsar Enter, selección y deshacer/rehacer. `useTrainingTyping` guarda borradores y mide escritura. El comparador normaliza formato y compara tokens Java; no penaliza espacios o saltos de línea por sí solos. El evaluador añade feedback sobre anclas y localiza diferencias.

Limitación: no ejecuta ni compila Java. No demuestra equivalencia de cualquier solución alternativa. Una implementación distinta puede necesitar soporte explícito en el comparador o evaluación por ejecución en una fase posterior. No describir el resultado como prueba completa de corrección semántica.

## Dominio y ayudas

`progress.js` combina 40% de recalls exitosos, 25% lógica, 20% precisión y 15% velocidad; descuenta 0.05 por pista del intento. El resultado se limita a 0–1. Dos recalls exitosos y dominio mínimo 0.85 producen MASTERED. Las anclas acumulan una media entre su puntuación anterior y la nueva.

Las pistas del ejercicio de escritura se presentan por niveles. Los resultados guardan pistas utilizadas, errores, precisión y tiempo. `supportLevel` traduce dominio a un nivel de apoyo. Actualmente speedrun está habilitado por `canSpeedrun()`; las restricciones de algunas plantillas no se aplican como bloqueo.

## Repaso y examen

Los intervalos de repaso son 10 minutos, 1 día, 3 días y 7 días. Un recall correcto avanza; un error reinicia el intervalo. La cola prioriza menor dominio. Cram incorpora próximos repasos y errores recientes. Roulette mezcla algoritmos aprendidos. Vargas Mode abre un simulacro de 45 minutos con feedback al finalizar.

La tarjeta Contraste aún utiliza reconocimiento: falta una modalidad independiente que compare y reconstruya deltas. Es una fase pendiente, no una capacidad completa del motor actual.

## Verificación

`npm test` verifica reglas del motor. `npm run validate:content` detecta IDs repetidos, referencias, secuencias, código y fragmentos incoherentes, además de auxiliares sin ejemplo o prácticas. El chequeo de navegador de auxiliares recorre el flujo real y comprueba indentación y ausencia de desbordamiento móvil.
