// =====================
// FACULTADES + CARRERAS
// =====================
// Listado oficial (usaremos su longitud para el conteo de carreras)
const FACULTADES = {
  arquitectura: {
    nombre: 'Arquitectura',
    carreras: [
      'Licenciatura en Arquitectura',
      'Licenciatura en Diseño Gráfico'
    ]
  },
  humanidades: {
    nombre: 'Humanidades',
    carreras: [
      'PEM En Pedagogía Y Técnico En Administración Educativa',
      'PEM en Pedagogía y Psicología',
      'PEM en Pedagogía y Ciencias de la Educación',
      'PEM en Matemática y Física',
      'PEM en Lenguaje e Historia',
      'Licenciatura en Psicología Educativa',
      'Licenciatura en Pedagogía y Administración Educativa',
      'Licenciatura en Psicología Clínica'
    ]
  },
  ingenieria: {
    nombre: 'Ingeniería',
    carreras: [
      'Ingeniería en Electrónica',
      'Ingeniería en Sistemas',
      'Ingeniería Industrial',
      'Ingeniería Civil'
    ]
  },
  derecho: {
    nombre: 'Derecho',
    carreras: [
      'Licenciatura en Ciencias Jurídicas y Sociales, Abogado y Notario'
    ]
  },
  economicas: {
    nombre: 'Ciencias Económicas',
    carreras: [
      'Licenciatura en Administración de Empresas',
      'Licenciatura en Contaduría Pública y Auditoría',
      'Licenciatura en Mercadotecnia'
    ]
  },
  salud: {
    nombre: 'Ciencias de la Salud',
    carreras: [
      'Técnico en Enfermería',
      'Licenciatura en Enfermería'
    ]
  }
};

// ---------------------
// Compatibilidad: si tu inicio.js aún no define los slots de facultades,
// crea los espacios para que Repo.setFacultad pueda actualizar conteos.
(function ensureFacultadesExist(){
  try{
    const f = (window.Repo && Repo.state && Repo.state.facultades) ? Repo.state.facultades : null;
    if(!f) return;
    Object.keys(FACULTADES).forEach(k=>{
      if(!f[k]) f[k] = { trabajos:0, carreras:0 };
    });
  }catch(e){}
})();

// =====================
// CONFIGURACIÓN INICIAL
// =====================

// Establece el número de carreras según el listado oficial
Object.entries(FACULTADES).forEach(([key, val])=>{
  Repo.setFacultad(key, { carreras: (val.carreras||[]).length });
});

// Tarjetas por página (inicio)
Repo.setPerPage(6);

// =====================
// ARTÍCULOS / TRABAJOS
// =====================
// IMPORTANTE: cada trabajo tiene un id estable + detalleUrl.
// Para archivos por facultad, usa rutas relativas a /html, p.e.:
//   'ingenieria/ing-0001-nombre.html'     (archivo real en /html/ingenieria)
// Para artículos genéricos, puedes usar 'articulo.html?id=<id>' (en /html).

// Facultad de Ingeniería

Repo.addTrabajo({
  id: 'art-ing-0002',
  titulo: 'El papel de la inteligencia artificial en la optimización de procesos industriales',
  autor: 'A. Hernández',
  facultad: 'Ingeniería',
  facultadKey: 'ingenieria',
  carrera: 'Ingeniería en Sistemas',
  fecha: '2025-10-24',
  etiquetas: ['inteligencia artificial', 'automatización', 'industria 4.0', 'optimización'],
  portada: '../img/ingenieria/cover-ia-procesos.jpg',
  detalleUrl: 'html/ingenieria/ing-0002-inteligencia-artificial-en-la-optimizacion-de-procesos-industriales.html',
});

Repo.addTrabajo({
  id: 'art-ing-0003',
  titulo: 'Ciberseguridad en la era del Internet de las Cosas (IoT)',
  autor: 'L. Rodríguez',
  facultad: 'Ingeniería',
  facultadKey: 'ingenieria',
  carrera: 'Ingeniería en Sistemas',
  fecha: '2025-10-25',
  etiquetas: ['ciberseguridad', 'iot', 'seguridad', 'tecnología'],
  portada: '../img/ingenieria/cover-ciberseguridad-iot.jpg',
  detalleUrl: 'ingenieria/ing-0003-ciberseguridad-en-la-era-del-internet-de-las-cosas.html',
});

