function cobrarServiciosModal() {

    const anterior = document.getElementById('cobrarServiciosModal');
    if (anterior) anterior.remove();

    // Crear contenido HTML del modal
    const cobrarServiciosModalHTML = `
<div class="modal fade" id="cobrarServiciosModal" tabindex="-1" aria-labelledby="tituloCobrarServicios" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloCobrarServicios">Cobrar Servicios</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body text-center" style="background-color: #dff0ff; border-radius: 0 0 1rem 1rem;">
        <p class="mb-4 fs-5 fw-semibold">Ingrese los siguientes datos:</p>

        <div class="row mb-3">
          <div class="col-12">
            <label for="fechaCobro" class="form-label">Fecha programada para cobrar el servicio:</label>
            <input type="date" id="fechaCobro" class="form-control">
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-12">
            <label for="diasProrroga" class="form-label">Fecha Limite de Pago:</label>
            <input type="date" id="fechaCobro" class="form-control">
          </div>
        </div>

        <button type="button" class="btn btn-primary px-4" onclick="confirmarCobro()">Aceptar</button>
      </div>

    </div>
  </div>
</div>



    `;
  
    // Insertar el modal en el body
    document.body.insertAdjacentHTML('beforeend', cobrarServiciosModalHTML);
  
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('cobrarServiciosModal'));
    modal.show();
  }
