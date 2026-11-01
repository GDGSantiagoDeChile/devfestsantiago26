/**
 * Motor de Sprites 8-Bits (Estilo Kunio-kun NES + Badges Tecnológicos Animados)
 * DevFest Santiago de Chile 2026 - GDG Santiago
 */

const PALETTES = {
  // Colores base Kunio-kun + GDG + Escala de grises
  '.': null, // Transparente
  'K': '#000000', // Contorno negro NES
  'W': '#FFFFFF', // Blanco puro
  'G': '#D4D4D4', // Gris claro
  'D': '#555555', // Gris oscuro
  // Pieles NES
  'S': '#FFCC99', // Piel clara/media
  'T': '#E5A073', // Piel bronceada/sombra
  'M': '#C68642', // Piel morena
  // Cabellos
  'H': '#1A1A1A', // Cabello negro/oscuro
  'C': '#5C3818', // Cabello castaño
  'R': '#A83228', // Cabello rojizo/caoba
  'A': '#7F8C8D', // Cabello platinado/gris
  // Colores GDG
  'B': '#4285F4', // Google Blue
  'E': '#EA4335', // Google Red
  'Y': '#FBBC04', // Google Yellow
  'V': '#34A853', // Google Green
  // Tonos secundarios GDG
  'b': '#1967D2', // Blue dark
  'e': '#C5221F', // Red dark
  'y': '#F29900', // Yellow dark
  'v': '#188038', // Green dark
  'P': '#7B1FA2', // Purple (Datadog / AI accent)
};

/**
 * Generador de personajes estilo Kunio-kun (Nekketsu NES) en grilla de 16x20 píxeles.
 * Cada personaje tiene 2 frames (Frame 0: Idle / Pose 1, Frame 1: Talk & Step / Pose 2)
 */
