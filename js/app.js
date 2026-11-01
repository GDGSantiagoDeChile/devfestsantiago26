import { EVENT_DATA } from '../data/devfest-data.js';
import { renderKunioCharacter, renderTechBadge } from './sprites.js';

// Estado de la aplicación
const state = {
  activeRoomFilter: 'all', // 'all' | 'auditorio' | 'sala1' | 'sala2' | 'sala3'
  simulateAsymmetric: false, // Permite previsualizar cómo se comporta la grilla cuando un taller dura menos
  blocksIndex: new Map() // Mapa id -> datos del bloque para abrir el modal
};

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
        timeline.push(createAutoFillerBlock(cursor, bStart, room, `${room.id}-gap-${idx}`));
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

  // ¿Queda tiempo libre al final de la tanda en esta sala? (Ej: un taller que dura 90 min en vez de 120 min)
  if (cursor < tandaEnd) {
    const remainingMins = tandaEnd - cursor;
    if (remainingMins >= scheduleConfig.minGapMinutesToFill && scheduleConfig.autoFillGaps) {
      timeline.push(createAutoFillerBlock(cursor, tandaEnd, room, `${room.id}-end-filler`));
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

function createAutoFillerBlock(startMins, endMins, room, id) {
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
    title: EVENT_DATA.scheduleConfig.defaultFillerTitle,
    speaker: 'Comunidad GDG Santiago & Speakers',
    affiliation: 'Dinámica Abierta',
    badge: 'FLEXIBLE',
    badgeColor: room.color,
    avatar: 'panel',
    roomLabel: room.name,
    description: EVENT_DATA.scheduleConfig.defaultFillerDescription,
    tags: ['Q&A Extendido', 'Networking', 'Bloque Flexible'],
    techLogos: ['community', 'ai']
  };
}

/**
 * Clona los datos de las tandas y, si el modo de demostración asimétrica está activo,
 * acorta un par de talleres para mostrar cómo se adapta el layout con bloques de relleno.
 */
function getEffectiveTandas() {
  const cloned = JSON.parse(JSON.stringify(EVENT_DATA.schedule.tandas));
  if (!state.simulateAsymmetric) {
    return cloned;
  }

  // En modo simulación:
  // 1) En Tanda 1, Sala 1 (Lucía Subatin) dura 90 min (09:15–10:45) + 30 min de bloque de relleno (10:45–11:15)
  const t1Sala1 = cloned[0].tracks.sala1[0];
  t1Sala1.endTime = '10:45';
  t1Sala1.durationNote = '90 minutos (Ajustado) · Preguntas incluidas';
  cloned[0].tracks.sala1.push({
    id: 't1-sala1-filler-demo',
    type: 'filler',
    formatLabel: 'BLOQUE DE RELLENO',
    startTime: '10:45',
    endTime: '11:15',
    durationNote: '30 minutos · Actividad complementaria',
    title: 'Clinic de Código & Q&A Abierto de Cloud',
    speaker: 'Mentores GDG Santiago',
    affiliation: 'Bloque de Relleno',
    badge: '30 MIN EXTRA',
    badgeColor: 'red',
    avatar: 'panel',
    roomLabel: 'SALA 1',
    description: 'Ejemplo de bloque de relleno (30 min) agregado cuando un taller finaliza a las 10:45 en lugar de las 11:15. El programa ajusta proporcionalmente la altura de cada bloque sin asumir simetría fija.',
    tags: ['Bloque de Relleno', 'Q&A', 'Networking'],
    techLogos: ['cloud', 'community']
  });

  // 2) En Tanda 2, Sala 2 (Ranse Vidal) termina a las 13:05 (90 min) y el motor auto-rellena 13:05–13:35
  const t2Sala2 = cloned[1].tracks.sala2[0];
  t2Sala2.endTime = '13:05';
  t2Sala2.durationNote = '90 minutos (Ajustado) · Auto-relleno activo';

  return cloned;
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
    const cast = [
      { key: 'mikaeri', name: 'Mikaeri', badge: 'Google' },
      { key: 'devpicon', name: 'Armando', badge: 'GDE/GDG' },
      { key: 'lucia', name: 'Lucía', badge: 'Google' },
      { key: 'alvaro', name: 'Álvaro', badge: 'GDE' },
      { key: 'lesly', name: 'Lesly', badge: 'GDE' },
      { key: 'eduardo', name: 'Eduardo', badge: 'Datadog' },
      { key: 'julio', name: 'Julio', badge: 'GDE' },
      { key: 'ranse', name: 'Ranse', badge: 'GDE' },
      { key: 'jimmy', name: 'Jimmy', badge: 'GDE' }
    ];

    kunioParade.innerHTML = cast
      .map(
        char => `
        <div class="kunio-stage-card" title="${char.name} (${char.badge})">
          ${renderKunioCharacter(char.key, 'kunio-sm')}
          <span class="kunio-stage-name">${char.name}</span>
        </div>
      `
      )
      .join('');
  }
}

