# PUBLIAVISO C.A. — Landing

Sitio estático (HTML + CSS + un script inline, sin dependencias ni build). Abrir `index.html`.

## Publicar en GitHub Pages
1. Crear un repositorio vacío en GitHub (sin README ni licencia).
2. Desde esta carpeta:
   ```bash
   git remote add origin https://github.com/USUARIO/REPOSITORIO.git
   git push -u origin main
   ```
3. En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.

Las rutas son relativas (`styles.css`, `assets/`), así que funciona tanto en `usuario.github.io/repositorio/` como en un dominio propio. `.nojekyll` evita que GitHub procese el sitio con Jekyll.

## Estado
- Sigue las 10 secciones de la maqueta visual de referencia, con revisión UX/UI y responsive (escritorio, tablet y móvil), menú móvil, scroll reveal y cronología con fotos en "Nuestra historia".
- Hero: fondo (`hero-fondo.webp`) y operario recortado (`hero-operario-hd.webp`) en alta resolución.
- Tire Center: foto en alta resolución (`tire-center-hd.webp`).
- Mapa corregido sobre el original: sin "Delta Amacuro" duplicado, sin rótulo "Francisco de Miranda", "Vargas" -> "La Guaira", "Zulia" reubicado. **Revisar visualmente**: no se redibujaron límites estatales; para producción conviene un mapa SVG verificado.
- Imágenes de las 6 capacidades: recortes PROVISIONALES de la maqueta (baja resolución, generadas con IA).
- `hero-faja.webp`, `hero-operario.webp` y `tire-center.webp` ya no se usan en la página (versiones anteriores).

## Pendientes antes de publicar
1. URLs de redes sociales y número de WhatsApp (logo oficial ya incorporado).
2. `assets/ciclo-industrial.webp` es PROVISIONAL (foto de agencia con marca retirada): reemplazar por foto propia o con licencia.
3. Confirmar procedencia/derechos de las fotos del puente, del hero y del mapa; respaldo documental del hito 1962-1967 (United States Steel).
4. Fotos finales en alta resolución de las 6 capacidades.
5. El formulario sigue la maqueta y no pide nombre, correo ni teléfono; hoy envía por `mailto:` (sin backend).
6. Tire Center: confirmar que es caso real y autorizado.
7. Cronología (Nuestra historia): falta la foto de 2026 (hoy muestra "FOTO PENDIENTE"). Formato recomendado: vertical 4:5, mínimo 800 × 1000 px, WebP.
8. Enlaces sin destino: "Conocer nuestra historia" y "Ver proyecto".
9. Favicon e imagen para compartir en redes (`og:image`), que requiere el dominio final.
