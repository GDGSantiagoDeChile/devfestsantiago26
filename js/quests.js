/**
 * ============================================================================
 * SISTEMA SECRETO DE MISIONES · DEVFEST SANTIAGO 2026
 * ============================================================================
 * Respuestas hápticas, micro-audio 8-bits nativo (Web Audio API) y payloads
 * cifrados con clave dinámica generada en tiempo de ejecución.
 * ============================================================================
 */

// Payloads cifrados (XOR + Base64) - Ininteligibles en texto plano
const _CIPHER_BANK = {
  // Misión 1 (Armando)
  k0: 'dys9OmktMyU2JWJyODYqPSsfXV1SKiN5LiYqJmQ0IzojPW4uPDJTXlZZaXFebGlyOy0zdjw8KDA8c31DRVdFP2I9LyYgciYkODE1O2FxvsCjjhLG1OvCbKvU/nhqMjYmd0lvbmNBQFNYayw4LTo9YmY0IzojPW4tLztVVR9CKih2cqvW2mQWExwCDBcAbht3Y3B6BB4BCQgKEGRtZ3BiYGOt1toOH0FGKiFqRmluYyx3djw8KDA8c31DRVdFP2IgJT0iOmZ7lP4YCBBvChphc2d0AgoGGAZuCgplBRoTGwYbAX4OH1oEdUV0bHUqNjJlNTMxOjBybC5HVUFCZiw7Ij0rMTBoNDAoa31Fbn8SEA5Gayw4LTo9YmY0IzojPW4jKz5WEgz06gkxICAtNjAkNTY/JyY8Yn9RUUhXLyAmbC0rfyksJSs1OyogPX4SeFNFazwhPCw8PiAqdjo8aScqPT5U859ZaysxbCUvfxckOj5wem1zYS8MOhIWa29oKCA4fycpNywjdGE+OzpBRB9bIjwnJSYgcickJDtyd0lvbn8SEBIKOD81ImktMyU2JWJyODYqPSsfXVtFOCY7ImQiPiYgOn1uudzcw39mZRJ7Ahwdj9oAfwELdhocaQAOAw9nYwgKZDwkLSdwVWRldn9waX8/cB1HQ1FXay50cDo6LSsrMWEROy4uIDtdEGJfKIznImlmHyAgIC85KiwhZ2MdQ0ZEJCEzcmk3fykwlfYjPTEuIjoSVUFCKm8kLSc6PigpN38zJi1vIj4SU15XPSp0PywtLSExN2VsZjNxRH8SEBIWa3MwJT9uPCgkJSxtazI6KyxGHVFZLyp5PCAiM2Z7HRAEBQoBYwxicWB9Zn1icGYqNjJ7XH9waWNvbmNCEFFaKjwncWs/KiE2InIxKjcmITEfV11XJ21qYmdgLyU3N38iLCAjLzJTQhJDJW9oPz08MCoiaC01LiIjJytdEFdFOyo3JSgiY2s2Ii0/JyRxbq+tvrMKZD9qRmluf2R5eTs5P31Fbn8SEA5SIjl0LyUvLDd4dC4lLDA7Yz5eVUBCZi07NGtwVWRldn9waX8/bjxeUUFFdm0lOSw9K2kyNy0+IC0oYytXSEYUda3O7Kb20GR5JSsiJi0ocJ2TcWL10R0VGAxvY2s2Ii0/JyRxbgnxkV5fLyB0cCwjYYf/ODYzKC4qICtXEEJXOS50IChuLzYsOzoiKGM/Ky1BX1xXd2AxIXduOiplOjM1LiI9bjtdXlZTaw4mISggOytranAgd0lvbn8SEBIKO283ICg9LHlnJyo1OjdiJjZcRB9CLjcgbne+wNbkdmM1JH0fJyxGUQgWAy4tbCY6LStlJTozOyY7IX9dU0daPyB0KSduOihlJTYkICxvPypXEEZXJ28iKTNuPof/OH8+JmMnLyZTXhJVKiE+KSgqMGpreGN/LC5xcnBCDjgWa290cGYqNjJ7XH9wdWwrJykMOg4ZLyYicg==',
  // Misión 2 (Nico)
  c1: 'eyAuKWMvIzQ3LHNrMjopMidyX19WVytpJTAnNW8kMTo9PW4hJSI8fQw6EhZ7IC4pYy8jNDcsc2syOikyJ3JbU11YaiYmMS0pPXd6vdbIrPfDYaPArZES1N3le3AnJTlrTn9udTA/LS9zPF5RQUV6ZjYqJj87eCY+Ki4mYjggNH0M0qqzZxcCHBEJGxpkGwsaAQMDEAYac3R9Fm92aG1qbK3NwWNhOjMuIn9ZfxIMWgRnJys+MD9ydzUqKzo3YjgoJzNXEgz05gwGDGMICgYHCgwABh0YDnMKfBBhcwQWAgsMbXN6LG1wQ2NvcCU6KRJTXlc0N3p9MjkqJjByLSYtOykvJ3JQX0oUeU5nf2NscyVkPCIoMDxxYyIqV0NGGyshJjthco30AjoiICAmOCAwNl1eV0VrZCQ+OS0rOjZ/KixjIiUyJzpAWV1FZmQPPjBsLjYwNjgoJyBsLTJ/QVVRQyIqJDYibCswZDMvaRAuICBzbRwMHUZ5Tmd/Y2xzMS0pbiovLj8ybn1DRVdFM2kqNjA/Jjoqci0oMStuf1l/EhASFmd4NC8iIm82KD49On5tPTQ2LEYdX180Ny4wLWEjNCY6Imt9v9PS3n9mZRJ7DhcOnNACbxAKfwsFYwwNDAMKYQoOGTQ0JjF9Rm91ZH9uaX8/cgMmLFFREldneDQrMSMhMnoRJyosI4/gIH9+VVFXNSs0Y2w/OycrMSl3YzZsLCacm0NGRCYoIn8mPzs0ZC8vJzcuIC0yf1FfXBYrJWc8Ly05MGQsKyoxKjggaWMdQAw8Z2Rnf2NsczEtKW4qLy4/Mm59Q0VXRTNpJDAnKWIlLTMia30MAA4GGx9yd3cECwlycXpzeiA2OHdJb2xhc38SDEIWJCgmLDBxbSQxOj09bi4vNTowXB1VWSYoZWFtYmElJS0vaTEqLy0yMlNCEkMpZHssNz4gOyNhPCwkLiAoJzASVUFGIicuPi9wYCYwLSEnJHFssczRswwdRnlOZ39jbHN6IDY4d0lvbGFzY1ZZRBYkKCYsMHFtJDE6PT1uLiAkISsfUl1OZXpNf2Nsb3VkYz5pICMtMiBiEEFHUzQwaigiPiE8KjhjPSY3OGNtvaiQ3Y7IZHssNz4gOyNhjOgCH4/bAR5mdRMKaDczLSwiKGtkCY3oLyYoLnNjV10M9f0qLjwiISo7MDpuOSI9LWE/PhJAQF8qITU+YzwqJzcwICh/YCksbX9XXhJaKyEgPjFsKzoqOytpDSYvLn1jHUAMPGdkZ39jbHMlZDwiKDA8cWMiKldDRhsvLSkrbjgqLTB9cLnc3e1hbzpfDmJfNDAmZWMELixkMDo7LG8/JDAtV0RdFignMjM3I28wKn8rJWM8JTU6MBJBR1NnMCYzYzoqL2Q+jfMtbyIuczdTSVNYZycmMSkpLjErcWBnf2ApLG1jHUAMPGdkZ39/Yys8MmFEaWNzYyU6KQw6DhkjLTFh'
};

