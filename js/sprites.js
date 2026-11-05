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
  // Pieles NES (Estilo @dave.xp / River City Ransom con sombra lateral)
  'S': '#FFCC99', // Piel clara/media (luz)
  'T': '#E5A073', // Piel clara/media (sombra lateral)
  'M': '#C68642', // Piel morena/trigueña (luz)
  'N': '#9E6329', // Piel morena/trigueña (sombra lateral)
  // Cabellos (2 tonos para volumen pixel art)
  'H': '#1A1A1A', // Cabello negro/oscuro base
  'h': '#3A3F50', // Cabello negro/oscuro brillo
  'C': '#5C3818', // Cabello castaño base
  'c': '#8C5828', // Cabello castaño luz/reflejo
  'R': '#A83228', // Cabello rojizo/caoba
  'A': '#7F8C8D', // Cabello platinado/gris
  // Colores GDG
  'B': '#4285F4', // Google Blue
  'E': '#EA4335', // Google Red
  'Y': '#FBBC04', // Google Yellow
  'V': '#34A853', // Google Green
  // Tonos secundarios / sombras GDG
  'b': '#1967D2', // Blue dark
  'e': '#C5221F', // Red dark
  'y': '#F29900', // Yellow dark
  'v': '#188038', // Green dark
  'P': '#7B1FA2', // Purple (Datadog / AI accent)
  'p': '#4A148C', // Purple dark
  'J': '#283593', // Denim / Jeans clásico
  'j': '#1A237E', // Denim sombra
};

/**
 * Generador de personajes estilo @dave.xp (en auténtica vista 3/4, grilla de 20x22 píxeles).
 * Rasgos clave de @dave.xp:
 * - Colores planos sin línea negra entre el cabello y la frente.
 * - Ojos verticales negros de 1x2 píxeles (K) sin esclerótica blanca, desplazados a la derecha (3px entre ojos y solo 1px de piel hasta el borde derecho).
 * - Oreja de 2x2 píxeles en el lado izquierdo debajo de la patilla.
 * - Boca de 3x1 (reposo) o 3x2 (hablando) tocando diagonalmente la base de los ojos.
 * - Torso y piernas en 3/4 con línea divisoria desplazada 1px a la derecha.
 */
