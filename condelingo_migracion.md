# CODELINGO — REFACTORIZACIÓN COMPLETA PARA “VARGAS MODE”
# PLAN DE IMPLEMENTACIÓN CRONOLÓGICO Y OBLIGATORIO

Estás trabajando sobre este repositorio:

https://github.com/Gerstep360/CodeLingo.git

OBJETIVO PRINCIPAL
==================

Convertir CodeLingo en una plataforma especializada en aprender,
recordar y escribir algoritmos Java de examen de forma:

1. comprensible,
2. progresiva,
3. mecánica,
4. rápida,
5. entretenida,
6. medible,
7. adaptable a los errores del alumno.

NO quiero solamente un “Duolingo de preguntas”.

La aplicación debe desarrollar 3 capacidades:

A. ENTENDER LA LÓGICA.
B. RECORDAR EL CÓDIGO SIN MIRAR.
C. ESCRIBIRLO RÁPIDO BAJO TIEMPO.

La finalidad real es un examen universitario donde prácticamente
hay que reconstruir algoritmos de memoria a gran velocidad.


==============================================================
REGLAS NO NEGOCIABLES
==============================================================

1. NO cambiar la lógica de los algoritmos del Ingeniero Vargas.

2. NO “optimizar” los códigos Java transformándolos en otra
   estrategia algorítmica.

3. Los códigos de referencia almacenados en el contenido son
   CANÓNICOS.

4. Una variante debe aprenderse como:

   ALGORITMO BASE
        +
   CAMBIO PEQUEÑO / DELTA

   NO como un algoritmo completamente distinto.

5. Prioridad pedagógica:

   PRECISIÓN
      ↓
   RECALL
      ↓
   VELOCIDAD

6. No medir éxito solamente con WPM/CPM.

7. Durante aprendizaje:
   mostrar ayuda.

8. Durante dominio:
   retirar ayuda progresivamente.

9. Durante examen:
   cero ayuda.

10. Toda la arquitectura educativa debe ser DATA-DRIVEN.

Añadir una nueva variante NO debe requerir crear componentes React.

Idealmente:

crear JSON
↓
guardar archivo
↓
CodeLingo lo descubre
↓
aparece automáticamente en la ruta.


==============================================================
FASE 0 — PROTEGER EL PROYECTO ANTES DE CAMBIAR NADA
==============================================================

ANTES de modificar la arquitectura:

1. Revisar el repositorio completo.

2. Identificar especialmente:

   src/App.jsx
   src/components/duo/
   src/data/curriculum/
   src/utils/defaultSnippets.js
   src/utils/duoStorage.js
   src/utils/codeParser.js
   src/hooks/useTypingEngine.js

3. Ejecutar:

   npm install
   npm run build
   npm run lint

4. Registrar cualquier error que YA exista.

5. Crear una rama de trabajo:

   refactor/vargas-learning-engine

6. NO eliminar todavía ninguna implementación antigua.

Primero crear la nueva arquitectura en paralelo.

7. Después de CADA fase importante ejecutar:

   npm run build
   npm run lint

No avanzar dejando el proyecto roto.


==============================================================
FASE 1 — CREAR LA NUEVA ARQUITECTURA DE CONTENIDO
==============================================================

Crear:

src/content/
└── ia-vargas/
    │
    ├── course.json
    │
    ├── templates/
    │   ├── class.template.json
    │   ├── base.template.json
    │   ├── variant.template.json
    │   └── exam.template.json
    │
    ├── 01-sumandos/
    │   ├── class.json
    │   ├── base.json
    │   └── exercises/
    │       ├── diferentes.json
    │       ├── pares.json
    │       └── rango.json
    │
    ├── 02-factores/
    │   ├── class.json
    │   ├── base.json
    │   └── exercises/
    │       ├── diferentes.json
    │       ├── primos.json
    │       └── rango.json
    │
    ├── 03-mochila/
    │   ├── class.json
    │   ├── base.json
    │   ├── shared/
    │   │   └── objeto.json
    │   └── exercises/
    │       ├── color.json
    │       ├── tamano.json
    │       └── peso-rango.json
    │
    ├── 04-combinaciones/
    │   ├── class.json
    │   ├── base.json
    │   └── exercises/
    │       ├── sin-repeticion.json
    │       └── con-repeticion.json
    │
    ├── 05-permutaciones/
    │   ├── class.json
    │   ├── base.json
    │   └── exercises/
    │       ├── sin-repeticion.json
    │       └── con-repeticion.json
    │
    ├── 06-determinante/
    │   ├── class.json
    │   ├── base.json
    │   ├── shared/
    │   │   ├── matriz.json
    │   │   ├── signo.json
    │   │   └── menor.json
    │   └── exercises/
    │       ├── cofactor.json
    │       ├── por-columna.json
    │       └── por-fila.json
    │
    └── 07-submatrices/
        ├── class.json
        ├── base.json
        ├── shared/
        │   └── submatriz.json
        └── exercises/
            ├── cuadradas.json
            ├── fila.json
            └── columna.json


