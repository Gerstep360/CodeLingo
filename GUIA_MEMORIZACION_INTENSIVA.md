# GUÍA DE MEMORIZACIÓN INTENSIVA — ALGORITMOS DEL EXAMEN

> Objetivo: poder **reconstruir el código rápido**, no memorizarlo como una foto.
>
> Tiempo recomendado: **50–60 minutos**.
>
> Archivo complementario: `ExamenEntrenamiento.java`

---

# 0. LA IDEA QUE UNE CASI TODO

Los ejercicios de listas usan casi siempre este patrón:

```java
static void algoritmo(...) {

    // 1. medir el estado actual

    // 2. cortar si ya no sirve

    // 3. comprobar si encontré solución

    // 4. probar opciones
    for (...) {

        L.add(...);          // ELEGIR

        algoritmo(...);      // BAJAR

        L.removeLast();      // VOLVER
    }
}
```

Memoriza estas tres palabras:

```text
AGREGO
BAJO
QUITO
```

o:

```text
ELEGIR → RECURSIÓN → DESHACER
```

`removeLast()` no es un detalle: permite volver al estado anterior y probar otra opción.

---

# PLAN DE 55 MINUTOS

| Minutos | Qué estudiar |
|---:|---|
| 0–8 | Patrón `add → recursión → removeLast` |
| 8–15 | Sumandos + Factores |
| 15–23 | Mochila + Mochila exacta |
| 23–33 | Combinaciones SR/CR |
| 33–41 | Permutaciones SR/CR |
| 41–48 | Determinante + menor |
| 48–55 | Submatrices + 3 consultas |
| Últimos minutos | escribir SIN mirar y luego cronometrar |

No intentes memorizar todos los métodos completos. Memoriza **el base + el cambio de la consulta**.

---

# 1. SUMANDOS

## Qué hace

Busca listas de números cuya suma sea `n`.

Ejemplo:

```text
n = 5

[1,1,1,1,1]
[1,1,1,2]
[1,1,3]
[1,2,2]
[1,4]
[2,3]
[5]
```

Los números aparecen ordenados porque la recursión continúa desde `k`.

## Código mental

```java
int s = suma(L);

if (s > n) return;

if (s == n) {
    imprimir;
    return;
}

for (k = i; k <= n; k++) {
    add(k);
    sumandos(..., k);
    removeLast();
}
```

## Cómo funciona por dentro

Para:

```java
sumandos(L, 4, 1);
```

comienza:

```text
L=[]
s=0

k=1
↓
L=[1]
s=1

k=1
↓
L=[1,1]
s=2

k=1
↓
L=[1,1,1]
s=3

k=1
↓
L=[1,1,1,1]
s=4
✓ IMPRIME
```

Luego hace:

```text
removeLast()

[1,1,1,1]
      ↓
[1,1,1]

ahora prueba k=2

[1,1,1,2]
s=5
✗ > 4
return
```

La recursión va construyendo y deshaciendo.

## Qué memorizar

```text
SUMANDOS = SUMA
> n      = cortar
== n     = imprimir
recursión = k
```

## 3 consultas fáciles

### C1 — exactamente `r` sumandos

Único cambio importante:

```java
if (s > n || L.size() > r) return;

if (s == n) {
    if (L.size() == r) System.out.println(L);
    return;
}
```

### C2 — debe contener `x`

```java
if (s == n) {
    if (L.contains(x)) System.out.println(L);
    return;
}
```

### C3 — sin repetir números

Cambia:

```java
sumandos(..., k);
```

por:

```java
sumandos(..., k + 1);
```

### Frase de memoria

```text
k     = puedo repetir
k + 1 = no puedo repetir
```

---

# 2. FACTORES

## Qué hace

Es casi SUMANDOS, pero cambia:

```text
suma → producto
s > n → p > n
```

y solamente prueba divisores:

```java
if (n % k == 0)
```

Ejemplo:

```text
n = 12

[2,2,3]
[2,6]
[3,4]
[12]
```

## Código mental

```java
int p = prod(L);

if (p > n) return;

if (p == n) {
    imprimir;
    return;
}

for (k = i; k <= n; k++) {

    if (n % k == 0) {

        add(k);
        factores(..., k);
        removeLast();
    }
}
```

## Por dentro

```text
n=12

L=[]
p=1

prueba 2
↓
[2]
p=2

prueba 2
↓
[2,2]
p=4

prueba 2
↓
[2,2,2]
p=8

otra vez 2
↓
p=16
✗ corta
```

