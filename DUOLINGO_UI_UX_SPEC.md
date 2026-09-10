# SPEC UI/UX — Experiencia tipo Duolingo para una app web de aprendizaje de código

> Documento de ingeniería visual + UX para reproducir **la sensación, jerarquía, interacción y gamificación de Duolingo** en una app web de entrenamiento de algoritmos.
>
> Fecha de análisis: septiembre de 2026.
>
> **Importante:** los colores de marca, tipografías públicas de sustitución y principios documentados vienen de fuentes oficiales de Duolingo. Los valores de radios, sombras, tamaños y duraciones marcados como **RECONSTRUCCIÓN** son aproximaciones prácticas obtenidas al analizar capturas y patrones de la interfaz; Duolingo no publica todos sus tokens internos.
>
> No copies el logotipo, Duo, personajes, sonidos ni Feather Bold. Para una app propia, copia **el lenguaje de interacción**, no los activos protegidos.

---

# 1. QUÉ HACE QUE DUOLINGO "SE SIENTA" COMO DUOLINGO

La interfaz no depende de una sola cosa. Su sensación viene de combinar:

1. **Jerarquía extrema:** una sola acción principal por pantalla.
2. **Formas redondeadas y gruesas:** botones, tarjetas, nodos, barras.
3. **Colores planos muy saturados:** verde, azul, rojo, amarillo.
4. **Profundidad falsa tipo juguete:** borde/sombra inferior gruesa en botones.
5. **Tipografía redondeada y pesada.**
6. **Microanimaciones frecuentes pero cortas.**
7. **Feedback inmediato después de cada respuesta.**
8. **Contenido presentado en pasos diminutos.**
9. **Progreso siempre visible.**
10. **Personajes/mascotas que reaccionan al rendimiento.**
11. **Espacio en blanco abundante.**
12. **No sobrecargar la pantalla con controles secundarios.**
13. **Rutas de progreso visuales en vez de menús académicos tradicionales.**
14. **Gamificación integrada al aprendizaje, no como una pantalla separada.**
15. **Copy corto, amistoso, directo y un poco juguetón.**

La regla visual principal es:

```text
UNA COSA IMPORTANTE
+
UN CTA OBVIO
+
FEEDBACK DIVERTIDO
+
SIGUIENTE PASO
```

---

# 2. PRINCIPIOS DE UX QUE DEBES REPLICAR

## 2.1 Una decisión principal por momento

Durante una lección, el usuario no debe preguntarse:

> "¿Qué hago ahora?"

Siempre hay una acción dominante:

```text
RESPONDER
↓
COMPROBAR
↓
RECIBIR FEEDBACK
↓
CONTINUAR
```

Tu app de código debería usar exactamente el mismo loop:

```text
ENTENDER
↓
RESPONDER / ESCRIBIR
↓
COMPROBAR
↓
EXPLICACIÓN VISUAL
↓
CONTINUAR
```

---

## 2.2 Progressive disclosure

Duolingo no muestra todo el contenido de una lección a la vez.

Para tu app:

```text
NO:
┌────────────────────────────────────┐
│ explicación                        │
│ teoría                             │
│ código completo                    │
│ árbol recursivo                    │
│ preguntas                          │
│ estadísticas                       │
│ cronómetro                         │
└────────────────────────────────────┘
```

Haz:

```text
PASO 1
"¿Qué hace este algoritmo?"

↓ continuar

PASO 2
"Observa cómo cambia L"

↓ continuar

PASO 3
"Completa esta línea"

↓ continuar

PASO 4
"Escríbelo tú"
```

---

## 2.3 Bite-sized learning

Cada ejercicio debe durar aproximadamente:

```text
5–40 segundos
```

y solo evaluar **una idea**.

Ejemplo:

```text
Pregunta:
¿Por qué combiSR usa k+1?

A) Para avanzar sin reutilizar el elemento
B) Para reiniciar la lista
C) Para ordenar L
D) Para salir de la recursión
```

No preguntes tres conceptos en la misma tarjeta.

---

## 2.4 Siempre mostrar progreso

Durante una lección:

```text
X    ███████████░░░░░░     7/12
```

El usuario debe saber que el final está cerca.

El progreso reduce la sensación de esfuerzo infinito.

---

# 3. ARQUITECTURA GENERAL

## 3.1 Desktop web

La experiencia web clásica de Duolingo usa tres zonas:

```text
┌───────────────┬───────────────────────────┬─────────────────────┐
│               │                           │                     │
│   SIDEBAR     │       CONTENIDO           │     RIGHT RAIL      │
│   220–260 px  │       600–720 px          │     300–360 px      │
│               │                           │                     │
│   Inicio      │       Ruta                │   Racha             │
│   Practicar   │       Lecciones           │   XP                │
│   Ranking     │       Ejercicios          │   Misiones          │
│   Perfil      │                           │   Progreso          │
│               │                           │                     │
└───────────────┴───────────────────────────┴─────────────────────┘
```

### RECONSTRUCCIÓN recomendada

```css
--sidebar-width: 256px;
--main-width: 640px;
--right-rail-width: 340px;
--page-gap: 32px;
--page-max-width: 1280px;
```

En pantallas medianas:

```text
SIDEBAR + CONTENIDO
```

Oculta el right rail.

En móvil:

```text
CONTENIDO
+
BOTTOM NAV
```

---

# 4. LAYOUT DE TU APP

## Desktop ≥ 1180 px

```text
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  CODELINGO      ┌────────────────────┐  🔥 4   ⭐ 780         │
│                 │                    │                         │
│  🏠 Aprender    │   RUTA / LESSON    │  RACHA                 │
│  🧠 Practicar   │                    │  ███████░               │
│  🏆 Progreso    │                    │                         │
│  📊 Dominio     │                    │  OBJETIVO DIARIO        │
│  👤 Perfil      │                    │  34 / 50 XP             │
│                 │                    │                         │
│                 └────────────────────┘                         │
└───────────────────────────────────────────────────────────────┘
```

## Tablet 760–1179 px

```text
sidebar 84 px
+
main 640 px
```

Solo iconos en sidebar.

## Mobile < 760 px

```text
┌────────────────────┐
│ header compacto    │
│                    │
│ contenido          │
│                    │
│                    │
├────────────────────┤
│ 🏠 🧠 🏆 📊 👤     │
└────────────────────┘
```

---

# 5. PALETA OFICIAL DE DUOLINGO

Fuente oficial: Duolingo Brand Guidelines — Color.

## Colores principales

| Token | Nombre oficial | HEX | Uso |
|---|---|---:|---|
| `green-500` | Feather Green | `#58CC02` | CTA, éxito, progreso |
| `green-300` | Mask Green | `#89E219` | fondos verdes claros |
| `text-900` | Eel | `#4B4B4B` | texto principal |
| `white` | Snow | `#FFFFFF` | fondo |

## Colores secundarios

| Token | Nombre | HEX | Uso recomendado |
|---|---|---:|---|
| `blue-500` | Macaw | `#1CB0F6` | información, selección |
| `red-500` | Cardinal | `#FF4B4B` | error |
| `yellow-500` | Bee | `#FFC800` | XP, recompensa |
| `orange-500` | Fox | `#FF9600` | racha |
| `purple-400` | Beetle | `#CE82FF` | niveles especiales |
| `blue-700` | Humpback | `#2B70C9` | azul profundo |

## Neutrales oficiales

| Token | HEX |
|---|---:|
| `eel` | `#4B4B4B` |
| `wolf` | `#777777` |
| `hare` | `#AFAFAF` |
| `swan` | `#E5E5E5` |
| `polar` | `#F7F7F7` |
| `snow` | `#FFFFFF` |

---

# 6. TOKENS SEMÁNTICOS PARA TU APP

No uses colores directamente en componentes.

Usa tokens semánticos:

```css
:root {
  --brand: #58CC02;
  --brand-light: #89E219;

  --info: #1CB0F6;
  --danger: #FF4B4B;
  --warning: #FFC800;
  --streak: #FF9600;
  --special: #CE82FF;

  --text-primary: #4B4B4B;
  --text-secondary: #777777;
  --text-muted: #AFAFAF;

  --border: #E5E5E5;
  --surface-soft: #F7F7F7;
  --surface: #FFFFFF;
}
```

---

# 7. COLORES FUNCIONALES RECOMENDADOS

Estos no son todos tokens oficiales de Duolingo; son **RECONSTRUCCIÓN** para conseguir el mismo efecto.

