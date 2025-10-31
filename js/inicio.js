// =====================
// Estado global de la app
// =====================
const appState = {
  trabajos: [],
  avisos: [],                 // <— avisos
  facultades: {
    arquitectura: { trabajos: 0, carreras: 0 },
    ingenieria:   { trabajos: 0, carreras: 0 },
    economicas:   { trabajos: 0, carreras: 0 },
    humanidades:  { trabajos: 0, carreras: 0 },
    derecho:      { trabajos: 0, carreras: 0 },
    salud:        { trabajos: 0, carreras: 0 }
  },
  metricas: { descargas: 0 },
  ui: { page: 1, perPage: 6, query: '' }
};

// =====================
// Cache de elementos
// =====================
const el = {
  // KPIs
  kpiTrabajos:   document.getElementById('kpi-trabajos'),
  kpiFacultades: document.getElementById('kpi-facultades'),
  kpiCarreras:   document.getElementById('kpi-carreras'),
  kpiDescargas:  document.getElementById('kpi-descargas'), // puede no existir en el HTML

  // Tarjetas trabajos + paginación
  cards: document.getElementById('cards-trabajos'),
  pag:   document.getElementById('paginacion-trabajos'),

  // Avisos (nuevo) + compat con "tabla-noticias" si existiera
  tablaAvisos:   document.getElementById('tabla-avisos'),
  tablaNoticias: document.getElementById('tabla-noticias'),

  // Búsqueda
  searchForm:  document.getElementById('form-busqueda'),
  searchInput: document.getElementById('search-keywords'),
  btnSearch:   document.getElementById('btn-search'),

  // Badges de facultad (Inicio → sección "Explorar por Facultad")
  facArqTrab: document.getElementById('fac-arq-trabajos'),
  facArqCarr: document.getElementById('fac-arq-carreras'),

  facIngTrab: document.getElementById('fac-ing-trabajos'),
  facIngCarr: document.getElementById('fac-ing-carreras'),

  facEcoTrab: document.getElementById('fac-eco-trabajos'),
  facEcoCarr: document.getElementById('fac-eco-carreras'),

  facHumTrab: document.getElementById('fac-hum-trabajos'),
  facHumCarr: document.getElementById('fac-hum-carreras'),

  facDerTrab: document.getElementById('fac-der-trabajos'),
  facDerCarr: document.getElementById('fac-der-carreras'),

  facSaludTrab: document.getElementById('fac-salud-trabajos'),
  facSaludCarr: document.getElementById('fac-salud-carreras')
};

// =====================
// Utils
// =====================
function fnum(n) {
  return Intl.NumberFormat('es-GT', { maximumFractionDigits: 0 }).format(n || 0);
}
function sanitize(s) {
  return (s || '').toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}
function matchKeywords(item, query) {
  if (!query) return true;
  const q = sanitize(query);
  const bag = [
    item.titulo,
    item.autor,
    item.facultad,
    item.carrera,
    item.fecha,          // <— buscamos por fecha (ISO o texto)
    item.resumen,
    (item.etiquetas || []).join(' ')
  ].map(sanitize).join(' ');
  return q.split(/\s+/).every(tok => bag.includes(tok));
}

// Soporta fechas en ISO (AAAA-MM-DD) y en dd/mm/aaaa o dd-mm-aaaa
function toMillisFromISOorLatam(s) {
  if (!s) return 0;
  const str = String(s).trim();

  // ISO YYYY-MM-DD
  const iso = str.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (iso) {
    const y = +iso[1], m = +iso[2] - 1, d = +iso[3];
    return new Date(y, m, d).getTime() || 0;
  }

  // dd/mm/yyyy o dd-mm-yyyy
  const latam = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (latam) {
    const d = +latam[1], mo = +latam[2] - 1, y = +latam[3];
    const year = y < 100 ? 2000 + y : y;
    return new Date(year, mo, d).getTime() || 0;
  }

  // Fallback: intentar Date parseable
  const t = Date.parse(str);
  return isNaN(t) ? 0 : t;
}

function formatFechaBadge(s) {
  if (!s) return '';
  // Si viene ISO, mostramos como "2025-10-30" tal cual (simple y consistente)
  // Si quieres más lindo: Intl.DateTimeFormat
  try {
    const ms = toMillisFromISOorLatam(s);
    if (!ms) return s;
    const dtf = new Intl.DateTimeFormat('es-GT', { year: 'numeric', month: 'short', day: '2-digit' });
    return dtf.format(new Date(ms));
  } catch {
    return s;
  }
}

// =====================
// Conteos por facultad
// =====================
function computeFacultadCounts() {
  Object.keys(appState.facultades).forEach(k => { appState.facultades[k].trabajos = 0; });

  appState.trabajos.forEach(t => {
    const k = (t.facultadKey || '').toLowerCase();
    if (appState.facultades[k]) {
      appState.facultades[k].trabajos++;
    }
  });
}