// Rutina XOR para descifrado en memoria
function _decodePayload(b64Str, keyStr) {
  try {
    const raw = atob(b64Str);
    const kLen = keyStr.length;
    let out = '';
    for (let i = 0; i < raw.length; i++) {
      out += String.fromCharCode(raw.charCodeAt(i) ^ keyStr.charCodeAt(i % kLen));
    }
    return decodeURIComponent(escape(out));
  } catch (err) {
    return '';
  }
}

// Sintetizador micro-audio 8-bit nativo (Web Audio API)
class RetroAudioEngine {
  constructor() {
    this.ctx = null;
  }
  _init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }
  stepBeep() {
    try {
      this._init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }
  victoryFanfare() {
    try {
      this._init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = this.ctx.currentTime + idx * 0.09;
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.12, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.14);
      });
    } catch (e) {}
  }
}

const audioEngine = new RetroAudioEngine();

// Feedback háptico nativo
function triggerHaptic(type = 'step') {
  if (navigator.vibrate) {
    if (type === 'step') {
      navigator.vibrate(35);
    } else if (type === 'unlock') {
      navigator.vibrate([60, 40, 90, 40, 140]);
    }
  }
}

// Micro-destello visual estilo glitch 8-bits
function flashGlitch(element) {
  if (!element) return;
  element.classList.add('secret-pulse');
  setTimeout(() => element.classList.remove('secret-pulse'), 350);
}

