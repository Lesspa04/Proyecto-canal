// Datos mock para sensores y alertas históricas (simula base de datos)
const datosSensores = [
    { fecha: '2023-10-15', sensorId: 'S001', nivel: 180, tipo: 'alta', acciones: 'Evacuación inmediata y cierre de vía' },
    { fecha: '2023-09-20', sensorId: 'S002', nivel: 90, tipo: 'media', acciones: 'Alerta a residentes y monitoreo intensivo' },
    { fecha: '2023-08-10', sensorId: 'S001', nivel: 40, tipo: 'baja', acciones: 'Registro normal, sin acciones' },
    { fecha: '2023-07-05', sensorId: 'S003', nivel: 220, tipo: 'alta', acciones: 'Activación de bombas de drenaje y notificación a autoridades' },
    { fecha: '2023-06-12', sensorId: 'S002', nivel: 120, tipo: 'media', acciones: 'Advertencia temprana enviada' }
];

// Elementos del DOM
const btnProyecto = document.getElementById('btn-proyecto');
const btnEmpresa = document.getElementById('btn-empresa');
const btnSensores = document.getElementById('btn-sensores');
const seccionProyecto = document.getElementById('seccion-proyecto');
const seccionEmpresa = document.getElementById('seccion-empresa');
const seccionSensores = document.getElementById('seccion-sensores');
const formBusqueda = document.getElementById('form-busqueda');
const tablaBody = document.getElementById('tbody-sensores');

// Función para ocultar todas las secciones y mostrar una específica
function mostrarSeccion(seccionMostrar, btnActivo) {
    // Ocultar todas
    seccionProyecto.classList.remove('seccion-activa');
    seccionProyecto.classList.add('seccion-oculta');
    seccionEmpresa.classList.remove('seccion-activa');
    seccionEmpresa.classList.add('seccion-oculta');
    seccionSensores.classList.remove('seccion-activa');
    seccionSensores.classList.add('seccion-oculta');
    
    // Remover activo de botones
    btnProyecto.classList.remove('activo');
    btnEmpresa.classList.remove('activo');
    btnSensores.classList.remove('activo');
    
    // Mostrar la seleccionada
    seccionMostrar.classList.add('seccion-activa');
    seccionMostrar.classList.remove('seccion-oculta');
    btnActivo.classList.add('activo');
    
    // Si es la sección de sensores, cargar datos iniciales
    if (seccionMostrar.id === 'seccion-sensores') {
        cargarSensores();
    }
}

// Navegación
btnProyecto.addEventListener('click', () => mostrarSeccion(seccionProyecto, btnProyecto));
btnEmpresa.addEventListener('click', () => mostrarSeccion(seccionEmpresa, btnEmpresa));
btnSensores.addEventListener('click', () => mostrarSeccion(seccionSensores, btnSensores));

// Función para cargar y filtrar datos de sensores
function cargarSensores(filtrarFecha = '', filtrarTipo = '') {
    const filtrados = datosSensores.filter(sensor => {
        const coincideFecha = !filtrarFecha || sensor.fecha === filtrarFecha;
        const coincideTipo = !filtrarTipo || sensor.tipo === filtrarTipo;
        return coincideFecha && coincideTipo;
    });

    tablaBody.innerHTML = ''; 

    if (filtrados.length === 0) {
        tablaBody.innerHTML = '<tr><td colspan="5">No se encontraron datos de sensores.</td></tr>';
        return;
    }

    filtrados.forEach(sensor => {
        const row = tablaBody.insertRow();
        row.insertCell(0).textContent = sensor.fecha;
        row.insertCell(1).textContent = sensor.sensorId;
        row.insertCell(2).textContent = sensor.nivel;
        row.insertCell(3).textContent = sensor.tipo.toUpperCase();
        row.insertCell(4).textContent = sensor.acciones;
    });
}