Después vuelve y prueba `3`:

```text
[2,2,3]
p=12
✓ imprime
```

## OJO

Normalmente llama:

```java
factores(L, 12, 2);
```

No empieces en `1`, porque multiplicar por `1` no cambia el producto y permitiría repetirlo indefinidamente.

## 3 consultas

### C1 — exactamente `r` factores

Añades:

```java
L.size() > r
```

y al llegar a `p==n`:

```java
if (L.size() == r)
```

### C2 — debe contener `x`

```java
if (p == n) {
    if (L.contains(x)) imprimir;
}
```

### C3 — factores sin repetir

```java
factoresC3(..., k + 1);
```

## Truco

Si sabes SUMANDOS, FACTORES es:

```text
suma(L)       → prod(L)
s == n        → p == n
+ if(n%k==0)
```

---

# 3. MOCHILA

## Qué hace

Aquí ya no pruebas números `1..n`.

Tienes una lista:

```java
A = [2,4,6,8,9]
```

y eliges elementos de ella.

Base:

```text
mostrar todas las combinaciones cuya suma <= max
```

## Código mental

```java
int s = suma(L);

if (s > max) return;

if (!L.isEmpty())
    imprimir;

for (k = i; k < A.size(); k++) {

    L.add(A.get(k));

    mochila(..., k + 1);

    L.removeLast();
}
```

## Diferencia importantísima

SUMANDOS:

```java
L.add(k);
```

MOCHILA:

```java
L.add(A.get(k));
```

Porque `k` ahora es una **posición**, no el valor.

## Por dentro

```text
A=[2,4,6]
max=6

[]
 ↓ elegir A[0]=2

[2]
✓ suma 2 <= 6

 ↓ elegir A[1]=4

[2,4]
✓ suma 6 <= 6

 ↓ intentar 6

[2,4,6]
suma 12
✗ corta
```

Luego vuelve:

```text
[2,4]
removeLast()
↓
[2]
```

y continúa.

## ¿Por qué `k+1`?

Porque cada posición de `A` se usa como máximo una vez.

```text
k+1 = siguiente objeto
```

## 3 consultas

### C1 — suma EXACTA `x`

Cambiar:

```java
if (!L.isEmpty()) imprimir;
```

por:

```java
if (s == x) {
    imprimir;
    return;
}
```

### C2 — exactamente `r` objetos

```java
if (L.size() == r) {
    imprimir;
    return;
}
```

manteniendo:

```java
if (s > max) return;
```

### C3 — debe contener `x`

```java
if (!L.isEmpty() && L.contains(x))
    imprimir;
```

---

# 4. MOCHILA EXACTA

La estructura es la misma que mochila.

Única idea:

```text
MOCHILA       → imprime mientras suma <= max
MOCHILA EXACTA→ imprime SOLO cuando suma == max
```

Código mental:

```java
int s = suma(L);

if (s > max) return;

if (s == max) {
    imprimir;
    return;
}

for (...) {
    add(A.get(k));
    mochilaExacta(..., k+1);
    removeLast();
}
```

## 3 consultas

### C1

Suma exacta + exactamente `r` elementos.

### C2

Suma exacta + contiene `x`.

### C3

Suma exacta + NO contiene `x`.

No cambias el esqueleto. Solo cambia el `if` del caso solución.

---

# 5. COMBINACIÓN SIN REPETICIÓN — `combiSR`

## Objetivo

Elegir `r` elementos de `A`.

El orden NO importa.

```text
[1,2] = [2,1]
```

Por eso no vuelves hacia atrás en `A`.

## Código base que debes saber casi de memoria

```java
static void combiSR(LinkedList<Integer> L,
                    LinkedList<Integer> A,
                    int r,
                    int i) {

    if (L.size() == r) {
        System.out.println(L);
        return;
    }

    for (int k = i; k < A.size(); k++) {

        L.add(A.get(k));

        combiSR(L, A, r, k + 1);

        L.removeLast();
    }
}
```

## Árbol interno

Para:

```text
A=[1,2,3]
r=2
```

ocurre:

```text
[]
├── 1
│   ├── 2 → [1,2] ✓
│   └── 3 → [1,3] ✓
│
├── 2
│   └── 3 → [2,3] ✓
│
└── 3
```

Nunca sale:

```text
[2,1]
```

porque cuando elegiste `2`, ya avanzaste.

## REGLA DE ORO

