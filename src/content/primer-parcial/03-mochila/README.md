# 03-mochila

Contenido modular de CodeLingo para la clase **Mochila**.

Estructura:

- `class.json`: metadatos, roles de L1/L2 y modelo mental.
- `base.json`: algoritmo base canónico.
- `shared/objeto.json`: clase `Objeto` con `peso`, `color` y `tam`.
- `shared/peso.json`: auxiliar `peso`.
- `exercises/color.json`: filtro `x.color.equals(c)`.
- `exercises/tamano.json`: filtro `x.tam<=tam`.
- `exercises/peso-rango.json`: filtro `x.peso>=a && x.peso<=b`.

Modelo mental:

`PESO → CORTO → IMPRIMO → RECORRO → AGREGO → BAJO → QUITO`

Regla central:

`L1.add(...) → recursión con k+1 → L1.removeLast()`

Todos los `code.target` conservan la lógica canónica de `ExamenVargas.java`.
