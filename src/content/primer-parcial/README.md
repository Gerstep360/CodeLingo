# Primer Parcial — CodeLingo Desde Cero v2

Esta versión convierte CodeLingo en el profesor principal, no en un simple sistema de repaso.

**Filosofía:** explicar → demostrar → construir → practicar → recordar → acelerar.

Todos los códigos Java canónicos existentes se conservan; se amplió la capa pedagógica alrededor de ellos.

Archivos clave nuevos:
- `fundamentals.json`
- `TEACH_FROM_ZERO.md`
- campos `fromZero` en cada `class.json`
- campos `teachBeforePractice` en bases y variantes
- templates actualizados a schema v2

---

# Templates CodeLingo v2

Estos templates están hechos con la misma estructura que usamos en los 7 temas reales:

1. Sumandos
2. Factores
3. Mochila
4. Combinaciones
5. Permutaciones
6. Determinante
7. Lista de SubMatrices

## Filosofía

Cada clase se aprende así:

BASE
→ entender anchors
→ practicar fragmentos críticos
→ comparar variantes por delta
→ escribir con menos ayuda
→ recall
→ speedrun
→ examen de clase

## Archivos

- `class.template.json`
  - Describe la familia completa.
  - Incluye `mentalModel`, `recoveryPhrases`, `shared`, `exercises`, `classExam`, `speedrun`, relaciones y contrastes.

- `base.template.json`
  - Mismo nivel de detalle que Sumandos/Factores/Mochila/etc.
  - Incluye `logic`, `anchors`, `code.signature`, `code.target`, `code.core`, `criticalFragments`, `trace`, `recognitionDrills`, `masteryRules`.

- `variant.template.json`
  - Diseñado como BASE + DELTA.
  - Incluye `before`, `after`, `focus`, `reason`, código canónico completo, comparación con base y microdrills.

- `shared.template.json`
  - Para auxiliares como `suma`, `prod`, `primo`, `Objeto`, `Matriz`, `signo`, `menor`, `subMatriz`.

- `exam.template.json`
  - Examen de clase sin hints y con métricas de lógica, precisión, tiempo y errores críticos.

- `contrast.template.json`
  - Para relaciones como Combi vs Permut o Sumandos vs Factores.

## Regla más importante

El `delta` sirve para ENSEÑAR.

`code.target` siempre debe guardar el CÓDIGO CANÓNICO COMPLETO.

Nunca generar el algoritmo final solamente aplicando deltas.

## Estructura recomendada

```text
XX-nombre-clase/
├── class.json
├── base.json
├── shared/
│   └── auxiliar-1.json
├── exercises/
│   ├── variante-1.json
│   ├── variante-2.json
│   └── variante-3.json
└── exam.json
```

En `example-class/` hay un esqueleto ya armado para copiar y renombrar.
