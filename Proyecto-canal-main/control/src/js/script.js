// ====================================
// Simulación de Base de Datos
// ====================================
class BaseDatosSensores {
  constructor() {
    this.sensores = [
      { fecha: '2025-11-10', sensorId: 'S002', nivel: 30, tipo: 'baja' },
      { fecha: '2025-10-15', sensorId: 'S001', nivel: 180, tipo: 'alta' },
      { fecha: '2025-09-20', sensorId: 'S002', nivel: 90, tipo: 'media' },
      { fecha: '2025-08-10', sensorId: 'S001', nivel: 100, tipo: 'media' },
      { fecha: '2025-07-25', sensorId: 'S003', nivel: 150, tipo: 'alta' },
      { fecha: '2025-07-10', sensorId: 'S002', nivel: 30, tipo: 'baja' },
      { fecha: '2025-06-15', sensorId: 'S001', nivel: 90, tipo: 'media' },
      { fecha: '2025-05-20', sensorId: 'S002', nivel: 90, tipo: 'media' },
      { fecha: '2025-04-10', sensorId: 'S001', nivel: 40, tipo: 'baja' },
      { fecha: '2025-03-05', sensorId: 'S003', nivel: 70, tipo: 'media' },
      { fecha: '2025-02-12', sensorId: 'S002', nivel: 120, tipo: 'media' },
      { fecha: '2025-01-15', sensorId: 'S002', nivel: 160, tipo: 'alta' },
    ];
  }

  filtrar(fecha, tipo) {
    return this.sensores.filter(s => {
      const coincideFecha = !fecha || s.fecha === fecha;
      const coincideTipo = !tipo || s.tipo === tipo;
      return coincideFecha && coincideTipo;
    });
  }
}

const db = new BaseDatosSensores();

// ====================================
// Elementos del DOM
// ====================================
const btnProyecto = document.getElementById('btn-proyecto');
const btnEmpresa = document.getElementById('btn-empresa');
const btnSensores = document.getElementById('btn-sensores');
const seccionProyecto = document.getElementById('seccion-proyecto');
const seccionEmpresa = document.getElementById('seccion-empresa');
const seccionSensores = document.getElementById('seccion-sensores');
const formBusqueda = document.getElementById('form-busqueda');
const tablaBody = document.getElementById('tbody-sensores');
const climaDiv = document.getElementById('clima-actual');

// ====================================
// Navegación
// ====================================
function mostrarSeccion(seccion, boton) {
  document.querySelectorAll('section').forEach(sec => sec.classList.add('seccion-oculta'));
  document.querySelectorAll('nav button').forEach(btn => btn.classList.remove('activo'));

  seccion.classList.remove('seccion-oculta');
  seccion.classList.add('seccion-activa');
  boton.classList.add('activo');

  if (seccion.id === 'seccion-sensores') {
    cargarSensores();
    cargarClima();
  }
}

btnProyecto.addEventListener('click', () => mostrarSeccion(seccionProyecto, btnProyecto));
btnEmpresa.addEventListener('click', () => mostrarSeccion(seccionEmpresa, btnEmpresa));
btnSensores.addEventListener('click', () => mostrarSeccion(seccionSensores, btnSensores));

// ====================================
// Cargar sensores + paginación + gráfica
// ====================================
let paginaActual = 1;
const registrosPorPagina = 10;

function cargarSensores(fecha = '', tipo = '') {
  const sensores = db.filtrar(fecha, tipo);
  mostrarPagina(sensores, 1);
  mostrarGrafica(sensores);

  formBusqueda.addEventListener('submit', e => {
  e.preventDefault();
  const fecha = document.getElementById('fecha').value;
  const tipo = document.getElementById('tipo').value;
  cargarSensores(fecha, tipo);
});
}

function mostrarPagina(sensores, pagina) {
  const inicio = (pagina - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const sensoresPagina = sensores.slice(inicio, fin);
  const totalPaginas = Math.ceil(sensores.length / registrosPorPagina);

  const tablaBody = document.getElementById('tbody-sensores');
  tablaBody.innerHTML = '';

  if (sensoresPagina.length === 0) {
    tablaBody.innerHTML = '<tr><td colspan="4">No se encontraron datos.</td></tr>';
  } else {
    sensoresPagina.forEach(s => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${s.fecha}</td>
        <td>${s.sensorId}</td>
        <td>${s.nivel} cm</td>
        <td><span class="badge ${s.tipo}">${s.tipo.toUpperCase()}</span></td>
      `;
      tablaBody.appendChild(row);
    });
  }

  mostrarBotonesPaginacion(totalPaginas, sensores);
}

function mostrarBotonesPaginacion(totalPaginas, sensores) {
  const contenedor = document.getElementById('paginacion');
  contenedor.innerHTML = '';

  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    if (i === paginaActual) btn.classList.add('activo');

    btn.addEventListener('click', () => {
      paginaActual = i;
      mostrarPagina(sensores, i);
    });

    contenedor.appendChild(btn);
  }
}

// ====================================
// Clima actual
// ====================================
async function cargarClima() {
  const lat = 4.669;
  const lon = -74.021;
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation,precipitation_probability&timezone=America/Bogota`;

  try {
    const resp = await fetch(url);
    const data = await resp.json();
    const clima = data.current_weather;

    // Buscar la hora actual
    const ahora = new Date().toISOString().slice(0, 13);
    const index = data.hourly.time.findIndex(h => h.startsWith(ahora));
    const lluvia = index !== -1 ? `${data.hourly.precipitation[index]} mm` : 'N/A';
    const probLluvia = index !== -1 && data.hourly.precipitation_probability
      ? `${data.hourly.precipitation_probability[index]}%`
      : 'N/A';

    const fechaHora = new Date(clima.time).toLocaleString('es-CO', {
      timeZone: 'America/Bogota',
      hour12: true,
    });

    climaDiv.innerHTML = `
      <h3>Clima actual San Luis</h3>
      <p><strong>Temperatura:</strong> ${clima.temperature} °C</p>
      <p><strong>Viento:</strong> ${clima.windspeed} km/h</p>
      <p><strong>Hora de actualización:</strong> ${fechaHora}</p>
    `;
  } catch {
    climaDiv.innerHTML = `<p style="color:red;">Error al cargar el clima.</p>`;
  }
}

// ====================================
// Gráfica con colores por nivel
// ====================================
function mostrarGrafica(sensores) {
  const ctx = document.getElementById('grafica-niveles').getContext('2d');
  if (window.graficaNiveles) window.graficaNiveles.destroy();

  const datosOrdenados = [...sensores].sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
  const fechas = datosOrdenados.map(s => s.fecha);
  const niveles = datosOrdenados.map(s => s.nivel);

  const coloresPuntos = datosOrdenados.map(s =>
    s.tipo === 'baja' ? 'rgba(0,200,0,0.8)' :
    s.tipo === 'media' ? 'rgba(255,200,0,0.9)' :
    'rgba(255,50,50,0.9)'
  );

  window.graficaNiveles = new Chart(ctx, {
    type: 'line',
    data: {
      labels: fechas,
      datasets: [{
        label: 'Nivel de agua (cm)',
        data: niveles,
        borderColor: 'rgba(0,100,255,0.6)',
        fill: true,
        tension: 0.3,
        pointRadius: 6,
        pointBackgroundColor: coloresPuntos,
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: 'Nivel (cm)' } },
        x: { title: { display: true, text: 'Fecha de medición' } }
      }
    }
  });
}

// ====================================
// Carga inicial
// ====================================
document.addEventListener('DOMContentLoaded', () => {
  mostrarSeccion(seccionProyecto, btnProyecto);
});
