# 06-determinante

Contenido modular de CodeLingo para la clase **Determinante**.

Estructura:

- `class.json`: modelo mental de la familia.
- `base.json`: determinante canónico por la primera columna.
- `shared/matriz.json`: clase `Matriz`.
- `shared/signo.json`: signo del cofactor.
- `shared/menor.json`: creación de la matriz menor.
- `exercises/cofactor.json`: `signo × det(menor)`.
- `exercises/por-columna.json`: reemplaza la columna fija `0` por `j`.
- `exercises/por-fila.json`: fija `i` y recorre columnas con `j`.

Modelo mental:

`BASE 1x1 → SUMA → SIGNO × ELEMENTO × det(MENOR)`

Reglas rápidas:

- Base: columna `0`.
- Cofactor: `signo(i,j) * det(menor(M,i,j))`.
- Por columna: `j` fijo, recorro `i`.
- Por fila: `i` fijo, recorro `j`.

Todos los `code.target` conservan la lógica canónica de `ExamenVargas.java`.
