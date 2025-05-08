function mostrarModalReporte() {
  // Elimina el modal anterior si existe
  const anterior = document.getElementById('modalGenerado');
  if (anterior) anterior.remove();

  // Crear contenido HTML del modal
  const modalHTML = `
<div class="modal fade" id="modalReporte" tabindex="-1" aria-labelledby="tituloModal" aria-hidden="true">
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
            <button type="button" class="btn w-100 p-3 bg-white rounded-4 shadow" onclick="generarReporte('mensual')">
              <img src="../../../../assets/pics/icon_mensual.png" alt="Mensual" class="img-fluid mb-2" style="height: 80px;">
              <div class="fw-bold">Mensual</div>
            </button>
          </div>

          <!-- Botón Anual -->
          <div class="col-6 col-md-5 mb-3">
            <button type="button" class="btn w-100 p-3 bg-white rounded-4 shadow" onclick="generarReporte('anual')">
              <img src="../assets/icons/calendar_year.png" alt="Anual" class="img-fluid mb-2" style="height: 80px;">
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
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Mostrar el modal
  const modal = new bootstrap.Modal(document.getElementById('modalReporte'));
  modal.show();
}