==============================================================
FASE 2 — DEFINIR QUÉ SIGNIFICA UNA CLASE
==============================================================

Cada directorio representa UNA CLASE.

Ejemplo:

01-sumandos/

La clase completa es “SUMANDOS”.

Dentro:

base.json
=
algoritmo padre.

exercises/
=
variaciones del algoritmo padre.

Por tanto mentalmente:

SUMANDOS
│
├── BASE
├── DIFERENTES
├── PARES
└── RANGO


class.json NO debe contener todo el código.

Debe contener la descripción de la familia.

Ejemplo conceptual:

{
  "schemaVersion": 1,

  "id": "sumandos",
  "order": 1,
  "title": "Sumandos",
  "shortTitle": "Sumandos",
  "icon": "plus",
  "color": "green",

  "objective":
    "Reconstruir el algoritmo de Sumandos y sus variantes.",

  "mentalModel": {
    "phrase":
      "SUMO → CORTO → RECORRO → AGREGO → BAJO → QUITO",

    "corePattern":
      "add → recursion → removeLast"
  },

  "base": "./base.json",

  "exercises": [
    "./exercises/diferentes.json",
    "./exercises/pares.json",
    "./exercises/rango.json"
  ],

  "exam": {
    "enabled": true,
    "randomOrder": true
  }
}


==============================================================
FASE 3 — DEFINIR EL FORMATO DE base.json
==============================================================

base.json representa el algoritmo que se debe aprender primero.

Debe contener:

- id
- title
- type = "base"
- explicación extremadamente corta
- modelo mental
- anchors
- código Java canónico
- fragmentos críticos
- hints
- trainingSequence
- masteryRules

Ejemplo:

{
  "schemaVersion": 1,

  "id": "sumandos-base",
  "type": "base",
  "title": "Algoritmo Base",

  "logic": {
    "idea":
      "Construye listas cuya suma sea exactamente n.",

    "goldenRule":
      "k permite volver a usar el mismo número.",

    "anchors": [
      {
        "id": "measure",
        "label": "MEDIR",
        "memory": "Primero sé cuánto llevo.",
        "code": "int s=suma(L);"
      },

      {
        "id": "stop",
        "label": "CORTAR",
        "memory": "Si llegué o me pasé, paro.",
        "code": "if(s>=n)"
      },

      {
        "id": "solution",
        "label": "SOLUCIÓN",
        "memory": "Si es exactamente n, imprimo.",
        "code": "if(s==n)System.out.println(L);"
      },

      {
        "id": "loop",
        "label": "RECORRER",
        "memory": "Pruebo desde i.",
        "code": "for(int k=i;k<=n;k++)"
      },

      {
        "id": "backtrack",
        "label": "BACKTRACK",
        "memory": "AGREGO → BAJO → QUITO",
        "code":
          "L.add(k); sumandos(L,n,k); L.removeLast();"
      }
    ]
  },

  "code": {
    "language": "java",

    "target":
      "CÓDIGO CANÓNICO COMPLETO AQUÍ"
  },

  "criticalFragments": [
    {
      "id": "recursive-argument",
      "expected": "sumandos(L,n,k);",
      "concept": "repetition",
      "errorMessage":
        "BASE usa k porque todavía se puede repetir el número."
    },

    {
      "id": "undo",
      "expected": "L.removeLast();",
      "concept": "backtracking",
      "errorMessage":
        "Falta deshacer la elección antes de probar otro k."
    }
  ],

  "trainingSequence": [
    "observe",
    "trace",
    "recognize",
    "fill-token",
    "fill-line",
    "order-blocks",
    "ghost-30",
    "ghost-60",
    "guided-typing",
    "recall",
    "speedrun"
  ]
}


==============================================================
FASE 4 — DEFINIR LAS VARIANTES COMO DELTAS
==============================================================

Una variante debe tener DOS cosas:

1. el código completo canónico,
2. la diferencia respecto al padre.

NO generar el código final automáticamente a partir del delta.

Guardar el target COMPLETO para evitar errores.

El delta solamente se usa para enseñar.


Ejemplo:

Sumandos Diferentes.

BASE:

sumandos(L,n,k);

VARIANTE:

sumDif(L,n,k+1);


