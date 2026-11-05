# 🕹️ DevFest Santiago de Chile 2026 · Landing & Agenda (8-Bit Edition)

Sitio web oficial del **DevFest Santiago de Chile 2026** organizado por **GDG Santiago de Chile** en el **Campus Bellavista de la Universidad Andrés Bello** (Sábado 7 de noviembre de 2026, 09:00 – 14:00 hrs).

## ✨ Características Principales

- **Estética 8-Bits (Inspirada en Kunio-kun de NES) + Paleta Oficial GDG y Escala de Grises**:
  - Avatares en 8-bits con animación de 2 frames para cada charlista y tallerista.
  - Badges tecnológicos en 8-bits con movimiento (Android, Kotlin, Gemini/IA, Google Cloud, Angular, Firebase, Flutter, Observabilidad/Datadog, Web).
  - Respeto íntegro por la imagen oficial de la sede (**Universidad Andrés Bello · Campus Bellavista**) en la pantalla principal y por los logos oficiales en la página de [`sponsors.html`](./sponsors.html).
- **Motor de Agenda / Programa en JSON (`data/agenda.json`) con Bloques Asimétricos**:
  - Todo el cronograma del evento vive en un archivo JSON independiente y fácil de editar: [`data/agenda.json`](./data/agenda.json).
  - Cada columna de sala (`Auditorio`, `Sala 1`, `Sala 2`, `Sala 3`) calcula la proporción de sus bloques según los minutos reales (`startTime` y `endTime`).
  - Si un taller o charla de especialidad dura menos de lo inicialmente estipulado (por ejemplo, 60 min en vez de 90 min), puedes ajustar su `endTime` y agregar un bloque con `type: "filler"` o dejar que `autoFillGaps: true` agregue un bloque de relleno automáticamente.
- **Actualización Instantánea en GitHub Pages (Zero-Build)**:
  - El programa completo vive en [`data/agenda.json`](./data/agenda.json), mientras que los anuncios de la marquesina y los sponsors viven en [`data/devfest-data.js`](./data/devfest-data.js).
  - Puedes editar [`data/agenda.json`](./data/agenda.json) directamente desde la interfaz web de GitHub ante cualquier cambio de último minuto y los cambios se reflejarán de inmediato.

## 🛠️ Cómo actualizar la agenda, un horario o un anuncio

1. **Agenda / Programa del evento ([`data/agenda.json`](./data/agenda.json))**:
   - Abre [`data/agenda.json`](./data/agenda.json).
   - En el arreglo `blocks` encontrarás en orden cronológico cada bloque plenario (`kind: "plenary"`) y cada tanda simultánea (`kind: "tanda"` con sus pistas `auditorio`, `sala1`, `sala2`, `sala3`).
   - Modifica `startTime`, `endTime`, `title`, `speaker`, `affiliation`, `badge` o `description` según sea necesario.
2. **Marquesina de avisos (`announcements` en [`data/devfest-data.js`](./data/devfest-data.js))**: Agrega o modifica textos en el arreglo `announcements`.
3. **Sponsors (`sponsors` en [`data/devfest-data.js`](./data/devfest-data.js))**: Agrega logos oficiales en `assets/img/` y regístralos en `sponsors.official` o `sponsors.community`.