```text
COMBINACIÓN SIN REPETICIÓN = k+1
```

## 3 consultas

Cuando:

```java
L.size() == r
```

en vez de imprimir siempre:

### C1 — suma igual a x

```java
if (suma(L) == x)
    imprimir;
```

### C2 — contiene x

```java
if (L.contains(x))
    imprimir;
```

### C3 — solo pares

```java
if (todosPares(L))
    imprimir;
```

El 90% del método queda idéntico.

---

# 6. COMBINACIÓN CON REPETICIÓN — `combiCR`

Es casi idéntica.

Solo cambia:

```java
combiSR(..., k + 1);
```

por:

```java
combiCR(..., k);
```

## ¿Por qué?

Porque después de elegir `A[k]`, puedes elegirlo nuevamente.

Ejemplo:

```text
A=[1,2,3]
r=2

[1,1] ✓
[1,2] ✓
[1,3] ✓
[2,2] ✓
[2,3] ✓
[3,3] ✓
```

## REGLA ABSOLUTA

```text
COMBI SR = k+1
COMBI CR = k
```

Si en el examen olvidas todo lo demás, recuerda eso.

## Las mismas 3 consultas

C1:

```text
suma == x
```

C2:

```text
contains(x)
```

C3:

```text
todos pares
```

Solo mantienes la llamada recursiva con `k`.

---

# 7. PERMUTACIÓN SIN REPETICIÓN — `permutSR`

## Diferencia con combinación

En una permutación:

```text
[1,2] != [2,1]
```

El orden SÍ importa.

Por eso en cada nivel vuelves a revisar toda `A`:

```java
for (int k = 0; k < A.size(); k++)
```

No existe `i`.

## ¿Cómo evito repetir?

```java
if (!L.contains(A.get(k)))
```

## Código mental

```java
if (L.size() == r) {
    imprimir;
    return;
}

for (k = 0; k < A.size(); k++) {

    if (!L.contains(A.get(k))) {

        add(A.get(k));

        permutSR(...);

        removeLast();
    }
}
```

## Por dentro

```text
A=[1,2,3]
r=2

[]
├──1
│  ├──2 → [1,2]
│  └──3 → [1,3]
│
├──2
│  ├──1 → [2,1]
│  └──3 → [2,3]
│
└──3
   ├──1 → [3,1]
   └──2 → [3,2]
```

## Regla de oro

```text
PERMUTACIÓN SR
→ k empieza en 0
→ NO lleva i
→ usa !contains
```

## 3 consultas

### C1 — empieza con x

En el caso base:

```java
if (L.getFirst() == x)
```

### C2 — termina con x

```java
if (L.getLast() == x)
```

### C3 — contiene x

```java
if (L.contains(x))
```

---

# 8. PERMUTACIÓN CON REPETICIÓN — `permutCR`

Es la más corta.

```java
if (L.size() == r) {
    imprimir;
    return;
}

for (int k = 0; k < A.size(); k++) {

    L.add(A.get(k));

    permutCR(L,A,r);

    L.removeLast();
}
```

No lleva:

```java
i
```

y tampoco:

```java
contains
```

porque repetir está permitido.

## Árbol

```text
A=[1,2]
r=2

[]
├──1
│  ├──1 → [1,1]
│  └──2 → [1,2]
│
└──2
   ├──1 → [2,1]
   └──2 → [2,2]
```

## Tabla que debes memorizar

| Algoritmo | Inicio del `for` | llamada | filtro |
|---|---|---|---|
| Combi SR | `k=i` | `k+1` | ninguno |
| Combi CR | `k=i` | `k` | ninguno |
| Permut SR | `k=0` | sin `i` | `!contains` |
| Permut CR | `k=0` | sin `i` | ninguno |

Esta tabla vale más que memorizar 4 métodos separados.

## 3 consultas

Iguales conceptualmente a permutSR:

```text
C1 empieza con x
C2 termina con x
C3 contiene x
```

Solo NO pongas `contains` para controlar la repetición.

---

# 9. DETERMINANTE GENÉRICO

Aquí cambia completamente el patrón.

## Caso base

Una matriz `1x1`:

```text
| 7 |

det = 7
```

Por eso:

```java
if (M.length == 1)
    return M[0][0];
```

## Para matrices más grandes

Se expande por la primera columna:

```java
for (int i = 0; i < M.length; i++)
```

Cada término:

```text
signo
× elemento de M
× determinante de su menor
```

Código:

```java
s += (i%2==0 ? 1 : -1)
   * M[i][0]
   * det(menor(M,i,0));
```

## Cómo recordar el signo

```text
i=0 → +
i=1 → -
i=2 → +
i=3 → -
```

Entonces:

```java
i % 2 == 0 ? 1 : -1
```

## Cómo funciona `menor`

Si tienes:

```text
1 2 3
4 5 6
7 8 9
```

y haces:

```java
menor(M, 0, 1)
```

eliminas:

```text
fila 0
columna 1
```

queda:

```text
4 6
7 9
```

Mentalmente:

```text
recorro M
si estoy en fi → salto fila
si estoy en co → salto columna
lo demás → copiar a R
```

## 3 consultas fáciles

### C1

```java
det(M) == x
```

### C2

```java
det(M) > 0
```

### C3

```java
det(menor(M,fi,co))
```

No memorices tres determinantes. Todas llaman al mismo `det`.

---

# 10. SUBMATRICES

Esta parte se vuelve fácil cuando entiendes los cuatro índices.

Una submatriz rectangular necesita:

```text
(i,j) = esquina superior izquierda
(p,q) = esquina inferior derecha
```

Visualmente:

```text
M:

0,0   0,1   0,2
1,0  [1,1   1,2]
2,0  [2,1   2,2]

inicio = (1,1)
final  = (2,2)
```

## ¿Por qué cuatro `for`?

Primero eliges dónde empieza:

```java
for (i...)
for (j...)
```

Luego dónde termina:

```java
for (p=i...)
for (q=j...)
```

Esqueleto:

```java
for (int i=0; i<M.length; i++)
for (int j=0; j<M[0].length; j++)
for (int p=i; p<M.length; p++)
for (int q=j; q<M[0].length; q++)
    mostrar(M,i,j,p,q);
```

## Fórmula mental

```text
INICIO: i,j
FINAL:  p,q
```

## `mostrar`

Solo recorre dentro de esos límites:

```java
for (f=i; f<=p; f++)
for (c=j; c<=q; c++)
```

OJO:

```text
generar límites → usa <
recorrer submatriz elegida → usa <=
```

---

# CONSULTA 1 — SUBMATRICES CUADRADAS

Una submatriz es cuadrada cuando:

```text
cantidad de saltos verticales
=
cantidad de saltos horizontales
```

o:

```java
p - i == q - j
```

Entonces dentro de los cuatro `for`:

```java
if (cuadrada(i,j,p,q))
    mostrar(...);
```

---

# CONSULTA 2 — SUMA DE LA SUBMATRIZ = x

Primero haces:

```java
static int sumaSub(...) {

    int s=0;

    for(f=i; f<=p; f++)
    for(c=j; c<=q; c++)
        s += M[f][c];

    return s;
}
```

Consulta:

```java
if (sumaSub(...) == x)
    mostrar(...);
```

---

# CONSULTA 3 — CONTIENE x

La recorres:

```java
for(...)
for(...)
    if(M[f][c] == x)
        return true;

return false;
```

y en la consulta:

```java
if (contiene(...,x))
    mostrar(...);
```

---

# TABLA FINAL: TODO EL EXAMEN EN UNA PÁGINA

| Problema | Cómo sé que terminé | Cómo avanzo |
|---|---|---|
| Sumandos | `suma(L)==n` | `k` |
| Factores | `prod(L)==n` | `k` + `n%k==0` |
| Mochila | `suma(L)<=max` | `k+1` sobre `A` |
| Mochila exacta | `suma(L)==max` | `k+1` |
| Combi SR | `L.size()==r` | `k+1` |
| Combi CR | `L.size()==r` | `k` |
| Permut SR | `L.size()==r` | desde `0` + `!contains` |
| Permut CR | `L.size()==r` | desde `0`, libre |
| Determinante | `M.length==1` | calcular menores |
| Submatrices | cuatro límites | `i,j,p,q` |

---

# LAS 4 FRASES PARA RECUPERAR TODO

Si te bloqueas en el examen:

```text
1. BACKTRACKING:
   agrego → llamo → quito

2. COMBINACIÓN:
   tengo i
   SR = k+1
   CR = k

3. PERMUTACIÓN:
   NO tengo i
   vuelvo desde k=0
   SR usa contains
   CR no usa contains

4. SUBMATRIZ:
   inicio i,j
   final p,q
```

---

# CÓMO DEBE ENTRENARTE TU APP

Para cada algoritmo haz estas etapas, en este orden.