JSON:

{
  "id": "sumandos-diferentes",
  "type": "variant",
  "title": "Diferentes",

  "parent": "../base.json",

  "logic": {
    "idea":
      "Un mismo número no se puede volver a elegir.",

    "goldenRule":
      "NO REPETIR = k + 1",

    "delta": [
      {
        "type": "replace",
        "before": "sumandos(L,n,k);",
        "after": "sumDif(L,n,k+1);",
        "reason":
          "k+1 obliga a continuar desde el siguiente valor."
      }
    ]
  },

  "code": {
    "target":
      "CÓDIGO CANÓNICO COMPLETO"
  }
}


==============================================================
FASE 5 — CARGAR TODO AUTOMÁTICAMENTE
==============================================================

NO importar manualmente:

UNIT_1
UNIT_2
UNIT_3
etc.

Crear por ejemplo:

src/content/contentLoader.js


Utilizar:

import.meta.glob(
  '/src/content/ia-vargas/**/*.json',
  { eager: true }
)


El loader debe:

1. descubrir course.json,
2. descubrir class.json,
3. descubrir base.json,
4. descubrir variants,
5. resolver paths parent/base,
6. ordenar por order,
7. construir un árbol normalizado.

Resultado interno:

course
 └── classes[]
      └── base
      └── variants[]
      └── exam


Añadir validación.

Si algún JSON tiene:

ID repetido,
parent inexistente,
base inexistente,
target vacío,
type inválido,

mostrar error claro en consola en DEVELOPMENT.

NO permitir errores silenciosos.


==============================================================
FASE 6 — CREAR UN ADAPTADOR DE COMPATIBILIDAD
==============================================================

NO romper inmediatamente DUO_UNITS.

Crear temporalmente:

src/content/curriculumAdapter.js


Debe transformar:

nuevo árbol JSON

en:

la estructura que actualmente esperan:

DuoLearningPath
DuoLessonRunner


Esto permite migrar gradualmente.

Cuando todo funcione con el nuevo contenido,
recién entonces retirar los antiguos:

src/data/curriculum/unit*.js


==============================================================
FASE 7 — CAMBIAR LA RUTA VISUAL
==============================================================

La ruta NO debe presentar cada algoritmo como algo independiente.

Debe verse jerárquicamente.


EJEMPLO:

╔═════════════════════════════╗
║          SUMANDOS           ║
║ Suma hasta llegar a n       ║
╚═════════════════════════════╝

              ●
             BASE
              │
      ┌───────┼────────┐
      ▼       ▼        ▼
  DIFER.    PARES    RANGO
      └───────┼────────┘
              ▼
        ⚡ SPEEDRUN
              ▼
        🏆 EXAMEN


Después aparece la siguiente CLASE.


La jerarquía debe ser:

CURSO
  ↓
CLASE
  ↓
BASE
  ↓
VARIANTES
  ↓
SPEEDRUN
  ↓
EXAMEN DE CLASE


==============================================================
FASE 8 — NO DESBLOQUEAR VARIANTES ANTES DEL BASE
==============================================================

Regla:

BASE debe aprenderse primero.

Ejemplo:

Sumandos Base
↓
Sumandos Diferentes
↓
Sumandos Pares
↓
Sumandos Rango


Sin embargo:

después de dominar el BASE,
las variantes de la misma clase pueden practicarse en cualquier orden.

El examen de clase se desbloquea después de completar todas.


==============================================================
FASE 9 — CREAR UN NUEVO MOTOR DE LECCIÓN
==============================================================

DuoLessonRunner actualmente está orientado principalmente
a teoría + preguntas.

Convertirlo en un controlador de ESTAPAS.


Crear:

src/components/training/TrainingRunner.jsx

Y:

src/components/training/stages/


Componentes:

ObserveStage.jsx
TraceStage.jsx
RecognizeStage.jsx
FillTokenStage.jsx
FillLineStage.jsx
OrderBlocksStage.jsx
GhostCodeStage.jsx
GuidedTypingStage.jsx
RecallStage.jsx
SpeedrunStage.jsx


TrainingRunner recibe:

classData
lessonData
masteryData


Y va ejecutando:

lessonData.trainingSequence


==============================================================
FASE 10 — ETAPA 1: OBSERVE
==============================================================

Objetivo:

ver el algoritmo completo SIN exigir nada.


Mostrar:

NOMBRE
↓
IDEA
↓
ANCLAS
↓
CÓDIGO


NO mostrar una pared gigante de explicación.

Usar máximo:

1 idea,
1 regla de oro,
4-6 anchors.


Ejemplo Sumandos:

MEDIR
↓
CORTAR
↓
RECORRER
↓
AGREGO
↓
BAJO
↓
QUITO


Colorear visualmente los bloques.

NO usar colores diferentes aleatoriamente.

El mismo concepto debe conservar el mismo significado visual.


==============================================================
FASE 11 — ETAPA 2: TRACE
==============================================================

Animar UNA ejecución pequeña.

Ejemplo:

sumandos(L,4,1)


Visualizar:

L=[]
↓
add 1
↓
L=[1]
↓
recursión
↓
add 1
↓
L=[1,1]
...


Luego:

removeLast()

mostrar:

[1,1,1]
↓
[1,1]


La animación debe enseñar:

qué hace cada línea.

NO usar animación solamente decorativa.


==============================================================
FASE 12 — ETAPA 3: RECOGNIZE
==============================================================

Preguntas rápidas de 2-5 segundos.

Ejemplos:

SUMANDOS BASE:

¿RECURRE CON?

[k]
[k+1]


COMBI SR:

¿EL FOR COMIENZA EN?

[i]
[0]


PERMUT SR:

¿USA?

[contains]
[!contains]
[ninguno]


Estas preguntas son de discriminación rápida.


==============================================================
FASE 13 — ETAPA 4: FILL TOKEN
==============================================================

Mostrar:

sumDif(L,n,____);

El alumno escribe:

k+1


NO seleccionar opción.

DEBE ESCRIBIR.


Otro ejemplo:

if(k%2____0)

alumno:

==


Esto empieza a unir:

concepto
+
teclado.


==============================================================
FASE 14 — ETAPA 5: FILL LINE
==============================================================

Mostrar contexto pero ocultar una línea crítica.

Ejemplo:

L.add(k);

_____________________;

L.removeLast();


Debe escribir:

sumDif(L,n,k+1);


Comparar código ignorando diferencias irrelevantes
de espacios si estamos en modo aprendizaje.


==============================================================
FASE 15 — ETAPA 6: ORDER BLOCKS
==============================================================

Mostrar bloques:

L.removeLast();

sumandos(...);

L.add(k);


Alumno debe ordenar:

L.add
↓
recursión
↓
removeLast


IMPORTANTE:

evitar drag and drop obligatorio.

También permitir click-click o teclado.

La aplicación debe poder entrenarse rápido.


==============================================================
FASE 16 — GHOST CODE 30%
==============================================================

Mostrar código con aproximadamente 30% oculto.

Ocultar primero fragmentos IMPORTANTES,
no caracteres aleatorios.

Prioridad:

argumentos recursivos,
condiciones,
inicio de for,
contains,
casos base.


Ejemplo:

for(int k=__;k<L2.size();k++){
    L.add(__________);
    combiSR(L1,L2,r,____);
    L.removeLast();
}


==============================================================
FASE 17 — GHOST CODE 60%
==============================================================

Después esconder aproximadamente 60%.

Mantener solamente ANCLAS visuales.

Ejemplo:

CASO BASE
[usuario escribe]

RECORRIDO
[usuario escribe]

BACKTRACK
[usuario escribe]


==============================================================
FASE 18 — GUIDED TYPING
==============================================================

Reutilizar useTypingEngine.

Pero integrarlo DENTRO de la lección.

No obligar al alumno a abandonar la lección
e ir a una pestaña “Editor” aparte.


Mostrar a la izquierda/arriba solamente:

MEDIR
CORTAR
RECORRER
BACKTRACK


Código objetivo NO visible completo.


El usuario escribe toda la función.


==============================================================
FASE 19 — RECALL MODE
==============================================================

Pantalla prácticamente vacía.

Mostrar solamente:

SUMANDOS DIFERENTES

“Escribe el algoritmo.”


NO código.

NO ghost code.

NO autocompletar líneas.

Pueden conservarse:

auto-indentación,
pareo normal de llaves/paréntesis,

porque eso es comportamiento normal de un editor.


Añadir botón:

PISTA


PISTA 1:
modelo mental.

PISTA 2:
anchors.

PISTA 3:
línea crítica.

PISTA 4:
código completo.


Cada pista debe disminuir la puntuación del intento.


==============================================================
FASE 20 — SPEEDRUN
==============================================================

NO desbloquear Speedrun si la precisión todavía es mala.

Requisito recomendado:

accuracy >= 95%

y

al menos 1 recall completo.


Speedrun debe medir:

Tiempo
Accuracy
Errores
Pistas
Critical mistakes
CPM


CPM NO debe ser la métrica principal.


Mostrar primero:

PRECISIÓN
RECALL
TIEMPO
PISTAS

