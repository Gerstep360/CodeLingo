# Agregar una clase o variante

## Nueva clase

1. Copia `src/content/primer-parcial/templates/example-class` a un directorio hermano, por ejemplo `08-nueva-clase`. El contenido dentro de templates no se muestra.
2. Edita `class.json`: ID único, título, objetivo, orden y modelo mental. Sustituye todas las referencias de ejemplo.
3. Pega el código completo en `base.json` → `code.target`. Si pertenece al material canónico, declara `canonicalSource` y verifica que exista en ExamenVargas.java. No cambies ese archivo para silenciar errores del validador.
4. Crea variantes en `exercises/`. Cada una necesita ID propio, orden único dentro de la clase y `parent: "../base.json"`.
5. Explica `logic.delta`: qué cambia, por qué y qué se conserva. Completa los capítulos que utiliza su secuencia.
6. Define `criticalFragments` con fragmentos exactos del target y mensajes útiles. Añade ejercicios cortos concretos.
7. Para auxiliares, copia `templates/shared.template.json` a `shared/`. La plantilla contiene un ejemplo funcional de suma: sustituye también entrada/salida, bloques, anclas y respuestas al cambiar el método.
8. Ejecuta `npm run validate:content`, después `npm run check`. Abre el camino y recorre explicación, ejemplo y primer ejercicio en escritorio y móvil.

El loader descubre la nueva clase sin modificar React. El orden y los requisitos del camino pueden dejarla bloqueada hasta completar la clase anterior.

## Una nueva variante de Sumandos

Crea `01-sumandos/exercises/primos.json` desde `variant.template.json`. Usa un ID como `sumandos-primos`, un `order` libre y referencia `../base.json`. Añade el código autorizado y explica la nueva condición. Si necesita un auxiliar, añádelo a `shared/` y documenta su relación. Ejecuta las mismas validaciones.

## Antes de darla por terminada

No dejes textos como CÓDIGO CANÓNICO o variantes ficticias de la plantilla. Comprueba que las preguntas tienen respuesta inequívoca, que las explicaciones coinciden con los ejemplos y que cada etapa tiene datos. Cambiar un ID crea una identidad de progreso nueva; no lo renombres como corrección cosmética.