// =====================
// Render
// =====================
function renderKPIs() {
  const totTrab = appState.trabajos.length;
  const totFac  = Object.keys(appState.facultades).length;
  const totCarr = Object.values(appState.facultades).reduce((a, b) => a + (b.carreras || 0), 0);

  if (el.kpiTrabajos)   el.kpiTrabajos.textContent   = fnum(totTrab);
  if (el.kpiFacultades) el.kpiFacultades.textContent = fnum(totFac);
  if (el.kpiCarreras)   el.kpiCarreras.textContent   = fnum(totCarr);
  if (el.kpiDescargas)  el.kpiDescargas.textContent  = fnum(appState.metricas.descargas || 0); // opcional
}

function renderFacultadesMeta() {
  const set = (node, txt) => { if (node) node.textContent = txt; };

  set(el.facArqTrab,   fnum(appState.facultades.arquitectura.trabajos) + ' trabajos');
  set(el.facArqCarr,   fnum(appState.facultades.arquitectura.carreras) + ' carreras');

  set(el.facIngTrab,   fnum(appState.facultades.ingenieria.trabajos) + ' trabajos');
  set(el.facIngCarr,   fnum(appState.facultades.ingenieria.carreras) + ' carreras');

  set(el.facEcoTrab,   fnum(appState.facultades.economicas.trabajos) + ' trabajos');
  set(el.facEcoCarr,   fnum(appState.facultades.economicas.carreras) + ' carreras');

  set(el.facHumTrab,   fnum(appState.facultades.humanidades.trabajos) + ' trabajos');
  set(el.facHumCarr,   fnum(appState.facultades.humanidades.carreras) + ' carreras');

  set(el.facDerTrab,   fnum(appState.facultades.derecho.trabajos) + ' trabajos');
  set(el.facDerCarr,   fnum(appState.facultades.derecho.carreras) + ' carreras');

  set(el.facSaludTrab, fnum(appState.facultades.salud.trabajos) + ' trabajos');
  set(el.facSaludCarr, fnum(appState.facultades.salud.carreras) + ' carreras');
}

function cardTrabajoHTML(t) {
  const img    = t.portada || '../img/placeholder-cover.jpg';
  const fac    = t.facultad || '';
  const autor  = t.autor || '';
  const titulo = t.titulo || 'Trabajo académico';
  const det    = t.detalleUrl || '#';
  const pdf    = t.pdfUrl || '#';
  const fecha  = t.fecha || ''; // ahora usamos fecha
  const fechaBadge = formatFechaBadge(fecha);

  return `
  <article class="card card--hover">
    <div class="card__media"><img src="${img}" alt="Portada"></div>
    <div class="card__body">
      <h3 class="card__title">${titulo}</h3>
      <div class="card__meta">
        <span class="badge">${fac}</span>
        <span class="badge">${fechaBadge}</span>
      </div>
      <p class="util-muted">Autor: ${autor}</p>
    </div>
    <div class="card__footer">
      <a class="btn btn--ghost" href="${det}">Ver detalle</a>
      <a class="btn btn--primary" href="${pdf}">Descargar PDF</a>
    </div>
  </article>`;
}

function renderTrabajos() {
  const q = appState.ui.query;

  const filtrados = appState.trabajos
    .filter(t => matchKeywords(t, q))
    // Ordenar por fecha (más reciente primero). Compat: si no trae fecha, cae a 0.
    .sort((a, b) => {
      const ta = toMillisFromISOorLatam(a.fecha);
      const tb = toMillisFromISOorLatam(b.fecha);
      return tb - ta || String(b.titulo).localeCompare(String(a.titulo)); // desempate
    });

  const total = filtrados.length;
  const pages = Math.max(1, Math.ceil(total / appState.ui.perPage));
  if (appState.ui.page > pages) appState.ui.page = pages;
  const ini = (appState.ui.page - 1) * appState.ui.perPage;
  const pagData = filtrados.slice(ini, ini + appState.ui.perPage);

  if (el.cards) el.cards.innerHTML = pagData.map(cardTrabajoHTML).join('') || '';
  if (el.pag)   { el.pag.innerHTML = renderPaginacion(pages); bindPagEvents(); }
}

function renderPaginacion(pages) {
  let html = '';
  html += `<button class="page-btn" aria-label="Anterior"${appState.ui.page === 1 ? ' disabled' : ''}>«</button>`;
  for (let i = 1; i <= pages; i++) {
    html += `<button class="page-btn"${i === appState.ui.page ? ' aria-current="page"' : ''}>${i}</button>`;
  }
  html += `<button class="page-btn" aria-label="Siguiente"${appState.ui.page === pages ? ' disabled' : ''}>»</button>`;
  return html;
}