Luego:

CPM


==============================================================
FASE 21 — BASE + DELTA PARA TODAS LAS VARIANTES
==============================================================

Implementar pantalla:

“¿QUÉ CAMBIÓ?”


SUMANDOS:

BASE
sumandos(...,k)

DIFERENTES
sumDif(...,k+1)


PARES:

BASE:
sin filtro

PARES:
if(k%2==0)


RANGO:

BASE:
k<=n

RANGO:
k<=b


FACTORES:

BASE
n%(p*k)==0

PRIMOS
primo(k) && n%(p*k)==0


MOCHILA:

BASE
sin filtro adicional

COLOR
x.color.equals(c)

TAMAÑO
x.tam<=tam

PESO
x.peso>=a && x.peso<=b


COMBI:

SR
k+1

CR
k


PERMUT:

SR
!contains

CR
libre


DETERMINANTE:

BASE
columna 0

POR COLUMNA
columna j

POR FILA
fila i


SUBMATRICES:

CUADRADA
fil()==col()

FILA
fil()==1

COLUMNA
col()==1


==============================================================
FASE 22 — FEEDBACK SEMÁNTICO
==============================================================

NO responder solamente:

ERROR.


Crear:

src/learning/semanticEvaluator.js


Utilizar criticalFragments de cada JSON.


Ejemplo:

Esperado:

combiSR(L1,L2,r,k+1);


Alumno usa:

combiSR(L1,L2,r,k);


Feedback:

❌ CONFUNDISTE SR CON CR

COMBI SR:
sin repetir
→ avanzo
→ k+1

COMBI CR:
puede repetir
→ permanezco
→ k


Otro ejemplo:

olvida removeLast:

❌ FALTA RETROCEDER

AGREGO
↓
BAJO
↓
QUITO ← falta esto


Otro:

Permut SR usa k=i:

❌ ESTÁS PENSANDO COMO COMBINACIÓN

PERMUTACIÓN:
el orden importa
→ vuelvo a recorrer desde 0.


==============================================================
FASE 23 — CREAR ERROR HEATMAP
==============================================================

Guardar dominio por anchor.

Ejemplo:

COMBI SR

Caso base                100%
for k=i                   96%
add                        98%
recursión k+1              54%
removeLast                100%


Mostrar:

⚠ PUNTO DÉBIL

k+1


Botón:

ENTRENAR 30 SEGUNDOS


Entonces generar micro ejercicios SOLO sobre ese anchor.


==============================================================
FASE 24 — CAMBIAR EL MODELO DE PROGRESO
==============================================================

El actual completedNodes no es suficiente.

Extender storage.


Guardar por algoritmo:

{
  "sumandos-diferentes": {

    "mastery": 0.82,

    "attempts": 12,

    "perfectRecalls": 3,

    "logic": {
      "score": 0.91
    },

    "typing": {
      "accuracy": 0.97,
      "bestTime": 31.2,
      "cpm": 230
    },

    "hintsUsed": 2,

    "anchors": {
      "measure": 1,
      "stop": 0.95,
      "loop": 0.92,
      "recursive-call": 0.61,
      "undo": 1
    },

    "lastReviewed": "...",
    "nextReview": "..."
  }
}


Mantener migración compatible con el localStorage anterior.

NO destruir progreso existente.


==============================================================
FASE 25 — MASTERÍA
==============================================================

No marcar algoritmo como “dominado”
solamente porque terminó una pantalla.

Usar una heurística transparente.

Ejemplo:

40% recall
25% lógica
20% precisión
15% velocidad

Aplicar penalización por pistas.


No es necesario crear IA para esto.

Debe ser determinista y fácil de depurar.


DOMINADO:

mastery >= 0.85

y

2 recalls satisfactorios.


==============================================================
FASE 26 — AYUDA ADAPTATIVA
==============================================================

Crear niveles de soporte:


NIVEL 5
Código completo visible.

NIVEL 4
Ghost 30%.

NIVEL 3
Ghost 60%.

NIVEL 2
Solo anchors.

NIVEL 1
Solo regla de oro.

NIVEL 0
Solo nombre del algoritmo.


El nivel debe bajar cuando mejora.

NO obligar a un alumno que ya domina el código
a repetir 20 pantallas fáciles.


Si mastery alto:

saltar reconocimiento básico
y llevar directamente a recall/speedrun.


==============================================================
FASE 27 — EXAMEN DE CLASE
==============================================================

Cada clase debe tener examen propio.


Ejemplo:

EXAMEN SUMANDOS


Randomizar:

Base
Diferentes
Pares
Rango


Mostrar UNO por uno.


Pantalla vacía.

