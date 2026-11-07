import { EVENT_DATA } from '../data/devfest-data.js';
import { renderKunioCharacter, renderKunioHeadshot, renderTechBadge } from './sprites.js';
import { initSecretQuests } from './quests.js';

// Estado de la aplicación
const state = {
  activeRoomFilter: 'all', // 'all' | 'auditorio' | 'sala1' | 'sala2' | 'sala3'
  agendaData: null, // Datos cargados desde data/agenda.json
  blocksIndex: new Map() // Mapa id -> datos del bloque para abrir el modal
};

/**
 * Carga el programa / agenda desde el archivo externo JSON (`data/agenda.json`)
 */
async function loadAgendaJson() {
  const agendaUrl = EVENT_DATA.meta?.agendaJsonPath || 'data/agenda.json';
  const response = await fetch(agendaUrl, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${agendaUrl} (HTTP ${response.status})`);
  }
  return response.json();
}

/**
 * Convierte "HH:MM" a minutos desde las 00:00
 */
function timeToMinutes(timeStr) {
  const [hh, mm] = timeStr.split(':').map(Number);
  return hh * 60 + mm;
}

/**
 * Convierte minutos desde las 00:00 a formato "HH:MM"
 */
function minutesToTime(totalMinutes) {
  const hh = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const mm = String(totalMinutes % 60).padStart(2, '0');
  return `${hh}:${mm}`;
}

/**
 * Renderiza el medallón circular del speaker (16x16 / 24x24 / 32x32 / 72x72).
 * - Si el speaker tiene foto (`speakerPhoto`), muestra la imagen circular con fallback automático.
 * - Si no tiene foto (ej. Eduardo Miranda), muestra el retrato 8-bits (`renderKunioHeadshot`) como avatar genérico.
 */
function renderSpeakerCircularAvatar(blockOrChar, sizeClass = 'circle-32') {
  const avatarKey = blockOrChar.avatar || blockOrChar.key || 'panel';
  const speakerName = blockOrChar.speaker || blockOrChar.fullName || blockOrChar.name || 'Speaker';
  const photoUrl = blockOrChar.speakerPhoto || null;
  const altPhotoUrl = blockOrChar.speakerPhotoAltUrl || '';
  const accentColor = blockOrChar.badgeColor || 'blue';
  const headshotFallback = renderKunioHeadshot(avatarKey);

  if (!photoUrl) {
    return `
      <span
        class="speaker-photo-circle ${sizeClass} circle-accent-${accentColor} is-fallback"
        title="${speakerName} (Avatar 8-Bit)"
      >
        <span class="speaker-circle-fallback">${headshotFallback}</span>
      </span>
    `;
  }

  return `
    <span
      class="speaker-photo-circle ${sizeClass} circle-accent-${accentColor}"
      title="${speakerName}"
    >
      <img
        src="${photoUrl}"
        ${altPhotoUrl ? `data-alt-src="${altPhotoUrl}"` : ''}
        alt="Foto de ${speakerName}"
        class="speaker-circle-img"
        loading="lazy"
        referrerpolicy="no-referrer"
      />
      <span class="speaker-circle-fallback">${headshotFallback}</span>
    </span>
  `;
}

/**
 * Conecta el manejador `onerror` en las imágenes circulares de un contenedor
 * para probar `data-alt-src` y, si también falla, mostrar el retrato 8-bits.
 */
function attachCircularAvatarFallbacks(rootEl) {
  if (!rootEl) return;
  rootEl.querySelectorAll('.speaker-circle-img').forEach(img => {
    if (img.dataset.boundFallback) return;
    img.dataset.boundFallback = 'true';
    img.addEventListener('error', () => {
      const altSrc = img.getAttribute('data-alt-src');
      if (altSrc && img.src !== altSrc) {
        img.src = altSrc;
        img.removeAttribute('data-alt-src');
        return;
      }
      const wrapper = img.closest('.speaker-photo-circle');
      if (wrapper) {
        wrapper.classList.add('is-fallback');
      }
    });
  });
}

/**
 * Normaliza los bloques de una sala dentro de una tanda:
 * - Calcula la duración real en minutos de cada bloque.
 * - Detecta intervalos de transición cortos (< minGapMinutesToFill) o huecos asimétricos (>= minGapMinutesToFill).
 * - Si un taller dura menos de lo estipulado, inserta o respeta bloques de relleno (`type: "filler"`).
 */
function buildTrackTimeline(rawBlocks, tandaStartStr, tandaEndStr, room, scheduleConfig) {
  const tandaStart = timeToMinutes(tandaStartStr);
  const tandaEnd = timeToMinutes(tandaEndStr);
  const sorted = [...rawBlocks].sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
  const timeline = [];

  let cursor = tandaStart;

  sorted.forEach((block, idx) => {
    const bStart = timeToMinutes(block.startTime);
    const bEnd = timeToMinutes(block.endTime);

    // ¿Hay espacio antes de este bloque?
    if (bStart > cursor) {
      const gapMins = bStart - cursor;
      if (gapMins >= scheduleConfig.minGapMinutesToFill && scheduleConfig.autoFillGaps) {
        timeline.push(createAutoFillerBlock(cursor, bStart, room, `${room.id}-gap-${idx}`, scheduleConfig));
      } else {
        timeline.push({
          id: `${room.id}-trans-${idx}`,
          type: 'transition',
          startTime: minutesToTime(cursor),
          endTime: minutesToTime(bStart),
          durationMinutes: gapMins,
          title: `Transición (${gapMins} min)`
        });
      }
    }

    timeline.push({
      ...block,
      durationMinutes: Math.max(5, bEnd - bStart)
    });

    cursor = Math.max(cursor, bEnd);
  });

  // ¿Queda tiempo libre al final de la tanda en esta sala?
  if (cursor < tandaEnd) {
    const remainingMins = tandaEnd - cursor;
    if (remainingMins >= scheduleConfig.minGapMinutesToFill && scheduleConfig.autoFillGaps) {
      timeline.push(createAutoFillerBlock(cursor, tandaEnd, room, `${room.id}-end-filler`, scheduleConfig));
    } else {
      timeline.push({
        id: `${room.id}-trans-end`,
        type: 'transition',
        startTime: minutesToTime(cursor),
        endTime: minutesToTime(tandaEnd),
        durationMinutes: remainingMins,
        title: `Cierre de bloque (${remainingMins} min)`
      });
    }
  }

  return timeline;
}

function createAutoFillerBlock(startMins, endMins, room, id, scheduleConfig) {
  const durationMinutes = endMins - startMins;
  const startTime = minutesToTime(startMins);
  const endTime = minutesToTime(endMins);
  return {
    id,
    type: 'filler',
    formatLabel: 'BLOQUE DE RELLENO / FLEXIBLE',
    startTime,
    endTime,
    durationMinutes,
    durationNote: `${durationMinutes} minutos disponibles`,
    title: scheduleConfig.defaultFillerTitle,
    speaker: 'Comunidad GDG Santiago & Speakers',
    affiliation: 'Dinámica Abierta',
    badge: 'FLEXIBLE',
    badgeColor: room.color,
    avatar: 'panel',
    roomLabel: room.name,
    description: scheduleConfig.defaultFillerDescription,
    tags: ['Q&A Extendido', 'Networking', 'Bloque Flexible'],
    techLogos: ['community', 'ai']
  };
}

/**
 * Retorna una copia de los bloques del programa cargados desde data/agenda.json
 */
function getEffectiveBlocks() {
  if (!state.agendaData || !Array.isArray(state.agendaData.blocks)) {
    return [];
  }
  return JSON.parse(JSON.stringify(state.agendaData.blocks));
}

/**
 * Inicializa la Marquesina (Marquee) en movimiento
 */
function initMarquee() {
  const container = document.getElementById('marquee-content');
  if (!container) return;

  const itemsHtml = EVENT_DATA.announcements
    .map(text => `<span class="marquee-item"><span class="pixel-star">★</span> ${text}</span>`)
    .join('');

  // Duplicamos el contenido para animación continua infinita sin cortes
  container.innerHTML = `<div class="marquee-group">${itemsHtml}</div><div class="marquee-group" aria-hidden="true">${itemsHtml}</div>`;
}

/**
 * Extrae la lista única de speakers de las tandas en `data/agenda.json`
 * para mostrar sus avatares 8-bit y medallones circulares en el escenario del Hero.
 */
function extractSpeakersFromAgenda(agendaData) {
  const defaultCast = [
    { key: 'mikaeri', name: 'Mikaeri', badge: 'Google' },
    { key: 'alvaro', name: 'Álvaro', badge: 'GDE Angular' },
    { key: 'ranse', name: 'Ranse', badge: 'GDE Cloud' },
    { key: 'jimmy', name: 'Jimmy', badge: 'GDE Angular' },
    { key: 'devpicon', name: 'Armando', badge: 'GDG Santiago' },
    { key: 'lesly', name: 'Lesly', badge: 'GDE Cloud AI' },
    { key: 'eduardo', name: 'Eduardo', badge: 'Datadog' },
    { key: 'julio', name: 'Julio', badge: 'GDE Cloud' },
    { key: 'nicolas', name: 'Nicolás', badge: 'GDE Cloud' },
    { key: 'lucia', name: 'Lucía', badge: 'Google' }
  ];

  if (!agendaData || !Array.isArray(agendaData.blocks)) {
    return defaultCast;
  }

  const seenAvatars = new Set();
  const extracted = [];

  agendaData.blocks.forEach(block => {
    if (block.kind !== 'tanda' || !block.tracks) return;
    Object.values(block.tracks).forEach(trackSessions => {
      trackSessions.forEach(session => {
        if (!session.avatar || session.avatar === 'panel' || seenAvatars.has(session.avatar)) return;
        seenAvatars.add(session.avatar);
        const firstName = session.speaker.split(' ')[0];
        extracted.push({
          key: session.avatar,
          avatar: session.avatar,
          blockId: session.id,
          name: firstName,
          fullName: session.speaker,
          badge: session.badge || session.affiliation || '',
          badgeColor: session.badgeColor || 'blue',
          speakerPhoto: session.speakerPhoto || null,
          speakerPhotoAltUrl: session.speakerPhotoAltUrl || '',
          speakerCountryFlag: session.speakerCountryFlag || '',
          hasBio: Boolean(session.speakerBio)
        });
      });
    });
  });

  return extracted.length > 0 ? extracted : defaultCast;
}

/**
 * Renderiza la barra de badges tecnológicos en 8-bits y los personajes Kunio-kun del Hero
 */
function initHeroSprites() {
  const techStrip = document.getElementById('hero-tech-badges');
  if (techStrip) {
    techStrip.innerHTML = EVENT_DATA.featuredTechs
      .map(t => renderTechBadge(t.key, true))
      .join('');
  }

  const kunioParade = document.getElementById('hero-kunio-parade');
  if (kunioParade) {
    const cast = extractSpeakersFromAgenda(state.agendaData);

    kunioParade.innerHTML = cast
      .map(
        char => `
        <button
          type="button"
          class="kunio-stage-card"
          data-hero-block-id="${char.blockId || ''}"
          data-hero-tab="${char.hasBio ? 'speaker' : 'session'}"
          title="${char.fullName || char.name} (${char.badge}) · Clic para ver ${char.hasBio ? 'perfil y sesión' : 'sesión'}"
        >
          <div class="kunio-stage-visual">
            ${renderKunioCharacter(char.key, 'kunio-sm')}
            ${renderSpeakerCircularAvatar(char, 'circle-24')}
          </div>
          <span class="kunio-stage-name">${char.speakerCountryFlag ? `${char.speakerCountryFlag} ` : ''}${char.name}</span>
        </button>
      `
      )
      .join('');

    attachCircularAvatarFallbacks(kunioParade);

    kunioParade.querySelectorAll('[data-hero-block-id]').forEach(btn => {
      btn.addEventListener('click', () => {
        const blockId = btn.getAttribute('data-hero-block-id');
        const tab = btn.getAttribute('data-hero-tab') || 'session';
        if (blockId) {
          openSessionModal(blockId, tab);
        }
      });
    });
  }
}

/**
 * Renderiza un bloque plenario (Bienvenida UNAB, Bienvenida GDG, Pausa común, Preparación, Conversatorio o Cierre)
 */
function renderPlenaryCard(block) {
  const startMins = timeToMinutes(block.startTime);
  const endMins = timeToMinutes(block.endTime);
  const durationMinutes = endMins - startMins;
  const fullBlock = { ...block, durationMinutes };
  state.blocksIndex.set(block.id, fullBlock);

  const isBreak = block.type === 'break';

  return `
    <article 
      class="plenary-card ${isBreak ? 'plenary-break' : 'plenary-main'}" 
      data-block-id="${block.id}"
      tabindex="0"
      role="button"
      aria-label="Ver detalles de ${block.title}"
    >
      <div class="plenary-time-col">
        <span class="time-pill">🕒 ${block.startTime} – ${block.endTime}</span>
        <span class="duration-micro">${durationMinutes} MIN</span>
      </div>
      <div class="plenary-avatar-col" tabindex="0" role="button" aria-label="Personaje 8-bits de ${block.title}" title="¡Tócame! 👾">
        ${renderKunioCharacter(block.avatar || 'panel', 'kunio-sm')}
      </div>
      <div class="plenary-info-col">
        <div class="plenary-topline">
          <span class="room-tag-8bit">${block.roomLabel}</span>
          <span class="speaker-badge-8bit">${block.badge}</span>
        </div>
        <h3 class="plenary-title">${block.title}</h3>
        <p class="plenary-subtitle">${block.subtitle}</p>
      </div>
      <div class="plenary-action-col">
        <span class="pixel-click-hint">[VER INFO +]</span>
      </div>
    </article>
  `;
}

/**
 * Formatea el nombre del speaker (o lista de panelistas si están separados por " · ")
 */
function formatSpeakerDisplay(speakerStr, countryFlag = '', countryName = '') {
  if (!speakerStr.includes(' · ')) {
    const countryPill = countryName
      ? `<span class="speaker-country-pill" title="País: ${countryName}">${countryFlag ? `${countryFlag} ` : ''}${countryName}</span>`
      : '';
    return `
      <div class="speaker-name-wrap">
        <h4 class="block-speaker-name">${speakerStr}</h4>
        ${countryPill}
      </div>
    `;
  }
  const parts = speakerStr.split(' · ');
  return `
    <div class="block-panelists-list">
      ${parts.map(p => `<div class="panelist-item">▪ ${p}</div>`).join('')}
    </div>
  `;
}

/**
 * Renderiza una tarjeta de sesión dentro de una columna de Sala (Charla, Taller, Panel o Relleno)
 */
function renderTrackBlockCard(block, room) {
  if (block.type === 'transition') {
    return `
      <div class="track-transition-slot" style="--slot-mins: ${block.durationMinutes}; flex-grow: ${block.durationMinutes};" title="Intervalo de transición de ${block.durationMinutes} minutos">
        <span class="transition-text">⏱ ${block.startTime}–${block.endTime} · Transición (${block.durationMinutes}m)</span>
      </div>
    `;
  }

  state.blocksIndex.set(block.id, block);

  const techIconsHtml = (block.techLogos || [])
    .map(key => renderTechBadge(key, false))
    .join('');

  const tagsHtml = (block.tags || [])
    .slice(0, 3)
    .map(tag => `<span class="mini-tag">#${tag}</span>`)
    .join('');

  const typeClass = `block-type-${block.type}`; // talk, workshop, panel, filler
  const colorClass = `room-accent-${room.color}`;
  const hasSpeakerBio = Boolean(block.speakerBio);

  // Medallón circular 32x32 del speaker (foto real o retrato 8-bits si es Eduardo / sin foto)
  const circularAvatarHtml =
    block.type !== 'filler' ? renderSpeakerCircularAvatar(block, 'circle-32') : '';

  return `
    <article
      class="schedule-block-card ${typeClass} ${colorClass}"
      style="--slot-mins: ${block.durationMinutes}; flex-grow: ${block.durationMinutes};"
      data-block-id="${block.id}"
      tabindex="0"
      role="button"
      aria-label="${block.formatLabel}: ${block.title} por ${block.speaker}, de ${block.startTime} a ${block.endTime}"
    >
      <div class="block-card-top">
        <div class="block-card-header">
          <span class="block-time-badge">🕒 ${block.startTime} – ${block.endTime}</span>
          <span class="block-duration-pill">${block.durationMinutes} MIN</span>
        </div>

        <div class="block-type-row">
          <span class="block-format-chip">${block.roomLabel || room.name} · ${block.formatLabel}</span>
          <span class="block-affiliation-chip badge-${block.badgeColor || room.color}">${block.badge}</span>
        </div>
      </div>

      <div class="block-main-body">
        <div class="block-speaker-row">
          <div class="block-avatar-combo">
            <div class="block-avatar-frame" tabindex="0" role="button" aria-label="Personaje 8-bits de ${block.speaker || block.title}" title="¡Tócame! 👾">
              ${renderKunioCharacter(block.avatar, 'kunio-sm')}
            </div>
            ${circularAvatarHtml}
          </div>
          <div class="block-speaker-meta">
            ${formatSpeakerDisplay(block.speaker, block.speakerCountryFlag, block.speakerCountry)}
            ${block.affiliation ? `<p class="block-moderators">${block.affiliation}</p>` : ''}
            ${block.moderators ? `<p class="block-moderators">${block.moderators}</p>` : ''}
            <p class="block-duration-note">${block.durationNote || `${block.durationMinutes} minutos`}</p>
          </div>
        </div>

        <h3 class="block-talk-title">${block.title}</h3>
        ${
          block.description
            ? `<p class="block-talk-excerpt">${block.description}</p>`
            : ''
        }
      </div>

      <div class="block-card-footer">
        <div class="block-footer-meta">
          <div class="block-tech-icons">${techIconsHtml}</div>
          <div class="block-tags-list">${tagsHtml}</div>
        </div>
        <div class="block-cta-row">
          <button
            type="button"
            class="press-start-hint btn-card-tab"
            data-card-open-tab="session"
            title="Ver detalles completos de la sesión"
          >
            📜 VER SESIÓN
          </button>
          ${
            hasSpeakerBio
              ? `<button
                  type="button"
                  class="press-start-hint btn-card-tab btn-card-speaker"
                  data-card-open-tab="speaker"
                  title="Ver biografía e información de ${block.speaker}"
                >
                  👤 PERFIL SPEAKER
                </button>`
              : ''
          }
        </div>
      </div>
    </article>
  `;
}

/**
 * Renderiza una Tanda completa con sus 4 columnas de Salas proporcionales al tiempo
 */
function renderTandaSection(tanda, rooms, scheduleConfig) {
  const totalTandaMins = timeToMinutes(tanda.endTime) - timeToMinutes(tanda.startTime);

  const visibleRooms = rooms.filter(
    r => state.activeRoomFilter === 'all' || state.activeRoomFilter === r.id
  );

  const columnsHtml = visibleRooms
    .map(room => {
      const rawBlocks = tanda.tracks[room.id] || [];
      const timeline = buildTrackTimeline(
        rawBlocks,
        tanda.startTime,
        tanda.endTime,
        room,
        scheduleConfig
      );

      const cardsHtml = timeline.map(b => renderTrackBlockCard(b, room)).join('');

      return `
        <div class="track-column room-col-${room.color}" data-room="${room.id}">
          <div class="track-column-header">
            <span class="track-room-name">${room.name}</span>
            <span class="track-room-sub">${room.subtitle}</span>
          </div>
          <div class="track-column-body" style="--tanda-total-mins: ${totalTandaMins};">
            ${cardsHtml}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <section class="tanda-block" id="${tanda.id}">
      <div class="tanda-header-banner">
        <div class="tanda-title-group">
          <span class="tanda-pixel-badge">${tanda.name}</span>
          <h3 class="tanda-subtitle">${tanda.subtitle}</h3>
        </div>
        <div class="tanda-time-pill">
          <span>🕒 ${tanda.startTime} – ${tanda.endTime} (${totalTandaMins} MIN)</span>
        </div>
      </div>

      <div class="tanda-grid-wrapper ${state.activeRoomFilter !== 'all' ? 'single-track-mode' : ''}">
        <div class="tanda-tracks-grid">
          ${columnsHtml}
        </div>
      </div>

      ${tanda.note ? `<p class="tanda-footnote">ℹ️ ${tanda.note}</p>` : ''}
    </section>
  `;
}

/**
 * Renderiza toda la Agenda cargada desde `data/agenda.json`
 */
function renderFullSchedule() {
  const container = document.getElementById('schedule-root');
  if (!container || !state.agendaData) return;

  state.blocksIndex.clear();
  const rooms = state.agendaData.rooms || [];
  const scheduleConfig = state.agendaData.scheduleConfig || {
    autoFillGaps: true,
    minGapMinutesToFill: 10,
    defaultFillerTitle: 'Bloque Flexible · Q&A Libre / Demos / Networking',
    defaultFillerDescription: 'Espacio flexible para preguntas extendidas o networking.'
  };

  const effectiveBlocks = getEffectiveBlocks();

  const blocksHtml = effectiveBlocks
    .map(block => {
      if (block.kind === 'tanda') {
        return renderTandaSection(block, rooms, scheduleConfig);
      }
      return renderPlenaryCard(block);
    })
    .join('');

  container.innerHTML = blocksHtml;
  attachCircularAvatarFallbacks(container);

  // Botones específicos de pestaña dentro de cada tarjeta (Ver Sesión vs Perfil Speaker)
  container.querySelectorAll('[data-card-open-tab]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const card = btn.closest('[data-block-id]');
      if (!card) return;
      const blockId = card.getAttribute('data-block-id');
      const targetTab = btn.getAttribute('data-card-open-tab') || 'session';
      openSessionModal(blockId, targetTab);
    });
  });

  // Asignar eventos de clic y teclado a cada bloque del programa
  container.querySelectorAll('[data-block-id]').forEach(el => {
    el.addEventListener('click', () => {
      const blockId = el.getAttribute('data-block-id');
      openSessionModal(blockId, 'session');
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const blockId = el.getAttribute('data-block-id');
        openSessionModal(blockId, 'session');
      }
    });
  });
}

