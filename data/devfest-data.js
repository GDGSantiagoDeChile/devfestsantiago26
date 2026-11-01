/**
 * ============================================================================
 * ARCHIVO CENTRAL DE DATOS - DEVFEST SANTIAGO DE CHILE 2026
 * ============================================================================
 * Para actualizar cualquier charla, horario, anuncio de la marquesina o sponsor:
 * 1. Edita este archivo directamente en GitHub (o localmente).
 * 2. Los bloques de cada sala calculan su altura proporcionalmente según
 *    `startTime` y `endTime` (formato "HH:MM").
 * 3. Si un taller dura menos (ej. cambia de "09:15"-"11:15" a "09:15"-"10:45"),
 *    puedes:
 *    a) Agregar un bloque manual con `type: "filler"` en esa misma sala, O
 *    b) Dejar `autoFillGaps: true` para que el sistema rellene automáticamente
 *       el tiempo restante con un bloque de transición/networking.
 * ============================================================================
 */

export const EVENT_DATA = {
  meta: {
    title: "DevFest Santiago de Chile 2026",
    edition: "Edición 8-Bits · GDG Santiago",
    statusLabel: "CRONOGRAMA PRELIMINAR · SUJETO A ACTUALIZACIONES",
    lastUpdated: "31 de octubre de 2026",
    dateText: "Sábado 7 de noviembre de 2026",
    timeText: "09:00 – 14:00 hrs (CLT)",
    venue: {
      name: "Universidad Andrés Bello",
      campus: "Sede / Campus Bellavista",
      city: "Santiago de Chile",
      address: "Av. Bellavista 0121, Providencia, Santiago",
      mapUrl: "https://maps.google.com/?q=Universidad+Andres+Bello+Campus+Bellavista+Santiago"
    },
    registrationUrl: "https://luma.com/7p4i60n3",
    githubRepoUrl: "https://github.com/GDGSantiagoDeChile/devfestsantiago26",
    chapterUrl: "https://gdg.community.dev/gdg-santiago-de-chile/"
  },

  /**
   * MARQUESINA DE ANUNCIOS PREVIOS AL EVENTO
   * Se desplaza continuamente en la parte superior. Puedes agregar o quitar mensajes.
   */
  announcements: [
    "🕹️ ¡REGISTRO GRATUITO ABIERTO EN LUMA! ASEGURA TU ENTRADA ANTES DE QUE SE AGOTEN LOS CUPOS",
    "📅 SÁBADO 7 DE NOVIEMBRE DE 2026 · 09:00 A 14:00 HRS · UNAB CAMPUS BELLAVISTA",
    "💻 TRAE TU LAPTOP CARGADA SI PARTICIPARÁS EN LOS TALLERES PRÁCTICOS DE SALA 1, SALA 2 Y SALA 3",
    "⚡ AGENDA PRELIMINAR: 1 AUDITORIO PRINCIPAL + 3 SALAS DE TALLERES SIMULTÁNEOS",
    "👾 PULSA SOBRE CUALQUIER BLOQUE DE LA AGENDA PARA VER EL AVATAR 8-BITS Y DETALLES DE LA SESIÓN"
  ],

  /**
   * CONFIGURACIÓN DE SALAS / TRACKS
   */
  rooms: [
    { id: "auditorio", name: "AUDITORIO", subtitle: "Charlas & Panel", color: "blue" },
    { id: "sala1", name: "SALA 1", subtitle: "Talleres Prácticos", color: "red" },
    { id: "sala2", name: "SALA 2", subtitle: "Talleres Prácticos", color: "yellow" },
    { id: "sala3", name: "SALA 3", subtitle: "Talleres Prácticos", color: "green" }
  ],

  /**
   * CONFIGURACIÓN DEL MOTOR DE BLOQUES ASIMÉTRICOS
   * Si `autoFillGaps` es true, cuando un taller o charla deja tiempo libre al final
   * o entre bloques dentro de una tanda, se genera un bloque de relleno automático
   * (a menos que ya hayas agregado un bloque `type: "filler"` manual).
   */
  scheduleConfig: {
    autoFillGaps: true,
    minGapMinutesToFill: 10, // Rellenar huecos mayores o iguales a 10 minutos
    defaultFillerTitle: "Bloque Flexible · Q&A Libre / Demos / Networking",
    defaultFillerDescription: "Espacio flexible para preguntas extendidas, demostraciones en vivo con el speaker, configuración de entorno o networking entre asistentes."
  },

  /**
   * PROGRAMA / AGENDA COMPLETA (TANDAS 1 Y 2 + HITOS GENERALES)
   */
  schedule: {
    // Hito de Apertura (Abarca todas las salas)
    opening: {
      id: "apertura",
      type: "plenary",
      startTime: "09:00",
      endTime: "09:10",
      title: "Apertura Oficial · UNAB + GDG Santiago",
      subtitle: "Retransmisión simultánea en el Auditorio y las tres salas de talleres",
      speaker: "Equipo Organizador GDG Santiago & Universidad Andrés Bello",
      role: "Anfitriones Oficiales",
      badge: "GDG + UNAB",
      avatar: "panel",
      roomLabel: "AUDITORIO + SALAS 1, 2 Y 3",
      description: "Bienvenida oficial al DevFest Santiago de Chile 2026 desde el Campus Bellavista de la Universidad Andrés Bello. Presentación de la agenda del día, indicaciones logísticas de las salas y apertura de la jornada comunitaria.",
      tags: ["Bienvenida", "Comunidad", "DevFest 2026", "UNAB"],
      techLogos: ["community", "ai", "cloud", "android"]
    },

    // TANDAS (Cada tanda tiene su ventana de tiempo y bloques independientes por sala)
    tandas: [
      {
        id: "tanda-1",
        name: "PRIMERA TANDA",
        subtitle: "09:15 – 11:15 · Charlas en Auditorio y tres talleres simultáneos",
        startTime: "09:15",
        endTime: "11:15",
        note: "Pausa común de 11:15 a 11:35. Temas, idiomas y requisitos por validar.",
        tracks: {
          auditorio: [
            {
              id: "t1-aud-1",
              type: "talk",
              formatLabel: "CHARLA",
              startTime: "09:15",
              endTime: "10:10",
              durationNote: "45 min de charla + 10 min de preguntas",
              title: "Keynote: Inteligencia Artificial y Cloud en la Nueva Era de Desarrollo",
              speaker: "Mikaeri Ohana",
              affiliation: "Google",
              badge: "Google",
              badgeColor: "blue",
              avatar: "mikaeri",
              roomLabel: "AUDITORIO",
              description: "Sesión inaugural de la primera tanda en el Auditorio Principal a cargo de Mikaeri Ohana (Developer Relations Engineer en Google). Exploraremos cómo la Inteligencia Artificial generativa, el Machine Learning moderno y la nube están transformando la forma en que diseñamos y desplegamos soluciones reales.",
              tags: ["Google Cloud", "Gemini IA", "Machine Learning", "Keynote"],
              techLogos: ["ai", "cloud"]
            },
            {
              id: "t1-aud-2",
              type: "talk",
              formatLabel: "CHARLA",
              startTime: "10:15",
              endTime: "11:10",
              durationNote: "45 min de charla + 10 min de preguntas",
              title: "De la idea al prototipo móvil: Construyendo apps con ayuda de la IA",
              speaker: "Armando Picón (@devpicon)",
              affiliation: "GDE / GDG",
              badge: "GDE / GDG",
              badgeColor: "green",
              avatar: "devpicon",
              roomLabel: "AUDITORIO",
              sessionizeUrl: "https://sessionize.com/s/devpicon/de-la-idea-al-prototipo-movil-construyendo-apps-co/191187",
              description: "Durante años, convertir una idea en una aplicación móvil funcional implicaba conocer tecnologías, herramientas y procesos específicos de Android o iOS. Hoy, las herramientas de inteligencia artificial están reduciendo considerablemente esa barrera y haciendo posible pasar de una idea a un prototipo en mucho menos tiempo. En esta charla exploraremos un flujo de trabajo práctico para utilizar la IA durante el prototipado de una aplicación móvil, desde las primeras ideas hasta verla funcionando en un dispositivo. Compartiré herramientas, consejos y lecciones aprendidas para evitar algunos de los errores más comunes y, sobre todo, entender hasta dónde puede ayudarnos la IA y qué decisiones todavía siguen dependiendo de nosotros.",
              tags: ["Mobile", "Android", "Kotlin", "IA Generativa", "Prototipado"],
              techLogos: ["android", "kotlin", "ai"]
            }
          ],
          sala1: [
            {
              id: "t1-sala1-1",
              type: "workshop",
              formatLabel: "TALLER",
              startTime: "09:15",
              endTime: "11:15",
              durationNote: "120 minutos · Preguntas incluidas",
              title: "Taller Práctico: Arquitecturas Cloud & Agentes de IA con Google Cloud",
              speaker: "Lucía Subatin",
              affiliation: "Google",
              badge: "Google",
              badgeColor: "red",
              avatar: "lucia",
              roomLabel: "SALA 1",
              description: "Taller práctico guiado por Lucía Subatin (Developer Relations Engineer en Google). Aprende paso a paso cómo diseñar, conectar y desplegar soluciones modernas en la nube integrando flujos de datos y agentes inteligentes. Incluye espacio continuo para preguntas y resolución de dudas.",
              tags: ["Google Cloud", "Agentes IA", "Arquitectura", "Hands-on"],
              techLogos: ["cloud", "ai"]
            }
          ],
          sala2: [
            {
              id: "t1-sala2-1",
              type: "workshop",
              formatLabel: "TALLER",
              startTime: "09:15",
              endTime: "11:15",
              durationNote: "120 minutos · Preguntas incluidas",
              title: "Taller Práctico: Desarrollo Web Moderno y Escalable en Acción",
              speaker: "Álvaro Camillo",
              affiliation: "GDE",
              badge: "GDE",
              badgeColor: "yellow",
              avatar: "alvaro",
              roomLabel: "SALA 2",
              description: "Taller intensivo liderado por Álvaro Camillo (Google Developer Expert). Una inmersión práctica en patrones modernos de ingeniería frontend y desarrollo web con herramientas del ecosistema Google, buenas prácticas de arquitectura y optimización en tiempo real.",
              tags: ["Angular", "Web", "Frontend", "Arquitectura"],
              techLogos: ["angular", "web"]
            }
          ],
          sala3: [
            {
              id: "t1-sala3-1",
              type: "workshop",
              formatLabel: "TALLER",
              startTime: "09:15",
              endTime: "11:15",
              durationNote: "120 minutos · Preguntas incluidas",
              title: "Taller Práctico: Construyendo con Machine Learning, LLMs y Gemini",
              speaker: "Lesly Zerna",
              affiliation: "GDE",
              badge: "GDE",
              badgeColor: "green",
              avatar: "lesly",
              roomLabel: "SALA 3",
              description: "Taller práctico junto a Lesly Zerna (Google Developer Expert en Machine Learning). Exploraremos desde cero cómo experimentar con modelos generativos, ingeniería de prompts, herramientas de IA de Google y creación de prototipos inteligentes listos para usar.",
              tags: ["Machine Learning", "Gemini", "IA Generativa", "Python / Cloud"],
              techLogos: ["ai", "cloud", "firebase"]
            }
          ]
        }
      },

      {
        id: "tanda-2",
        name: "SEGUNDA TANDA",
        subtitle: "11:35 – 13:35 · Charla, Panel de Conversación y tres talleres simultáneos",
        startTime: "11:35",
        endTime: "13:35",
        note: "Panel: 45 min de conversación y 15 min de preguntas. Cierre de 13:45 a 14:00 con retransmisión a las salas.",
        tracks: {
          auditorio: [
            {
              id: "t2-aud-1",
              type: "talk",
              formatLabel: "CHARLA",
              startTime: "11:35",
              endTime: "12:25",
              durationNote: "40 min de charla + 10 min de preguntas",
              title: "Observabilidad Moderna y Rendimiento en Sistemas Cloud-Native",
              speaker: "Eduardo Miranda",
              affiliation: "Datadog",
              badge: "Datadog",
              badgeColor: "blue",
              avatar: "eduardo",
              roomLabel: "AUDITORIO",
              description: "Sesión técnica en el Auditorio Principal con Eduardo Miranda (Datadog). Analizaremos cómo monitorear, entender y optimizar aplicaciones modernas distribuidas y servicios potenciados por IA en producción sin perder visibilidad de extremo a extremo.",
              tags: ["Observabilidad", "Datadog", "Cloud Native", "DevOps & SRE"],
              techLogos: ["datadog", "cloud"]
            },
            {
              id: "t2-aud-2",
              type: "panel",
              formatLabel: "PANEL DE CONVERSACIÓN",
              startTime: "12:30",
              endTime: "13:30",
              durationNote: "45 min de conversación + 15 min de preguntas",
              title: "Panel de Conversación: IA, Talento y Transformación Digital en la Industria",
              speaker: "Andrés Peralta (Banco BICE) · Pedro Aguirre Diez (Camanchaca) · Rocío Contreras (UNAB)",
              moderators: "Moderan: Nicole Paine y Armando Picón (GDG Santiago)",
              affiliation: "BICE · Camanchaca · UNAB · GDG Santiago",
              badge: "PANEL",
              badgeColor: "yellow",
              avatar: "panel",
              roomLabel: "AUDITORIO",
              description: "Un espacio de diálogo abierto entre líderes de la industria financiera, productiva y académica en Chile: Andrés Peralta (Banco BICE), Pedro Aguirre Diez (Camanchaca) y Rocío Contreras (Universidad Andrés Bello), moderado por Nicole Paine y Armando Picón de GDG Santiago. Conversaremos sobre adopción real de inteligencia artificial, desafíos tecnológicos locales y el futuro del talento tech.",
              tags: ["Panel", "Industria & Academia", "IA en Chile", "Liderazgo Tech"],
              techLogos: ["community", "ai", "cloud"]
            }
          ],
          sala1: [
            {
              id: "t2-sala1-1",
              type: "workshop",
              formatLabel: "TALLER",
              startTime: "11:35",
              endTime: "13:35",
              durationNote: "120 minutos · Preguntas incluidas",
              title: "Taller Práctico: Orquestación de Agentes e IA en Google Cloud Platform",
              speaker: "Julio Quinteros",
              affiliation: "GDE",
              badge: "GDE",
              badgeColor: "red",
              avatar: "julio",
              roomLabel: "SALA 1",
              description: "Taller práctico dirigido por Julio Quinteros (Google Developer Expert en Google Cloud). Aprenderemos a construir y desplegar arquitecturas en Google Cloud Platform integrando servicios de IA generativa, Vertex AI y agentes automatizados listos para entornos empresariales.",
              tags: ["Google Cloud", "Vertex AI", "Agentes IA", "Arquitectura"],
              techLogos: ["cloud", "ai"]
            }
          ],
          sala2: [
            {
              id: "t2-sala2-1",
              type: "workshop",
              formatLabel: "TALLER",
              startTime: "11:35",
              endTime: "13:35",
              durationNote: "120 minutos · Preguntas incluidas",
              title: "Taller Práctico: Soluciones Escalables de Datos e Inteligencia Artificial",
              speaker: "Ranse Vidal",
              affiliation: "GDE",
              badge: "GDE",
              badgeColor: "yellow",
              avatar: "ranse",
              roomLabel: "SALA 2",
              description: "Taller práctico de 120 minutos guiado por Ranse Vidal. Explora de forma interactiva cómo estructurar flujos modernos de ingeniería, integración de servicios cloud y herramientas del ecosistema Google con ejercicios prácticos y preguntas abiertas durante toda la sesión.",
              tags: ["Cloud", "Datos & IA", "Desarrollo Práctico", "Ecosistema Google"],
              techLogos: ["cloud", "firebase", "ai"]
            }
          ],
          sala3: [
            {
              id: "t2-sala3-1",
              type: "workshop",
              formatLabel: "TALLER",
              startTime: "11:35",
              endTime: "13:35",
              durationNote: "120 minutos · Preguntas incluidas",
              title: "Taller Práctico: Arquitectura Frontend Moderna con Angular",
              speaker: "Jimmy Dolores",
              affiliation: "GDE",
              badge: "GDE",
              badgeColor: "green",
              avatar: "jimmy",
              roomLabel: "SALA 3",
              description: "Taller práctico junto a Jimmy Dolores (Google Developer Expert en Angular). Descubre las últimas capacidades de Angular para construir aplicaciones web reactivas, modulares y de alto rendimiento, aplicando patrones modernos paso a paso.",
              tags: ["Angular", "Frontend", "TypeScript", "Web Performance"],
              techLogos: ["angular", "web"]
            }
          ]
        }
      }
    ],

    // Pausa común entre Tanda 1 y Tanda 2
    commonBreak: {
      id: "pausa-comun",
      type: "break",
      startTime: "11:15",
      endTime: "11:35",
      title: "Pausa Común, Networking & Cambio de Talleres",
      subtitle: "20 minutos para recargar energías, conocer a la comunidad y cambiar de sala",
      speaker: "Comunidad GDG Santiago",
      role: "Break & Networking",
      badge: "PAUSA 20 MIN",
      avatar: "panel",
      roomLabel: "TODAS LAS ÁREAS",
      description: "Pausa común de 11:15 a 11:35 hrs entre la Primera Tanda y la Segunda Tanda. Aprovecha para compartir con otros desarrolladores, conversar con los speakers y ubicarte en tu próxima sala de taller o en el Auditorio Principal.",
      tags: ["Networking", "Comunidad", "Cambio de Sala"],
      techLogos: ["community"]
    },

    // Hito de Cierre (Abarca todas las salas)
    closing: {
      id: "cierre",
      type: "plenary",
      startTime: "13:45",
      endTime: "14:00",
      title: "Cierre del Evento · UNAB + GDG Santiago",
      subtitle: "Retransmisión en las tres salas · Agradecimientos y foto grupal",
      speaker: "Equipo Organizador GDG Santiago & Universidad Andrés Bello",
      role: "Cierre Oficial",
      badge: "CIERRE",
      avatar: "panel",
      roomLabel: "AUDITORIO + SALAS 1, 2 Y 3",
      description: "Palabras de cierre de las 13:45 a las 14:00 hrs con retransmisión a las tres salas de talleres. Agradecimientos a nuestros speakers, sponsors, voluntarios, a la Universidad Andrés Bello sede Bellavista y a toda la comunidad que dio vida al DevFest Santiago 2026.",
      tags: ["Cierre", "Comunidad", "Foto Oficial", "GDG Santiago"],
      techLogos: ["community", "android", "cloud", "ai"]
    }
  },

  /**
   * BADGES TECNOLÓGICOS DESTACADOS DEL EVENTO
   */
  featuredTechs: [
    { key: "android", label: "Android" },
    { key: "kotlin", label: "Kotlin & Mobile" },
    { key: "ai", label: "Gemini & IA" },
    { key: "cloud", label: "Google Cloud" },
    { key: "angular", label: "Angular" },
    { key: "firebase", label: "Firebase" },
    { key: "flutter", label: "Flutter" },
    { key: "datadog", label: "Observabilidad" },
    { key: "web", label: "Web & Frontend" }
  ],

  /**
   * SPONSORS Y PARTNERS (En la página de Sponsors se usan logos oficiales sin pixelar)
   */
  sponsors: {
    host: [
      {
        name: "Universidad Andrés Bello · Campus Bellavista",
        tier: "Sede Anfitriona & Partner Académico",
        logo: "assets/img/unab-campus-bellavista.png",
        url: "https://www.unab.cl",
        description: "Casa de estudios anfitriona del DevFest Santiago de Chile 2026 en su Campus Bellavista."
      }
    ],
    official: [
      {
        name: "Google for Developers",
        tier: "Global Program Partner",
        logoText: "Google for Developers",
        badgeColor: "#4285F4",
        url: "https://developers.google.com/",
        description: "Impulsando la red global de comunidades Google Developer Groups (GDG) y Google Developer Experts (GDE)."
      },
      {
        name: "Datadog",
        tier: "Sponsor Tecnológico",
        logoText: "DATADOG",
        badgeColor: "#632CA6",
        url: "https://www.datadoghq.com/",
        description: "Plataforma de observabilidad y seguridad para aplicaciones en la nube."
      },
      {
        name: "Banco BICE",
        tier: "Participación en Panel Industrial",
        logoText: "BANCO BICE",
        badgeColor: "#041B2C",
        url: "https://www.bice.cl/",
        description: "Presente en el Panel de Conversación de industria en el Auditorio Principal."
      },
      {
        name: "Camanchaca",
        tier: "Participación en Panel Industrial",
        logoText: "CAMANCHACA",
        badgeColor: "#1967D2",
        url: "https://camanchaca.cl/",
        description: "Presente en el Panel de Conversación sobre innovación y tecnología en la industria."
      }
    ],
    community: [
      {
        name: "GDG Santiago de Chile",
        role: "Comunidad Organizadora",
        logo: "assets/img/gdg-santiago-logo.png",
        url: "https://gdg.community.dev/gdg-santiago-de-chile/",
        description: "Comunidad abierta de desarrolladoras y desarrolladores entusiastas de las tecnologías de Google en Santiago."
      },
      {
        name: "Women Techmakers Chile",
        role: "Comunidad Aliada",
        logoText: "Women Techmakers",
        badgeColor: "#4285F4",
        url: "https://developers.google.com/womentechmakers",
        description: "Visibilidad, comunidad y recursos para mujeres en tecnología."
      },
      {
        name: "Comunidades Tech de Chile",
        role: "Sponsors Comunitarios & Media Partners",
        logoText: "Comunidades Aliadas",
        badgeColor: "#34A853",
        url: "https://luma.com/7p4i60n3",
        description: "¿Tu comunidad quiere sumarse como Sponsor Comunitario? ¡Escríbenos para aparecer aquí con tu logo oficial!"
      }
    ]
  }
};