const KUNIO_TEMPLATES = {
  // 1. Armando Picón (@devpicon) - Cabello corto oscuro, lentes pixel, polera GDG Azul, sonrisa energética
  'devpicon': {
    frame1: [
      "....KKKKKKKK....",
      "...KHHHHHHHHK...",
      "..KHHHHHHHHHHK..",
      "..KHHSSSSSSHHK..",
      "..KHSKKKKKKSHK..",
      "..KKKWKSSKWKKK..",
      "..KSSSKSSSSSSK..",
      "..KSSSSKKSSSSK..",
      "...KSSWWWWSSK...",
      "....KKKKKKKK....",
      "...KBBBBBBBBK...",
      "..KBBBBYYBBBBK..",
      "..KBBKBBBBKBBK..",
      "..KSSKBBBBKSSK..",
      "..KKKKBBBBKKKK..",
      "....KDDDDDDK....",
      "....KDDKKDDK....",
      "....KDDKKDDK....",
      "...KKKK..KKKK...",
      "...KKKK..KKKK..."
    ],
    frame2: [
      "....KKKKKKKK....",
      "...KHHHHHHHHK...",
      "..KHHHHHHHHHHK..",
      "..KHHSSSSSSHHK..",
      "..KHSKKKKKKSHK..",
      "..KKKWKSSKWKKK..",
      "..KSSSKSSSSSSK..",
      "..KSSSKKKKSSSK..",
      "...KSSWKKWSSK...",
      "....KKKKKKKK....",
      "..KKBBBBBBBBKK..",
      "..KSSKBBBBYYBK..",
      "..KKKKBBBBKBBK..",
      "....KBBBBBBSSK..",
      "....KKKKKKKKKK..",
      "....KDDDDDDK....",
      "...KDDK..KDDK...",
      "...KKKK..KKKK...",
      "...KKKK..KKKK...",
      "................"
    ]
  },

  // 2. Mikaeri Ohana (Google) - Cabello largo oscuro con reflejos, chaqueta Google Blue + detalle amarillo
  'mikaeri': {
    frame1: [
      "....KKKKKKKK....",
      "...KHHHHHHHHK...",
      "..KHHHHHHHHHHK..",
      ".KHHHSSSSSSHHHK.",
      ".KHHKWWSSWWKHHK.",
      ".KHHKKSSSSKKHHK.",
      ".KHHSSSSSSSSHHK.",
      ".KHHHSSWWSSHHHK.",
      ".KHHKKKKKKKKHHK.",
      ".KHKBBBBBBBBKHK.",
      "..KKBBYYYYBBKK..",
      "..KBBKBBBBKBBK..",
      "..KSSKBBBBKSSK..",
      "..KKKKBBBBKKKK..",
      "....KKKKKKKK....",
      "....KDDDDDDK....",
      "....KDDKKDDK....",
      "....KDDKKDDK....",
      "...KWWK..KWWK...",
      "...KKKK..KKKK..."
    ],
    frame2: [
      "....KKKKKKKK....",
      "...KHHHHHHHHK...",
      "..KHHHHHHHHHHK..",
      ".KHHHSSSSSSHHHK.",
      ".KHHKWWSSWWKHHK.",
      ".KHHKKSSSSKKHHK.",
      ".KHHSSSSSSSSHHK.",
      ".KHHHSKKKKSHHHK.",
      ".KHHKKKKKKKKHHK.",
      ".KHKBBBBBBBBKHK.",
      "..KKBBYYYYBBKK..",
      "..KSSKBBBBKBBK..",
      "..KKKKBBBBKSSK..",
      "....KBBBBBBKKK..",
      "....KKKKKKKK....",
      "....KDDDDDDK....",
      "...KDDK..KDDK...",
      "...KWWK..KWWK...",
      "...KKKK..KKKK...",
      "................"
    ]
  },

  // 3. Lucía Subatin (Google) - Cabello castaño largo, outfit Google Red + Cloud badge
  'lucia': {
    frame1: [
      "....KKKKKKKK....",
      "...KCCCCCCCCK...",
      "..KCCCCCCCCCCK..",
      ".KCCCSSSSSSCCCK.",
      ".KCCKWWSSWWKCCK.",
      ".KCCKKSSSSKKCCK.",
      ".KCCSSSSSSSSCCK.",
      ".KCCCSSWWSSCCCK.",
      ".KCCKKKKKKKKCCK.",
      "..KKEEEEEEEEKK..",
      "..KEEEWWWWEEEK..",
      "..KEEKWWWWKEEK..",
      "..KSSKEEEEKSSK..",
      "..KKKKEEEEKKKK..",
      "....KKKKKKKK....",
      "....KDDDDDDK....",
      "....KDDKKDDK....",
      "....KDDKKDDK....",
      "...KEEK..KEEK...",
      "...KKKK..KKKK..."
    ],
    frame2: [
      "....KKKKKKKK....",
      "...KCCCCCCCCK...",
      "..KCCCCCCCCCCK..",
      ".KCCCSSSSSSCCCK.",
      ".KCCKWWSSWWKCCK.",
      ".KCCKKSSSSKKCCK.",
      ".KCCSSSSSSSSCCK.",
      ".KCCCSKKKKSCcCK.",
      ".KCCKKKKKKKKCCK.",
      "..KKEEEEEEEEKK..",
      "..KSSKEEEEWEEK..",
      "..KKKKWWWWKEEK..",
      "....KEEEEEEKSSK.",
      "....KKKKKKKKKK..",
      "....KDDDDDDK....",
      "...KDDK..KDDK...",
      "...KEEK..KEEK...",
      "...KKKK..KKKK...",
      "................",
      "................"
    ]
  },

  // 4. Álvaro Camillo (GDE) - Estilo Kunio clásico con cabello castaño, polera Roja Angular/GDE
  'alvaro': {
    frame1: [
      "...KKKKKKKKKK...",
      "..KCCCCCCCCCCK..",
      "..KCCCSSSSSSCK..",
      "..KCCSSSSSSSSK..",
      "..KCSKWWSSWWKSK.",
      "..KCSKKSSSSKKSK.",
      "..KSSSSSSSSSSK..",
      "...KSSWWWWSSK...",
      "....KKKKKKKK....",
      "...KEEEEEEEEK...",
      "..KEEEWWWWEEEK..",
      "..KEEKEEEEKEEK..",
      "..KSSKEEEEKSSK..",
      "..KKKKEEEEKKKK..",
      "....KKKKKKKK....",
      "....KDDDDDDK....",
      "....KDDKKDDK....",
      "....KDDKKDDK....",
      "...KKKK..KKKK...",
      "...KKKK..KKKK..."
    ],
    frame2: [
      "...KKKKKKKKKK...",
      "..KCCCCCCCCCCK..",
      "..KCCCSSSSSSCK..",
      "..KCCSSSSSSSSK..",
      "..KCSKWWSSWWKSK.",
      "..KCSKKSSSSKKSK.",
      "..KSSSSSSSSSSK..",
      "...KSSKKKKSSK...",
      "....KKKKKKKK....",
      "..KKEEEEEEEEKK..",
      "..KSSKEEEEWEEK..",
      "..KKKKEEEEKEEK..",
      "....KEEEEEESSK..",
      "....KKKKKKKKKK..",
      "....KDDDDDDK....",
      "...KDDK..KDDK...",
      "...KKKK..KKKK...",
      "...KKKK..KKKK...",
      "................",
      "................"
    ]
  },

  // 5. Lesly Zerna (GDE ML) - Cabello largo oscuro, lentes/sonrisa brillante, polera Amarilla/Verde AI
  'lesly': {
    frame1: [
      "....KKKKKKKK....",
      "...KHHHHHHHHK...",
      "..KHHHHHHHHHHK..",
      ".KHHHSSSSSSHHHK.",
      ".KHHKWWSSWWKHHK.",
      ".KHHKKSSSSKKHHK.",
      ".KHHSSSSSSSSHHK.",
      ".KHHHSSWWSSHHHK.",
      ".KHHKKKKKKKKHHK.",
      "..KKYYYYYYYYKK..",
      "..KYYYBBBBYYYK..",
      "..KYYKYYYYKYYK..",
      "..KSSKYYYYKSSK..",
      "..KKKKYYYYKKKK..",
      "....KKKKKKKK....",
      "....KDDDDDDK....",
      "....KDDKKDDK....",
      "....KDDKKDDK....",
      "...KYYK..KYYK...",
      "...KKKK..KKKK..."
    ],
    frame2: [
      "....KKKKKKKK....",
      "...KHHHHHHHHK...",
      "..KHHHHHHHHHHK..",
      ".KHHHSSSSSSHHHK.",
      ".KHHKWWSSWWKHHK.",
      ".KHHKKSSSSKKHHK.",
      ".KHHSSSSSSSSHHK.",
      ".KHHHSKKKKSHHHK.",
      ".KHHKKKKKKKKHHK.",
      "..KKYYYYYYYYKK..",
      "..KSSKYYYYBYYK..",
      "..KKKKBBBBKYYK..",
      "....KYYYYYYSSK..",
      "....KKKKKKKKKK..",
      "....KDDDDDDK....",
      "...KDDK..KDDK...",
      "...KYYK..KYYK...",
      "...KKKK..KKKK...",
      "................",
      "................"
    ]
  },

  // 6. Eduardo Miranda (Datadog) - Estilo Kunio con chaqueta Púrpura/Negra Datadog
  'eduardo': {
    frame1: [
      "...KKKKKKKKKK...",
      "..KHHHHHHHHHHK..",
      "..KHHHSSSSSSHK..",
      "..KHHSSSSSSSSK..",
      "..KHSKWWSSWWKSK.",
      "..KHSKKSSSSKKSK.",
      "..KSSSSSSSSSSK..",
      "...KSKKKKKKSK...",
      "....KKKKKKKK....",
      "...KPPPPPPPPK...",
      "..KPPPWWWWPPPK..",
      "..KPPKPPPPKPPK..",
      "..KSSKPPPPKSSK..",
      "..KKKKPPPPKKKK..",
      "....KKKKKKKK....",
      "....KDDDDDDK....",
      "....KDDKKDDK....",
      "....KDDKKDDK....",
      "...KKKK..KKKK...",
      "...KKKK..KKKK..."
    ],
    frame2: [
      "...KKKKKKKKKK...",
      "..KHHHHHHHHHHK..",
      "..KHHHSSSSSSHK..",
      "..KHHSSSSSSSSK..",
      "..KHSKWWSSWWKSK.",
      "..KHSKKSSSSKKSK.",
      "..KSSSSSSSSSSK..",
      "...KSSWKKWSSK...",
      "....KKKKKKKK....",
      "..KKPPPPPPPPKK..",
      "..KSSKPPPPWPPK..",
      "..KKKKPPPPKPPK..",
      "....KPPPPPPSSK..",
      "....KKKKKKKKKK..",
      "....KDDDDDDK....",
      "...KDDK..KDDK...",
      "...KKKK..KKKK...",
      "...KKKK..KKKK...",
      "................",
      "................"
    ]
  },

  // 7. Julio Quinteros (GDE Cloud/AI) - Lentes, barba pixel, chaqueta Verde GDG Cloud
  'julio': {
    frame1: [
      "....KKKKKKKK....",
      "...KHHHHHHHHK...",
      "..KHHHHHHHHHHK..",
      "..KHHSSSSSSHHK..",
      "..KHSKKKKKKSHK..",
      "..KKKWKSSKWKKK..",
      "..KSSSSSSSSSSK..",
      "..KHHWWWWHHK..".replace('', 'WW'),
      "...KHHHHHHHHK...",
      "....KKKKKKKK....",
      "...KVVVVVVVVK...",
      "..KVVVWWWWVVVK..",
      "..KVVKVVVVKVVK..",
      "..KSSKVVVVKSSK..",
      "..KKKKVVVVKKKK..",
      "....KDDDDDDK....",
      "....KDDKKDDK....",
      "....KDDKKDDK....",
      "...KKKK..KKKK...",
      "...KKKK..KKKK..."
    ],
    frame2: [
      "....KKKKKKKK....",
      "...KHHHHHHHHK...",
      "..KHHHHHHHHHHK..",
      "..KHHSSSSSSHHK..",
      "..KHSKKKKKKSHK..",
      "..KKKWKSSKWKKK..",
      "..KSSSSSSSSSSK..",
      "..KHHWKKKKWHHK..",
      "...KHHHHHHHHK...",
      "....KKKKKKKK....",
      "..KKVVVVVVVVKK..",
      "..KSSKVVVVWVVK..",
      "..KKKKVVVVKVVK..",
      "....KVVVVVVSSK..",
      "....KKKKKKKKKK..",
      "....KDDDDDDK....",
      "...KDDK..KDDK...",
      "...KKKK..KKKK...",
      "...KKKK..KKKK...",
      "................"
    ]
  },

  // 8. Ranse Vidal (GDE) - Peinado pompadour Kunio-kun clásico, chaqueta Azul/Verde
  'ranse': {
    frame1: [
      "..KKKKKKKKKKKK..",
      ".KHHHHHHHHHHHHK.",
      ".KHHHHSSSSSSHHK.",
      "..KHHSSSSSSSSK..",
      "..KHSKWWSSWWKSK.",
      "..KHSKKSSSSKKSK.",
      "..KSSSSSSSSSSK..",
      "...KSSWWWWSSK...",
      "....KKKKKKKK....",
      "...KBBBBBBBBK...",
      "..KBBBVVVVBBBK..",
      "..KBBKBBBBKBBK..",
      "..KSSKBBBBKSSK..",
      "..KKKKBBBBKKKK..",
      "....KKKKKKKK....",
      "....KDDDDDDK....",
      "....KDDKKDDK....",
      "....KDDKKDDK....",
      "...KWWK..KWWK...",
      "...KKKK..KKKK..."
    ],
    frame2: [
      "..KKKKKKKKKKKK..",
      ".KHHHHHHHHHHHHK.",
      ".KHHHHSSSSSSHHK.",
      "..KHHSSSSSSSSK..",
      "..KHSKWWSSWWKSK.",
      "..KHSKKSSSSKKSK.",
      "..KSSSSSSSSSSK..",
      "...KSSKKKKSSK...",
      "....KKKKKKKK....",
      "..KKBBBBBBBBKK..",
      "..KSSKBBBBVBBK..",
      "..KKKKBBBBKBBK..",
      "....KBBBBBBSSK..",
      "....KKKKKKKKKK..",
      "....KDDDDDDK....",
      "...KDDK..KDDK...",
      "...KWWK..KWWK...",
      "...KKKK..KKKK...",
      "................",
      "................"
    ]
  },

  // 9. Jimmy Dolores (GDE Angular) - Cabello oscuro spiky NES, chaqueta Roja GDE Angular
  'jimmy': {
    frame1: [
      ".K..KKKKKKKK..K.",
      ".KKKHHHHHHHHKKK.",
      "..KHHHHHHHHHHK..",
      "..KHHMMMMMMHHK..",
      "..KHMKKKKKKMHK..",
      "..KMMKWWMMWWKMK.",
      "..KMMMMMMMMMMK..",
      "...KMMWWWWMMK...",
      "....KKKKKKKK....",
      "...KEEEEEEEEK...",
      "..KEEEYYYYEEEK..",
      "..KEEKEEEEKEEK..",
      "..KMMKEEEEKMMK..",
      "..KKKKEEEEKKKK..",
      "....KKKKKKKK....",
      "....KDDDDDDK....",
      "....KDDKKDDK....",
      "....KDDKKDDK....",
      "...KEEK..KEEK...",
      "...KKKK..KKKK..."
    ],
    frame2: [
      ".K..KKKKKKKK..K.",
      ".KKKHHHHHHHHKKK.",
      "..KHHHHHHHHHHK..",
      "..KHHMMMMMMHHK..",
      "..KHMKKKKKKMHK..",
      "..KMMKWWMMWWKMK.",
      "..KMMMMMMMMMMK..",
      "...KMMKKKKMMK...",
      "....KKKKKKKK....",
      "..KKEEEEEEEEKK..",
      "..KMMKEEEEYEEK..",
      "..KKKKEEEEKEEK..",
      "....KEEEEEEMMK..",
      "....KKKKKKKKKK..",
      "....KDDDDDDK....",
      "...KDDK..KDDK...",
      "...KEEK..KEEK...",
      "...KKKK..KKKK...",
      "................",
      "................"
    ]
  },

  // 10. Panel / Comunidad / Apertura (Party Nekketsu GDG)
  'panel': {
    frame1: [
      "....KKKKKKKK....",
      "...KHHHHHHHHK...",
      "..KHHHHHHHHHHK..",
      "..KHHSSSSSSHHK..",
      "..KHSKWWSSWWKSK.",
      "..KHSKKSSSSKKSK.",
      "..KSSSSSSSSSSK..",
      "...KSSWWWWSSK...",
      "....KKKKKKKK....",
      "...KBBEEYYVVK...",
      "..KBBEEYYVVBBK..",
      "..KBBKWWWWKVVKK.",
      "..KSSKWWWWKSSK..",
      "..KKKKWWWWKKKK..",
      "....KKKKKKKK....",
      "....KDDDDDDK....",
      "....KDDKKDDK....",
      "....KDDKKDDK....",
      "...KKKK..KKKK...",
      "...KKKK..KKKK..."
    ],
    frame2: [
      "....KKKKKKKK....",
      "...KHHHHHHHHK...",
      "..KHHHHHHHHHHK..",
      "..KHHSSSSSSHHK..",
      "..KHSKWWSSWWKSK.",
      "..KHSKKSSSSKKSK.",
      "..KSSSSSSSSSSK..",
      "...KSSKKKKSSK...",
      "....KKKKKKKK....",
      "..KKBBEEYYVVKK..",
      "..KSSKBBEEYYVK..",
      "..KKKKWWWWKVVKK.",
      "....KWWWWWWSSK..",
      "....KKKKKKKKKK..",
      "....KDDDDDDK....",
      "...KDDK..KDDK...",
      "...KKKK..KKKK...",
      "...KKKK..KKKK...",
      "................",
      "................"
    ]
  }
};

