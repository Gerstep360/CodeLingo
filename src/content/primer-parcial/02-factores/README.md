# 02-factores

Contenido modular de CodeLingo para la clase **Factores**.

Estructura:

- `class.json`: metadatos, modelo mental y relación con Sumandos.
- `base.json`: algoritmo base canónico.
- `shared/prod.json`: auxiliar `prod`.
- `shared/primo.json`: auxiliar `primo`.
- `exercises/diferentes.json`: variante `k+1`.
- `exercises/primos.json`: agrega `primo(k)` manteniendo la divisibilidad.
- `exercises/rango.json`: limita el `for` hasta `b`.

Modelo mental:

`MULTIPLICO → CORTO → FILTRO → AGREGO → BAJO → QUITO`

Los `code.target` conservan exactamente la lógica canónica de `ExamenVargas.java`.