Repo.addTrabajo({
  id: 'art-ing-0004',
  titulo: 'Energías renovables: innovación tecnológica para un futuro sostenible',
  autor: 'C. Morales',
  facultad: 'Ingeniería',
  facultadKey: 'ingenieria',
  carrera: 'Ingeniería Industrial',
  fecha: '2025-10-25',
  etiquetas: ['energías renovables', 'tecnología', 'sostenibilidad', 'smart grids'],
  portada: '../img/ingenieria/cover-energias-renovables.jpg',
  detalleUrl: 'ingenieria/ing-0004-energias-renovables-innovacion-tecnologica.html',
});

Repo.addTrabajo({
  id: 'art-ing-0005',
  titulo: 'Automatización industrial inteligente: integración de sensores, robótica y análisis de datos',
  autor: 'E. Castillo',
  facultad: 'Ingeniería',
  facultadKey: 'ingenieria',
  carrera: 'Ingeniería Mecatrónica',
  fecha: '2025-10-27',
  etiquetas: ['automatización', 'tecnología'],
  portada: '../img/ingenieria/cover-agricultura-precision.jpg',
  detalleUrl: 'ingenieria/ing-0005-automatizacion-industrial-inteligente-integracion-de-sensores-robotica-y-analisis-de-datos.html',
});

Repo.addTrabajo({
  id: 'art-ing-0006',
  titulo: 'Desarrollo de software ético: desafíos y responsabilidad social del ingeniero',
  autor: 'S. Gómez',
  facultad: 'Ingeniería',
  facultadKey: 'ingenieria',
  carrera: 'Ingeniería en Sistemas',
  fecha: '2025-10-30',
  etiquetas: ['ética', 'software', 'responsabilidad social', 'tecnología'],
  portada: '../img/ingenieria/cover-software-etico.jpg',
  detalleUrl: 'ingenieria/ing-0006-desarrollo-de-software-etico-y-responsabilidad-social.html',
});

//Facultad de Arquitectura

Repo.addTrabajo({
  id: 'art-arq-0001',
  titulo: 'La evolución del diseño gráfico digital y su influencia en la comunicación visual contemporánea',
  autor: 'M. López',
  facultad: 'Arquitectura',
  facultadKey: 'arquitectura',
  carrera: 'Diseño Gráfico',
  fecha: '2025-10-22',
  etiquetas: ['diseño digital', 'comunicación visual', 'tecnología', 'creatividad'],
  portada: '../img/arquitectura/cover-evolucion-diseno-grafico.jpg',
  detalleUrl: 'html/arquitectura/arq-0001-evolucion-del-diseno-grafico-digital.html',
});

Repo.addTrabajo({
  id: 'art-arq-0002',
  titulo: 'El color como elemento psicológico y comunicativo en la identidad visual de marca',
  autor: 'L. Martínez',
  facultad: 'Arquitectura',
  facultadKey: 'arquitectura',
  carrera: 'Diseño Gráfico',
  fecha: '2025-10-23',
  etiquetas: ['color', 'identidad visual', 'psicología del color', 'branding'],
  portada: '../img/arquitectura/cover-color-identidad-visual.jpg',
  detalleUrl: 'arquitectura/arq-0002-color-como-elemento-psicologico-en-la-identidad-visual.html',
});

Repo.addTrabajo({
  id: 'art-arq-0003',
  titulo: 'Tipografía y legibilidad: fundamentos esenciales en el diseño editorial moderno',
  autor: 'D. Ramírez',
  facultad: 'Arquitectura',
  facultadKey: 'arquitectura',
  carrera: 'Diseño Gráfico',
  fecha: '2025-10-24',
  etiquetas: ['tipografía', 'diseño editorial', 'legibilidad', 'publicaciones'],
  portada: '../img/arquitectura/cover-tipografia-legibilidad.jpg',
  detalleUrl: 'arquitectura/arq-0003-tipografia-y-legibilidad-en-el-diseno-editorial.html',
});

Repo.addTrabajo({
  id: 'art-arq-0004',
  titulo: 'El diseño gráfico sostenible: materiales, procesos y conciencia ambiental',
  autor: 'C. Hernández',
  facultad: 'Arquitectura',
  facultadKey: 'arquitectura',
  carrera: 'Diseño Gráfico',
  fecha: '2025-10-29',
  etiquetas: ['sostenibilidad', 'diseño responsable', 'ecología', 'procesos creativos'],
  portada: '../img/arquitectura/cover-diseno-sostenible.jpg',
  detalleUrl: 'arquitectura/arq-0004-diseno-grafico-sostenible-materiales-y-procesos.html',
});