```css
:root {
  --green-main: #58CC02;
  --green-shadow: #46A302;
  --green-soft: #D7FFB8;

  --blue-main: #1CB0F6;
  --blue-shadow: #168CC5;
  --blue-soft: #DDF4FF;

  --red-main: #FF4B4B;
  --red-shadow: #D33131;
  --red-soft: #FFDADA;

  --yellow-main: #FFC800;
  --yellow-shadow: #D7A900;
  --yellow-soft: #FFF5C2;

  --purple-main: #CE82FF;
  --purple-shadow: #A85ED6;
  --purple-soft: #F3E1FF;

  --gray-button: #E5E5E5;
  --gray-shadow: #CBCBCB;
}
```

---

# 8. MODO OSCURO

Duolingo actualmente muestra ejercicios en modo oscuro en algunos contextos/plataformas.

Para tu implementación:

```css
[data-theme="dark"] {
  --surface: #131F24;
  --surface-raised: #202F36;
  --surface-soft: #1A2A30;

  --text-primary: #F7F7F7;
  --text-secondary: #B7C4C9;
  --text-muted: #7C8D93;

  --border: #37464F;

  --brand: #58CC02;
  --info: #1CB0F6;
  --danger: #FF4B4B;
  --warning: #FFC800;
}
```

No conviertas el verde en pastel en dark mode. Duolingo mantiene los colores de estado saturados.

---

# 9. TIPOGRAFÍA

Duolingo documenta:

- **Feather Bold** para titulares; es una tipografía propietaria.
- **DIN Next Rounded** para cuerpo y subtítulos.
- **Nunito** como sustituto oficial cuando no están disponibles sus fuentes.

Para tu app:

```css
font-family:
  "Nunito",
  system-ui,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

## Pesos

```text
400 → cuerpo secundario
600 → labels
700 → cuerpo enfatizado
800 → botones / títulos
900 → números importantes
```

## Escala recomendada

```css
--font-xs:   12px;
--font-sm:   14px;
--font-md:   16px;
--font-lg:   18px;
--font-xl:   22px;
--font-2xl:  26px;
--font-3xl:  32px;
--font-hero: 40px;
```

## Estilo

Duolingo evita tipografía delicada.

Usa:

```css
font-weight: 700;
letter-spacing: 0.1px;
line-height: 1.35;
```

Para botones:

```css
font-weight: 800;
letter-spacing: 0.8px;
text-transform: uppercase;
```

No abuses del uppercase en títulos.

---

# 10. SHAPE LANGUAGE

La forma visual de Duolingo es:

```text
GRUESA
REDONDA
AMIGABLE
GEOMÉTRICA
```

No uses:

```text
border-radius: 4px;
```

Usa:

```text
8px   → chips pequeños
12px  → inputs
16px  → cards
20px  → botones grandes
24px  → modal/card destacada
999px → pills y barras
```

## Tokens

```css
--radius-xs: 8px;
--radius-sm: 12px;
--radius-md: 16px;
--radius-lg: 20px;
--radius-xl: 24px;
--radius-pill: 999px;
```

---

# 11. EL BOTÓN "DUOLINGO"

Este componente es probablemente el detalle más importante.

No es un botón plano.

Visualmente:

```text
┌──────────────────────────────┐
│          CONTINUAR           │
└──────────────────────────────┘
      ██████████████████
       sombra inferior
```

La profundidad es una especie de borde inferior.

## Implementación

```css
.duo-button {
  min-height: 50px;
  padding: 0 24px;

  border: 0;
  border-radius: 16px;

  background: var(--green-main);
  color: white;

  font-weight: 800;
  font-size: 15px;
  letter-spacing: .7px;

  box-shadow: 0 5px 0 var(--green-shadow);

  cursor: pointer;

  transition:
    transform 90ms ease,
    box-shadow 90ms ease,
    filter 120ms ease;
}
```

## Hover

```css
.duo-button:hover {
  filter: brightness(1.03);
}
```

## Press

```css
.duo-button:active {
  transform: translateY(4px);
  box-shadow: 0 1px 0 var(--green-shadow);
}
```

Esto crea el efecto:

```text
botón elevado
↓ click
se hunde físicamente
↓ release
vuelve a subir
```

---

# 12. BOTÓN DESHABILITADO

Duolingo hace que el estado disabled sea absolutamente obvio.

```css
.duo-button:disabled {
  background: #E5E5E5;
  color: #AFAFAF;
  box-shadow: 0 5px 0 #CBCBCB;
  cursor: default;
}
```

No usar solo `opacity: .5`.

El componente sigue teniendo volumen, pero parece de piedra/gris.

---

# 13. BOTÓN SECUNDARIO

```css
.duo-button-secondary {
  min-height: 48px;
  border-radius: 16px;

  background: white;
  color: #1CB0F6;

  border: 2px solid #E5E5E5;
  box-shadow: 0 3px 0 #E5E5E5;

  font-weight: 800;
}
```

---

# 14. BOTÓN DE PELIGRO / ERROR

```css
background: #FF4B4B;
box-shadow: 0 5px 0 #D33131;
```

---

# 15. OPCIONES DE RESPUESTA

Una opción no debe parecer un enlace.

Debe parecer una pieza física seleccionable.

```text
┌───────────────────────────────┐
│  A   k + 1                    │
└───────────────────────────────┘
```

## Normal

```css
.answer {
  min-height: 56px;

  background: #FFF;
  border: 2px solid #E5E5E5;
  border-bottom-width: 4px;

  border-radius: 14px;

  color: #4B4B4B;

  padding: 12px 16px;
}
```

## Hover

```css
background: #F7F7F7;
```

## Seleccionada

```css
background: #DDF4FF;
border-color: #1CB0F6;
color: #168CC5;
```

## Correcta

```css
background: #D7FFB8;
border-color: #58CC02;
color: #46A302;
```

## Incorrecta

```css
background: #FFDADA;
border-color: #FF4B4B;
color: #D33131;
```

---

# 16. WORD TILES → CODE TILES

Duolingo usa piezas de palabras.

Para tu app haz **code tiles**:

```text
┌──────────────┐  ┌────────────────┐
│ L.add(k);    │  │ removeLast();  │
└──────────────┘  └────────────────┘
```

CSS:

```css
.code-tile {
  padding: 10px 14px;
  border: 2px solid var(--border);
  border-bottom-width: 4px;
  border-radius: 12px;
  background: white;

  font-family: "JetBrains Mono", monospace;
  font-weight: 600;
}
```

Aunque el resto use Nunito, el código debe seguir usando monospace.

---

# 17. CARDS

Duolingo moderno redujo el uso indiscriminado de contenedores y usa whitespace con más intención.

Usa cards solo cuando agrupen algo conceptual.

```css
.card {
  background: var(--surface);
  border: 2px solid var(--border);
  border-radius: 18px;
  padding: 20px;
}
```

No uses sombra difusa tipo Material:

```css
/* EVITAR */
box-shadow: 0 20px 40px rgba(0,0,0,.15);
```

La estética Duolingo depende más de:

```text
borde claro
+
sombra inferior simple
```

que de elevación suave.

---

# 18. SIDEBAR

## Desktop

Cada elemento:

```text
┌────────────────────────┐
│ 🏠  APRENDER           │
└────────────────────────┘
```

### Tamaño recomendado

```css
height: 52px;
padding: 0 14px;
border-radius: 12px;
gap: 14px;
```

### Inactivo

```text
fondo transparente
texto #777
```

### Activo

```css
background: #DDF4FF;
border: 2px solid #84D8FF;
color: #1CB0F6;
```

Icono y texto fuertes.

No uses una barrita vertical estilo dashboard empresarial.

---

# 19. BOTTOM NAV MOBILE

5–6 acciones máximo.

```text
🏠     🧠     🏆     🔔     👤
```

Reglas:

```text
altura: 68–80 px
fondo: superficie
border-top: 2px solid #E5E5E5
icono activo: color
iconos inactivos: gris
```

No pongas texto debajo si la pantalla es muy pequeña.

---

# 20. HEADER DE LECCIÓN

Patrón:

```text
X      ██████████████░░░░       ❤️ 4
```

Para tu app:

```text
X      ██████████████░░░░       ⚡ 8
```

o:

```text
X      ██████████████░░░░       7/10
```

No necesitas vidas durante modo examen si eso perjudica aprendizaje.

---

# 21. PROGRESS BAR

Forma:

```text
╭────────────────────────────────╮
│██████████████████              │
╰────────────────────────────────╯
```

CSS:

```css
.progress {
  height: 16px;
  background: #E5E5E5;
  border-radius: 999px;
  overflow: hidden;
}

.progress__fill {
  height: 100%;
  border-radius: inherit;
  background: #58CC02;
}
```

Añade highlight:

```css
.progress__fill::after {
  content: "";
  display: block;
  height: 4px;
  margin: 3px 8px;
  background: rgba(255,255,255,.25);
  border-radius: 999px;
}
```

---

# 22. ANIMACIÓN DE LA BARRA

**RECONSTRUCCIÓN objetivo:**

```css
transition:
  width 420ms cubic-bezier(.2,.8,.2,1);
