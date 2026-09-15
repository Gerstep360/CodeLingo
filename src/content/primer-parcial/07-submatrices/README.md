# 07-submatrices

Contenido modular de CodeLingo para la clase **Lista de SubMatrices**.

Estructura:

- `class.json`: modelo mental general.
- `base.json`: genera y guarda todas las submatrices.
- `shared/matriz.json`: clase `Matriz`.
- `shared/submatriz.json`: recorta una submatriz entre `(i,j)` y `(a,b)`.
- `exercises/cuadradas.json`: filtro `fil()==col()`.
- `exercises/fila.json`: filtro `fil()==1`.
- `exercises/columna.json`: filtro `col()==1`.

Modelo mental principal:

`INICIO (i,j) → FINAL (a,b) → RECORTO → GUARDO`

Los cuatro ciclos del algoritmo base:

- `i`: fila inicial
- `j`: columna inicial
- `a`: fila final, empieza en `i`
- `b`: columna final, empieza en `j`

Todos los `code.target` conservan la lógica canónica de `ExamenVargas.java`.