/**
 * Renderiza un bloque plenario (Apertura, Pausa común o Cierre)
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
        <span class="time-pill">${block.startTime} – ${block.endTime}</span>
        <span class="duration-micro">${durationMinutes} MIN</span>
      </div>
      <div class="plenary-avatar-col">
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
 * Renderiza una tarjeta de sesión dentro de una columna de Sala (Charla, Taller, Panel o Relleno)
 */
function renderTrackBlockCard(block, room) {
  if (block.type === 'transition') {
    return `
      <div class="track-transition-slot" style="--slot-mins: ${block.durationMinutes}; flex-grow: ${block.durationMinutes};" title="Intervalo de transición de ${block.durationMinutes} minutos">
        <span class="transition-text">⏱ ${block.startTime}–${block.endTime} · Intervalo de transición (${block.durationMinutes}m)</span>
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

  return `
    <article
      class="schedule-block-card ${typeClass} ${colorClass}"
      style="--slot-mins: ${block.durationMinutes}; flex-grow: ${block.durationMinutes};"
      data-block-id="${block.id}"
      tabindex="0"
      role="button"
      aria-label="${block.formatLabel}: ${block.title} por ${block.speaker}, de ${block.startTime} a ${block.endTime}"
    >
      <div class="block-card-header">
        <span class="block-time-badge">${block.startTime} – ${block.endTime}</span>
        <span class="block-duration-pill">${block.durationMinutes} MIN</span>
      </div>

      <div class="block-type-row">
        <span class="block-format-chip">${block.formatLabel}</span>
        <span class="block-affiliation-chip badge-${block.badgeColor || room.color}">${block.badge}</span>
      </div>

      <div class="block-main-body">
        <div class="block-speaker-row">
          <div class="block-avatar-frame">
            ${renderKunioCharacter(block.avatar, 'kunio-sm')}
          </div>
          <div class="block-speaker-meta">
            <h4 class="block-speaker-name">${block.speaker}</h4>
            ${block.moderators ? `<p class="block-moderators">${block.moderators}</p>` : ''}
            <p class="block-duration-note">${block.durationNote || `${block.durationMinutes} minutos`}</p>
          </div>
        </div>

        <h3 class="block-talk-title">${block.title}</h3>
      </div>

      <div class="block-card-footer">
        <div class="block-tech-icons">${techIconsHtml}</div>
        <div class="block-tags-list">${tagsHtml}</div>
        <div class="block-cta-row">
          <span class="press-start-hint">▶ PULSAR PARA VER DETALLE</span>
        </div>
      </div>
    </article>
  `;
}

/**
 * Renderiza una Tanda completa con sus 4 columnas de Salas proporcionales al tiempo
 */
function renderTandaSection(tanda) {
  const totalTandaMins = timeToMinutes(tanda.endTime) - timeToMinutes(tanda.startTime);

  // Regla de tiempo lateral (cada 15 o 30 minutos)
  const timeTicks = [];
  const startM = timeToMinutes(tanda.startTime);
  const endM = timeToMinutes(tanda.endTime);
  for (let m = startM; m <= endM; m += 30) {
    timeTicks.push(minutesToTime(m));
  }

  const visibleRooms = EVENT_DATA.rooms.filter(
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
        EVENT_DATA.scheduleConfig
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

      <p class="tanda-footnote">ℹ️ ${tanda.note}</p>
    </section>
  `;
}

/**
 * Renderiza toda la Agenda / Programa
 */
function renderFullSchedule() {
  const container = document.getElementById('schedule-root');
  if (!container) return;

  state.blocksIndex.clear();
  const effectiveTandas = getEffectiveTandas();

  const openingHtml = renderPlenaryCard(EVENT_DATA.schedule.opening);
  const tanda1Html = renderTandaSection(effectiveTandas[0]);
  const breakHtml = renderPlenaryCard(EVENT_DATA.schedule.commonBreak);
  const tanda2Html = renderTandaSection(effectiveTandas[1]);
  const closingHtml = renderPlenaryCard(EVENT_DATA.schedule.closing);

  container.innerHTML = `
    ${openingHtml}
    ${tanda1Html}
    ${breakHtml}
    ${tanda2Html}
    ${closingHtml}
  `;

  // Asignar eventos de clic y teclado a cada bloque del programa
  container.querySelectorAll('[data-block-id]').forEach(el => {
    el.addEventListener('click', () => {
      const blockId = el.getAttribute('data-block-id');
      openSessionModal(blockId);
    });
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const blockId = el.getAttribute('data-block-id');
        openSessionModal(blockId);
      }
    });
  });
}