/**
 * Badges y Logos Tecnológicos en 8-Bits (12x12 pixel art)
 */
const TECH_BADGES_12X12 = {
  'android': {
    name: 'Android',
    color: '#34A853',
    grid: [
      "..V......V..",
      "...V....V...",
      "..VVVVVVVV..",
      ".VVWVVVVWVV.",
      ".VVVVVVVVVV.",
      ".KKKKKKKKKK.",
      "VV.VVVVVV.VV",
      "VV.VVVVVV.VV",
      "VV.VVVVVV.VV",
      "...VVVVVV...",
      "...VV..VV...",
      "...VV..VV..."
    ]
  },
  'ai': {
    name: 'Gemini / IA',
    color: '#4285F4',
    grid: [
      ".....BB.....",
      ".....BB.....",
      "....BBBB....",
      "...BBBBBB...",
      "..BBBBBBBB..",
      "BBBBWWWWBBBB",
      "BBBBWWWWBBBB",
      "..BBBBBBBB..",
      "...BBBBBB...",
      "....BBBB....",
      ".....BB..Y..",
      "........YYY."
    ]
  },
  'cloud': {
    name: 'Google Cloud',
    color: '#4285F4',
    grid: [
      "............",
      "....EEEE....",
      "..EEBBBBBB..",
      ".EBBWWWWBB..",
      ".EBW....WBB.",
      "YYW......WBB",
      "YYW......WVV",
      ".YYWWWWWWVV.",
      "..YYYYVVVV..",
      "............",
      "............",
      "............"
    ]
  },
  'angular': {
    name: 'Angular',
    color: '#EA4335',
    grid: [
      ".....EE.....",
      "...EEEEEE...",
      ".EEEEEEEEEE.",
      ".EEEEWWEEEE.",
      ".EEEWWWWEEE.",
      "..EEWEEWEE..",
      "..EWWWWWW...",
      "..EW....WE..",
      "...EEEEEE...",
      "....EEEE....",
      ".....EE.....",
      "............"
    ]
  },
  'kotlin': {
    name: 'Kotlin / Mobile',
    color: '#4285F4',
    grid: [
      ".BBBBBBBBBB.",
      ".BBBBBBBBEE.",
      ".BBBBBBEEEE.",
      ".BBBBEEEEEE.",
      ".BBEEEEEE...",
      ".BEEEEEE....",
      ".BBYYYYYY...",
      ".BBBBYYYYYY.",
      ".BBBBBBYYYY.",
      ".BBBBBBBBYY.",
      ".BBBBBBBBBB.",
      "............"
    ]
  },
  'firebase': {
    name: 'Firebase',
    color: '#FBBC04',
    grid: [
      "....YY......",
      "...YYYY.....",
      "...YYYY.E...",
      "..YYYYYEE...",
      "..YYYYEEEE..",
      ".YYYYYYYYYY.",
      ".YYYYYYYYYY.",
      ".YYYYYYYYYY.",
      "..YYYYYYYY..",
      "...YYYYYY...",
      "....YYYY....",
      "............"
    ]
  },
  'flutter': {
    name: 'Flutter',
    color: '#4285F4',
    grid: [
      "......BBBB..",
      "....BBBBBB..",
      "...BBBBBB...",
      "..BBBB......",
      ".BBBB..BBBB.",
      "BBBB..BBBB..",
      ".BB..BBBB...",
      "....BBBB....",
      "...BBBBBB...",
      "....BBBBBB..",
      "......BBBB..",
      "............"
    ]
  },
  'datadog': {
    name: 'Observabilidad / Datadog',
    color: '#7B1FA2',
    grid: [
      "..PPPPPPPP..",
      ".PPWWWWWWPP.",
      ".PWKKWWKKWP.",
      ".PWWWWWWWWP.",
      ".PWWKKKKWWP.",
      ".PWWWWWWWWP.",
      "..PPPPPPPP..",
      "...PPWWPP...",
      "..PPPPPPPP..",
      "..PP.PP.PP..",
      ".....PP.....",
      "............"
    ]
  },
  'web': {
    name: 'Web & Frontend',
    color: '#FBBC04',
    grid: [
      "............",
      "...BB..VV...",
      "..BB....VV..",
      ".BB......VV.",
      "BB...YY...VV",
      "BB..YYYY..VV",
      ".BB..YY..VV.",
      "..BB....VV..",
      "...BB..VV...",
      "............",
      "............",
      "............"
    ]
  },
  'community': {
    name: 'Comunidad & Industria',
    color: '#34A853',
    grid: [
      "............",
      "..BBB..EEE..",
      ".BBBB..EEEE.",
      "BBBBB..EEEEE",
      ".BBBB..EEEE.",
      "..BBB..EEE..",
      "..VVV..YYY..",
      ".VVVV..YYYY.",
      "VVVVV..YYYYY",
      ".VVVV..YYYY.",
      "..VVV..YYY..",
      "............"
    ]
  }
};