// Estado de progreso de las misiones
const _secretState = {
  // Misión 1 (Armando: Kotlin badge x3 -> Sala 3 taller x3)
  m1_step1_count: 0,
  m1_step1_ready: false,
  m1_step2_count: 0,
  m1_reset_timer: null,

  // Misión 2 (Nico: 4 colores GDG en orden -> Sala 2 taller x3)
  m2_color_sequence: [],
  m2_step1_ready: false,
  m2_step2_count: 0,
  m2_reset_timer: null
};

/**
 * Muestra el modal retro con el secreto desbloqueado
 */
function showSecretModal(htmlContent) {
  audioEngine.victoryFanfare();
  triggerHaptic('unlock');

  let modal = document.getElementById('secret-quest-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'secret-quest-modal';
    modal.className = 'modal-overlay is-open secret-modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `
      <div class="modal-window-8bit secret-quest-window">
        <div class="modal-titlebar">
          <span class="modal-titlebar-text">🏆 ¡MISIÓN SECRETA COMPLETADA!</span>
          <button type="button" class="modal-close-x" id="secret-quest-close">✕</button>
        </div>
        <div class="modal-body-content" id="secret-quest-body"></div>
        <div class="modal-actions-footer">
          <button type="button" class="btn-8bit btn-8bit-yellow" id="secret-quest-ok">
            ▶ ENTENDIDO, ¡VOY CORRIENDO!
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const closeHandler = () => {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
    };
    modal.querySelector('#secret-quest-close').addEventListener('click', closeHandler);
    modal.querySelector('#secret-quest-ok').addEventListener('click', closeHandler);
    modal.addEventListener('click', e => {
      if (e.target === modal) closeHandler();
    });
  }

  const bodyEl = modal.querySelector('#secret-quest-body');
  if (bodyEl) {
    bodyEl.innerHTML = htmlContent;
  }
  modal.classList.add('is-open');
  document.body.style.overflow = 'hidden';
}

/**
 * Inicializa la Misión 1: Armando Picón
 * Paso 1: 3 toques seguidos en el badge de Kotlin en el Hero
 * Paso 2: 3 toques seguidos en la tarjeta del taller de Armando en Sala 3
 */