/**
 * Abre el Modal 8-Bits con pestañas separadas para la Sesión y el Perfil del Speaker.
 * Si el speaker no tiene información de perfil (ej. Eduardo Miranda), la pestaña de perfil no está disponible.
 */
function openSessionModal(blockId, initialTab = 'session') {
  const block = state.blocksIndex.get(blockId);
  if (!block) return;

  const modal = document.getElementById('session-modal');
  const modalBody = document.getElementById('session-modal-body');
  if (!modal || !modalBody) return;

  const hasSpeakerProfile = Boolean(block.speakerBio);
  const activeTab = hasSpeakerProfile && initialTab === 'speaker' ? 'speaker' : 'session';

  const techBadgesHtml = (block.techLogos || [])
    .map(key => renderTechBadge(key, true))
    .join('');

  const tagsHtml = (block.tags || [])
    .map(tag => `<span class="modal-tag-chip">#${tag}</span>`)
    .join('');

  const tabsBarHtml = hasSpeakerProfile
    ? `
      <div class="modal-tabs-bar" role="tablist" aria-label="Secciones de información">
        <button
          type="button"
          role="tab"
          aria-selected="${activeTab === 'session'}"
          class="modal-tab-btn ${activeTab === 'session' ? 'active' : ''}"
          data-switch-modal-tab="session"
        >
          📜 INFO DE LA SESIÓN
        </button>
        <button
          type="button"
          role="tab"
          aria-selected="${activeTab === 'speaker'}"
          class="modal-tab-btn ${activeTab === 'speaker' ? 'active' : ''}"
          data-switch-modal-tab="speaker"
        >
          👤 PERFIL DEL SPEAKER
        </button>
      </div>
    `
    : '';

  const countryBadgeHtml = block.speakerCountry
    ? `<span class="modal-country-chip">${block.speakerCountryFlag ? `${block.speakerCountryFlag} ` : ''}${block.speakerCountry}</span>`
    : '';

  modalBody.innerHTML = `
    ${tabsBarHtml}

    <!-- PANEL 1: INFORMACIÓN DE LA SESIÓN -->
    <div class="modal-tab-panel ${activeTab === 'session' ? 'is-active' : ''}" data-modal-panel="session">
      <div class="modal-arcade-stage">
        <div class="modal-avatar-box">
          ${renderKunioCharacter(block.avatar || 'devpicon', 'kunio-lg')}
          <span class="avatar-status-pill">● SPEAKER 8-BIT ACTIVO</span>
        </div>
        <div class="modal-Locate-info">
          <div class="modal-badges-top">
            <span class="modal-room-chip">${block.roomLabel || 'AUDITORIO'}</span>
            <span class="modal-time-chip">🕒 ${block.startTime} – ${block.endTime} (${block.durationMinutes} min)</span>
            <span class="modal-affiliation-chip">${block.badge || ''}</span>
            ${countryBadgeHtml}
          </div>
          <h2 class="modal-talk-title">${block.title}</h2>
          <div class="modal-speaker-row-inline">
            ${block.type !== 'filler' && block.avatar !== 'panel' ? renderSpeakerCircularAvatar(block, 'circle-36') : ''}
            <div>
              <p class="modal-speaker-line"><strong>${block.speaker}</strong> ${block.affiliation ? `· <span>${block.affiliation}</span>` : ''}</p>
              ${block.moderators ? `<p class="modal-moderators-line">🎙️ ${block.moderators}</p>` : ''}
              ${block.durationNote ? `<p class="modal-duration-detail">⏱️ ${block.durationNote}</p>` : ''}
            </div>
          </div>
          ${
            hasSpeakerProfile
              ? `<button type="button" class="modal-inline-bio-trigger" data-switch-modal-tab="speaker">
                  👤 Conocer biografía y perfil de ${block.speaker.split(' ')[0]} →
                </button>`
              : ''
          }
        </div>
      </div>

      <div class="modal-description-box">
        <h3 class="modal-section-heading">📜 DESCRIPCIÓN DE LA SESIÓN</h3>
        <p class="modal-description-text">${block.description}</p>
      </div>

      <div class="modal-tech-section">
        <h3 class="modal-section-heading">⚡ TECNOLOGÍAS & LOGOS RELACIONADOS</h3>
        <div class="modal-tech-logos-row">
          ${techBadgesHtml}
        </div>
        <div class="modal-tags-row">
          ${tagsHtml}
        </div>
      </div>
    </div>

    <!-- PANEL 2: PERFIL DEL SPEAKER (Solo disponible si el speaker tiene bio registrada) -->
    ${
      hasSpeakerProfile
        ? `
        <div class="modal-tab-panel ${activeTab === 'speaker' ? 'is-active' : ''}" data-modal-panel="speaker">
          <div class="modal-speaker-profile-hero">
            <div class="modal-speaker-dual-portraits">
              ${renderSpeakerCircularAvatar(block, 'circle-72')}
              <div class="modal-speaker-mini-sprite" title="Sprite 8-Bit de ${block.speaker}">
                ${renderKunioCharacter(block.avatar || 'devpicon', 'kunio-sm')}
              </div>
            </div>
            <div class="modal-speaker-profile-meta">
              <div class="modal-badges-top">
                <span class="modal-affiliation-chip">${block.badge || 'SPEAKER'}</span>
                ${countryBadgeHtml}
                <span class="modal-room-chip">${block.roomLabel || 'AUDITORIO'} · ${block.startTime}</span>
              </div>
              <h2 class="modal-speaker-profile-name">${block.speaker}</h2>
              ${block.affiliation ? `<p class="modal-speaker-profile-role">${block.affiliation}</p>` : ''}
            </div>
          </div>

          <div class="modal-description-box modal-bio-box">
            <h3 class="modal-section-heading">🪪 ACERCA DE ${block.speaker.toUpperCase()}</h3>
            <p class="modal-description-text">${block.speakerBio}</p>
          </div>

          <div class="modal-speaker-session-summary">
            <div class="modal-speaker-session-info">
              <span class="modal-session-mini-label">🎤 SESIÓN EN DEVFEST SANTIAGO 2026:</span>
              <strong>${block.title}</strong>
              <span>🕒 ${block.startTime} – ${block.endTime} · ${block.roomLabel}</span>
            </div>
            <button type="button" class="btn-8bit btn-8bit-ghost" data-switch-modal-tab="session">
              📜 VER DESCRIPCIÓN DE LA SESIÓN
            </button>
          </div>
        </div>
      `
        : ''
    }

    <div class="modal-actions-footer">
      <a href="#sede" class="btn-8bit btn-8bit-primary" id="modal-venue-action">
        🏛️ CÓMO LLEGAR A LA SEDE
      </a>
      <button type="button" class="btn-8bit btn-8bit-ghost" id="modal-close-action">
        ✕ CERRAR VENTANA
      </button>
    </div>
  `;

  attachCircularAvatarFallbacks(modalBody);

  // Eventos para cambiar entre las pestañas "Sesión" y "Perfil del Speaker"
  modalBody.querySelectorAll('[data-switch-modal-tab]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-switch-modal-tab');
      modalBody.querySelectorAll('.modal-tab-btn').forEach(tabBtn => {
        const isSelected = tabBtn.getAttribute('data-switch-modal-tab') === targetTab;
        tabBtn.classList.toggle('active', isSelected);
        tabBtn.setAttribute('aria-selected', String(isSelected));
      });
      modalBody.querySelectorAll('.modal-tab-panel').forEach(panel => {
        panel.classList.toggle('is-active', panel.getAttribute('data-modal-panel') === targetTab);
      });
    });
  });

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeActionBtn = document.getElementById('modal-close-action');
  if (closeActionBtn) {
    closeActionBtn.addEventListener('click', closeSessionModal);
  }

  const venueActionBtn = document.getElementById('modal-venue-action');
  if (venueActionBtn) {
    venueActionBtn.addEventListener('click', () => {
      closeSessionModal();
    });
  }
}

