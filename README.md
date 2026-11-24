# El Blog de Periodismo y Literatura
Sitio estático (HTML, CSS, JS). Sin backend ni variables de entorno.
## Ejecutar en local
`python3 -m http.server 8000` y abrir http://localhost:8000
## Desplegar en Render
1. Suba la carpeta a un repositorio de GitHub.
2. Render > New > Static Site > elija el repositorio.
3. Build command: vacío. Publish directory: `.`
## Recursos multimedia
- Imágenes en `images/` (8 archivos .jpeg con los nombres indicados en `js/articles.js`). Fotos de integrantes: `images/integrantes/ehimy-valentina.jpg` y `santiago-castilla.jpg`.
- Videos en `videos/`; los nombres se configuran en `window.VIDEOS` (`js/articles.js`). Falta el nombre del archivo de Colombia (campo `file`).
## Añadir artículos o etapas
Copie un objeto de `window.ARTICLES` o una fila de `window.TIMELINES` en `js/articles.js`.
## Pendiente
Fotos de los integrantes y nombre del video de Colombia.
