/**
 * ============================================================================
 * ARCHIVO DE CONFIGURACIÓN GENERAL Y SPONSORS - DEVFEST SANTIAGO DE CHILE 2026
 * ============================================================================
 * NOTA IMPORTANTE SOBRE LA AGENDA / PROGRAMA:
 * El programa completo del evento (horarios, salas, charlas, talleres y bloques
 * plenarios) se encuentra en el archivo independiente:
 *   -> data/agenda.json
 *
 * Para cambios de último minuto en el cronograma, edita directamente `data/agenda.json`.
 * ============================================================================
 */

export const EVENT_DATA = {
  meta: {
    title: "DevFest Santiago de Chile 2026",
    edition: "Edición 8-Bits · GDG Santiago",
    statusLabel: "VERSIÓN ACTUALIZADA · 6 DE NOVIEMBRE DE 2026",
    lastUpdated: "6 de noviembre de 2026",
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
    chapterUrl: "https://gdg.community.dev/gdg-santiago-de-chile/",
    agendaJsonPath: "data/agenda.json"
  },

  /**
   * MARQUESINA DE ANUNCIOS PREVIOS AL EVENTO
   * Se desplaza continuamente en la parte superior. Puedes agregar o quitar mensajes.
   */
  announcements: [
    "🕹️ ¡REGISTRO GRATUITO ABIERTO EN LUMA! ASEGURA TU ENTRADA ANTES DE QUE SE AGOTEN LOS CUPOS",
    "📅 SÁBADO 7 DE NOVIEMBRE DE 2026 · 09:00 A 14:00 HRS · UNAB CAMPUS BELLAVISTA",
    "⚡ CRONOGRAMA ACTUALIZADO: 1 AUDITORIO + 3 SALAS CON TALLERES / CHARLAS DE ESPECIALIDAD SIMULTÁNEOS",
    "💻 SEIS TALLERES / CHARLAS DE ESPECIALIDAD DE 90 MINUTOS + CONVERSATORIO DE CIERRE",
    "👾 PULSA SOBRE CUALQUIER BLOQUE DE LA AGENDA PARA VER EL AVATAR 8-BITS Y DETALLES DE LA SESIÓN"
  ],

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
        tier: "Conversatorio de Cierre",
        logoText: "BANCO BICE",
        badgeColor: "#041B2C",
        url: "https://www.bice.cl/",
        description: "Presente en el Conversatorio de cierre en el auditorio principal junto a Andrés Peralta."
      },
      {
        name: "Camanchaca",
        tier: "Conversatorio de Cierre",
        logoText: "CAMANCHACA",
        badgeColor: "#1967D2",
        url: "https://camanchaca.cl/",
        description: "Presente en el Conversatorio de cierre en el auditorio principal junto a Pedro Aguirre."
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
        name: "GDG Valparaíso",
        role: "Comunidad GDG Invitada",
        logoText: "GDG Valparaíso",
        badgeColor: "#EA4335",
        url: "https://gdg.community.dev/",
        description: "Comunidad hermana presente en la apertura oficial del DevFest Santiago de Chile 2026."
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