## Nivel 1 — animación / ejecución interna

La app muestra algo como:

```text
L=[]
↓ add(1)

L=[1]
↓ llamada recursiva

L=[1,2]
✓ caso base

↓ return
↓ removeLast()

L=[1]

↓ probar siguiente k
```

No hay cronómetro.

## Nivel 2 — explica decisiones

Preguntas rápidas:

```text
¿Por qué combiSR usa k+1?
¿Por qué permutSR empieza en 0?
¿Por qué factores usa n%k==0?
¿Por qué mochila usa A.get(k)?
¿Qué hace removeLast()?
```

## Nivel 3 — huecos

Ejemplo:

```java
for(int k=___; k<A.size(); k++){
    L.add(_________);
    combiSR(L,A,r,_____);
    _____________;
}
```

## Nivel 4 — solo esqueleto

La app muestra:

```text
COMBINACIÓN SIN REPETICIÓN
Parámetros: L,A,r,i
```

Tú escribes el método.

## Nivel 5 — consulta fácil

La app dice:

```text
Ahora modifica el algoritmo para
mostrar solamente combinaciones
que contienen 3.
```

Tu cabeza solo debería pensar:

```java
if(L.size()==r){
    if(L.contains(3))
        System.out.println(L);
    return;
}
```

## Nivel 6 — contra reloj

Solo cuando ya pudiste reconstruirlo sin mirar.

Mide:

```text
precisión
errores
tiempo
```

Prioridad:

```text
PRECISIÓN > VELOCIDAD
```

Cuando llegues a 0 errores, entonces intenta bajar el tiempo.

---

# EJERCICIOS FLASH PARA LA APP

Usa estos prompts aleatorios.

## Sumandos

```text
1. Mostrar sumandos de 6 con exactamente 2 números.
2. Mostrar sumandos de 6 que contengan 2.
3. Mostrar sumandos de 6 sin repetir números.
```

## Factores

```text
1. Factores de 12 con exactamente 2 números.
2. Factores de 12 que contengan 3.
3. Factores de 12 sin repetir.
```

## Mochila

```text
A=[2,4,6,8]

1. Combinaciones con suma exacta 10.
2. Combinaciones de exactamente 2 elementos y suma <= 10.
3. Combinaciones que contengan 4 y suma <= 10.
```

## Mochila exacta

```text
A=[2,4,6,8]

1. Suma 10 usando exactamente 2 elementos.
2. Suma 10 y debe contener 4.
3. Suma 10 y no debe contener 8.
```

## Combi SR

```text
A=[1,2,3,4], r=2

1. Suma = 5.
2. Contiene 2.
3. Solo números pares.
```

## Combi CR

```text
A=[1,2,3,4], r=2

1. Suma = 4.
2. Contiene 2.
3. Solo números pares.
```

## Permut SR

```text
A=[1,2,3], r=2

1. Empieza con 1.
2. Termina con 2.
3. Contiene 3.
```

## Permut CR

```text
A=[1,2,3], r=2

1. Empieza con 1.
2. Termina con 2.
3. Contiene 3.
```

## Determinante

```text
1. ¿det(M) == 22?
2. ¿det(M) es positivo?
3. Determinante del menor quitando fila 0, columna 0.
```

## Submatrices

```text
1. Mostrar cuadradas.
2. Mostrar las que suman 12.
3. Mostrar las que contienen 5.
```

---

# TEST FINAL DE MEMORIA

Sin ver código, responde:

1. ¿Cuáles son las tres acciones del backtracking?
2. ¿Combi SR llama con `k` o `k+1`?
3. ¿Combi CR llama con `k` o `k+1`?
4. ¿Permut SR lleva parámetro `i`?
5. ¿Qué evita repetir valores en permutSR?
6. ¿Qué diferencia `L.add(k)` de `L.add(A.get(k))`?
7. ¿Cuándo corta sumandos?
8. ¿Qué condición extra tiene factores?
9. ¿Cuál es el caso base del determinante?
10. ¿Qué representan `i,j,p,q`?

Respuestas:

```text
1. add → recursión → removeLast
2. k+1
3. k
4. no
5. !L.contains(A.get(k))
6. k es valor / A.get(k) es elemento de una posición
7. suma>n; imprime cuando suma==n
8. n%k==0
9. M.length==1
10. esquina inicial y esquina final de la submatriz
```

Si puedes responder esas diez sin pensar demasiado, ya tienes el mapa mental del código.