function initMissionArmando() {
  // Paso 1: Badge de Kotlin en el Hero
  const techList = document.getElementById('hero-tech-badges');
  if (techList) {
    techList.addEventListener('click', e => {
      const badge = e.target.closest('.tech-badge-8bit');
      if (!badge) return;
      const title = badge.getAttribute('title') || '';
      if (!title.toLowerCase().includes('kotlin')) return;

      _secretState.m1_step1_count++;
      clearTimeout(_secretState.m1_reset_timer);
      triggerHaptic('step');
      audioEngine.stepBeep();
      flashGlitch(badge);

      if (_secretState.m1_step1_count >= 3) {
        _secretState.m1_step1_ready = true;
        _secretState.m1_step1_count = 0;
      }

      _secretState.m1_reset_timer = setTimeout(() => {
        _secretState.m1_step1_count = 0;
      }, 4000);
    });
  }

  // Paso 2: Tarjeta del taller de Armando (t1-sala3-1)
  const scheduleRoot = document.getElementById('schedule-root');
  if (scheduleRoot) {
    scheduleRoot.addEventListener('click', e => {
      const card = e.target.closest('[data-block-id="t1-sala3-1"]');
      if (!card) return;

      if (!_secretState.m1_step1_ready) return;

      _secretState.m1_step2_count++;
      triggerHaptic('step');
      audioEngine.stepBeep();
      flashGlitch(card);

      if (_secretState.m1_step2_count >= 3) {
        _secretState.m1_step1_ready = false;
        _secretState.m1_step2_count = 0;

        // Clave generada en tiempo de ejecución para descifrar payload
        const key = ['KOTLIN', 'DEV', 'PICON', '2026'].join('_');
        const decryptedHtml = _decodePayload(_CIPHER_BANK.k0, key);
        if (decryptedHtml) {
          showSecretModal(decryptedHtml);
        }
      }
    });
  }
}

/**
 * Inicializa la Misión 2: Nicolás Lecaros
 * Paso 1: Tocar los 4 colores GDG en orden: Azul -> Rojo -> Amarillo -> Verde
 * Paso 2: 3 toques seguidos en la tarjeta del taller de Nico en Sala 2 (t2-sala2-1)
 */
function initMissionNicolas() {
  // Paso 1: Tira de colores GDG del header
  const colorStrip = document.querySelector('.site-header .gdg-color-strip');
  if (colorStrip) {
    const spans = colorStrip.querySelectorAll('span');
    spans.forEach((span, idx) => {
      // 0: Azul, 1: Rojo, 2: Amarillo, 3: Verde
      span.style.cursor = 'pointer';
      span.addEventListener('click', e => {
        e.stopPropagation();
        triggerHaptic('step');
        audioEngine.stepBeep();
        flashGlitch(span);

        const expectedIdx = _secretState.m2_color_sequence.length;
        if (idx === expectedIdx) {
          _secretState.m2_color_sequence.push(idx);
          if (_secretState.m2_color_sequence.length === 4) {
            _secretState.m2_step1_ready = true;
            _secretState.m2_color_sequence = [];
          }
        } else {
          _secretState.m2_color_sequence = idx === 0 ? [0] : [];
        }

        clearTimeout(_secretState.m2_reset_timer);
        _secretState.m2_reset_timer = setTimeout(() => {
          _secretState.m2_color_sequence = [];
        }, 5000);
      });
    });
  }

  // Paso 2: Tarjeta del taller de Nicolás (t2-sala2-1)
  const scheduleRoot = document.getElementById('schedule-root');
  if (scheduleRoot) {
    scheduleRoot.addEventListener('click', e => {
      const card = e.target.closest('[data-block-id="t2-sala2-1"]');
      if (!card) return;

      if (!_secretState.m2_step1_ready) return;

      _secretState.m2_step2_count++;
      triggerHaptic('step');
      audioEngine.stepBeep();
      flashGlitch(card);

      if (_secretState.m2_step2_count >= 3) {
        _secretState.m2_step1_ready = false;
        _secretState.m2_step2_count = 0;

        // Clave generada en tiempo de ejecución para descifrar payload
        const key = ['GDG', 'CLOUD', 'NICOLAS', '2026'].join('_');
        const decryptedHtml = _decodePayload(_CIPHER_BANK.c1, key);
        if (decryptedHtml) {
          showSecretModal(decryptedHtml);
        }
      }
    });
  }
}

/**
 * Punto de entrada del sistema de misiones secretas
 */
export function initSecretQuests() {
  initMissionArmando();
  initMissionNicolas();
}
