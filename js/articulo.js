// js/articulo.js
(function(){
  // ------------------------
  // Utilidades de rutas
  // ------------------------
  function getPathInfo(){
    const full = location.pathname.replace(/\\/g,'/');
    const i = full.lastIndexOf('/html/');
    const after = i>=0 ? full.substring(i + '/html/'.length) : '';
    const folder = after.includes('/') ? after.substring(0, after.lastIndexOf('/')) : '';
    const depth = folder ? folder.split('/').length : 0;

    const prefixHtml = depth ? '../'.repeat(depth) : '';
    const prefixRoot = '../'.repeat(depth + 1);
    const relFromHtml = after;

    return { depth, prefixHtml, prefixRoot, relFromHtml };
  }
  const PI = getPathInfo();

  function isAbs(u){ return /^(https?:)?\/\//i.test(u); }
  function toHtmlHref(u){
    if (!u) return '#';
    if (isAbs(u)) return u;
    if (/^\.\.\//.test(u)) return u;
    return PI.prefixHtml + u.replace(/^\/+/, '');
  }
  function toRootHref(u){
    if (!u) return '#';
    if (isAbs(u)) return u;
    if (u.startsWith('../../')) return u;
    if (u.startsWith('../')) return PI.prefixRoot + u.slice(3);
    return PI.prefixRoot + u.replace(/^\/+/, '');
  }

  const $  = (sel)=>document.querySelector(sel);
  const fnum = (n)=>Intl.NumberFormat('es-GT',{maximumFractionDigits:0}).format(n||0);
  const sanitize = (s)=> (s||'').toString().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  // ------------------------
  // Búsqueda del artículo
  // ------------------------
  function byId(id){
    return (window.Repo && Repo.state && Array.isArray(Repo.state.trabajos))
      ? Repo.state.trabajos.find(t => (t.id||'')===id)
      : null;
  }
  function byCurrentPath(){
    if (!window.Repo || !Repo.state) return null;
    const pool = Repo.state.trabajos || [];
    return pool.find(t => (t.detalleUrl||'').replace(/^\.\//,'') === PI.relFromHtml
                      || PI.relFromHtml.endsWith( (t.detalleUrl||'') ));
  }
  function getArticle(){
    if (window.ART_ID){
      const a = byId(String(window.ART_ID));
      if (a) return a;
    }
    const q = new URLSearchParams(location.search);
    const id = q.get('id');
    if (id){
      const a = byId(id);
      if (a) return a;
    }
    return byCurrentPath();
  }

  // ------------------------
  // APA Builder (auto)
  // ------------------------
  function normalizeName(name){
    // Intenta devolver "Apellido, A."
    if(!name) return '';
    const parts = name.trim().split(/\s+/);
    if(parts.length===1) return parts[0]; // ya viene como "A. García" o algo corto
    // Detecta si viene como "A. García" → ya está formateado
    if (/\b[A-ZÁÉÍÓÚÑ]\.\b/.test(parts[0])) return name;
    const last = parts.pop();
    const initials = parts.map(w=> (w[0]||'').toUpperCase() + '.').join(' ');
    return `${last}, ${initials}`.replace(/\s+/g,' ').trim();
  }
  function formatAuthors(art){
    // Acepta string "A. García, M. López" o array
    if(Array.isArray(art.autores) && art.autores.length){
      return art.autores.map(normalizeName).join(', ');
    }
    if(art.autor){
      // Puede venir "A. García" (ya formateado) o "Ana García" → normalizamos
      const many = String(art.autor).split(/\s*,\s*|\s*;\s*/).filter(Boolean);
      return many.map(normalizeName).join(', ');
    }
    return '—';
  }
  function buildAPACitation(art){
    const autores = formatAuthors(art);
    const anio = art.anio || art.fecha || 's.f.';
    const titulo = art.titulo || 'Sin título';
    const tipo = art.tipo || 'Artículo académico';
    const carrera = art.carrera ? `, ${art.carrera}` : '';
    const facultad = art.facultad ? `, ${art.facultad}` : '';
    const inst = 'Universidad de Occidente — Sede Mazatenango';
    // URL del artículo actual
    const url = (location.origin ? location.origin : '') + location.pathname;
    return `${autores} (${anio}). ${titulo}. [${tipo}${carrera}${facultad}]. ${inst}. ${url}`;
  }

  // ------------------------
  // UI helpers
  // ------------------------
  function setChips(containerSel, items){
    const cont = $(containerSel);
    if (!cont) return;
    cont.innerHTML = (items||[]).map(e=>`<span class="chip">${sanitize(e)}</span>`).join('') || '';
  }
  function facKeyToLanding(fk){
    const map = {
      ingenieria:  'ingenieria.html',
      economicas:  'economicas.html',
      humanidades: 'humanidades.html',
      derecho:     'derecho.html',
      arquitectura:'arquitectura.html',
      salud:       'salud.html'
    };
    const file = map[(fk||'').toLowerCase()] || 'facultades.html';
    return PI.prefixHtml + file;
  }
  function cardHTML(t){
    const img = toRootHref(t.portada || '../img/placeholder-cover.jpg');
    const det = t.detalleUrl ? toHtmlHref(t.detalleUrl) : '#';
    const pdf = t.pdfUrl ? toRootHref(t.pdfUrl) : null;
    return `
      <article class="card card--hover">
        <div class="card__media"><img src="${img}" alt="Portada"></div>
        <div class="card__body">
          <h3 class="card__title">${t.titulo||'Trabajo académico'}</h3>
          <div class="card__meta">
            <span class="badge">${t.carrera||''}</span>
            <span class="badge">${t.anio||''}</span>
          </div>
          <p class="util-muted">Autor: ${t.autor||''}</p>
        </div>
        <div class="card__footer">
          <a class="btn btn--ghost" href="${det}">Ver detalle</a>
          ${pdf ? `<a class="btn btn--primary" href="${pdf}" target="_blank" rel="noopener">Descargar PDF</a>`:''}
        </div>
      </article>`;
  }
  function renderRelacionados(art){
    const wrap = $('#cards-relacionados');
    if (!wrap || !window.Repo || !Repo.state) return;
    const fac = (art.facultadKey||'').toLowerCase();
    const relacionados = (Repo.state.trabajos||[])
      .filter(t => (t.facultadKey||'').toLowerCase()===fac && (t.id!==art.id))
      .sort((a,b)=> String(b.anio).localeCompare(String(a.anio)))
      .slice(0,6);
    wrap.innerHTML = relacionados.map(cardHTML).join('') || '<p class="util-muted">Sin artículos relacionados.</p>';
  }

  // ------------------------
  // Render principal
  // ------------------------
  function render(){
    const art = getArticle();
    if (!art){
      const t = $('#art-titulo');     if (t) t.textContent = 'Artículo no encontrado';
      const s = $('#art-subtitulo');  if (s) s.textContent = 'Verifica el identificador o la ruta del archivo.';
      return;
    }

    // Título del documento
    const title = `${art.titulo} — Plataforma Académica UDEO`;
    const docTitle = document.getElementById('doc-title');
    if (docTitle) docTitle.textContent = title;
    document.title = title;

    // Migas + botones
    const bcFacs = $('#bc-facultad'); if (bcFacs) bcFacs.href = PI.prefixHtml + 'facultades.html';
    const bcCar = $('#bc-carrera');   if (bcCar) bcCar.textContent = art.carrera || 'Carrera';
    const btnFac = $('#btn-ver-facultad'); if (btnFac) btnFac.href = facKeyToLanding(art.facultadKey);

    const btnVolver = $('#btn-volver');
    if (btnVolver) {
      btnVolver.addEventListener('click', (e)=>{
        e.preventDefault();
        if (history.length>1) history.back();
        else location.href = PI.prefixHtml + 'inicio.html';
      });
      btnVolver.setAttribute('href', PI.prefixHtml + 'inicio.html');
    }

    // Héroe / aside
    $('#art-titulo')   && ($('#art-titulo').textContent = art.titulo || 'Título del artículo');
    $('#art-subtitulo')&& ($('#art-subtitulo').textContent = art.subtitulo || art.linea || '');
    $('#art-facultad') && ($('#art-facultad').textContent = art.facultad || '');
    $('#art-carrera')  && ($('#art-carrera').textContent = art.carrera || '');
    $('#art-anio')     && ($('#art-anio').textContent = art.anio || '');
    $('#art-autores')  && ($('#art-autores').textContent = Array.isArray(art.autores)?art.autores.join(', '):(art.autor||'—'));
    $('#art-tipo')     && ($('#art-tipo').textContent = art.tipo || 'Artículo académico');
    setChips('#art-etiquetas', art.etiquetas || []);

    // Cita APA (usa la que venga; si no hay, la genera)
    const cita = art.citaAPA || art.cita || buildAPACitation(art);
    $('#art-cita-apa') && ($('#art-cita-apa').textContent = cita);

    // Metadatos
    $('#art-fecha')    && ($('#art-fecha').textContent = art.fecha || art.anio || '—');
    $('#art-licencia') && ($('#art-licencia').textContent = art.licencia || 'Todos los derechos reservados');
    $('#art-id')       && ($('#art-id').textContent = art.id || '—');

    // PDF
    const btnPdf = $('#btn-descargar');
    if (btnPdf) {
      if (art.pdfUrl) { btnPdf.setAttribute('href', toRootHref(art.pdfUrl)); btnPdf.removeAttribute('disabled'); }
      else { btnPdf.setAttribute('href', '#'); btnPdf.setAttribute('disabled', 'disabled'); }
    }

    // “Ver todos” → a la landing de su facultad (mejor UX)
    const verTodos = $('#btn-ver-todos');
    if (verTodos) verTodos.href = facKeyToLanding(art.facultadKey);

    // Relacionados
    renderRelacionados(art);
  }

  document.addEventListener('DOMContentLoaded', render);
})();
