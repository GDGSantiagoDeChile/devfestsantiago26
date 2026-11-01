# 🕹️ DevFest Santiago de Chile 2026 · Landing & Agenda (8-Bit Edition)

Sitio web oficial del **DevFest Santiago de Chile 2026** organizado por **GDG Santiago de Chile** en el **Campus Bellavista de la Universidad Andrés Bello** (Sábado 7 de noviembre de 2026, 09:00 – 14:00 hrs).

## ✨ Características Principales

- **Estética 8-Bits (Inspirada en Kunio-kun de NES) + Paleta Oficial GDG y Escala de Grises**:
  - Avatares en 8-bits con animación de 2 frames para cada charlista y tallerista.
  - Badges tecnológicos en 8-bits con movimiento (Android, Kotlin, Gemini/IA, Google Cloud, Angular, Firebase, Flutter, Observabilidad/Datadog, Web).
  - Respeto íntegro por la imagen oficial de la sede (**Universidad Andrés Bello · Campus Bellavista**) en la pantalla principal y por los logos oficiales en la página de [`sponsors.html`](./sponsors.html).
- **Motor de Agenda / Programa con Bloques Asimétricos**:
  - Cada columna de sala (`Auditorio`, `Sala 1`, `Sala 2`, `Sala 3`) calcula la proporción de sus bloques según los minutos reales (`startTime` y `endTime`).
  - Si un taller dura menos de lo inicialmente estipulado (por ejemplo, 90 min en vez de 120 min), puedes ajustar su `endTime` y agregar un bloque con `type: "filler"` o dejar que `autoFillGaps: true` agregue un bloque de relleno automáticamente.
- **Actualización Instantánea en GitHub Pages (Zero-Build)**:
  - Toda la información del programa, anuncios de la marquesina y sponsors vive en un único archivo: [`data/devfest-data.js`](./data/devfest-data.js).
  - Puedes editar [`data/devfest-data.js`](./data/devfest-data.js) directamente desde la interfaz web de GitHub y los cambios se publicarán automáticamente en GitHub Pages sin pasos complejos de compilación.

## 🛠️ Cómo actualizar una charla, horario o anuncio

Abre [`data/devfest-data.js`](./data/devfest-data.js) y edita cualquiera de las siguientes secciones:

1. **Marquesina de avisos (`announcements`)**: Agrega o modifica textos en el arreglo `announcements`.
2. **Charlas y Talleres (`schedule.tandas`)**: Modifica `startTime`, `endTime`, `title`, `speaker`, `description`, `tags` o `techLogos`.
3. **Sponsors (`sponsors`)**: Agrega logos oficiales en `assets/img/` y regístralos en `sponsors.official` o `sponsors.community`.
