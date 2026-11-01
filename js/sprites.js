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
 * Generador de personajes estilo @dave.xp / Kunio-kun (River City Ransom, Technōs Japan NES)
 * en grilla detallada de 24x32 píxeles (proporción 3:4 chibi Nekketsu).
 * Cada personaje tiene 2 frames (Frame 1: Idle / Sonrisa, Frame 2: Hablando estilo Kunio + Paso)
 */
const KUNIO_TEMPLATES = {
  // 1. Armando Picón (@devpicon) - Cabello corto negro con volumen, lentes marco negro, hoodie GDG Azul con '< >'
  'devpicon': {
    frame1: [
      ".......KKKKKKKKKK.......",
      ".....KKHHHHHHHHHHKK.....",
      "....KHHHHhHHHHhHHHHK....",
      "...KHHHHHHHHHHHHHHHHK...",
      "...KHHHHHHHHHHHHHHHHK...",
      "...KHHHKKKKKKKKKKHHHK...",
      "...KHHKTTSSSSSSTTKHHK...",
      "...KHKTTKKKKKKKKTTKHK...",
      "..KKHKTKKKKKKKKKKTKHK...",
      "..KTKKKWKWWKKWWKWKKSK...",
      "..KTKKKWKWWKKWWKWKKSK...",
      "..KKHKTKKKKSSKKKKTKSK...",
      "...KHKTTSSSSSSSSSSKSK...",
      "...KHKTTTKKKKKKSSSKSK...",
      "....KKTTTWWWWWWSSSKK....",
      ".....KKTTTTTTTTTTKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKbbWWWWWWBBKK.....",
      "....KbbBBBBBBBBBBBBK....",
      "...KbbBKKKKBBBBKKKKBK...",
      "...KbbBKYKBBBBBBKYKBK...",
      "...KTTKbbBBBBBBBBBBKSSK.",
      "...KTTKbbBBBBBBBBBBKSSK.",
      "...KKKKbbBBBBBBBBBBKKKK.",
      "......KKKKKKKKKKKK......",
      "......KjjJJJJJJJJJK.....",
      "......KjjJJKKKKJJJK.....",
      "......KjjJJK..KJJJK.....",
      "......KjjJJK..KJJJK.....",
      ".....KKWWBBK..KWWBBKK...",
      "....KWWWWWWK..KWWWWWWK..",
      "....KKKKKKKK..KKKKKKKK.."
    ],
    frame2: [
      ".......KKKKKKKKKK.......",
      ".....KKHHHHHHHHHHKK.....",
      "....KHHHHhHHHHhHHHHK....",
      "...KHHHHHHHHHHHHHHHHK...",
      "...KHHHHHHHHHHHHHHHHK...",
      "...KHHHKKKKKKKKKKHHHK...",
      "...KHHKTTSSSSSSTTKHHK...",
      "...KHKTTKKKKKKKKTTKHK...",
      "..KKHKTKKKKKKKKKKTKHK...",
      "..KTKKKWKWWKKWWKWKKSK...",
      "..KTKKKWKWWKKWWKWKKSK...",
      "..KKHKTKKKKSSKKKKTKSK...",
      "...KHKTTSSKKKKSSSSKSK...",
      "...KHKTTTSKWWKSSSSKSK...",
      "....KKTTTSKKKKSSSSKK....",
      ".....KKTTTTTTTTTTKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKbbWWWWWWBBKK.....",
      "...KKbbBBBBBBBBBBBBK....",
      "..KTTKbbBKKKKBBBBKKBK...",
      "..KTTKbbBKYKBBBBKYKBK...",
      "..KKKKbbBBBBBBBBBBBKSSK.",
      ".....KbbBBBBBBBBBBBKSSK.",
      ".....KbbBBBBBBBBBBBKKKK.",
      "......KKKKKKKKKKKK......",
      "......KjjJJJJJJJJJK.....",
      ".....KjjJJKKKKJJJK......",
      ".....KjjJJK..KJJJK......",
      "....KKWWBBK..KjjJJK.....",
      "...KWWWWWWK..KKWWBBKK...",
      "...KKKKKKKK..KWWWWWWK...",
      ".............KKKKKKKK..."
    ]
  },

  // 2. Mikaeri Ohana (Google) - Cabello largo oscuro con ondas/brillo, expresión alegre, chaqueta Google Blue con camiseta amarilla/blanca
  'mikaeri': {
    frame1: [
      "......KKKKKKKKKKKK......",
      "....KKHHHHHHHHHHHHKK....",
      "...KHHHHhHHHHHHhHHHHK...",
      "..KHHHHHHHHHHHHHHHHHHK..",
      "..KHHHHhHHHHHHHHhHHHHK..",
      "..KHHHKKKKKKKKKKKKHHHK..",
      ".KHHHKTTSSSSSSSSSSKHHHK.",
      ".KHHKTTKKSSSSSSKKSSKHHK.",
      ".KHHKTSSSSSSSSSSSSSKHHK.",
      ".KHHKTSKWKSSSSKWKSSKHHK.",
      ".KHHKTSKWKSSSSKWKSSKHHK.",
      ".KHHKTTSSSSSSSSSSSSKHHK.",
      ".KHHKTTTSSSSSSSSSSSKHHK.",
      ".KHHKTTTTKKKKKKSSSSKHHK.",
      "..KHHKTTTTWWWWSSSSKHHK..",
      "..KHHhKKTTTTTTTTKKhHHK..",
      "..KHHHK.KKKKKKKK.KHHHK..",
      "...KKK.KbbYYYYBBK.KKK...",
      "....KbbBBBWWWWBBBBBK....",
      "...KbbBBBBYYYYBBBBBBK...",
      "...KbbBBBBWWWWBBBBBBK...",
      "...KTTKbbBYYYYBBBBKSSK..",
      "...KTTKbbBWWWWBBBBKSSK..",
      "...KKKKbbBBBBBBBBBKKKK..",
      "......KKKKKKKKKKKK......",
      "......KDDDDDDDDDDDK.....",
      "......KDDGGGGGGDDDK.....",
      "......KDDGGK..KGGDK.....",
      "......KDDGGK..KGGDK.....",
      ".....KKWWBBK..KWWBBKK...",
      "....KWWWWWWK..KWWWWWWK..",
      "....KKKKKKKK..KKKKKKKK.."
    ],
    frame2: [
      "......KKKKKKKKKKKK......",
      "....KKHHHHHHHHHHHHKK....",
      "...KHHHHhHHHHHHhHHHHK...",
      "..KHHHHHHHHHHHHHHHHHHK..",
      "..KHHHHhHHHHHHHHhHHHHK..",
      "..KHHHKKKKKKKKKKKKHHHK..",
      ".KHHHKTTSSSSSSSSSSKHHHK.",
      ".KHHKTTKKSSSSSSKKSSKHHK.",
      ".KHHKTSSSSSSSSSSSSSKHHK.",
      ".KHHKTSKWKSSSSKWKSSKHHK.",
      ".KHHKTSKWKSSSSKWKSSKHHK.",
      ".KHHKTTSSSSSSSSSSSSKHHK.",
      ".KHHKTTTSSKKKKSSSSSKHHK.",
      ".KHHKTTTTSKWWKSSSSSKHHK.",
      "..KHHKTTTSKKKKSSSSKHHK..",
      "..KHHhKKTTTTTTTTKKhHHK..",
      "..KHHHK.KKKKKKKK.KHHHK..",
      "...KKK.KbbYYYYBBK.KKK...",
      "...KKbbBBBWWWWBBBBBK....",
      "..KTTKbbBBYYYYBBBBBBK...",
      "..KTTKbbBBWWWWBBBBBBK...",
      "..KKKKbbBBYYYYBBBBKSSK..",
      ".....KbbBBWWWWBBBBKSSK..",
      ".....KbbBBBBBBBBBBKKKK..",
      "......KKKKKKKKKKKK......",
      "......KDDDDDDDDDDDK.....",
      ".....KDDGGGGGGDDDK......",
      ".....KDDGGK..KGGDK......",
      "....KKWWBBK..KDDGGK.....",
      "...KWWWWWWK..KKWWBBKK...",
      "...KKKKKKKK..KWWWWWWK...",
      ".............KKKKKKKK..."
    ]
  },

  // 3. Lucía Subatin (Google) - Cabello castaño largo hasta los hombros con luces, blazer rojo GDG con detalle blanco
  'lucia': {
    frame1: [
      "......KKKKKKKKKKKK......",
      "....KKCCCCCCCCCCCCKK....",
      "...KCCCCcCCCCCCcCCCCK...",
      "..KCCCCCCCCCCCCCCCCCCK..",
      "..KCCCCcCCCCCCCCcCCCCK..",
      "..KCCCKKKKKKKKKKKKCCCK..",
      ".KCCCKTTSSSSSSSSSSKCCCK.",
      ".KCCKTTccSSSSSSccSSKCCK.",
      ".KCCKTSSSSSSSSSSSSSKCCK.",
      ".KCCKTSKWKSSSSKWKSSKCCK.",
      ".KCCKTSKWKSSSSKWKSSKCCK.",
      ".KCCKTTSSSSSSSSSSSSKCCK.",
      ".KCCKTTTSSSSSSSSSSSKCCK.",
      ".KCCKTTTTKKKKKKSSSSKCCK.",
      "..KCCKTTTTWWWWSSSSKCCK..",
      "..KCCcKKTTTTTTTTKKcCCK..",
      "..KCCCK.KKKKKKKK.KCCCK..",
      "...KKK.KeeWWWWEEKKKKK...",
      "....KeeEEEWWWWEEEEEK....",
      "...KeeEEEWWWWWWEEEEEK...",
      "...KeeEEEEWWWWEEEEEBK...",
      "...KTTKeeEWWWWEEEEKSSK..",
      "...KTTKeeEEEEEEEEEKSSK..",
      "...KKKKeeEEEEEEEEEKKKK..",
      "......KKKKKKKKKKKK......",
      "......KjjJJJJJJJJJK.....",
      "......KjjJJKKKKJJJK.....",
      "......KjjJJK..KJJJK.....",
      "......KjjJJK..KJJJK.....",
      ".....KKWWEEK..KWWEEKK...",
      "....KWWWWWWK..KWWWWWWK..",
      "....KKKKKKKK..KKKKKKKK.."
    ],
    frame2: [
      "......KKKKKKKKKKKK......",
      "....KKCCCCCCCCCCCCKK....",
      "...KCCCCcCCCCCCcCCCCK...",
      "..KCCCCCCCCCCCCCCCCCCK..",
      "..KCCCCcCCCCCCCCcCCCCK..",
      "..KCCCKKKKKKKKKKKKCCCK..",
      ".KCCCKTTSSSSSSSSSSKCCCK.",
      ".KCCKTTccSSSSSSccSSKCCK.",
      ".KCCKTSSSSSSSSSSSSSKCCK.",
      ".KCCKTSKWKSSSSKWKSSKCCK.",
      ".KCCKTSKWKSSSSKWKSSKCCK.",
      ".KCCKTTSSSSSSSSSSSSKCCK.",
      ".KCCKTTTSSKKKKSSSSSKCCK.",
      ".KCCKTTTTSKWWKSSSSSKCCK.",
      "..KCCKTTTSKKKKSSSSKCCK..",
      "..KCCcKKTTTTTTTTKKcCCK..",
      "..KCCCK.KKKKKKKK.KCCCK..",
      "...KKK.KeeWWWWEEKKKKK...",
      "...KKeeEEEWWWWEEEEEK....",
      "..KTTKeeEEWWWWWWEEEEK...",
      "..KTTKeeEEWWWWEEEEEBK...",
      "..KKKKeeEEWWWWEEEEKSSK..",
      ".....KeeEEEEEEEEEEKSSK..",
      ".....KeeEEEEEEEEEEKKKK..",
      "......KKKKKKKKKKKK......",
      "......KjjJJJJJJJJJK.....",
      ".....KjjJJKKKKJJJK......",
      ".....KjjJJK..KJJJK......",
      "....KKWWEEK..KjjJJK.....",
      "...KWWWWWWK..KKWWEEKK...",
      "...KKKKKKKK..KWWWWWWK...",
      ".............KKKKKKKK..."
    ]
  },

  // 4. Álvaro Camillo (GDE) - Cabello castaño con peinado moderno, chaqueta roja Angular con escudo blanco en el pecho
  'alvaro': {
    frame1: [
      "......KKKKKKKKKKKK......",
      "....KKCCCCCCCCCCCCKK....",
      "...KCCCCcCCCCCCcCCCCK...",
      "...KCCCCCCCCCCCCCCCCK...",
      "...KCCCcCCCCKKKKCCCCK...",
      "...KCCCKKKKKSSSSKKKKK...",
      "...KCCKTTSSSSSSSSSSK....",
      "...KCKTTCCSSSSCCSSSK....",
      "..KKCKTSSSSSSSSSSSSK....",
      "..KTKTSKWKSSSSKWKSSK....",
      "..KTKTSKWKSSSSKWKSSK....",
      "..KKCKTTSSSSSSSSSSSK....",
      "...KCKTTTSSSSSSSSSSK....",
      "...KCKTTTKKKKKKSSSSK....",
      "....KKTTTWWWWWWSSSKK....",
      ".....KKTTTTTTTTTTKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKeeWWWWWWEeKK.....",
      "....KeeEEEEEEEEEEEEK....",
      "...KeeEEEEWWWWEEEEEK....",
      "...KeeEEEWEEEEWEEEEK....",
      "...KTTKeeEWWWWEEEEKSSK..",
      "...KTTKeeEEEEEEEEEKSSK..",
      "...KKKKeeEEEEEEEEEKKKK..",
      "......KKKKKKKKKKKK......",
      "......KDDDDDDDDDDDK.....",
      "......KDDKKKKKKDDDK.....",
      "......KDDDK..KDDDDK.....",
      "......KDDDK..KDDDDK.....",
      ".....KKWWEEK..KWWEEKK...",
      "....KWWWWWWK..KWWWWWWK..",
      "....KKKKKKKK..KKKKKKKK.."
    ],
    frame2: [
      "......KKKKKKKKKKKK......",
      "....KKCCCCCCCCCCCCKK....",
      "...KCCCCcCCCCCCcCCCCK...",
      "...KCCCCCCCCCCCCCCCCK...",
      "...KCCCcCCCCKKKKCCCCK...",
      "...KCCCKKKKKSSSSKKKKK...",
      "...KCCKTTSSSSSSSSSSK....",
      "...KCKTTCCSSSSCCSSSK....",
      "..KKCKTSSSSSSSSSSSSK....",
      "..KTKTSKWKSSSSKWKSSK....",
      "..KTKTSKWKSSSSKWKSSK....",
      "..KKCKTTSSSSSSSSSSSK....",
      "...KCKTTSSKKKKSSSSSK....",
      "...KCKTTTSKWWKSSSSSK....",
      "....KKTTTSKKKKSSSSKK....",
      ".....KKTTTTTTTTTTKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKeeWWWWWWEeKK.....",
      "...KKeeEEEEEEEEEEEEK....",
      "..KTTKeeEEWWWWEEEEEK....",
      "..KTTKeeEWEEEEWEEEEK....",
      "..KKKKeeEEWWWWEEEEKSSK..",
      ".....KeeEEEEEEEEEEKSSK..",
      ".....KeeEEEEEEEEEEKKKK..",
      "......KKKKKKKKKKKK......",
      "......KDDDDDDDDDDDK.....",
      ".....KDDKKKKKKDDDK......",
      ".....KDDDK..KDDDDK......",
      "....KKWWEEK..KDDDK......",
      "...KWWWWWWK..KKWWEEKK...",
      "...KKKKKKKK..KWWWWWWK...",
      ".............KKKKKKKK..."
    ]
  },

  // 5. Lesly Zerna (GDE ML) - Cabello largo oscuro, lentes/sonrisa carismática, chaqueta amarilla/azul IA
  'lesly': {
    frame1: [
      "......KKKKKKKKKKKK......",
      "....KKHHHHHHHHHHHHKK....",
      "...KHHHHhHHHHHHhHHHHK...",
      "..KHHHHHHHHHHHHHHHHHHK..",
      "..KHHHHhHHHHHHHHhHHHHK..",
      "..KHHHKKKKKKKKKKKKHHHK..",
      ".KHHHKTTSSSSSSSSSSKHHHK.",
      ".KHHKTTKKKKKKKKKKSSKHHK.",
      ".KHHKTKKKKKKKKKKKKSKHHK.",
      ".KHHKKKWKWWKKWWKWKKKHHK.",
      ".KHHKKKWKWWKKWWKWKKKHHK.",
      ".KHHKTKKKKKSSKKKKKSKHHK.",
      ".KHHKTTTSSSSSSSSSSSKHHK.",
      ".KHHKTTTTKKKKKKSSSSKHHK.",
      "..KHHKTTTWWWWWWSSSKHHK..",
      "..KHHhKKTTTTTTTTKKhHHK..",
      "..KHHHK.KKKKKKKK.KHHHK..",
      "...KKK.KyyBBBBYYK.KKK...",
      "....KyyYYYBBBBYYYYYK....",
      "...KyyYYYBBWWBBYYYYYK...",
      "...KyyYYYBBWWBBYYYYYK...",
      "...KTTKyyYBBBBYYYYKSSK..",
      "...KTTKyyYYYYYYYYYKSSK..",
      "...KKKKyyYYYYYYYYYKKKK..",
      "......KKKKKKKKKKKK......",
      "......KjjJJJJJJJJJK.....",
      "......KjjJJKKKKJJJK.....",
      "......KjjJJK..KJJJK.....",
      "......KjjJJK..KJJJK.....",
      ".....KKWWYYK..KWWYYKK...",
      "....KWWWWWWK..KWWWWWWK..",
      "....KKKKKKKK..KKKKKKKK.."
    ],
    frame2: [
      "......KKKKKKKKKKKK......",
      "....KKHHHHHHHHHHHHKK....",
      "...KHHHHhHHHHHHhHHHHK...",
      "..KHHHHHHHHHHHHHHHHHHK..",
      "..KHHHHhHHHHHHHHhHHHHK..",
      "..KHHHKKKKKKKKKKKKHHHK..",
      ".KHHHKTTSSSSSSSSSSKHHHK.",
      ".KHHKTTKKKKKKKKKKSSKHHK.",
      ".KHHKTKKKKKKKKKKKKSKHHK.",
      ".KHHKKKWKWWKKWWKWKKKHHK.",
      ".KHHKKKWKWWKKWWKWKKKHHK.",
      ".KHHKTKKKKKSSKKKKKSKHHK.",
      ".KHHKTTTSSKKKKSSSSSKHHK.",
      ".KHHKTTTTSKWWKSSSSSKHHK.",
      "..KHHKTTTSKKKKSSSSKHHK..",
      "..KHHhKKTTTTTTTTKKhHHK..",
      "..KHHHK.KKKKKKKK.KHHHK..",
      "...KKK.KyyBBBBYYK.KKK...",
      "...KKyyYYYBBBBYYYYYK....",
      "..KTTKyyYBBWWBBYYYYYK...",
      "..KTTKyyYBBWWBBYYYYYK...",
      "..KKKKyyYYBBBBYYYYKSSK..",
      ".....KyyYYYYYYYYYYKSSK..",
      ".....KyyYYYYYYYYYYKKKK..",
      "......KKKKKKKKKKKK......",
      "......KjjJJJJJJJJJK.....",
      ".....KjjJJKKKKJJJK......",
      ".....KjjJJK..KJJJK......",
      "....KKWWYYK..KjjJJK.....",
      "...KWWWWWWK..KKWWYYKK...",
      "...KKKKKKKK..KWWWWWWK...",
      ".............KKKKKKKK..."
    ]
  },

  // 6. Eduardo Miranda (Datadog) - Cabello corto oscuro estilizado, chaqueta púrpura/negra Datadog con detalle blanco
  'eduardo': {
    frame1: [
      "......KKKKKKKKKKKK......",
      "....KKHHHHHHHHHHHHKK....",
      "...KHHHHhHHHHHHhHHHHK...",
      "...KHHHHHHHHHHHHHHHHK...",
      "...KHHHhHHHHKKKKHHHHK...",
      "...KHHHKKKKKSSSSKKKKK...",
      "...KHHKTTSSSSSSSSSSK....",
      "...KHKTTHHSSSSHHSSSK....",
      "..KKHKTSSSSSSSSSSSSK....",
      "..KTKTSKWKSSSSKWKSSK....",
      "..KTKTSKWKSSSSKWKSSK....",
      "..KKHKTTSSSSSSSSSSSK....",
      "...KHKTTTSSSSSSSSSSK....",
      "...KHKTTTKKKKKKSSSSK....",
      "....KKTTTWWWWWWSSSKK....",
      ".....KKTTTTTTTTTTKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKppWWWWWWPPKK.....",
      "....KppPPPPPPPPPPPPK....",
      "...KppPPPWWWWWWPPPPPK...",
      "...KppPPPWKPPKWPPPPPK...",
      "...KTTKppWWWWWWPPPKSSK..",
      "...KTTKppPPPPPPPPPKSSK..",
      "...KKKKppPPPPPPPPPKKKK..",
      "......KKKKKKKKKKKK......",
      "......KDDDDDDDDDDDK.....",
      "......KDDKKKKKKDDDK.....",
      "......KDDDK..KDDDDK.....",
      "......KDDDK..KDDDDK.....",
      ".....KKWWPPK..KWWPPKK...",
      "....KWWWWWWK..KWWWWWWK..",
      "....KKKKKKKK..KKKKKKKK.."
    ],
    frame2: [
      "......KKKKKKKKKKKK......",
      "....KKHHHHHHHHHHHHKK....",
      "...KHHHHhHHHHHHhHHHHK...",
      "...KHHHHHHHHHHHHHHHHK...",
      "...KHHHhHHHHKKKKHHHHK...",
      "...KHHHKKKKKSSSSKKKKK...",
      "...KHHKTTSSSSSSSSSSK....",
      "...KHKTTHHSSSSHHSSSK....",
      "..KKHKTSSSSSSSSSSSSK....",
      "..KTKTSKWKSSSSKWKSSK....",
      "..KTKTSKWKSSSSKWKSSK....",
      "..KKHKTTSSSSSSSSSSSK....",
      "...KHKTTSSKKKKSSSSSK....",
      "...KHKTTTSKWWKSSSSSK....",
      "....KKTTTSKKKKSSSSKK....",
      ".....KKTTTTTTTTTTKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKppWWWWWWPPKK.....",
      "...KKppPPPPPPPPPPPPK....",
      "..KTTKppPWWWWWWPPPPPK...",
      "..KTTKppPWKPPKWPPPPPK...",
      "..KKKKppPWWWWWWPPPKSSK..",
      ".....KppPPPPPPPPPPKSSK..",
      ".....KppPPPPPPPPPPKKKK..",
      "......KKKKKKKKKKKK......",
      "......KDDDDDDDDDDDK.....",
      ".....KDDKKKKKKDDDK......",
      ".....KDDDK..KDDDDK......",
      "....KKWWPPK..KDDDK......",
      "...KWWWWWWK..KKWWPPKK...",
      "...KKKKKKKK..KWWWWWWK...",
      ".............KKKKKKKK..."
    ]
  },

  // 7. Julio Quinteros (GDE Cloud/AI) - Lentes, barba corta bien dibujada, chaqueta verde Google Cloud
  'julio': {
    frame1: [
      ".......KKKKKKKKKK.......",
      ".....KKHHHHHHHHHHKK.....",
      "....KHHHHhHHHHhHHHHK....",
      "...KHHHHHHHHHHHHHHHHK...",
      "...KHHHHHHHHHHHHHHHHK...",
      "...KHHHKKKKKKKKKKHHHK...",
      "...KHHKTTSSSSSSTTKHHK...",
      "...KHKTTKKKKKKKKTTKHK...",
      "..KKHKTKKKKKKKKKKTKHK...",
      "..KTKKKWKWWKKWWKWKKSK...",
      "..KTKKKWKWWKKWWKWKKSK...",
      "..KKHKTKKKKSSKKKKTKSK...",
      "...KHKTTHHHHHHHHHHKSK...",
      "...KHKTTHHWWWWWWHEKSK...",
      "....KKHHHHHHHHHHHHKK....",
      ".....KKHHHHHHHHHHKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKvvWWWWWWVVKK.....",
      "....KvvVVVVVVVVVVVVK....",
      "...KvvVVVVWWWWVVVVVVK...",
      "...KvvVVVWWWWWWVVVVVK...",
      "...KTTKvvVVVVVVVVVKSSK..",
      "...KTTKvvVVVVVVVVVKSSK..",
      "...KKKKvvVVVVVVVVVKKKK..",
      "......KKKKKKKKKKKK......",
      "......KjjJJJJJJJJJK.....",
      "......KjjJJKKKKJJJK.....",
      "......KjjJJK..KJJJK.....",
      "......KjjJJK..KJJJK.....",
      ".....KKWWVVK..KWWVVKK...",
      "....KWWWWWWK..KWWWWWWK..",
      "....KKKKKKKK..KKKKKKKK.."
    ],
    frame2: [
      ".......KKKKKKKKKK.......",
      ".....KKHHHHHHHHHHKK.....",
      "....KHHHHhHHHHhHHHHK....",
      "...KHHHHHHHHHHHHHHHHK...",
      "...KHHHHHHHHHHHHHHHHK...",
      "...KHHHKKKKKKKKKKHHHK...",
      "...KHHKTTSSSSSSTTKHHK...",
      "...KHKTTKKKKKKKKTTKHK...",
      "..KKHKTKKKKKKKKKKTKHK...",
      "..KTKKKWKWWKKWWKWKKSK...",
      "..KTKKKWKWWKKWWKWKKSK...",
      "..KKHKTKKKKSSKKKKTKSK...",
      "...KHKTTHHKKKKHHHHKSK...",
      "...KHKTTHHKWWKHHHHKSK...",
      "....KKHHHHKKKKHHHHKK....",
      ".....KKHHHHHHHHHHKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKvvWWWWWWVVKK.....",
      "...KKvvVVVVVVVVVVVVK....",
      "..KTTKvvVVWWWWVVVVVVK...",
      "..KTTKvvVWWWWWWVVVVVK...",
      "..KKKKvvVVVVVVVVVVKSSK..",
      ".....KvvVVVVVVVVVVKSSK..",
      ".....KvvVVVVVVVVVVKKKK..",
      "......KKKKKKKKKKKK......",
      "......KjjJJJJJJJJJK.....",
      ".....KjjJJKKKKJJJK......",
      ".....KjjJJK..KJJJK......",
      "....KKWWVVK..KjjJJK.....",
      "...KWWWWWWK..KKWWVVKK...",
      "...KKKKKKKK..KWWWWWWK...",
      ".............KKKKKKKK..."
    ]
  },

  // 8. Ranse Vidal (GDE) - Peinado con volumen estilo Kunio clásico (pompadour Nekketsu), chaqueta azul/verde
  'ranse': {
    frame1: [
      "....KKKKKKKKKKKKKK......",
      "...KHHHHHHHHHHHHHHKK....",
      "..KHHHHhHHHHHHHHhHHHK...",
      "..KHHHHHHHHHHHHHHHHHK...",
      "...KHHHHHHKKKKKKKKKKK...",
      "...KHHHHKKTTSSSSSSTTK...",
      "...KHHHKTTSSSSSSSSSSK...",
      "...KHHKTTHHSSSSHHSSSK...",
      "..KKHKTSSSSSSSSSSSSSK...",
      "..KTKTSKWKSSSSKWKSSSK...",
      "..KTKTSKWKSSSSKWKSSSK...",
      "..KKHKTTSSSSSSSSSSSSK...",
      "...KHKTTTSSSSSSSSSSSK...",
      "...KHKTTTKKKKKKSSSSSK...",
      "....KKTTTWWWWWWSSSSKK...",
      ".....KKTTTTTTTTTTKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKbbWWWWWWBBKK.....",
      "....KbbBBBBVVVVBBBBK....",
      "...KbbBBBBVVVVVVBBBBK...",
      "...KbbBBBBVVWWVVBBBBK...",
      "...KTTKbbBBVVVVBBBKSSK..",
      "...KTTKbbBBBBBBBBBKSSK..",
      "...KKKKbbBBBBBBBBBKKKK..",
      "......KKKKKKKKKKKK......",
      "......KDDDDDDDDDDDK.....",
      "......KDDKKKKKKDDDK.....",
      "......KDDDK..KDDDDK.....",
      "......KDDDK..KDDDDK.....",
      ".....KKWWVVK..KWWVVKK...",
      "....KWWWWWWK..KWWWWWWK..",
      "....KKKKKKKK..KKKKKKKK.."
    ],
    frame2: [
      "....KKKKKKKKKKKKKK......",
      "...KHHHHHHHHHHHHHHKK....",
      "..KHHHHhHHHHHHHHhHHHK...",
      "..KHHHHHHHHHHHHHHHHHK...",
      "...KHHHHHHKKKKKKKKKKK...",
      "...KHHHHKKTTSSSSSSTTK...",
      "...KHHHKTTSSSSSSSSSSK...",
      "...KHHKTTHHSSSSHHSSSK...",
      "..KKHKTSSSSSSSSSSSSSK...",
      "..KTKTSKWKSSSSKWKSSSK...",
      "..KTKTSKWKSSSSKWKSSSK...",
      "..KKHKTTSSSSSSSSSSSSK...",
      "...KHKTTSSKKKKSSSSSSK...",
      "...KHKTTTSKWWKSSSSSSK...",
      "....KKTTTSKKKKSSSSSKK...",
      ".....KKTTTTTTTTTTKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKbbWWWWWWBBKK.....",
      "...KKbbBBBBVVVVBBBBK....",
      "..KTTKbbBBVVVVVVBBBBK...",
      "..KTTKbbBBVVWWVVBBBBK...",
      "..KKKKbbBBBVVVVBBBKSSK..",
      ".....KbbBBBBBBBBBBKSSK..",
      ".....KbbBBBBBBBBBBKKKK..",
      "......KKKKKKKKKKKK......",
      "......KDDDDDDDDDDDK.....",
      ".....KDDKKKKKKDDDK......",
      ".....KDDDK..KDDDDK......",
      "....KKWWVVK..KDDDK......",
      "...KWWWWWWK..KKWWVVKK...",
      "...KKKKKKKK..KWWWWWWK...",
      ".............KKKKKKKK..."
    ]
  },

  // 9. Jimmy Dolores (GDE Angular) - Piel trigueña (M/N), cabello negro con puntas estilo anime/NES, chaqueta roja/amarilla GDE Angular
  'jimmy': {
    frame1: [
      "..KK...KKKKKKKKKK...KK..",
      "..KHK.KHHHHHHHHHHK.KHK..",
      "...KHKHHHHhHHhHHHHKHK...",
      "...KHHHHHHHHHHHHHHHHK...",
      "..KKHHHHHHHHHHHHHHHHKK..",
      "..KHHHHKKKKKKKKKKHHHHK..",
      "...KHHKNNMMMMMMNNKHHK...",
      "...KHKNNHHMMMMHHNNKHK...",
      "..KKHKNMMMMMMMMMMMKHK...",
      "..KNKNMKWKMMMMKWKMMMK...",
      "..KNKNMKWKMMMMKWKMMMK...",
      "..KKHKNNMMMMMMMMMMMMK...",
      "...KHKNNNMMMMMMMMMMMK...",
      "...KHKNNNKKKKKKMMMMMK...",
      "....KKNNNWWWWWWMMMMKK...",
      ".....KKNNNNNNNNNNKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKeeYYYYYYEEKK.....",
      "....KeeEEEEYYYYEEEEK....",
      "...KeeEEEEYYWWYYEEEEK...",
      "...KeeEEEEYYWWYYEEEEK...",
      "...KNNKeeEEYYYYEEEKMMK..",
      "...KNNKeeEEEEEEEEEKMMK..",
      "...KKKKeeEEEEEEEEEKKKK..",
      "......KKKKKKKKKKKK......",
      "......KjjJJJJJJJJJK.....",
      "......KjjJJKKKKJJJK.....",
      "......KjjJJK..KJJJK.....",
      "......KjjJJK..KJJJK.....",
      ".....KKWWEEK..KWWEEKK...",
      "....KWWWWWWK..KWWWWWWK..",
      "....KKKKKKKK..KKKKKKKK.."
    ],
    frame2: [
      "..KK...KKKKKKKKKK...KK..",
      "..KHK.KHHHHHHHHHHK.KHK..",
      "...KHKHHHHhHHhHHHHKHK...",
      "...KHHHHHHHHHHHHHHHHK...",
      "..KKHHHHHHHHHHHHHHHHKK..",
      "..KHHHHKKKKKKKKKKHHHHK..",
      "...KHHKNNMMMMMMNNKHHK...",
      "...KHKNNHHMMMMHHNNKHK...",
      "..KKHKNMMMMMMMMMMMKHK...",
      "..KNKNMKWKMMMMKWKMMMK...",
      "..KNKNMKWKMMMMKWKMMMK...",
      "..KKHKNNMMMMMMMMMMMMK...",
      "...KHKNNMMKKKKMMMMMMK...",
      "...KHKNNNMKWWKMMMMMMK...",
      "....KKNNNMKKKKMMMMMKK...",
      ".....KKNNNNNNNNNNKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKeeYYYYYYEEKK.....",
      "...KKeeEEEEYYYYEEEEK....",
      "..KNNKeeEEYYWWYYEEEEK...",
      "..KNNKeeEEYYWWYYEEEEK...",
      "..KKKKeeEEEYYYYEEEKMMK..",
      ".....KeeEEEEEEEEEEKMMK..",
      ".....KeeEEEEEEEEEEKKKK..",
      "......KKKKKKKKKKKK......",
      "......KjjJJJJJJJJJK.....",
      ".....KjjJJKKKKJJJK......",
      ".....KjjJJK..KJJJK......",
      "....KKWWEEK..KjjJJK.....",
      "...KWWWWWWK..KKWWEEKK...",
      "...KKKKKKKK..KWWWWWWK...",
      ".............KKKKKKKK..."
    ]
  },

  // 10. Panel / Comunidad / Apertura - Chaqueta multicolor GDG (Azul, Rojo, Amarillo, Verde) estilo Nekketsu
  'panel': {
    frame1: [
      "......KKKKKKKKKKKK......",
      "....KKHHHHHHHHHHHHKK....",
      "...KHHHHhHHHHHHhHHHHK...",
      "...KHHHHHHHHHHHHHHHHK...",
      "...KHHHhHHHHKKKKHHHHK...",
      "...KHHHKKKKKSSSSKKKKK...",
      "...KHHKTTSSSSSSSSSSK....",
      "...KHKTTHHSSSSHHSSSK....",
      "..KKHKTSSSSSSSSSSSSK....",
      "..KTKTSKWKSSSSKWKSSK....",
      "..KTKTSKWKSSSSKWKSSK....",
      "..KKHKTTSSSSSSSSSSSK....",
      "...KHKTTTSSSSSSSSSSK....",
      "...KHKTTTKKKKKKSSSSK....",
      "....KKTTTWWWWWWSSSKK....",
      ".....KKTTTTTTTTTTKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKBBEEWWWWYYVVKK...",
      "....KBBBBEEWWWWYYVVVVK..",
      "...KBBBBEEEWWWWYYYVVVVK.",
      "...KBBBBEEEWWWWYYYVVVVK.",
      "...KTTKBBEEWWWWYYVKSSK..",
      "...KTTKBBEEWWWWYYVKSSK..",
      "...KKKKBBEEYYYYVVVKKKK..",
      "......KKKKKKKKKKKK......",
      "......KjjJJJJJJJJJK.....",
      "......KjjJJKKKKJJJK.....",
      "......KjjJJK..KJJJK.....",
      "......KjjJJK..KJJJK.....",
      ".....KKWWBBK..KWWVVKK...",
      "....KWWWWWWK..KWWWWWWK..",
      "....KKKKKKKK..KKKKKKKK.."
    ],
    frame2: [
      "......KKKKKKKKKKKK......",
      "....KKHHHHHHHHHHHHKK....",
      "...KHHHHhHHHHHHhHHHHK...",
      "...KHHHHHHHHHHHHHHHHK...",
      "...KHHHhHHHHKKKKHHHHK...",
      "...KHHHKKKKKSSSSKKKKK...",
      "...KHHKTTSSSSSSSSSSK....",
      "...KHKTTHHSSSSHHSSSK....",
      "..KKHKTSSSSSSSSSSSSK....",
      "..KTKTSKWKSSSSKWKSSK....",
      "..KTKTSKWKSSSSKWKSSK....",
      "..KKHKTTSSSSSSSSSSSK....",
      "...KHKTTSSKKKKSSSSSK....",
      "...KHKTTTSKWWKSSSSSK....",
      "....KKTTTSKKKKSSSSKK....",
      ".....KKTTTTTTTTTTKK.....",
      ".......KKKKKKKKKK.......",
      ".....KKBBEEWWWWYYVVKK...",
      "...KKBBBBEEWWWWYYVVVVK..",
      "..KTTKBBBEEEWWWWYYVVVVK.",
      "..KTTKBBBEEEWWWWYYVVVVK.",
      "..KKKKBBBEEWWWWYYVKSSK..",
      ".....KBBBEEWWWWYYVKSSK..",
      ".....KBBBEEYYYYVVVKKKK..",
      "......KKKKKKKKKKKK......",
      "......KjjJJJJJJJJJK.....",
      ".....KjjJJKKKKJJJK......",
      ".....KjjJJK..KJJJK......",
      "....KKWWBBK..KjjJJK.....",
      "...KWWWWWWK..KKWWVVKK...",
      "...KKKKKKKK..KWWWWWWK...",
      ".............KKKKKKKK..."
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