/**
 * Abre el Modal 8-Bits con el avatar en movimiento del charlista, descripción, tags y logos
 */
function openSessionModal(blockId) {
  const block = state.blocksIndex.get(blockId);
  if (!block) return;

  const modal = document.getElementById('session-modal');
  const modalBody = document.getElementById('session-modal-body');
  if (!modal || !modalBody) return;

  const techBadgesHtml = (block.techLogos || [])
    .map(key => renderTechBadge(key, true))
    .join('');

  const tagsHtml = (block.tags || [])
    .map(tag => `<span class="modal-tag-chip">#${tag}</span>`)
    .join('');

  const sessionizeBtn = block.sessionizeUrl
    ? `<a href="${block.sessionizeUrl}" target="_blank" rel="noopener noreferrer" class="btn-8bit btn-8bit-secondary">🔗 VER EN SESSIONIZE</a>`
    : '';

  modalBody.innerHTML = `
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
        </div>
        <h2 class="modal-talk-title">${block.title}</h2>
        <p class="modal-speaker-line">👤 <strong>${block.speaker}</strong> ${block.affiliation ? `· <span>${block.affiliation}</span>` : ''}</p>
        ${block.moderators ? `<p class="modal-moderators-line">🎙️ ${block.moderators}</p>` : ''}
        ${block.durationNote ? `<p class="modal-duration-detail">⏱️ ${block.durationNote}</p>` : ''}
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

    <div class="modal-actions-footer">
      <a href="${EVENT_DATA.meta.registrationUrl}" target="_blank" rel="noopener noreferrer" class="btn-8bit btn-8bit-primary">
        🎟️ REGISTRARSE EN LUMA
      </a>
      ${sessionizeBtn}
      <button type="button" class="btn-8bit btn-8bit-ghost" id="modal-close-action">
        ✕ CERRAR VENTANA
      </button>
    </div>
  `;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  const closeActionBtn = document.getElementById('modal-close-action');
  if (closeActionBtn) {
    closeActionBtn.addEventListener('click', closeSessionModal);
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
 * Inicializa filtros de salas y el simulador de bloques asimétricos
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

  const asymmetricToggle = document.getElementById('toggle-asymmetric-demo');
  if (asymmetricToggle) {
    asymmetricToggle.addEventListener('click', () => {
      state.simulateAsymmetric = !state.simulateAsymmetric;
      asymmetricToggle.classList.toggle('is-active', state.simulateAsymmetric);
      asymmetricToggle.innerHTML = state.simulateAsymmetric
        ? '⚡ MODO ASIMÉTRICO ACTIVO (VER HORARIO ORIGINAL)'
        : '🛠️ PROBAR TALLER CORTO + BLOQUE DE RELLENO';
      renderFullSchedule();
    });
  }

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

document.addEventListener('DOMContentLoaded', () => {
  initMarquee();
  initHeroSprites();
  renderFullSchedule();
  initScheduleControls();
  initSponsorsRender();
});
