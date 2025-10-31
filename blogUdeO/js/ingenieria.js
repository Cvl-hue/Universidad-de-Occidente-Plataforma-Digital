const ingState = {
  trabajos: [],
  metricas: { carreras: 0 },
  ui: { maxCards: Infinity, query: '' } // ← todos
};

const $ = {
  kpiTrabajos: document.getElementById('ing-kpi-trabajos'),
  kpiCarreras: document.getElementById('ing-kpi-carreras'),
  cards:       document.getElementById('cards-ultimos-ingenieria'),
  form:        document.getElementById('form-busqueda'),
  q:           document.getElementById('search-keywords'),
  btn:         document.getElementById('btn-search'),
  listaCarr:   document.getElementById('ing-lista-carreras')
};

// =====================
// Utilidades
// =====================
function fnum(n){ return Intl.NumberFormat('es-GT',{maximumFractionDigits:0}).format(n||0); }
function sanitize(s){ return (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase(); }
function match(item,query){
  if(!query) return true;
  const q = sanitize(query);
  const bag = [
    item.titulo, item.autor, item.carrera, item.anio,
    item.resumen, (item.etiquetas||[]).join(' ')
  ].map(sanitize).join(' ');
  return q.split(/\s+/).every(tok=>bag.includes(tok));
}

// =====================
// Render KPIs
// =====================
function renderKPIs(){
  if ($.kpiTrabajos) $.kpiTrabajos.textContent = fnum(ingState.trabajos.length);
  if ($.kpiCarreras) $.kpiCarreras.textContent = fnum(ingState.metricas.carreras || 0);
}

// =====================
// Cards de trabajos (todos)
// =====================
function card(t){
  const img=t.portada||'../img/placeholder-cover.jpg';
  const titulo=t.titulo||'Trabajo académico';
  const autor=t.autor||'';
  const anio=t.anio||'';
  const carrera=t.carrera||'';
  const det=t.detalleUrl||'#';
  const pdf=t.pdfUrl||'#';
  return `
  <article class="card card--hover">
    <div class="card__media"><img src="${img}" alt="Portada"></div>
    <div class="card__body">
      <h3 class="card__title">${titulo}</h3>
      <div class="card__meta">
        <span class="badge">${carrera}</span>
        <span class="badge">${anio}</span>
      </div>
      <p class="util-muted">Autor: ${autor}</p>
    </div>
    <div class="card__footer">
      <a class="btn btn--ghost" href="${det}">Ver detalle</a>
      <a class="btn btn--primary" href="${pdf}">Descargar PDF</a>
    </div>
  </article>`;
}

function renderCards(){
  const q = ingState.ui.query;
  const filtrados = ingState.trabajos
    .filter(t=>match(t,q))
    // Orden del más reciente al más antiguo
    .sort((a,b)=> String(b.anio).localeCompare(String(a.anio)));
  // Mostrar TODOS (sin slice)
  if ($.cards) $.cards.innerHTML = filtrados.map(card).join('') || '';
}

// =====================
// Carreras (lista)
// =====================
function getCarrerasIngenieria(){
  // Preferir FACULTADES (contenido-inicio.js) para la lista completa
  if (typeof FACULTADES !== 'undefined' && FACULTADES.ingenieria) {
    return Array.from(FACULTADES.ingenieria.carreras || []);
  }
  return [];
}

function renderCarreras(){
  if (!$.listaCarr) return;
  const carreras = getCarrerasIngenieria();

  // KPI carreras: si no vino desde Repo, usa la longitud de la lista
  if (!ingState.metricas.carreras) {
    Ing.setCarreras(carreras.length);
  }

  $.listaCarr.innerHTML = carreras.map(nombre => `
    <li>${nombre}</li>
  `).join('') || '<li class="util-muted">No hay carreras registradas.</li>';
}

// =====================
// Búsqueda local
// =====================
function handleSearch(){
  ingState.ui.query = ($.q && $.q.value || '').trim();
  renderCards();
}
function bindSearch(){
  if ($.btn) $.btn.addEventListener('click', handleSearch);
  if ($.q) $.q.addEventListener('keydown', e=>{
    if(e.key==='Enter'){ e.preventDefault(); handleSearch(); }
  });
}

// =====================
// Hidratación desde Repo
// =====================
function hydrateFromRepo(){
  if(!window.Repo || !Repo.state) return;

  // Trabajos de Ingeniería
  const trabajosIng = (Repo.state.trabajos||[])
    .filter(t => (t.facultadKey||'').toLowerCase()==='ingenieria');
  trabajosIng.forEach(t => Ing.addTrabajo(t));

  // Carreras desde Repo (conteo), si existe
  if (Repo.state.facultades && Repo.state.facultades.ingenieria) {
    const n = Number(Repo.state.facultades.ingenieria.carreras || 0);
    if (n) Ing.setCarreras(n);
  }
}

function hydrate(){
  renderKPIs();
  renderCards();
  renderCarreras();
}

// =====================
// API pública
// =====================
const Ing = {
  addTrabajo(t){
    ingState.trabajos.push({
      id:         t.id||crypto.randomUUID(),
      titulo:     t.titulo||'',
      autor:      t.autor||'',
      carrera:    t.carrera||'',
      anio:       t.anio||'',
      etiquetas:  t.etiquetas||[],
      resumen:    t.resumen||'',
      portada:    t.portada||'',
      detalleUrl: t.detalleUrl||'#',
      pdfUrl:     t.pdfUrl||'#'
    });
    renderKPIs();
    renderCards();
  },
  setCarreras(n){
    ingState.metricas.carreras = Number(n||0);
    renderKPIs();
  },
  setMaxCards(n){
    ingState.ui.maxCards = Math.max(1, Number(n)||5);
    renderCards();
  },
  buscar(q){
    if($.q){ $.q.value = q || ''; }
    ingState.ui.query = (q||'').trim();
    renderCards();
  },
  state: ingState
};

window.Ing = Ing;

// =====================
// Inicio
// =====================
document.addEventListener('DOMContentLoaded', ()=>{
  bindSearch();
  hydrateFromRepo();
  hydrate();
});