```

Cuando aumenta:

```text
ancho actual
↓
se desliza
↓
pequeño bounce final
```

Opcional con Framer Motion:

```js
transition={{
  duration: .42,
  ease: [0.2, 0.8, 0.2, 1]
}}
```

---

# 23. FEEDBACK CORRECTO

Una de las firmas de Duolingo:

```text
contenido normal

────────────────────────────

┌──────────────────────────────┐
│ ✓ ¡Correcto!                 │
│                              │
│              [ CONTINUAR ]   │
└──────────────────────────────┘
```

El footer cambia de color.

## Fondo

```css
#D7FFB8
```

## Título

```css
#46A302
```

## CTA

```css
#58CC02
```

## Animación

1. footer sube desde abajo;
2. check hace pop;
3. opcional: personaje celebra;
4. botón queda disponible.

---

# 24. FEEDBACK INCORRECTO

```text
┌──────────────────────────────┐
│ ✕ Casi                      │
│                              │
│ La llamada correcta usa      │
│ k + 1 porque no repetimos.   │
│                              │
│              [ CONTINUAR ]   │
└──────────────────────────────┘
```

Colores:

```text
background  #FFDADA
title       #D33131
CTA         #FF4B4B
```

Regla UX:

> No mostrar solo “Incorrecto”.

Siempre explicar **una razón concreta**.

---

# 25. ANIMACIÓN DE RESPUESTA CORRECTA

Secuencia recomendada:

```text
t=0ms      respuesta se valida
t=60ms     opción pasa a verde
t=80ms     check escala 0.7 → 1.12
t=160ms    check vuelve 1.12 → 1
t=120ms    panel inferior empieza a subir
t=300ms    sonido corto / mascot reaction
```

### CSS

```css
@keyframes pop {
  0%   { transform: scale(.70); }
  60%  { transform: scale(1.12); }
  100% { transform: scale(1); }
}
```

Duración:

```css
260ms cubic-bezier(.2,.9,.3,1.2)
```

---

# 26. ANIMACIÓN DE ERROR

No hagas una explosión roja.

Usa un shake corto:

```css
@keyframes shake {
  0%,100% { transform: translateX(0); }
  25%     { transform: translateX(-5px); }
  50%     { transform: translateX(5px); }
  75%     { transform: translateX(-3px); }
}
```

Duración:

```text
280–360 ms
```

---

# 27. TRANSICIÓN ENTRE EJERCICIOS

Evita páginas completas recargando.

Usa:

```text
ejercicio actual
↓ fade + translateX(-12)
nuevo
↓ fade + translateX(+12 → 0)
```

Duración:

```text
180–240 ms
```

No uses transiciones de 800 ms; se sienten lentas al responder rápido.

---

# 28. BOTÓN PRESS ANIMATION

Para absolutamente todos los botones físicos:

```text
mousedown:
  translateY(4px)
  shadow 5px → 1px

mouseup:
  translateY(0)
  shadow 1px → 5px
```

Duración:

```text
80–100 ms
```

Esta microinteracción debe sentirse instantánea.

---

# 29. HOVER DE TARJETAS

Muy pequeño.

```css
transform: translateY(-1px);
filter: brightness(1.01);
```

No:

```css
transform: scale(1.08);
```

Duolingo es juguetón, pero no parece una landing page.

---

# 30. ANIMACIÓN DE NODOS DE RUTA

Un nodo activo puede:

```text
idle:
scale 1.00

cada 2–3 segundos:
1.00 → 1.05 → .98 → 1.00
```

Duración total:

```text
550–700 ms
```

No todos los nodos deben animarse simultáneamente.

Solo:

```text
nodo actual
mascota cercana
recompensa disponible
```

---

# 31. MASCOTA / PERSONAJES

Duolingo usa personajes como:

- guía;
- celebración;
- corrección;
- recompensa;
- descanso visual;
- señal de atención.

Para tu app crea tu propio personaje.

Estados mínimos:

```text
idle
thinking
happy
celebrate
wrong-but-supportive
streak
level-up
sleepy
```

---

# 32. RIVE

Duolingo ha documentado que usa **Rive** para animaciones interactivas de personajes, incluyendo state machines.

Para tu app:

```text
Rive
├── state: idle
├── state: listening
├── state: correct
├── state: wrong
├── state: combo
└── state: level_up
```

Inputs:

```text
isCorrect: boolean
combo: number
mastery: number
isIdle: boolean
```

---

# 33. CUÁNDO USAR CSS, RIVE Y JS

```text
CSS:
- hover
- press
- progress
- shake
- pop
- slide
- fade

Rive:
- mascota
- personajes
- animaciones complejas
- reacciones

Framer Motion:
- cambio de tarjetas
- layout animations
- route nodes
- modals
```

No uses Rive para un simple botón.

---

# 34. MOTION TOKENS

**RECONSTRUCCIÓN recomendada:**

```css
--motion-instant: 90ms;
--motion-fast: 160ms;
--motion-base: 240ms;
--motion-slow: 420ms;
--motion-celebrate: 650ms;
```

Easing:

```css
--ease-standard: cubic-bezier(.2,.8,.2,1);
--ease-pop: cubic-bezier(.2,.9,.3,1.2);
--ease-out: cubic-bezier(0,0,.2,1);
```

---

# 35. REDUCED MOTION

Obligatorio:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    transition-duration: 1ms !important;
  }
}
```

La app debe seguir funcionando sin animaciones.

---

# 36. RUTA DE APRENDIZAJE

La pantalla principal de Duolingo no se siente como:

```text
Curso
├─ Capítulo
├─ Capítulo
├─ Capítulo
```

Se siente como un videojuego:

```text
        ★
       /
      ★
       \
        ★
       /
      🎁
       \
        ★
```

---

# 37. TU RUTA DE ALGORITMOS

```text
SECCIÓN 1 — BACKTRACKING

              ⭐
             /
        Sumandos
           |
          ⭐
           \
         Factores
             |
            🎁
             \
           Mochila
               |
              ⭐
               \
          Combinaciones
```

Cada nodo debe indicar **acción**, no solo materia.

Ejemplo:

```text
"Construye sumandos"
"Entiende el backtracking"
"Distingue SR y CR"
"Escribe sin pistas"
```

---

# 38. NODO ACTIVO

Forma circular.

```css
width: 72px;
height: 64px;
border-radius: 50%;
background: #58CC02;
box-shadow: 0 7px 0 #46A302;
```

Interior:

```text
estrella
código
rayo
cerebro
```

Preferible SVG propio.

---

# 39. NODO COMPLETADO

Puede usar:

```text
verde + check
```

o dorado para dominio máximo.

```css
background: #FFC800;
box-shadow: 0 7px 0 #D7A900;
```

---

# 40. NODO BLOQUEADO

```css
background: #E5E5E5;
box-shadow: 0 7px 0 #CBCBCB;
color: #AFAFAF;
```

No necesita candado enorme. El color ya comunica bloqueo.

---

# 41. UNIT HEADER

La cabecera de unidad debe funcionar como punto visual de descanso.

```text
┌────────────────────────────────────────────┐
│ SECCIÓN 2 · UNIDAD 3                      │
│ Combinaciones y permutaciones       📖     │
└────────────────────────────────────────────┘
```

Estilo:

```css
background: #58CC02;
color: white;
border-radius: 14px;
padding: 18px 20px;
```

---

# 42. TOOLTIP DE NODO

Al pulsar nodo:

```text
          ▼
┌───────────────────────────────┐
│ Combinación sin repetición    │
│                               │
│ Reconstruye el algoritmo      │
│                               │
│         [ EMPEZAR +10 XP ]    │
└───────────────────────────────┘
```

Características:

```text
ancho: 280–340 px
radius: 16 px
entrada: scale .95 → 1 + fade
duración: ~160 ms
```

---

# 43. LECCIÓN: LAYOUT

En desktop:

```text
┌──────────────────────────────────────────────────────┐
│ X         ███████████████████░░░░          8/10     │
│                                                      │
│                                                      │
│      ¿Qué ocurre después de L.add(k)?                │
│                                                      │
│      ┌──────────────────────────────────────┐        │
│      │ A  Se llama recursivamente          │        │
│      └──────────────────────────────────────┘        │
│                                                      │
│      ┌──────────────────────────────────────┐        │
│      │ B  Se borra la lista                 │        │
│      └──────────────────────────────────────┘        │
│                                                      │
│                                                      │
│                         [ COMPROBAR ]                 │
└──────────────────────────────────────────────────────┘
```

