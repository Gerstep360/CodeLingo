# 🦉 CodeLingo (Vargas Sprint)

Plataforma interactiva gamificada estilo **Duolingo** diseñada para desarrollar memoria muscular, dominio de backtracking y resolución de algoritmos en Java para exámenes universitarios.

---

## 🚀 Características Principales

1. **Ruta de Aprendizaje Interactiva (Estilo Duolingo)**:
   - Nodos con progreso progresivo y desbloqueo secuencial dinámico.
   - Puntos de experiencia (XP), rachas de días y feedback háptico/visual.
   - Iconografía vectorial 100% SVG nítida y moderna (cero emojis).

2. **Modo Examen (IDE con UI/UX Duolingo)**:
   - Cabecera estilo Duolingo con botón de salida, barra de progreso y temporizador físico 3D de 45 minutos.
   - Editor de código de alta precisión con cursor asistido y navegación libre con flechas (`↑`, `↓`, `←`, `→`).
   - Autocompletado inteligente sin bloqueos de signos (`()`, `{}`, `[]`).
   - Barra de métricas 3D: Caracteres restantes, precisión en tiempo real y contador de combos dinámicos.

3. **Guía Mental y Tarjetas Rápidas (Flash Quiz)**:
   - Mnemotecnias clave de Backtracking, Combinaciones, Permutaciones y Submatrices.
   - Pruebas rápidas de 10 preguntas para fijar conceptos teóricos en segundos.

4. **Persistencia de Datos**:
   - Progreso guardado automáticamente en `localStorage`.
   - Exportación e importación de backups en formato JSON para no perder rachas ni nodos completados.

---

## 📦 Despliegue en Servidor (Nginx junto a Angular)

El proyecto está preparado para coexistir pacíficamente con una aplicación Angular u otros servicios en un servidor Nginx, bajo la subruta `/CodeLingo`.

### Despliegue Automatizado:
```bash
chmod +x install.sh
./install.sh /var/www/CodeLingo
```

El script se encarga de:
1. Instalar dependencias con `npm install`.
2. Compilar los archivos con `VITE_BASE_PATH="/CodeLingo/" npm run build`.
3. Copiar la carpeta `dist/` a `/var/www/CodeLingo`.
4. Copiar la configuración de Nginx (`nginx-codelingo.conf`) y recargar el servicio sin afectar otras aplicaciones.

### Configuración Nginx (`nginx-codelingo.conf`):
```nginx
location ^~ /CodeLingo {
    alias /var/www/CodeLingo/dist;
    index index.html;
    try_files $uri $uri/ /CodeLingo/index.html;

    location ~* \.(?:js|css|svg|woff2?|ttf|eot|png|jpe?g|ico|webp)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
    }
}
```

---

## 💻 Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo en http://localhost:5173
npm run dev

# Compilar para producción
npm run build
```