function closeSessionModal() {
  const modal = document.getElementById('session-modal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/**
 * Inicializa filtros de salas y controles del modal
 */
function initScheduleControls() {
  const filterBtns = document.querySelectorAll('[data-room-filter]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeRoomFilter = btn.getAttribute('data-room-filter');
      renderFullSchedule();
    });
  });

  // Cierre de modal
  const closeBtn = document.getElementById('modal-close-btn');
  const modalOverlay = document.getElementById('session-modal');
  if (closeBtn) closeBtn.addEventListener('click', closeSessionModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', e => {
      if (e.target === modalOverlay) closeSessionModal();
    });
  }
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSessionModal();
  });
}

/**
 * Inicializa la página de Sponsors (si estamos en sponsors.html o en la vista previa)
 */
function initSponsorsRender() {
  const hostGrid = document.getElementById('sponsors-host-grid');
  const officialGrid = document.getElementById('sponsors-official-grid');
  const communityGrid = document.getElementById('sponsors-community-grid');

  if (hostGrid) {
    hostGrid.innerHTML = EVENT_DATA.sponsors.host
      .map(
        s => `
        <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="sponsor-official-card sponsor-host-card">
          <div class="sponsor-logo-clean">
            <img src="${s.logo}" alt="${s.name}" loading="lazy" />
          </div>
          <div class="sponsor-card-meta">
            <span class="sponsor-tier-badge">${s.tier}</span>
            <h3>${s.name}</h3>
            <p>${s.description}</p>
          </div>
        </a>
      `
      )
      .join('');
  }

  if (officialGrid) {
    officialGrid.innerHTML = EVENT_DATA.sponsors.official
      .map(
        s => `
        <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="sponsor-official-card">
          <div class="sponsor-logo-clean">
            ${
              s.logo
                ? `<img src="${s.logo}" alt="${s.name}" loading="lazy" />`
                : `<div class="official-wordmark" style="--brand-color: ${s.badgeColor || '#111'}">${s.logoText}</div>`
            }
          </div>
          <div class="sponsor-card-meta">
            <span class="sponsor-tier-badge">${s.tier}</span>
            <h3>${s.name}</h3>
            <p>${s.description}</p>
          </div>
        </a>
      `
      )
      .join('');
  }

  if (communityGrid) {
    communityGrid.innerHTML = EVENT_DATA.sponsors.community
      .map(
        s => `
        <a href="${s.url}" target="_blank" rel="noopener noreferrer" class="sponsor-official-card sponsor-community-card">
          <div class="sponsor-logo-clean">
            ${
              s.logo
                ? `<img src="${s.logo}" alt="${s.name}" loading="lazy" />`
                : `<div class="official-wordmark community-wordmark" style="--brand-color: ${s.badgeColor || '#34A853'}">${s.logoText}</div>`
            }
          </div>
          <div class="sponsor-card-meta">
            <span class="sponsor-tier-badge">${s.role}</span>
            <h3>${s.name}</h3>
            <p>${s.description}</p>
          </div>
        </a>
      `
      )
      .join('');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  initMarquee();
  initScheduleControls();
  initSponsorsRender();

  try {
    state.agendaData = await loadAgendaJson();
  } catch (err) {
    console.error('Error cargando data/agenda.json:', err);
    const container = document.getElementById('schedule-root');
    if (container) {
      container.innerHTML = `
        <div class="plenary-card plenary-break">
          <div class="plenary-info-col">
            <h3 class="plenary-title">⚠️ No se pudo cargar el archivo data/agenda.json</h3>
            <p class="plenary-subtitle">Verifica que el sitio se esté sirviendo mediante un servidor HTTP y que data/agenda.json tenga un formato JSON válido.</p>
          </div>
        </div>
      `;
    }
  }

  initHeroSprites();
  renderFullSchedule();
  initSecretQuests();
});
