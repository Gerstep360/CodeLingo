# Esquema del contenido

Los JSON se descubren por su ubicación. Un archivo desconocido no crea automáticamente una nueva modalidad de ejercicio. Las plantillas están en `src/content/primer-parcial/templates`.

## Campos comunes

| Campo | Uso |
| --- | --- |
| `schemaVersion` | Versión declarada del contenido; conviven formatos anteriores. |
| `id` | Identificador único y estable; también identifica progreso guardado. |
| `type` | Tipo de contenido: base, variant o shared. |
| `title`, `shortTitle`, `subtitle`, `purpose` | Textos de presentación; no introducir emoji para iconos. |
| `order` | Orden entero de clases o variantes. |
| `classId` | Clase de origen; el loader también la incorpora según directorio. |
| `parent`, `requires` | Referencias relativas a archivos existentes del curso. |
| `canonicalSource` | Activa comprobación del target contra ExamenVargas.java. |

## Clase: class.json

`objective` explica el resultado esperado. `icon` y `color` son claves de presentación. `mentalModel` agrupa `phrase`, `corePattern`, `roles` y `recoveryPhrases`. `base`, `shared` y `exercises` documentan relaciones, pero el loader descubre los archivos por directorio. `classExam` (o `exam`) configura el examen; `speedrun` describe su intención. No todas las restricciones declaradas se aplican: actualmente `canSpeedrun` permite acceso. `relatedClasses` y `contrastTable` describen relaciones y diferencias.

## Código y explicación

- `code.language`: Java. `code.target`: código completo de referencia; conservar operadores, literales y orden lógico. `code.template`: soporte conceptual cuando `typingEnabled` es falso.
- `logic.idea`, `goldenRule`, `mentalModel`: explicación y recordatorio. `logic.anchors`: objetos con `id`, `label`, `code`, `memory`. `logic.delta`: cambios de una variante.
- `memory.phrase`, `memory.anchors`: material de apoyo heredado.
- `teachBeforePractice`: capítulos usados por los observadores. Los nombres exactos se mapean en `INTRO_CHAPTERS` de `trainingSequence.js`; no inventar nuevas claves esperando que aparezcan automáticamente.
- `trainingSequence`: lista ordenada de etapas. Consultar LEARNING_ENGINE.md.
- `trace.steps`: pasos necesarios cuando existe una etapa trace.

## Auxiliares: shared/*.json

Además del código y secuencia, cada auxiliar debe tener:

- `fromZero.explanation`: explicación inicial en palabras sencillas; `title` es opcional. `beforeCode` y `practiceRule` son indicaciones editoriales.
- `teachingExample.input`, `output`, `caption`: ejemplo concreto. Entrada y salida admiten valor simple, lista, objeto o matriz. `states` muestra estados intermedios. `removeRow`/`removeColumn` marcan índices de una matriz menor; `selection` describe límites de una submatriz.
- `teachBeforePractice.chapter5_lineByLine.lines`: objetos `{code, explanation, label}`. Cada bloque debe pertenecer al target.
- Anclas completas y ejercicios acordes a su secuencia. El validador rechaza explicaciones o prácticas vacías.

## Evaluación

`criticalFragments` es una lista de objetos con `id` único, `anchor`, `concept`, `expected` o `forbidden`, y `errorMessage`. `expected` debe ser un fragmento contiguo del target; `forbidden` no puede aparecer en él. Estos fragmentos orientan el feedback; no sustituyen la comprobación global.

`microDrills` define ejercicios cortos. Para `fill-token`, usar `{type: "fill-token", prompt: "int s=____;", answer: "0", reason: "La suma empieza en cero."}`. Las preguntas de reconocimiento pueden usar opciones explícitas. Evitar preguntas ambiguas que exijan adivinar una frase textual.

El esquema es validado por `npm run validate:content`; los campos editoriales adicionales pueden conservarse, pero no todos se renderizan.