Sin ayudas.


Al terminar mostrar:

Lógica
Precisión
Tiempo
Errores críticos
Resultado por variante


NO revelar el código mientras el examen esté activo.


==============================================================
FASE 28 — VARGAS ROULETTE
==============================================================

Crear modo:

VARGAS ROULETTE


Mezclar ejercicios de clases ya aprendidas.

Ejemplo:

Sumandos Pares
↓
Permut CR
↓
Factores Primos
↓
Mochila Color
↓
Determinante
↓
Submatrices Cuadradas


Esto debe evitar aprender solamente
el orden del curso.


==============================================================
FASE 29 — MODO CONTRASTE
==============================================================

Crear minijuego:

VS / DIFERENCIAS


Ejemplo:

COMBI SR       COMBI CR

k+1            ?


Alumno escribe:

k


Otro:

PERMUT SR      PERMUT CR

!contains      ?


Respuesta:

libre


Otro:

SUMANDOS       FACTORES

suma           ?


Respuesta:

prod


Este modo debe priorizar algoritmos que el usuario confunde.


==============================================================
FASE 30 — REPASO ESPACIADO
==============================================================

Crear:

ReviewQueue


Cada algoritmo puede estar:

NEW
LEARNING
REVIEW
MASTERED


Usar nextReview.


No hace falta implementar un algoritmo científico complejo.

Crear un sistema simple configurable.

Ejemplo inicial:

aprendido
↓
10 minutos
↓
1 día
↓
3 días
↓
7 días


Si falla:

reducir intervalo.


Si acierta recall perfecto:

aumentar intervalo.


También crear:

CRAM MODE


Para estudiar antes del examen:

mezclar solamente:

débil
+
próximo a vencer
+
errores recientes


==============================================================
FASE 31 — PSICOLOGÍA DE LA INTERFAZ
==============================================================

Durante estudio activo:

NO mostrar 30 cosas simultáneamente.


Cuando se escribe código:

ocultar:

feed lateral innecesario,
estadísticas secundarias,
botones decorativos,
información que no ayuda.


Mantener:

tarea
progreso
timer cuando corresponda
anchors cuando corresponda.


Objetivo:

reducir distracciones.


==============================================================
FASE 32 — MICROSESIONES
==============================================================

Las actividades normales deben ser cortas.

Ideal:

5-30 segundos por micro ejercicio.


Ejemplo:

“¿k o k+1?”

2 segundos.


“Escribe línea recursiva”

5 segundos.


“Escribe for”

10 segundos.


“Escribe función”

30-90 segundos.


Evitar bloques de teoría de cinco minutos.


==============================================================
FASE 33 — GAMIFICACIÓN ÚTIL
==============================================================

Mantener:

XP
racha
combo
sonidos
confetti


Pero NO premiar solamente presionar teclas.


XP recomendado:

+5 reconocer patrón

+10 completar bloque

+15 escribir función guiada

+25 recall sin ayuda

+40 speedrun objetivo

+50 examen perfecto


Confetti grande solamente para:

dominar algoritmo,
dominar clase,
nuevo récord,
examen aprobado.


No lanzar una fiesta visual por responder:

"k+1".


==============================================================
FASE 34 — EXACTITUD ANTES QUE VELOCIDAD
==============================================================

Si el alumno escribe rápido pero tiene errores lógicos:

NO felicitar por CPM.


Ejemplo:

400 CPM
pero usa k en Combi SR.


Resultado:

❌ ERROR LÓGICO CRÍTICO


La puntuación debe priorizar:

1. lógica correcta,
2. código correcto,
3. precisión,
4. después velocidad.


==============================================================
FASE 35 — MODO EXAMEN GENERAL
==============================================================

Mantener el examen de 45 minutos.

Pero convertirlo en:

VARGAS MODE


Configuración:

45 minutos
cero hints
pantalla limpia
algoritmos randomizados
códigos completos


El alumno recibe algo como:

1. Sumandos Diferentes
2. Factores Primos
3. Mochila Tamaño
4. Combi SR
5. Determinante
6. Submatrices Fila


Debe escribir.


Al terminar:

DOMINIO GLOBAL
PRECISIÓN
RECALL
TIEMPO
ERROR POR CLASE
ERROR POR ANCHOR
ALGORITMO MÁS LENTO
ALGORITMO MÁS DÉBIL


Y botón:

ENTRENAR MIS ERRORES


==============================================================
FASE 36 — GENERAR SNIPPETS DESDE EL NUEVO CONTENIDO
==============================================================

Actualmente defaultSnippets usa archivos Java y extrae secciones.

