////////////////////////////////////////////////////
// MODAL PRINCIPAL PARA REPORTES
//////////////////////////////////////////////////

function reporteModalMain() {
  // Elimina el modal anterior si existe
  const anterior = document.getElementById('reporteModalMain');
  if (anterior) anterior.remove();

  // Crear contenido HTML del modal
  const reporteModalMainHTML = `
<div class="modal fade" id="reporteModalMain" tabindex="-1" aria-labelledby="tituloModal" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloModal">Generar Reporte</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body text-center" style="background-color: #bcd0f6; border-radius: 0 0 1rem 1rem;">
        <p class="mb-4 fs-5 fw-semibold">¿Qué tipo de reporte desea generar?</p>

        <div class="row justify-content-center">
          <!-- Botón Mensual -->
          <div class="col-6 col-md-5 mb-3">
            <button type="button" class="btn w-100 p-3 bg-white rounded-4 shadow" onclick="generarReporteTipo('mensual')">
              <img src="../assets/pics/icon_mensual.png" alt="Mensual" class="img-fluid mb-2" style="height: 80px;">
              <div class="fw-bold">Mensual</div>
            </button>
          </div>

          <!-- Botón Anual -->
          <div class="col-6 col-md-5 mb-3">
            <button type="button" class="btn w-100 p-3 bg-white rounded-4 shadow" onclick="generarReporteTipo('anual')">
              <img src="../assets/pics/icon_manual.png" alt="Anual" class="img-fluid mb-2" style="height: 80px;">
              <div class="fw-bold">Anual</div>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>
  `;

  // Insertar el modal en el body
  document.body.insertAdjacentHTML('beforeend', reporteModalMainHTML);

  // Mostrar el modal
  const modal = new bootstrap.Modal(document.getElementById('reporteModalMain'));
  modal.show();
}

////////////////////////////////////////////////////
// FUNCION AUXILIAR PARA LOS BOTONES DEL MODAL ANTERIOR
// DECIDEN QUE 2DO MODAL ABRIR (AÑO/MENSUAL)
//////////////////////////////////////////////////
function generarReporteTipo(tipo) {
  if (tipo === 'mensual') {
    reporteModalMensual();
  } else if (tipo === 'anual') {
    reporteModalAnual();
  }
}


////////////////////////////////////////////////////
// MODAL PARA SELECCIONAL EL MES
//////////////////////////////////////////////////

function reporteModalMensual() {
  // Elimina el modal anterior si existe
  const anterior = document.getElementById('reporteModalMain');
  if (anterior) {
    const instancia = bootstrap.Modal.getInstance(anterior) || new bootstrap.Modal(anterior);
    instancia.hide();
    // Espera un poco antes de removerlo para que se cierre correctamente
    setTimeout(() => anterior.remove(), 500);
  }

  const modalMensualHTML = `
<div class="modal fade" id="modalMensual" tabindex="-1" aria-labelledby="tituloMensual" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloMensual">Seleccionar Mes</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body text-center" style="background-color: #dff0ff; border-radius: 0 0 1rem 1rem;">
        <p class="mb-4 fs-5 fw-semibold">Seleccione el mes para el reporte:</p>

        <select id="mesSeleccionado" class="form-select mb-4">
          <option value="" disabled selected>Seleccione un mes</option>
          <option value="01">Enero</option>
          <option value="02">Febrero</option>
          <option value="03">Marzo</option>
          <option value="04">Abril</option>
          <option value="05">Mayo</option>
          <option value="06">Junio</option>
          <option value="07">Julio</option>
          <option value="08">Agosto</option>
          <option value="09">Septiembre</option>
          <option value="10">Octubre</option>
          <option value="11">Noviembre</option>
          <option value="12">Diciembre</option>
        </select>

        <button type="button" class="btn btn-primary px-4" onclick="generarReporteMensual()">Generar</button>
      </div>

    </div>
  </div>
</div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalMensualHTML);
  const modal = new bootstrap.Modal(document.getElementById('modalMensual'));
  modal.show();
}

////////////////////////////////////////////////////
// MODAL PARA SELECCIONAR EL AÑO SOLO 5 ANTERIORES AL ACTUAL
//////////////////////////////////////////////////
function reporteModalAnual() {
  // Elimina el modal anterior si existe
  const anterior = document.getElementById('reporteModalMain');
  if (anterior) {
    const instancia = bootstrap.Modal.getInstance(anterior) || new bootstrap.Modal(anterior);
    instancia.hide();
    // Espera un poco antes de removerlo para que se cierre correctamente
    setTimeout(() => anterior.remove(), 500);
  }

  const añoActual = new Date().getFullYear();
  let opcionesAños = '<option value="" disabled selected>Seleccione un año</option>';
  
  for (let i = 0; i < 6; i++) {
    const año = añoActual - i;
    opcionesAños += `<option value="${año}">${año}</option>`;
  }
  
  const modalAnualHTML = `
  <div class="modal fade" id="modalAnual" tabindex="-1" aria-labelledby="tituloAnual" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content rounded-4 border-0 shadow">
  
        <div class="modal-header border-0">
          <h5 class="modal-title w-100 text-center" id="tituloAnual">Seleccionar Año</h5>
          <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
        </div>
  
        <div class="modal-body text-center" style="background-color: #dff0ff; border-radius: 0 0 1rem 1rem;">
          <p class="mb-4 fs-5 fw-semibold">Seleccione el año para el reporte:</p>
  
          <select id="anioSeleccionado" class="form-select mb-4">
            ${opcionesAños}
          </select>
  
          <button type="button" class="btn btn-primary px-4" onclick="generarReporteAnual()">Generar</button>
        </div>
  
      </div>
    </div>
  </div>
  `;
  

  document.body.insertAdjacentHTML('beforeend', modalAnualHTML);
  const modal = new bootstrap.Modal(document.getElementById('modalAnual'));
  modal.show();
}


////////////////////////////////////////////////////
// FUNCIONES PARA GENERAR LA NUEVA PAGINA POR MES
//////////////////////////////////////////////////

function generarReporteMensual(){

  window.location.href = `../..//views/templates/adminTemplates/reportesTemplates/reportes.html`;
  
}

function generarReporteAnual(){

  window.location.href = `../..//views/templates/adminTemplates/reportesTemplates/reportes.html`;
  
}