/**
 * Convierte una matriz de caracteres en un elemento SVG pixel-art nítido
 */
export function renderMatrixToSVG(matrix, className = '') {
  const height = matrix.length;
  const width = matrix[0].length;
  let rects = '';

  for (let y = 0; y < height; y++) {
    const row = matrix[y];
    for (let x = 0; x < width; x++) {
      const char = row[x];
      const fill = PALETTES[char];
      if (fill) {
        rects += `<rect x="${x}" y="${y}" width="1" height="1" fill="${fill}" />`;
      }
    }
  }

  return `<svg class="${className}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
}

/**
 * Retorna el HTML de un personaje Kunio-kun animado (alterna entre frame1 y frame2 con CSS)
 */
export function renderKunioCharacter(avatarKey = 'devpicon', sizeClass = 'kunio-md') {
  const template = KUNIO_TEMPLATES[avatarKey] || KUNIO_TEMPLATES['panel'];
  const svgFrame1 = renderMatrixToSVG(template.frame1, 'kunio-frame kunio-frame-1');
  const svgFrame2 = renderMatrixToSVG(template.frame2, 'kunio-frame kunio-frame-2');

  return `
    <div class="kunio-sprite ${sizeClass}" data-avatar="${avatarKey}">
      ${svgFrame1}
      ${svgFrame2}
    </div>
  `;
}

/**
 * Retorna el HTML de un badge tecnológico en 8-bits con ícono pixelado animado
 */
export function renderTechBadge(techKey, showLabel = true) {
  const badge = TECH_BADGES_12X12[techKey] || TECH_BADGES_12X12['ai'];
  const svg = renderMatrixToSVG(badge.grid, 'pixel-tech-svg');
  return `
    <span class="tech-badge-8bit" style="--badge-accent: ${badge.color}" title="${badge.name}">
      <span class="tech-badge-icon">${svg}</span>
      ${showLabel ? `<span class="tech-badge-label">${badge.name}</span>` : ''}
    </span>
  `;
}

export { TECH_BADGES_12X12, KUNIO_TEMPLATES };