Contenido central:

```css
max-width: 640px;
margin: 0 auto;
padding: 24px 24px 120px;
```

---

# 44. BOTÓN INFERIOR

Durante ejercicios:

```text
[ COMPROBAR ]
```

Debe permanecer en una zona predecible.

En móvil:

```css
position: sticky;
bottom: 0;
```

con fondo para que no se mezcle.

En desktop puede ser bottom-right dentro del ancho de contenido.

---

# 45. EJERCICIO "CÓMO FUNCIONA POR DENTRO"

Para tu caso, esto es central.

Componente:

```text
┌──────────────────────────────────────────┐
│ SUMANDOS                                 │
│                                          │
│ L = [1, 1]                               │
│ suma = 2                                 │
│                                          │
│             ↓ add(1)                     │
│                                          │
│ L = [1, 1, 1]                            │
│ suma = 3                                 │
│                                          │
│ ¿Qué hará ahora?                         │
└──────────────────────────────────────────┘
```

La lista debe animarse físicamente.

---

# 46. VISUALIZADOR DE RECURSIÓN

Usa dos representaciones:

## A. Stack vertical

```text
sumandos([], 4, 1)
↓
sumandos([1], 4, 1)
↓
sumandos([1,1], 4, 1)
↓
sumandos([1,1,1], 4, 1)
```

## B. Árbol

```text
[]
├─1
│ ├─1
│ │ ├─1
│ │ └─2
│ └─2
└─2
```

No muestres las dos al mismo tiempo en móvil.

---

# 47. ANIMACIÓN DEL STACK

Al llamar recursivamente:

```text
tarjeta actual baja 8 px
nueva tarjeta entra desde arriba
```

o:

```text
nuevo frame se apila
```

Duración:

```text
240 ms
```

Al retornar:

```text
frame superior sale
frame anterior recupera énfasis
```

---

# 48. ANIMACIÓN DE `add()`

Representación:

```text
[1, 2]
```

al ejecutar:

```java
L.add(3);
```

haz:

```text
[1] [2]   [3]
           ↓
[1] [2] [3]
```

Duración:

```text
300–420 ms
```

---

# 49. ANIMACIÓN DE `removeLast()`

```text
[1] [2] [3]
          ↑
        fade
```

y luego:

```text
[1] [2]
```

Usa color rojo muy suave solamente durante la salida.

No hagas parecer que es un error: `removeLast` es parte correcta del backtracking.

---

# 50. RESALTADO DE LÍNEA ACTIVA

Editor:

```java
int s = suma(L);

if (s > n) return;

if (s == n) {
    System.out.println(L);
}
```

La línea ejecutándose:

```css
background: #DDF4FF;
border-left: 4px solid #1CB0F6;
```

Transición:

```text
150 ms
```

---

# 51. "EXPLICA ESTA LÍNEA"

Tarjeta:

```text
combiSR(L,A,r,k+1);

¿Por qué k+1?
```

Debajo 3–4 opciones.

Después de responder:

```text
✓ Exacto.

k+1 obliga a la próxima llamada a empezar
después del elemento actual, por lo que no
puede reutilizarlo.
```

Copy corto.

No mostrar un ensayo de 3 párrafos.

---

# 52. "CÓDIGO QUE DESAPARECE"

Misma interfaz en niveles.

## Nivel 1

10% oculto.

## Nivel 2

30%.

## Nivel 3

60%.

## Nivel 4

solo comentarios.

## Nivel 5

editor vacío.

Visualmente el progreso puede ser:

```text
PISTAS
● ● ● ○ ○
```

---

# 53. INPUT DE CÓDIGO

No conviertas el editor en VS Code completo.

Necesitas:

```text
line numbers opcionales
syntax highlighting
auto-indent
tab
monospace
errores visuales
```

No necesitas:

```text
minimap
terminal
git
10 paneles
```

---

# 54. CÓDIGO CORRECTO PARCIAL

No comparar solamente strings exactos.

Idealmente:

```text
parsear AST
```

o al menos:

```text
normalizar espacios
normalizar saltos
ignorar comentarios
comparar tokens
```

Feedback Duolingo-like:

```text
Casi.

Tu estructura está bien, pero la llamada
recursiva debe recibir k+1.
```

---

# 55. MICROEJERCICIO AUTOMÁTICO

Si el usuario falla:

```java
combiSR(L,A,r,k);
```

la app no debería hacerle repetir inmediatamente todo.

Muestra:

```text
COMBI SR

¿qué índice corresponde?

[ k ]    [ k+1 ]
```

Luego vuelve al problema original.

---

# 56. PANEL DE RESULTADO

No mostrar un dashboard técnico después de cada ejercicio.

Mostrar:

```text
┌────────────────────────────────────┐
│             🎉                     │
│                                    │
│      ¡Lección completada!          │
│                                    │
│      ⚡  +25 XP                    │
│      🎯  92% precisión             │
│      ⏱   04:13                     │
│                                    │
│           [ CONTINUAR ]            │
└────────────────────────────────────┘
```

---

# 57. RECOMPENSAS

Duolingo hace que una recompensa tenga ceremonia.

Secuencia:

```text
pantalla se limpia
↓
objeto central aparece
↓
bounce
↓
contador aumenta
↓
CTA aparece
```

No metas la recompensa dentro de una tabla.

---

# 58. XP

En tu app, XP puede representar:

```text
esfuerzo + práctica
```

NO debería representar dominio real.

Separa:

```text
XP = actividad
Dominio = capacidad
```

---

# 59. DOMINIO

Ejemplo:

```text
Combi SR

Comprensión       100%
Huecos             90%
Reconstrucción     70%
Sin pistas         60%
Velocidad          45%

DOMINIO: 73%
```

Visualmente no enseñes cinco barras todo el tiempo.

En el home:

```text
Dominio 73%
```

y los detalles en otra pantalla.

---

# 60. RACHA

Icono:

```text
🔥
```

Para no copiar assets, dibuja tu propio icono SVG.

Estados:

```text
0  gris
1+ naranja
racha en riesgo → naranja/rojo pulsante suave
```

No hagas pulsos permanentes.

---

# 61. QUESTS / MISIONES

Duolingo usa metas concretas.

Tu app:

```text
HOY

✓ Completa 1 lección
○ Reconstruye un algoritmo sin pistas
○ Corrige 3 errores antiguos
```

Barra:

```text
2 / 3
```

---

# 62. FEEDBACK POSITIVO

Tono:

```text
"¡Bien!"
"Exacto."
"Lo tienes."
"Buena reconstrucción."
"Sin errores."
```

No:

```text
"ERES UN GENIO ABSOLUTO"
```

Duolingo es entusiasta, pero el producto mantiene mensajes cortos.

---

# 63. FEEDBACK DE ERROR

Duolingo documenta que su tono debe ser:

```text
positivo
motivador
no agresivo
```

Para tu app:

```text
"Casi."
"Una pieza está fuera de lugar."
"Revisa la llamada recursiva."
"Buena estructura; falta el caso base."
```

No:

```text
"Incorrecto."
"Fallaste otra vez."
```

---

# 64. COPY

Regla:

```text
menos palabras > más palabras
```

Ejemplo malo:

> En este ejercicio tendrás que analizar detalladamente el comportamiento de la función recursiva para posteriormente determinar cuál de las siguientes...

Ejemplo bueno:

> ¿Qué ocurre después de `L.add(k)`?

---

# 65. ICONOGRAFÍA

Duolingo usa iconos:

```text
gruesos
redondeados
rellenos
claros
```

No mezcles:

```text
Lucide thin
Font Awesome solid
emoji
Material icons
```

Elige una sola familia.

Para acercarte:

- SVG propio;
- stroke 2.5–3;
- esquinas redondeadas;
- relleno cuando sea posible.

---

# 66. NO USES EMOJI COMO ICONOS DE PRODUCCIÓN

Durante prototipo está bien.

Producción:

```text
flame.svg
brain.svg
home.svg
trophy.svg
code.svg
profile.svg
```

Esto hace que la interfaz se vea premium.

---

# 67. ESTADOS DE ICONOS

```text
default  gris
hover    gris oscuro
active   color del módulo
disabled gris claro
reward   amarillo
```

---

# 68. MODALES

Duolingo evita modales empresariales complicados.

```css
.modal {
  width: min(520px, calc(100vw - 32px));
  border-radius: 24px;
  background: white;
  padding: 24px;
}
```

Overlay:

```css
background: rgba(0,0,0,.35);
```

Entrada:

```text
opacity 0 → 1
scale .94 → 1
220 ms
```

---

# 69. CONFIRMACIÓN DE SALIR

Durante lección:

```text
¿Salir de la lección?

Perderás el progreso de esta sesión.

[ SEGUIR APRENDIENDO ]
[ SALIR ]
```

Acción de continuar visualmente dominante.

---

# 70. TOAST

Usar poco.

```text
┌───────────────────────┐
│ ✓ Progreso guardado   │
└───────────────────────┘
```

Duration:

```text
2–3 segundos
```

No uses toast para respuestas de ejercicios; ahí usa feedback panel.

---

# 71. SKELETONS / LOADING

No spinner gigante.

Usa skeleton:

```text
██████████
████████████████
███████████
```

o pequeña mascota animada para cargas >500 ms.

---

# 72. SOUND DESIGN

La sensación Duolingo también depende del sonido.

Categorías:

```text
tap
correct
wrong
progress
reward
lesson_complete
streak
```

Reglas:

```text
cortos
brillantes
no invasivos
menos de ~600 ms para microfeedback
```

Debe existir:

```text
Ajustes → Efectos de sonido
```

---

# 73. HAPTICS

En web móvil, si la plataforma permite vibración:

```js
navigator.vibrate?.(20);
```

Solo como mejora opcional.

No depender de ello.

---

# 74. ACCESIBILIDAD

Todas las respuestas deben poder usarse con teclado.

Ejemplo:

```text
1 / A → respuesta 1
2 / B → respuesta 2
Enter → comprobar / continuar
Esc → salir
```

---

# 75. FOCUS RING

No elimines outline.

```css
:focus-visible {
  outline: 3px solid #1CB0F6;
  outline-offset: 3px;
}
```

---

# 76. CONTRASTE

No uses amarillo como texto pequeño sobre blanco.

Amarillo funciona para:

```text
iconos
relleno de progreso
recompensas
```

Texto encima de amarillo debe ser oscuro.

---

# 77. TOUCH TARGETS

Mínimo:

```text
44 × 44 px
```

Preferible:

```text
48–56 px
```

---

# 78. SISTEMA DE SPACING

Usa grid de 4 px.

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
```

---

# 79. WHITESPACE

Duolingo moderno enfatiza usar whitespace por propósito en vez de meter cada cosa en una tarjeta.

Por ejemplo:

```text
TÍTULO

mucho espacio

ejercicio

mucho espacio

respuestas
```

No:

```text
card dentro de card dentro de card
```

---

# 80. DENSIDAD

Tu app es para estudiar rápido, pero eso NO significa llenarla de información.

Densidad alta destruye la sensación Duolingo.

Pantalla de ejercicio:

```text
1 pregunta
1 visual
2–4 opciones
1 CTA
```

---

# 81. HEADER SYSTEM

Duolingo rediseñó recientemente sus core tabs para hacer:

- headers consistentes;
- pocas escalas tipográficas;
- títulos posicionados consistentemente;
- spacing uniforme;
- menos contenedores innecesarios.

Replica esa disciplina.

## Tier 1

Página principal:

```text
32 px / 900
```

## Tier 2

Pantalla secundaria:

```text
26 px / 800
```

## Tier 3

Sección:

```text
20 px / 800
```

---

# 82. DISEÑO DE HOME

Tu home debería tener:

```text
SIDEBAR

MAIN:
  section banner
  path
  active lesson
  rewards

RIGHT:
  streak
  daily goal
  mastery snapshot
```

No empieces con estadísticas.

La acción dominante es:

```text
CONTINUAR APRENDIENDO
```

---

# 83. PRACTICE HUB

En 2026 Duolingo abrió más opciones de práctica para todos.

Para tu app:

```text
PRACTICAR

🧠 Errores
⌨ Reconstrucción
🧩 Huecos
🔀 Ordenar código
👁 Ejecución interna
⚡ Velocidad
```

Cada tarjeta tiene:

```text
icono
nombre
1 línea descriptiva
```

---

# 84. PERFIL

No hacer LinkedIn.

Solo:

```text
avatar
nombre
racha
XP
dominio
algoritmos dominados
logros
```

---

# 85. ESTADÍSTICAS

Usa números grandes.

```text
12
algoritmos dominados
```

No:

```text
tabla de 27 columnas
```

---

# 86. LEADERBOARD

Si implementas ranking:

```text
posición
avatar
nombre
XP
```

No mezclar dominio con ranking porque incentivaría memorizar mal.

---

# 87. ANIMACIÓN DE LEVEL-UP

Secuencia:

```text
background ligeramente oscurecido
↓
badge entra con scale .6
↓
1.15
↓
1.00
↓
partículas 500–900ms
↓
mensaje
```

No más de ~1.2 s antes de dejar continuar.

---

# 88. CONFETTI

Partículas:

```text
12–30
```

No 500.

Duración:

```text
600–1100 ms
```

No bloquear interacción.

---

# 89. PARTICLES PALETTE

```text
#58CC02
#1CB0F6
#FFC800
#FF4B4B
#CE82FF
```

---

# 90. ANIMACIÓN DE XP

```text
+10 XP
```

sube:

```text
translateY(0 → -18px)
opacity 1 → 0
```

600 ms.

Contador global:

```text
740 → 750
```

con count-up 300 ms.

---

# 91. ANIMACIÓN DE STREAK

Cuando aumenta:

```text
flame scale 1 → 1.18 → 1
orange glow breve
contador cambia
```

No mantener glow.

---

# 92. ESTADO "PERFECT LESSON"

Debe sentirse especial.

```text
100%
SIN ERRORES
```

Paleta:

```text
amarillo + verde
```

Mascota celebra.

---

# 93. ESTADO DE ERROR REPETIDO

Tu app debe ser más pedagógica que Duolingo en esto.

Después de 2 fallos en la misma idea:

```text
No repetir el ejercicio idéntico.

CAMBIAR A:
visualizador
microexplicación
pregunta binaria
```

Después volver.

---

# 94. ADAPTIVE LOOP

```text
                 ┌─────────────┐
                 │ ejercicio   │
                 └──────┬──────┘
                        │
             ┌──────────┴─────────┐
             │                    │
          correcto              error
             │                    │
             ↓                    ↓
      dificultad +1       clasificar error
             │                    │
             │             microejercicio
             │                    │
             └──────────┬─────────┘
                        ↓
                 siguiente ítem
```

---

# 95. APRENDIZAJE DE CÓDIGO TIPO DUOLINGO

Para cada algoritmo:

```text
1. Concepto
2. Ejecución visual
3. Qué hace esta línea
4. Ordena bloques
5. Rellena huecos
6. Encuentra error
7. Reconstrucción parcial
8. Reconstrucción completa
9. Consulta
10. Velocidad
```

Esto debería verse como una lección lineal, no como diez modos separados.

---

# 96. EJEMPLO COMPLETO DE LECCIÓN

## Pantalla 1

```text
SUMANDOS

Construye listas cuya suma sea n.

[ CONTINUAR ]
```

## Pantalla 2

Animación:

```text
[]
↓ add(1)
[1]
↓ add(1)
[1,1]
```

Pregunta:

```text
¿Qué está cambiando?
```

## Pantalla 3

```text
int s = suma(L);
```

Pregunta:

```text
¿Qué representa s?
```

## Pantalla 4

```text
if(s > n) return;
```

Pregunta:

```text
¿Por qué termina aquí?
```

## Pantalla 5

Ordena:

```text
removeLast
recursive call
add
```

## Pantalla 6

Completa:

```java
sumandos(L,n,____);
```

## Pantalla 7

Escribe el método.

## Pantalla 8

Consulta:

```text
Ahora muestra solamente soluciones
que contienen 2.
```

## Pantalla 9

Resumen.

---

# 97. HOME PATH MAPPING

Ejemplo:

```text
SECCIÓN 1 · BACKTRACKING

      ★ Comprender add-call-remove
       \
        ★ Sumandos
       /
      ★ Factores
       \
        🎁 Caja
       /
      ★ Mochila
       \
        ★ Mochila exacta

SECCIÓN 2 · COMBINATORIA

      ★ Combi SR
       \
        ★ Combi CR
       /
      ★ Permut SR
       \
        ★ Permut CR

SECCIÓN 3 · MATRICES

      ★ Menor
       \
        ★ Determinante
       /
      ★ Submatrices
```

---

# 98. COMPONENT TREE

Si usas React:

```text
<AppShell>
  <Sidebar />

  <MainColumn>
    <UnitBanner />
    <LearningPath>
      <PathNode />
      <CharacterReaction />
      <RewardNode />
    </LearningPath>
  </MainColumn>

  <RightRail>
    <StreakCard />
    <DailyQuestCard />
    <MasteryCard />
  </RightRail>