Repo.addTrabajo({
  id: 'art-arq-0005',
  titulo: 'El impacto de la inteligencia artificial en los procesos creativos del diseñador gráfico',
  autor: 'E. Cabrera',
  facultad: 'Arquitectura',
  facultadKey: 'arquitectura',
  carrera: 'Diseño Gráfico',
  fecha: '2025-10-30',
  etiquetas: ['inteligencia artificial', 'creatividad', 'diseño digital', 'innovación'],
  portada: '../img/arquitectura/cover-ia-procesos-creativos.jpg',
  detalleUrl: 'arquitectura/arq-0005-impacto-de-la-inteligencia-artificial-en-el-diseno-grafico.html',
});


// (Opcional) ejemplos de nuevas facultades (puedes borrarlos si no los necesitas ahora)
/*
Repo.addTrabajo({
  id: 'art-007',
  titulo: 'Vivienda social sostenible en climas tropicales',
  autor: 'L. Ramírez',
  facultad: 'Arquitectura',
  facultadKey: 'arquitectura',
  carrera: 'Licenciatura en Arquitectura',
  anio: '2025',
  etiquetas: ['vivienda','sostenibilidad','tropical'],
  portada: '../img/cover-07.jpg',
  detalleUrl: 'articulo.html?id=art-007',
  pdfUrl: '../pdfs/vivienda-social-tropical.pdf'
});

Repo.addTrabajo({
  id: 'art-008',
  titulo: 'Protocolos de triage en atención primaria',
  autor: 'S. Gómez',
  facultad: 'Ciencias de la Salud',
  facultadKey: 'salud',
  carrera: 'Licenciatura en Enfermería',
  anio: '2024',
  etiquetas: ['triage','enfermería','atención primaria'],
  portada: '../img/cover-08.jpg',
  detalleUrl: 'articulo.html?id=art-008',
  pdfUrl: '../pdfs/triage-atencion-primaria.pdf'
});
*/

// =====================
// AVISOS (reemplaza NOTICIAS)
// =====================

(function ensureAvisosAPI(){
  if (!window.Repo) return;

  // Asegurar contenedor
  Repo.state.avisos = Repo.state.avisos || [];

  // API para agregar Avisos
  if (!Repo.addAviso) {
    Repo.addAviso = function(a){
      const norm = {
        id:         a.id || crypto.randomUUID(),
        titulo:     a.titulo || 'Aviso',
        subtitulo:  a.subtitulo || a.resumen || '',
        fecha:      a.fecha || '',
        etiquetas:  Array.isArray(a.etiquetas) ? a.etiquetas : (a.etiquetas ? [a.etiquetas] : []),
        // detalleUrl relativo a /html → ej: "avisos/avi-0001-mi-aviso.html"
        detalleUrl: a.detalleUrl || `avisos/${(a.id||'aviso').toLowerCase()}.html`,
        // Lista opcional de adjuntos: [{text:'Bases', href:'../pdfs/bases.pdf'}]
        adjuntos:   Array.isArray(a.adjuntos) ? a.adjuntos : []
      };
      Repo.state.avisos.push(norm);
      return norm.id;
    };
  }

  // Alias de compatibilidad: si quedó algún addNoticia viejo, lo redirigimos a addAviso
  if (!Repo.addNoticia) {
    Repo.addNoticia = function(n){
      return Repo.addAviso({
        id:        n.id || undefined,
        titulo:    n.titulo,
        subtitulo: n.resumen || '',
        fecha:     n.fecha || '',
        etiquetas: ['aviso'],
        detalleUrl: n.detalleUrl || 'avisos/aviso-generico.html'
      });
    };
  }
})();

// === Lista de Avisos ( /html/avisos/<archivo>.html con plantillaaviso.html) ===



Repo.addAviso({
  id: 'avi-0001',
  titulo: 'Lanzamiento oficial de la Plataforma Académica UDEO',
  subtitulo: 'La Universidad de Occidente presenta su repositorio digital de trabajos estudiantiles.',
  fecha: '06/11/2025',
  etiquetas: ['lanzamiento','oficial'],
  detalleUrl: 'avisos/avi-0001-lanzamiento-oficial.html'
});

// =====================
// PARCHE (opcional)
// =====================
// Si más adelante agregas trabajos sin id o sin detalleUrl,
// este bloque los normaliza automáticamente para que el enlace funcione.
(function(){
  if (!window.Repo || !Repo.state) return;
  (Repo.state.trabajos || []).forEach(t => {
    if (!t.id) t.id = crypto.randomUUID();
    if (!t.detalleUrl) t.detalleUrl = `articulo.html?id=${encodeURIComponent(t.id)}`;
  });
  // Refresca paginación/DOM
  Repo.setPerPage(Repo.state.ui?.perPage || 6);
})();