const KUNIO_TEMPLATES = {
  // 1. Armando Picón (@devpicon) - Cabello corto negro, lentes, hoodie GDG Azul con detalle amarillo
  'devpicon': {
    frame1: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KHHHHHHHHHHK....",
      "....KHHHHHHHHHHK....",
      "....KHHHHSSHHHHK....",
      "....KHHHSSSSSSSK....",
      "....KHHHSSSSSSSK....",
      "....KSSHDKSDSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKSSSSKKKSSK....",
      ".....KKSSSSSSSSK....",
      "......KKKKKKKKK.....",
      "....KKBBBBBBBBKK....",
      "...KBBKBBBBYYBBKBK..",
      "...KBBKBBBBYYBBKBK..",
      "...KSSKBBBBBBBBKSSK.",
      "...KKKKDDDDDDDDKKKK.",
      ".....KDDDDDDDDK.....",
      ".....KDDDDKDDDK.....",
      ".....KWWWWKWWWWK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ],
    frame2: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KHHHHHHHHHHK....",
      "....KHHHHHHHHHHK....",
      "....KHHHHSSHHHHK....",
      "....KHHHSSSSSSSK....",
      "....KHHHSSSSSSSK....",
      "....KSSHDKSDSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKSSSSKKKSSK....",
      ".....KKSSSKKKSSK....",
      "......KKKKKKKKK.....",
      "..KKKKBBBBBBBBKKKK..",
      ".KSSBBBBBBBYYBBBSSK.",
      ".KSSBBBBBBBYYBBBSSK.",
      "..KKKKBBBBBBBBKKKK..",
      ".....KDDDDDDDDK.....",
      ".....KDDDDDDDDK.....",
      ".....KDDDDKDDDK.....",
      ".....KWWWWKWWWWK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ]
  },

  // 2. Mikaeri Ohana (Google) - Cabello largo oscuro, chaqueta Google Blue con camiseta amarilla
  'mikaeri': {
    frame1: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KHHHHHHHHHHK....",
      "...KHHHHHHHHHHHHK...",
      "...KHHHHHSSHHHHHK...",
      "...KHHHHSSSSSSSHK...",
      "...KHHHHSSSSSSSHK...",
      "...KHSSHSKSSSKSKHK..",
      "...KHSSSSKSSSKSKHK..",
      "...KHKSSSSKKKSSKHK..",
      "...KHHKSSSSSSSSKHK..",
      "...KHHKKKKKKKKKKHK..",
      "...KKKBBBBYYYYBBKK..",
      "...KBBKBBBYYYYBKBK..",
      "...KBBKBBBWWWWBKBK..",
      "...KSSKBBBBBBBBKSSK.",
      "...KKKKDDDDDDDDKKKK.",
      ".....KDDDDDDDDK.....",
      ".....KDDDDKDDDK.....",
      ".....KWWWWKWWWWK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ],
    frame2: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KHHHHHHHHHHK....",
      "...KHHHHHHHHHHHHK...",
      "...KHHHHHSSHHHHHK...",
      "...KHHHHSSSSSSSHK...",
      "...KHHHHSSSSSSSHK...",
      "...KHSSHSKSSSKSKHK..",
      "...KHSSSSKSSSKSKHK..",
      "...KHKSSSSKKKSSKHK..",
      "...KHHKSSSKKKSSKHK..",
      "...KHHKKKKKKKKKKHK..",
      "...KKKBBBBYYYYKKKKK.",
      "...KBBKBBBYYYYBBBSSK",
      "...KBBKBBBWWWWBBBSSK",
      "...KSSKBBBBBBBKKKKK.",
      "...KKKKDDDDDDDDK....",
      ".....KDDDDDDDDK.....",
      ".....KDDDDKDDDK.....",
      ".....KWWWWKWWWWK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ]
  },

  // 3. Lucía Subatin (Google) - Cabello castaño hasta los hombros, blazer rojo GDG con blusa blanca
  'lucia': {
    frame1: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KCCCCCCCCCCK....",
      "...KCCCCCCCCCCCCK...",
      "...KCCCCCSSCCCCCK...",
      "...KCCCCSSSSSSSCK...",
      "...KCCCCSSSSSSSCK...",
      "...KCSSCSKSSSKSKCK..",
      "...KCSSSSKSSSKSKCK..",
      "...KCKSSSSKKKSSKCK..",
      "...KCCKSSSSSSSSKCK..",
      "...KCCKKKKKKKKKKCK..",
      "...KKKEEEEWWWWEEKK..",
      "...KEEKEEEWWWWEEKEK.",
      "...KEEKEEEWWWWEEKEK.",
      "...KSSKEEEEEEEEKSSK.",
      "...KKKKJJJJJJJJKKKK.",
      ".....KJJJJJJJJK.....",
      ".....KJJJJKJJJK.....",
      ".....KEEEEKEEEEK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ],
    frame2: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KCCCCCCCCCCK....",
      "...KCCCCCCCCCCCCK...",
      "...KCCCCCSSCCCCCK...",
      "...KCCCCSSSSSSSCK...",
      "...KCCCCSSSSSSSCK...",
      "...KCSSCSKSSSKSKCK..",
      "...KCSSSSKSSSKSKCK..",
      "...KCKSSSSKKKSSKCK..",
      "...KCCKSSSKKKSSKCK..",
      "...KCCKKKKKKKKKKCK..",
      "..KKKKEEEEWWWWKKKK..",
      ".KSSEEEEEEWWWWEESSK.",
      ".KSSEEEEEEWWWWEESSK.",
      "..KKKKEEEEEEEEKKKK..",
      ".....KJJJJJJJJK.....",
      ".....KJJJJJJJJK.....",
      ".....KJJJJKJJJK.....",
      ".....KEEEEKEEEEK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ]
  },

  // 4. Álvaro Camillo (GDE) - Cabello castaño con tupé moderno, chaqueta roja Angular con centro blanco
  'alvaro': {
    frame1: [
      "....................",
      "....KKKKKKKKKKK.....",
      "...KCCCCCCCCCCCK....",
      "...KCCCCCCCCCCCK....",
      "....KCCCCSSCCCCK....",
      "....KCCCSSSSSSSK....",
      "....KCCCSSSSSSSK....",
      "....KSSCSKSSSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKSSSSKKKSSK....",
      ".....KKSSSSSSSSK....",
      "......KKKKKKKKK.....",
      "....KKEEEEWWWWEEKK..",
      "...KEEKEEEWWWWEEKEK.",
      "...KEEKEEEWWWWEEKEK.",
      "...KSSKEEEEEEEEKSSK.",
      "...KKKKDDDDDDDDKKKK.",
      ".....KDDDDDDDDK.....",
      ".....KDDDDKDDDK.....",
      ".....KCCCCKCCCCK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ],
    frame2: [
      "....................",
      "....KKKKKKKKKKK.....",
      "...KCCCCCCCCCCCK....",
      "...KCCCCCCCCCCCK....",
      "....KCCCCSSCCCCK....",
      "....KCCCSSSSSSSK....",
      "....KCCCSSSSSSSK....",
      "....KSSCSKSSSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKSSSSKKKSSK....",
      ".....KKSSSKKKSSK....",
      "......KKKKKKKKK.....",
      "....KKEEEEWWWWKKKKK.",
      "...KEEKEEEWWWWEEESSK",
      "...KEEKEEEWWWWEEESSK",
      "...KSSKEEEEEEEKKKKK.",
      "...KKKKDDDDDDDDK....",
      ".....KDDDDDDDDK.....",
      ".....KDDDDKDDDK.....",
      ".....KCCCCKCCCCK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ]
  },

  // 5. Lesly Zerna (GDE ML) - Cabello largo oscuro, lentes, chaqueta amarilla/azul IA
  'lesly': {
    frame1: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KHHHHHHHHHHK....",
      "...KHHHHHHHHHHHHK...",
      "...KHHHHHSSHHHHHK...",
      "...KHHHHSSSSSSSHK...",
      "...KHHHHSSSSSSSHK...",
      "...KHSSHDKSDSKSKHK..",
      "...KHSSSSKSSSKSKHK..",
      "...KHKSSSSKKKSSKHK..",
      "...KHHKSSSSSSSSKHK..",
      "...KHHKKKKKKKKKKHK..",
      "...KKKYYYYBBBBYYKK..",
      "...KYYKYYYBBBBYYKYK.",
      "...KYYKYYYBBBBYYKYK.",
      "...KSSKYYYYYYYYKSSK.",
      "...KKKKJJJJJJJJKKKK.",
      ".....KJJJJJJJJK.....",
      ".....KJJJJKJJJK.....",
      ".....KYYYYKYYYYK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ],
    frame2: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KHHHHHHHHHHK....",
      "...KHHHHHHHHHHHHK...",
      "...KHHHHHSSHHHHHK...",
      "...KHHHHSSSSSSSHK...",
      "...KHHHHSSSSSSSHK...",
      "...KHSSHDKSDSKSKHK..",
      "...KHSSSSKSSSKSKHK..",
      "...KHKSSSSKKKSSKHK..",
      "...KHHKSSSKKKSSKHK..",
      "...KHHKKKKKKKKKKHK..",
      "..KKKKYYYYBBBBKKKK..",
      ".KSSYYYYYYBBBBYYSSK.",
      ".KSSYYYYYYBBBBYYSSK.",
      "..KKKKYYYYYYYYKKKK..",
      ".....KJJJJJJJJK.....",
      ".....KJJJJJJJJK.....",
      ".....KJJJJKJJJK.....",
      ".....KYYYYKYYYYK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ]
  },

  // 6. Eduardo Miranda (Datadog) - Cabello corto oscuro, chaqueta púrpura Datadog con camisa blanca
  'eduardo': {
    frame1: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KHHHHHHHHHHK....",
      "....KHHHHHHHHHHK....",
      "....KHHHHSSHHHHK....",
      "....KHHHSSSSSSSK....",
      "....KHHHSSSSSSSK....",
      "....KSSHSKSSSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKSSSSKKKSSK....",
      ".....KKSSSSSSSSK....",
      "......KKKKKKKKK.....",
      "....KKPPPPWWWWPPKK..",
      "...KPPKPPPWWWWPPKPK.",
      "...KPPKPPPWWWWPPKPK.",
      "...KSSKPPPPPPPPKSSK.",
      "...KKKKDDDDDDDDKKKK.",
      ".....KDDDDDDDDK.....",
      ".....KDDDDKDDDK.....",
      ".....KWWWWKWWWWK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ],
    frame2: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KHHHHHHHHHHK....",
      "....KHHHHHHHHHHK....",
      "....KHHHHSSHHHHK....",
      "....KHHHSSSSSSSK....",
      "....KHHHSSSSSSSK....",
      "....KSSHSKSSSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKSSSSKKKSSK....",
      ".....KKSSSKKKSSK....",
      "......KKKKKKKKK.....",
      "....KKPPPPWWWWKKKKK.",
      "...KPPKPPPWWWWPPPSSK",
      "...KPPKPPPWWWWPPPSSK",
      "...KSSKPPPPPPPKKKKK.",
      "...KKKKDDDDDDDDK....",
      ".....KDDDDDDDDK.....",
      ".....KDDDDKDDDK.....",
      ".....KWWWWKWWWWK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ]
  },

  // 7. Julio Quinteros (GDE Cloud/AI) - Lentes, barba completa estilo @dave.xp, chaqueta verde Google Cloud
  'julio': {
    frame1: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KHHHHHHHHHHK....",
      "....KHHHHHHHHHHK....",
      "....KHHHHSSHHHHK....",
      "....KHHHSSSSSSSK....",
      "....KHHHSSSSSSSK....",
      "....KSSHDKSDSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKCCCCHHHCCK....",
      ".....KKCCCCCCCCK....",
      "......KKKKKKKKK.....",
      "....KKVVVVWWWWVVKK..",
      "...KVVKVVVWWWWVVKVK.",
      "...KVVKVVVWWWWVVKVK.",
      "...KSSKVVVVVVVVKSSK.",
      "...KKKKJJJJJJJJKKKK.",
      ".....KJJJJJJJJK.....",
      ".....KJJJJKJJJK.....",
      ".....KWWWWKWWWWK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ],
    frame2: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KHHHHHHHHHHK....",
      "....KHHHHHHHHHHK....",
      "....KHHHHSSHHHHK....",
      "....KHHHSSSSSSSK....",
      "....KHHHSSSSSSSK....",
      "....KSSHDKSDSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKCCCCKKKCCK....",
      ".....KKCCCKKKCCK....",
      "......KKKKKKKKK.....",
      "..KKKKVVVVWWWWKKKK..",
      ".KSSVVVVVVWWWWVVSSK.",
      ".KSSVVVVVVWWWWVVSSK.",
      "..KKKKVVVVVVVVKKKK..",
      ".....KJJJJJJJJK.....",
      ".....KJJJJJJJJK.....",
      ".....KJJJJKJJJK.....",
      ".....KWWWWKWWWWK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ]
  },

  // 8. Ranse Vidal (GDE) - Peinado con tupé alto estilo @dave.xp, chaqueta azul con camisa verde
  'ranse': {
    frame1: [
      "....................",
      "...KKKKKKKKKKKK.....",
      "..KHHHHHHHHHHHHK....",
      "...KHHHHHHHHHHHK....",
      "....KHHHHSSHHHHK....",
      "....KHHHSSSSSSSK....",
      "....KHHHSSSSSSSK....",
      "....KSSHSKSSSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKSSSSKKKSSK....",
      ".....KKSSSSSSSSK....",
      "......KKKKKKKKK.....",
      "....KKBBBBVVVVBBKK..",
      "...KBBKBBBVVVVBBKBK.",
      "...KBBKBBBVVVVBBKBK.",
      "...KSSKBBBBBBBBKSSK.",
      "...KKKKDDDDDDDDKKKK.",
      ".....KDDDDDDDDK.....",
      ".....KDDDDKDDDK.....",
      ".....KWWWWKWWWWK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ],
    frame2: [
      "....................",
      "...KKKKKKKKKKKK.....",
      "..KHHHHHHHHHHHHK....",
      "...KHHHHHHHHHHHK....",
      "....KHHHHSSHHHHK....",
      "....KHHHSSSSSSSK....",
      "....KHHHSSSSSSSK....",
      "....KSSHSKSSSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKSSSSKKKSSK....",
      ".....KKSSSKKKSSK....",
      "......KKKKKKKKK.....",
      "....KKBBBBVVVVKKKKK.",
      "...KBBKBBBVVVVBBBSSK",
      "...KBBKBBBVVVVBBBSSK",
      "...KSSKBBBBBBBKKKKK.",
      "...KKKKDDDDDDDDK....",
      ".....KDDDDDDDDK.....",
      ".....KDDDDKDDDK.....",
      ".....KWWWWKWWWWK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ]
  },

  // 9. Jimmy Dolores (GDE Angular) - Piel trigueña plana (M), cabello negro con volumen, chaqueta roja/amarilla GDE Angular
  'jimmy': {
    frame1: [
      "....................",
      "....KKKKKKKKKKK.....",
      "...KHHHHHHHHHHHK....",
      "....KHHHHHHHHHHK....",
      "....KHHHHMMHHHHK....",
      "....KHHHMMMMMMMK....",
      "....KHHHMMMMMMMK....",
      "....KMMHMKMMMKMK....",
      "....KMMMMKMMMKMK....",
      "....KKMMMMKKKMMK....",
      ".....KKMMMMMMMMK....",
      "......KKKKKKKKK.....",
      "....KKEEEEYYYYEEKK..",
      "...KEEKEEEYYYYEEKEK.",
      "...KEEKEEEYYYYEEKEK.",
      "...KMMKEEEEEEEEKMMK.",
      "...KKKKJJJJJJJJKKKK.",
      ".....KJJJJJJJJK.....",
      ".....KJJJJKJJJK.....",
      ".....KEEEEKEEEEK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ],
    frame2: [
      "....................",
      "....KKKKKKKKKKK.....",
      "...KHHHHHHHHHHHK....",
      "....KHHHHHHHHHHK....",
      "....KHHHHMMHHHHK....",
      "....KHHHMMMMMMMK....",
      "....KHHHMMMMMMMK....",
      "....KMMHMKMMMKMK....",
      "....KMMMMKMMMKMK....",
      "....KKMMMMKKKMMK....",
      ".....KKMMMKKKMMK....",
      "......KKKKKKKKK.....",
      "..KKKKEEEEYYYYKKKK..",
      ".KMMEEEEEEYYYYEEMMK.",
      ".KMMEEEEEEYYYYEEMMK.",
      "..KKKKEEEEEEEEKKKK..",
      ".....KJJJJJJJJK.....",
      ".....KJJJJJJJJK.....",
      ".....KJJJJKJJJK.....",
      ".....KEEEEKEEEEK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ]
  },

  // 10. Nicolás Lecaros (GDG Santiago de Chile) - Cabello castaño corto, chaqueta verde GDG con polera azul/blanca
  'nicolas': {
    frame1: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KCCCCCCCCCCK....",
      "....KCCCCCCCCCCK....",
      "....KCCCCSSCCCCK....",
      "....KCCCSSSSSSSK....",
      "....KCCCSSSSSSSK....",
      "....KSSCSKSSSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKSSSSKKKSSK....",
      ".....KKSSSSSSSSK....",
      "......KKKKKKKKK.....",
      "....KKVVVVBBBBVVKK..",
      "...KVVKVVVBBBBVVKVK.",
      "...KVVKVVVWWWWVVKVK.",
      "...KSSKVVVVVVVVKSSK.",
      "...KKKKDDDDDDDDKKKK.",
      ".....KDDDDDDDDK.....",
      ".....KDDDDKDDDK.....",
      ".....KVVVVKVVVVK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ],
    frame2: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KCCCCCCCCCCK....",
      "....KCCCCCCCCCCK....",
      "....KCCCCSSCCCCK....",
      "....KCCCSSSSSSSK....",
      "....KCCCSSSSSSSK....",
      "....KSSCSKSSSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKSSSSKKKSSK....",
      ".....KKSSSKKKSSK....",
      "......KKKKKKKKK.....",
      "..KKKKVVVVBBBBKKKK..",
      ".KSSVVVVVVBBBBVVSSK.",
      ".KSSVVVVVVWWWWVVSSK.",
      "..KKKKVVVVVVVVKKKK..",
      ".....KDDDDDDDDK.....",
      ".....KDDDDDDDDK.....",
      ".....KDDDDKDDDK.....",
      ".....KVVVVKVVVVK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ]
  },

  // 11. Panel / Comunidad / Apertura - Chaqueta multicolor GDG en vista 3/4
  'panel': {
    frame1: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KHHHHHHHHHHK....",
      "....KHHHHHHHHHHK....",
      "....KHHHHSSHHHHK....",
      "....KHHHSSSSSSSK....",
      "....KHHHSSSSSSSK....",
      "....KSSHSKSSSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKSSSSKKKSSK....",
      ".....KKSSSSSSSSK....",
      "......KKKKKKKKK.....",
      "....KKBBBBYYYYVVKK..",
      "...KBBKEEEYYYYVVKVK.",
      "...KBBKEEEYYYYVVKVK.",
      "...KSSKBBBWWWWVVKSSK",
      "...KKKKJJJJJJJJKKKK.",
      ".....KJJJJJJJJK.....",
      ".....KJJJJKJJJK.....",
      ".....KWWWWKWWWWK....",
      ".....KKKKKKKKKKK....",
      "...................."
    ],
    frame2: [
      "....................",
      ".....KKKKKKKKKK.....",
      "....KHHHHHHHHHHK....",
      "....KHHHHHHHHHHK....",
      "....KHHHHSSHHHHK....",
      "....KHHHSSSSSSSK....",
      "....KHHHSSSSSSSK....",
      "....KSSHSKSSSKSK....",
      "....KSSSSKSSSKSK....",
      "....KKSSSSKKKSSK....",
      ".....KKSSSKKKSSK....",
      "......KKKKKKKKK.....",
      "..KKKKBBBBYYYYKKKK..",
      ".KSSBBBEEEYYYYVVSSK.",
      ".KSSBBBEEEYYYYVVSSK.",
      "..KKKKBBBBWWWWKKKK..",
      ".....KJJJJJJJJK.....",
      ".....KJJJJJJJJK.....",
      ".....KJJJJKJJJK.....",
      ".....KWWWWKWWWWK....",
      ".....KKKKKKKKKKK....",
      "...................."
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