</AppShell>
```

Lección:

```text
<LessonShell>
  <LessonHeader>
    <ExitButton />
    <ProgressBar />
    <SessionMetric />
  </LessonHeader>

  <ExerciseRenderer>
    <Prompt />
    <Visualizer />
    <AnswerArea />
  </ExerciseRenderer>

  <LessonFooter>
    <FeedbackPanel />
    <PrimaryButton />
  </LessonFooter>
</LessonShell>
```

---

# 99. EJERCICIOS COMO COMPONENTES

```text
MultipleChoiceExercise
CodeGapExercise
OrderBlocksExercise
FindBugExercise
TraceExecutionExercise
ExplainLineExercise
RebuildExercise
QueryModificationExercise
```

Todos deben implementar la misma interfaz lógica:

```ts
type Exercise = {
  id: string
  type: ExerciseType
  prompt: string
  validate(answer): Result
  hint?: Hint
  explanation?: Explanation
}
```

---

# 100. ESTADOS DE LECCIÓN

```ts
type LessonState =
  | "answering"
  | "checking"
  | "correct"
  | "incorrect"
  | "transitioning"
  | "complete";
```

No uses 20 booleanos:

```text
isCorrect
isWrong
showFooter
isChecking
...
```

Usa state machine.

---

# 101. STATE MACHINE DEL EJERCICIO

```text
ANSWERING
   │
   │ Check
   ↓
VALIDATING
   │
   ├── correct ─→ CORRECT
   │                │
   │                │ continue
   │                ↓
   │            TRANSITION
   │                │
   │                ↓
   │            ANSWERING
   │
   └── wrong ───→ INCORRECT
                    │
                    │ continue
                    ↓
               REMEDIATION
```

---

# 102. CSS TOKEN FILE

```css
:root {
  /* Brand */
  --c-green: #58CC02;
  --c-green-light: #89E219;
  --c-blue: #1CB0F6;
  --c-red: #FF4B4B;
  --c-yellow: #FFC800;
  --c-orange: #FF9600;
  --c-purple: #CE82FF;

  /* Neutral */
  --c-eel: #4B4B4B;
  --c-wolf: #777777;
  --c-hare: #AFAFAF;
  --c-swan: #E5E5E5;
  --c-polar: #F7F7F7;
  --c-snow: #FFFFFF;

  /* Geometry */
  --r-xs: 8px;
  --r-sm: 12px;
  --r-md: 16px;
  --r-lg: 20px;
  --r-xl: 24px;
  --r-pill: 999px;

  /* Space */
  --s-1: 4px;
  --s-2: 8px;
  --s-3: 12px;
  --s-4: 16px;
  --s-5: 20px;
  --s-6: 24px;
  --s-8: 32px;
  --s-10: 40px;
  --s-12: 48px;

  /* Motion */
  --t-instant: 90ms;
  --t-fast: 160ms;
  --t-base: 240ms;
  --t-slow: 420ms;

  --ease-main: cubic-bezier(.2,.8,.2,1);
}
```

---

# 103. COMPONENTE BUTTON COMPLETO

```css
.btn {
  min-height: 50px;
  padding-inline: 24px;

  border: none;
  border-radius: 16px;

  font-family: inherit;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: .7px;

  cursor: pointer;

  transform: translateY(0);

  transition:
    transform 90ms ease,
    box-shadow 90ms ease,
    filter 120ms ease;
}

.btn--primary {
  color: #fff;
  background: #58CC02;
  box-shadow: 0 5px 0 #46A302;
}

.btn--primary:hover {
  filter: brightness(1.025);
}

.btn--primary:active {
  transform: translateY(4px);
  box-shadow: 0 1px 0 #46A302;
}

.btn:disabled {
  color: #AFAFAF;
  background: #E5E5E5;
  box-shadow: 0 5px 0 #CBCBCB;
  cursor: default;
  filter: none;
}
```

---

# 104. COMPONENTE ANSWER COMPLETO

```css
.answer {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;

  width: 100%;
  min-height: 58px;

  padding: 12px 16px;

  border: 2px solid #E5E5E5;
  border-bottom-width: 4px;
  border-radius: 14px;

  background: #fff;
  color: #4B4B4B;

  font-size: 16px;
  font-weight: 700;

  cursor: pointer;

  transition:
    background 120ms ease,
    border-color 120ms ease,
    transform 90ms ease;
}

.answer:hover {
  background: #F7F7F7;
}

.answer[data-selected="true"] {
  color: #168CC5;
  background: #DDF4FF;
  border-color: #1CB0F6;
}

.answer[data-result="correct"] {
  color: #46A302;
  background: #D7FFB8;
  border-color: #58CC02;
}

.answer[data-result="wrong"] {
  color: #D33131;
  background: #FFDADA;
  border-color: #FF4B4B;
}
```

---

# 105. COMPONENTE PROGRESS

```css
.lesson-progress {
  width: 100%;
  height: 16px;

  background: #E5E5E5;
  border-radius: 999px;
  overflow: hidden;
}

.lesson-progress__fill {
  width: var(--progress);
  height: 100%;

  background: #58CC02;
  border-radius: inherit;

  transition:
    width 420ms cubic-bezier(.2,.8,.2,1);
}
```

---

# 106. FRAMER MOTION — CARD TRANSITION

```tsx
<motion.div
  key={exercise.id}
  initial={{ opacity: 0, x: 18 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -18 }}
  transition={{ duration: 0.20 }}
>
  <Exercise />