Mantener ExamenEntrenamiento.java como referencia oficial,
pero generar automáticamente snippets de práctica desde:

code.target

de cada JSON.


Así el contenido educativo y el editor independiente
usan LA MISMA FUENTE DE VERDAD.


Evitar tener:

código A en curriculum
+
código B en snippets.


==============================================================
FASE 37 — CREAR TEMPLATE PARA NUEVAS CLASES
==============================================================

Quiero que añadir una clase futura sea sencillo.


Crear documentación:

docs/ADDING_CLASS.md


Debe explicar:

1. copiar directorio template,
2. editar class.json,
3. pegar código base,
4. crear variants,
5. definir delta,
6. definir criticalFragments,
7. ejecutar validator,
8. listo.


Ejemplo:

mañana aparece:

Sumandos Primos


Solamente:

01-sumandos/
exercises/
primos.json


NO tocar React.


==============================================================
FASE 38 — VALIDACIÓN AUTOMÁTICA
==============================================================

Crear script:

scripts/validate-content.mjs


Añadir a package.json:

"validate:content": "node scripts/validate-content.mjs"


Debe revisar:

JSON válido
IDs únicos
parents válidos
class base existente
targetCode no vacío
trainingSequence válida
criticalFragments válidos
orden válido


Añadir también:

npm run check


que ejecute:

validate:content
lint
build


==============================================================
FASE 39 — TESTS DE APRENDIZAJE
==============================================================

Añadir tests para casos críticos.


Por ejemplo:

Combi SR:
debe detectar k+1.

Combi CR:
debe detectar k.

Permut SR:
debe detectar !contains.

Permut CR:
no debe exigir contains.

Backtracking:
debe detectar removeLast.

Submatriz:
debe reconocer 4 índices.

Det:
debe reconocer llamada det(menor(...)).


No hace falta construir un compilador Java.

Evaluar patrones semánticos conocidos.


==============================================================
FASE 40 — MIGRAR EL CONTENIDO REAL
==============================================================

Una vez que el motor nuevo funcione,
cargar TODOS los algoritmos actuales.


CLASE SUMANDOS
---------------

Base
Diferentes
Pares
Rango


CLASE FACTORES
--------------

Base
Diferentes
Primos
Rango


CLASE MOCHILA
-------------

Base
Color
Tamaño
Peso rango


CLASE COMBINACIONES
-------------------

Sin repetición
Con repetición


CLASE PERMUTACIONES
-------------------

Sin repetición
Con repetición


CLASE DETERMINANTE
------------------

Base
Cofactor
Por columna
Por fila


CLASE SUBMATRICES
-----------------

Base
Cuadradas
Fila
Columna


Usar EXACTAMENTE los códigos canónicos de
ExamenVargas.java como target.


==============================================================
FASE 41 — RELACIONES ENTRE CLASES
==============================================================

Añadir relatedClasses.


FACTORES
relacionado con:
SUMANDOS


Mostrar:

SUMA
↓
PRODUCTO


COMBINACIONES
relacionado con:
PERMUTACIONES


Mostrar:

COMBI = tengo i
PERMUT = vuelvo a 0


DETERMINANTE
relacionado con:
SUBMATRICES / Matriz


Esto ayuda a reutilizar esquemas mentales.


==============================================================
FASE 42 — “RECOVERY PHRASES”
==============================================================

Mantener frases cortas.

No párrafos.


Ejemplos:

BACKTRACK
AGREGO → BAJO → QUITO


COMBI
TENGO i


COMBI SR
k+1


COMBI CR
k


PERMUT
VUELVO A 0


PERMUT SR
!contains


DETERMINANTE
SIGNO × ELEMENTO × det(MENOR)


SUBMATRIZ
INICIO i,j → FINAL a,b


Mostrar estas frases solamente como recordatorio,
NO como sustituto de practicar.


==============================================================
FASE 43 — MODO TECLADO
==============================================================

La aplicación está orientada a mecanografía.

Garantizar que TODO pueda hacerse con teclado.


Enter:
continuar.

1-4:
opciones rápidas.

Tab:
cuando tenga sentido.

Escape:
salir/cerrar.

Ctrl+Enter:
comprobar código.

R:
reintentar cuando terminó.

H:
solicitar hint cuando no estamos en examen.


Evitar requerir mouse constantemente.


==============================================================
FASE 44 — ACCESIBILIDAD Y FATIGA
==============================================================

No usar solamente color para comunicar correcto/error.

Agregar iconografía y texto.


Evitar animaciones constantes.

Respetar:

prefers-reduced-motion.


Sonidos:

permitir mute.


No reproducir error extremadamente fuerte
por cada tecla incorrecta.