function bindPagEvents() {
  const btns = el.pag ? el.pag.querySelectorAll('.page-btn') : [];
  btns.forEach(b => {
    b.addEventListener('click', e => {
      const txt = e.currentTarget.textContent.trim();
      if (txt === '«') { if (appState.ui.page > 1) { appState.ui.page--; renderTrabajos(); } return; }
      if (txt === '»') {
        const max = Math.ceil(Math.max(1, appState.trabajos.filter(t => matchKeywords(t, appState.ui.query)).length) / appState.ui.perPage);
        if (appState.ui.page < max) { appState.ui.page++; renderTrabajos(); }
        return;
      }
      const n = parseInt(txt, 10);
      if (!isNaN(n)) { appState.ui.page = n; renderTrabajos(); }
    });
  });
}

// ===== Avisos (remplaza Noticias) =====
function renderAvisos() {
  // Acepta #tabla-avisos (nuevo) o #tabla-noticias (compat).
  const tbody = el.tablaAvisos || el.tablaNoticias;
  if (!tbody) return;

  const list = (appState.avisos || [])
    .slice()
    .sort((a,b)=> toMillisFromISOorLatam(b.fecha) - toMillisFromISOorLatam(a.fecha));

  tbody.innerHTML = list.map(a => `
    <tr>
      <td>${formatFechaBadge(a.fecha || '')}</td>
      <td>${a.titulo || ''}</td>
      <td>${a.subtitulo || a.resumen || ''}</td>
      <td><a class="btn btn--ghost" href="${a.detalleUrl || '#'}">Ver</a></td>
    </tr>
  `).join('') || `
    <tr><td colspan="4" class="util-muted">No hay avisos publicados todavía.</td></tr>
  `;
}

// =====================
// Búsqueda
// =====================
function handleSearch() {
  appState.ui.query = (el.searchInput && el.searchInput.value || '').trim();
  appState.ui.page = 1;
  renderTrabajos();
}

function bindSearch() {
  if (el.btnSearch) el.btnSearch.addEventListener('click', handleSearch);
  if (el.searchInput) el.searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); handleSearch(); }
  });
}

// =====================
// Ciclo de hidratación
// =====================
function hydrate() {
  computeFacultadCounts();
  renderKPIs();
  renderFacultadesMeta();
  renderTrabajos();
  renderAvisos();
}

// =====================
// API global Repo
// =====================
const Repo = {
  addTrabajo(t) {
    // Compat: si viene 'anio', lo convertimos a 'fecha' (1 de enero del anio)
    let fecha = t.fecha || '';
    if (!fecha && t.anio) {
      const y = String(t.anio).trim();
      fecha = /^\d{4}$/.test(y) ? `${y}-01-01` : y; // si no es AAAA, lo dejamos tal cual
    }

    appState.trabajos.push({
      id:          t.id || (crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      titulo:      t.titulo || '',
      autor:       t.autor || '',
      facultad:    t.facultad || '',
      facultadKey: t.facultadKey || '',
      carrera:     t.carrera || '',
      fecha,                           // <— ahora guardamos fecha
      etiquetas:   t.etiquetas || [],
      resumen:     t.resumen || '',
      portada:     t.portada || '',
      detalleUrl:  t.detalleUrl || '#',
      pdfUrl:      t.pdfUrl || '#'
    });
    computeFacultadCounts();
    renderKPIs();
    renderFacultadesMeta();
    renderTrabajos();
  },

  // Nuevo: Avisos
  addAviso(a) {
    appState.avisos.unshift({
      id:         a.id || (crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
      fecha:      a.fecha || '',
      titulo:     a.titulo || 'Aviso',
      subtitulo:  a.subtitulo || a.resumen || '',
      etiquetas:  Array.isArray(a.etiquetas) ? a.etiquetas : [],
      detalleUrl: a.detalleUrl || '#'
    });
    renderAvisos();
  },

  // Compat noticias → avisos
  addNoticia(n) {
    Repo.addAviso({
      id: n.id,
      fecha: n.fecha,
      titulo: n.titulo,
      subtitulo: n.resumen,
      detalleUrl: n.url
    });
  },

  setFacultad(key, { carreras }) {
    const k = (key || '').toLowerCase();
    if (!appState.facultades[k]) {
      appState.facultades[k] = { trabajos: 0, carreras: 0 };
    }
    appState.facultades[k].carreras = Number(carreras || 0);
    renderKPIs();
    renderFacultadesMeta();
  },

  setDescargas(n) {
    appState.metricas.descargas = Number(n || 0);
    renderKPIs();
  },

  setPerPage(n) {
    appState.ui.perPage = Math.max(1, Number(n) || 6);
    appState.ui.page = 1;
    renderTrabajos();
  },

  buscar(q) {
    if (el.searchInput) el.searchInput.value = q || '';
    handleSearch();
  },

  state: appState
};

window.Repo = Repo;

// =====================
// Inicio
// =====================
document.addEventListener('DOMContentLoaded', () => {
  bindSearch();
  hydrate();
});