</motion.div>
```

---

# 107. FRAMER MOTION — POP

```tsx
<motion.div
  initial={{ scale: 0.72, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{
    type: "spring",
    stiffness: 480,
    damping: 20
  }}
/>
```

Úsalo para:

```text
check
reward
XP
badge
```

No para todo.

---

# 108. SIDEBAR BREAKPOINTS

```css
@media (min-width: 1180px) {
  .sidebar {
    width: 256px;
  }
}

@media (min-width: 760px) and (max-width: 1179px) {
  .sidebar {
    width: 84px;
  }

  .sidebar .label {
    display: none;
  }

  .right-rail {
    display: none;
  }
}

@media (max-width: 759px) {
  .sidebar {
    display: none;
  }

  .bottom-nav {
    display: flex;
  }
}
```

---

# 109. LESSON MOBILE

```text
padding horizontal: 16 px
header: 56–64 px
question title: 22–26 px
answers gap: 10–12 px
footer: 88–112 px
```

No reduzcas botones por debajo de 48px.

---

# 110. LESSON DESKTOP

```text
max content width: ~640 px
question max width: 600 px
footer CTA width: 180–240 px
```

Si el ejercicio es código:

```text
max content width: 760–860 px
```

porque necesitas editor.

---

# 111. EDITOR MODE

Para ejercicios de código largos cambia layout:

```text
┌───────────────────────────────────────────────┐
│ Pregunta                                      │
│                                               │
│ ┌───────────────────────────────────────────┐ │
│ │ editor                                    │ │
│ │                                           │ │
│ └───────────────────────────────────────────┘ │
│                                               │
│                       [ COMPROBAR ]            │
└───────────────────────────────────────────────┘
```

No mostrar sidebar/right rail durante una lección enfocada si distraen.

---

# 112. FULL FOCUS MODE

Al entrar en lección:

```text
Home UI
↓
transición
↓
solo LessonShell
```

Esto es importante.

El usuario no debe ver:

```text
ranking
notificaciones
misiones
perfil
```

mientras reconstruye código.

---

# 113. ANIMACIÓN ENTRADA A LECCIÓN

```text
route node
↓ click
tooltip
↓ Start
white flash/fade muy corto
↓ lesson header aparece
↓ exercise slide-in
```

Duración total:

```text
250–400 ms
```

---

# 114. FINAL DE LECCIÓN

No devolver inmediatamente al home.

Secuencia:

```text
resultado
↓
XP
↓
racha
↓
dominio
↓
CONTINUAR
↓
ruta con nodo actualizado
```

---

# 115. ANIMAR EL NODO AL VOLVER

Al finalizar:

```text
nodo viejo
↓
relleno cambia
↓
check pop
↓
siguiente nodo hace bounce
```

Esto conecta visualmente:

```text
"lo que hice"
→
"mi progreso"
```

---

# 116. GAMIFICATION LOOP

```text
ACCION
↓
FEEDBACK
↓
XP
↓
PROGRESO
↓
RECOMPENSA
↓
SIGUIENTE RETO
```

Nunca:

```text
acción → página muerta
```

---

# 117. APRENDIZAJE LOOP

Para que no sea solo gamificación:

```text
INTENTO
↓
RETRIEVAL
↓
ERROR ESPECÍFICO
↓
REMEDIACIÓN
↓
REINTENTO
↓
RETENCIÓN
```

---

# 118. REGLAS DE DIFICULTAD

```text
Nivel 1: código 90% visible
Nivel 2: 70%
Nivel 3: 40%
Nivel 4: comentarios
Nivel 5: vacío
```

Si falla 2 veces:

```text
nivel -1 temporal
```

Si acierta 2 veces:

```text
nivel +1
```

---

# 119. CRONÓMETRO

El cronómetro no debe dominar visualmente hasta niveles avanzados.

## Comprensión

```text
sin cronómetro visible
```

## Reconstrucción

```text
02:13
```

pequeño.

## Speed mode

```text
00:42.8
```

destacado.

---

# 120. SPEED MODE

Diseño:

```text
┌──────────────────────────────────┐
│  COMBI SR              00:42.8  │
│  ██████████████░░░░             │
│                                  │
│  [ editor ]                      │
│                                  │
│              [ COMPROBAR ]       │
└──────────────────────────────────┘
```

No usar rojo al bajar el tiempo; eso genera ansiedad.

Usa neutral + verde al mejorar marca personal.

---

# 121. PERSONAL BEST

```text
NUEVO RÉCORD
01:32 → 01:17
```

Animación:

```text
contador
↓
pequeño sparkle
```

---

# 122. ERROR MEMORY

Pantalla:

```text
ERRORES A REPASAR

combiSR        k vs k+1          4
factores       n % k == 0       2
permutSR       contains          2
```

Pero visualmente en tarjetas, no tabla empresarial.

---

# 123. ERROR CARD

```text
┌────────────────────────────────────┐
│ 🔁  k vs k+1                       │
│                                    │
│ Te confundiste 4 veces            │
│                                    │
│                    [ PRACTICAR ]   │
└────────────────────────────────────┘
```

---

# 124. NOTIFICACIONES

Si agregas:

```text
"Tu examen está cerca. Practica 10 min."
```

Mantén copy:

```text
breve
específico
acción clara
```

No culpabilizar excesivamente.

---

# 125. ESTÉTICA DE ILUSTRACIÓN

Duolingo documenta una estética:

```text
formas geométricas simples
curvas
exageración
personajes expresivos
pocos detalles pequeños
colores planos
```

Para tu mascota:

```text
cabeza grande
ojos expresivos
silueta reconocible
brazos/manos simples
pocas líneas internas
```

---

# 126. ILUSTRACIÓN Y ATENCIÓN

La propia documentación de Duolingo explica que usa ilustración y animación para dirigir la atención.

Tu personaje debe mirar:

```text
al CTA
al código activo
al resultado
```

Evita personaje mirando fuera de pantalla.

---

# 127. ANIMACIÓN IDLE

```text
parpadeo cada 3–6 s
respiración muy ligera
cambio de mirada ocasional
```

No mover continuamente todo el cuerpo.

---

# 128. ANIMACIÓN CORRECT

```text
200 ms anticipación
300 ms celebración
200 ms settle
```

Total:

```text
~700 ms
```

Puede reproducirse mientras usuario lee el feedback.

---

# 129. ANIMACIÓN WRONG

No debe parecer castigo.

```text
cejas
ligera inclinación
pensando
```

No:

```text
personaje furioso
explosión
pantalla temblando
```

---

# 130. CÓMO CONSEGUIR EL "BOUNCE"

Spring:

```js
{
  type: "spring",
  stiffness: 450,
  damping: 24,
  mass: 0.7
}
```

Ajusta por componente.

Botones no necesitan spring; usa CSS rápido.

---

# 131. CAPAS DE MOTION

## Nivel A — micro

```text
hover
press
focus
```

90–160 ms.

## Nivel B — state change

```text
correct
wrong
progress
panel
```

180–420 ms.

## Nivel C — celebration

```text
lesson complete
streak
reward
```

500–1100 ms.

---

# 132. NUNCA BLOQUEAR POR ANIMACIÓN

Después de una respuesta correcta:

```text
animación puede seguir
pero CTA debe estar listo
```

El usuario rápido no debe esperar 2 segundos.

---

# 133. DATA VISUALIZATION

Duolingo no parece Power BI.

Para dominio usa:

```text
progress bar
ring
badge
```

No gráficos de líneas salvo pantalla de estadísticas avanzada.

---

# 134. RIGHT RAIL

Componentes:

```text
StreakCard
DailyGoalCard
MistakesCard
MasteryCard
```

Máximo 3 visibles antes de scroll.

---

# 135. RIGHT RAIL CARD

```css
border: 2px solid #E5E5E5;
border-radius: 16px;
padding: 16px;
margin-bottom: 16px;
```

Header:

```text
16–18px / 800
```

---

# 136. DAILY GOAL

```text
OBJETIVO DIARIO

34 / 50 XP
██████████████░░░
```

CTA secundario:

```text
Ver misión
```

---

# 137. EMPTY STATE

No:

```text
No records found.
```

Sí:

```text
Todavía no hay errores para repasar.

Completa una lección y guardaremos
los puntos que necesiten práctica.
```

+ ilustración.

---

# 138. ERROR STATE TÉCNICO

```text
No pudimos cargar la lección.

[ REINTENTAR ]
```

No mostrar stack traces.

---

# 139. OFFLINE

Si tu app puede funcionar offline:

```text
Sin conexión

Puedes seguir con las lecciones descargadas.
```

---

# 140. ONBOARDING

Duolingo pregunta objetivos pronto.

Para tu app:

```text
¿Qué necesitas?

○ Aprobar un examen hoy
○ Memorizar algoritmos
○ Mejorar velocidad
○ Aprender a programar
```

---

# 141. EXAM MODE

Si elige:

```text
"Examen en 3 horas"
```

pedir:

```text
¿cuánto falta?
¿Qué temas entran?
¿Qué tan bien los recuerdas?
```

Luego genera una ruta intensiva.

---

# 142. ONBOARDING PROGRESS

No formulario de 10 campos.

Pantallas pequeñas:

```text
1/4
2/4
3/4
4/4
```

---

# 143. PRIMERA VICTORIA RÁPIDA

Duolingo intenta que empieces rápido.

Tu app debería dar una respuesta fácil antes de una reconstrucción completa.

Ejemplo:

```text
¿Qué hace removeLast()?
```

para producir:

```text
✓
+5 XP
```

en menos de 30 s.

---

# 144. MASTERY VS SPEED

Dos medidores separados:

```text
DOMINIO  ████████░░ 82%
VELOCIDAD █████░░░░░ 53%
```

Nunca premiar velocidad cuando hay errores.

---

# 145. "CHECK" BUTTON LOGIC

Disabled mientras no haya respuesta:

```text
gris
```

Cuando respuesta válida:

```text
verde
```

Después de evaluar:

```text
CTA cambia de COMPROBAR → CONTINUAR
```

Mantener el CTA en el mismo lugar reduce carga cognitiva.

---

# 146. KEYBOARD FLOW

Ejemplo:

```text
Alt+1  opción 1
Alt+2  opción 2
Enter  comprobar
Enter  continuar
```

Para code editor:

```text
Ctrl+Enter → comprobar
```

---

# 147. AUTOSAVE

Guardar:

```text
ejercicio actual
respuesta
tiempo
dominio
errores
```

sin botón Guardar.

---

# 148. ANIMATION PERFORMANCE

Objetivo:

```text
60 fps
```

Animar principalmente:

```text
transform
opacity
```

Evitar animar:

```text
top
left
width
height
```

excepto progress width si no genera problemas.

---

# 149. GPU FRIENDLY

Para cards/transitions:

```css
will-change: transform, opacity;
```

solo durante la animación.

No aplicarlo globalmente.

---

# 150. RIVE PERFORMANCE

Un solo personaje animado principal por pantalla.

Pausa animaciones Rive fuera de viewport.

---

# 151. SERVER-DRIVEN EXERCISES

Duolingo documenta una arquitectura Server-Driven UI para poder variar contenido/componentes desde servidor.

Tu app puede adoptar una versión simple:

```json
{
  "type": "multiple_choice",
  "prompt": "¿Por qué usa k+1?",
  "options": ["...", "..."],
  "answer": 0,
  "explanation": "..."
}
```

El frontend renderiza según `type`.

Esto permite añadir ejercicios sin redeploy.

---

# 152. EXERCISE REGISTRY

```ts
const registry = {
  multiple_choice: MultipleChoiceExercise,
  fill_gap: CodeGapExercise,
  order_blocks: OrderBlocksExercise,
  trace: TraceExercise,
  rebuild: RebuildExercise,
  find_bug: FindBugExercise
}
```

---

# 153. DESIGN TOKENS EN JSON

```json
{
  "color": {
    "brand": "#58CC02",
    "info": "#1CB0F6",
    "danger": "#FF4B4B",
    "warning": "#FFC800",
    "text": "#4B4B4B",
    "border": "#E5E5E5"
  },
  "radius": {
    "sm": 12,
    "md": 16,
    "lg": 20,
    "pill": 999
  },
  "motion": {
    "fast": 160,
    "base": 240,
    "slow": 420
  }
}
```

---

# 154. ESTRUCTURA DE CARPETAS

```text
src/
├── app/
├── components/
│   ├── buttons/
│   ├── cards/
│   ├── navigation/
│   ├── progress/
│   └── feedback/
├── exercises/
│   ├── MultipleChoice/
│   ├── CodeGap/
│   ├── FindBug/
│   ├── OrderBlocks/
│   ├── Trace/
│   └── Rebuild/
├── learning/
│   ├── engine/
│   ├── mastery/
│   └── scheduler/
├── motion/
├── mascot/
├── tokens/
│   ├── colors.css
│   ├── spacing.css
│   └── motion.css
└── pages/
```

---

# 155. NO COPIAR LITERALMENTE

Para mantener identidad propia:

No usar:

```text
Duo
logo Duolingo
Feather Bold
sonidos extraídos
sprites de personajes
assets descargados de la app
```

Sí puedes reproducir:

```text
botón físico
progress bars
ruta
feedback inmediato
gamificación
microanimaciones
estructura de lección
jerarquía
spacing
paleta inspirada/compatible
```

Si quieres máxima similitud visual sin parecer una copia de marca, cambia el color principal.

Ejemplo:

```text
brand propia: #7B61FF
```

y conserva todo el sistema.

---

# 156. CHECKLIST "SE SIENTE DUOLINGO"

## Visual

- [ ] Fondo muy limpio.
- [ ] Tipografía redondeada.
- [ ] Texto principal oscuro, no negro puro.
- [ ] Bordes de 2 px.
- [ ] Radios grandes.
- [ ] CTA con sombra inferior física.
- [ ] Colores saturados.
- [ ] Espacio en blanco abundante.
- [ ] Iconografía gruesa y coherente.
- [ ] Un elemento visual dominante por pantalla.

## Interaction

- [ ] Hover discreto.
- [ ] Press físico.
- [ ] Feedback instantáneo.
- [ ] Correcto verde.
- [ ] Error rojo.
- [ ] Continuar siempre en lugar predecible.
- [ ] Progress visible.
- [ ] Transiciones < 450 ms.
- [ ] Celebraciones sin bloquear.

## Learning UX

- [ ] Una pregunta por pantalla.
- [ ] Ejercicios cortos.
- [ ] Dificultad incremental.
- [ ] Recuperación activa.
- [ ] Repaso de errores.
- [ ] Reintento adaptativo.
- [ ] Explicación breve.
- [ ] Reconstrucción gradual.
- [ ] Progreso hacia dominio.

---

# 157. CHECKLIST DE PIXEL POLISH

Antes de decir que está terminada:

- [ ] botones alineados a pixel;
- [ ] mismos radios en componentes equivalentes;
- [ ] mismos paddings horizontales;
- [ ] headers con baseline consistente;
- [ ] iconos con tamaño óptico consistente;
- [ ] no hay saltos al cambiar estado;
- [ ] los paneles de feedback ocupan la misma altura aproximada;
- [ ] no hay flashes blancos inesperados;
- [ ] tab focus funciona;
- [ ] mobile safe areas respetadas;
- [ ] animaciones a 60fps;
- [ ] `prefers-reduced-motion` funciona;
- [ ] dark mode probado;
- [ ] zoom 200% usable;
- [ ] 320px de ancho usable.

---

# 158. VALORES BASE PARA IMPLEMENTAR YA

Si necesitas una configuración rápida:

```text
FONT
Nunito

BACKGROUND
#FFFFFF

TEXT
#4B4B4B

BORDER
#E5E5E5

PRIMARY
#58CC02
shadow #46A302

INFO
#1CB0F6

ERROR
#FF4B4B

REWARD
#FFC800

CARD RADIUS
16 px

BUTTON RADIUS
16 px

BUTTON HEIGHT
50 px

BUTTON DEPTH
5 px

ANSWER HEIGHT
58 px

CONTENT WIDTH
640 px

SIDEBAR
256 px

RIGHT RAIL
340 px

PAGE GAP
32 px

FAST MOTION
160 ms

NORMAL MOTION
240 ms

PROGRESS
420 ms

CELEBRATION
650–1000 ms
```

---

# 159. TU MVP VISUAL

Para obtener el 80% de la sensación Duolingo rápidamente, implementa primero:

1. AppShell de tres columnas.
2. Nunito.
3. Paleta.
4. Botón con profundidad.
5. Answer cards.
6. Progress bar.
7. Lesson feedback footer.
8. Learning path.
9. Microanimaciones.
10. Mascota Rive propia.

Luego:

```text
Practice Hub
Quests
XP
Streak
Mastery
Reward screens
```

---

# 160. QUÉ PRODUCE EL 20% FINAL

El acabado premium no viene de añadir funcionalidades.

Viene de:

```text
consistencia de padding
alineación
timing
hover
press
copy
iconos
transiciones
estado disabled
feedback
responsive
```

Ese es precisamente el tipo de detalle que Duolingo ha descrito como "craft" en su rediseño reciente de tabs.

---

# 161. FUENTES OFICIALES CONSULTADAS

## Duolingo Brand Guidelines — Color

https://design.duolingo.com/identity/color/1000

Datos usados:

- Feather Green `#58CC02`
- Mask Green `#89E219`
- Eel `#4B4B4B`
- Snow `#FFFFFF`
- Macaw `#1CB0F6`
- Cardinal `#FF4B4B`
- Bee `#FFC800`
- Fox `#FF9600`
- Beetle `#CE82FF`
- Humpback `#2B70C9`
- neutrales

## Duolingo Brand Guidelines — Typography

https://design.duolingo.com/identity/typography

Datos usados:

- Feather Bold como fuente de titulares propietaria.
- DIN Next Rounded como fuente de cuerpo.
- Nunito como sustituto oficial recomendado.

## Duolingo — Core Tabs Redesign

https://blog.duolingo.com/core-tabs-redesign/

Principios usados:

- consistencia de headers;
- jerarquía tipográfica más simple;
- spacing intencional;
- balance entre simplicidad y claridad;
- reducción de contenedores innecesarios.

## Duolingo — Shape Language

https://blog.duolingo.com/shape-language-duolingos-art-style/

Principios usados:

- estética bold, bouncy, bright;
- botones redondeados;
- ilustración como guía de atención;
- movimiento para dirigir la mirada.

## Duolingo — Home Screen / Learning Path

https://blog.duolingo.com/new-duolingo-home-screen-design/

Principios usados:

- ruta guiada;
- niveles;
- práctica integrada;
- contenido intercalado;
- progresión visible.

## Duolingo — Character System

https://blog.duolingo.com/building-character/

Principios usados:

- personajes dentro de ejercicios;
- reacciones a respuesta correcta;
- animaciones intermedias como recompensa.

## Duolingo — Rive / Character Animation

https://blog.duolingo.com/world-character-visemes/

Dato usado:

- Rive y State Machines para animación de personajes.

## Duolingo — Server-Driven UI

https://blog.duolingo.com/server-driven-ui/

Principios usados:

- UI basada en componentes;
- layout y estilos definidos por respuestas;
- experimentación rápida.

## Duolingo — Voice / Tone

https://design.duolingo.com/writing/

https://design.duolingo.com/writing/duo

Principios usados:

- mensajes cortos;
- lenguaje claro;
- tono positivo;
- motivador;
- juguetón sin agresividad.

---

# 162. RESUMEN EN UNA FRASE

Para que una app se sienta como Duolingo:

> **Convierte cada concepto en un pequeño reto visual, dale una única acción clara, haz que cada toque se sienta físico, responde inmediatamente con color/movimiento, muestra progreso y lleva al usuario al siguiente reto antes de que pierda impulso.**

---

# 163. ADAPTACIÓN DIRECTA A TU ENTRENADOR DE CÓDIGO

La pantalla NO debería decir:

```text
"Aprende recursividad"
```

Debería comportarse así:

```text
★ 1. Mira qué pasa por dentro
↓
★ 2. Predice el siguiente paso
↓
★ 3. Completa 2 líneas
↓
★ 4. Encuentra el error
↓
★ 5. Reconstruye con pistas
↓
★ 6. Reconstruye sin pistas
↓
🏆 7. Haz una consulta
↓
⚡ 8. Hazlo contra reloj
```

Eso mantiene el aspecto de Duolingo, pero además soluciona el problema real de tu app: **que el usuario aprenda antes de exigirle velocidad**.