==============================================================
FASE 45 — LIMPIAR LA ARQUITECTURA ANTIGUA
==============================================================

SOLO después de comprobar paridad funcional:

retirar o convertir en compatibilidad:

src/data/curriculum/unit1_...
unit2_...
etc.


duoLessonsData.js puede convertirse en
un re-export del nuevo loader.


NO eliminar:

TypingEngine
CodeParser
ExamMode

si todavía se reutilizan.


Eliminar únicamente código verdaderamente muerto.


==============================================================
FASE 46 — CRITERIOS FINALES DE ACEPTACIÓN
==============================================================

La refactorización NO está terminada hasta cumplir TODO esto:


A.

Puedo crear:

exercises/primos.json

y aparece automáticamente.


B.

No tuve que modificar React para agregarlo.


C.

Cada clase tiene:

base
variantes
speedrun
examen.


D.

La variante enseña primero:

qué cambió respecto al base.


E.

Existe:

Observe
Trace
Recognize
Fill Token
Fill Line
Order
Ghost
Guided Typing
Recall
Speedrun.


F.

Recall NO muestra el código.


G.

Speedrun no prioriza velocidad sobre exactitud.


H.

Errores críticos reciben feedback semántico.


I.

Existe mastery por algoritmo.


J.

Existe dominio por anchor.


K.

Existe entrenamiento automático de puntos débiles.


L.

Existe examen por clase.


M.

Existe Vargas Roulette.


N.

Existe Vargas Mode de 45 minutos.


O.

El progreso persiste al recargar.


P.

El progreso viejo se migra sin perderse.


Q.

npm run check pasa completamente.


R.

La UI funciona en desktop y móvil.


S.

Puede navegarse principalmente por teclado.


T.

NO se modificó la lógica Java canónica del Ingeniero.


==============================================================
FASE 47 — DOCUMENTAR
==============================================================

Crear:

docs/ARCHITECTURE.md
docs/CONTENT_SCHEMA.md
docs/ADDING_CLASS.md
docs/LEARNING_ENGINE.md


ARCHITECTURE:
cómo se conecta React con contenido.


CONTENT_SCHEMA:
explicar cada propiedad JSON.


ADDING_CLASS:
tutorial copiando un template.


LEARNING_ENGINE:
explicar stages, mastery, hints, review y semantic feedback.


==============================================================
FORMA DE TRABAJO OBLIGATORIA PARA EL AGENTE
==============================================================

NO implementar las 47 fases de golpe.

Trabajar cronológicamente.

Después de cada bloque:

1. explicar qué cambió,
2. listar archivos creados,
3. listar archivos modificados,
4. ejecutar validación,
5. ejecutar lint,
6. ejecutar build,
7. corregir errores,
8. recién continuar.


Agrupar implementación aproximadamente así:

SPRINT 1
Fases 0-6
Arquitectura y contenido.

SPRINT 2
Fases 7-18
Ruta jerárquica y stages básicos.

SPRINT 3
Fases 19-26
Recall, Speedrun, feedback y mastery.

SPRINT 4
Fases 27-35
Exámenes, Roulette, review y Vargas Mode.

SPRINT 5
Fases 36-47
Migración completa, QA, limpieza y documentación.


IMPORTANTE:

Antes de cada sprint leer el código existente
y reutilizar componentes cuando tenga sentido.

No reescribir todo por gusto.

Preservar estética Duolingo ya construida.

La prioridad es transformar la arquitectura pedagógica,
NO destruir la interfaz existente.


==============================================================
RESULTADO ESPERADO
==============================================================

CodeLingo debe enseñar así:


VEO EL ALGORITMO
      ↓
ENTIENDO SUS BLOQUES
      ↓
VEO CÓMO FUNCIONA
      ↓
RECONOZCO SUS REGLAS
      ↓
COMPLETO PALABRAS
      ↓
COMPLETO LÍNEAS
      ↓
ORDENO BLOQUES
      ↓
ESCRIBO CON GUÍA
      ↓
ESCRIBO SIN MIRAR
      ↓
REPITO LO QUE FALLO
      ↓
MEZCLO CON OTROS ALGORITMOS
      ↓
AUMENTO VELOCIDAD
      ↓
SIMULO EL EXAMEN REAL


Objetivo final:

que al aparecer:

“PERMUTACIÓN SIN REPETICIÓN”

el alumno piense automáticamente:

orden importa
→ vuelvo a k=0
→ no puedo repetir
→ !contains
→ add
→ recursión
→ removeLast

y sus manos puedan escribirlo sin tener que recordar
el código como una fotografía completa.