function agregarServicioModal() {

    const anterior = document.getElementById('agregarServicioModal');
    if (anterior) anterior.remove();

    // Crear contenido HTML del modal
    const agregarServicioModalHTML = `
<div class="modal fade" id="agregarServicioModal" tabindex="-1" aria-labelledby="tituloServicio" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloServicio">Agregar Servicio</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body text-center" style="background-color: #dff0ff; border-radius: 0 0 1rem 1rem;">
        <p class="mb-4 fs-5 fw-semibold">Ingrese los siguientes datos:</p>

        <div class="row mb-3 text-start">
          <div class="col-12">
            <label for="inputID" class="form-label fw-semibold">ID:</label>
            <input type="text" id="inputID" class="form-control" placeholder="ID del servicio">
          </div>
        </div>

        <div class="row mb-3 text-start">
          <div class="col-12">
            <label for="inputConcepto" class="form-label fw-semibold">Concepto del servicio:</label>
            <input type="text" id="inputConcepto" class="form-control" placeholder="Ej: Agua, Luz...">
          </div>
        </div>

        <div class="row mb-3 text-start">
          <div class="col-12">
            <label for="inputDescripcion" class="form-label fw-semibold">Descripción:</label>
            <textarea id="inputDescripcion" class="form-control" rows="3" placeholder="Detalles del servicio"></textarea>
          </div>
        </div>

        <div class="row mb-4 text-start">
          <div class="col-12">
            <label for="inputCosto" class="form-label fw-semibold">Costo:</label>
            <input type="number" id="inputCosto" class="form-control" placeholder="Costo en pesos" min="0" step="100">
          </div>
        </div>

        <button type="button" class="btn btn-primary px-4" onclick="guardarServicio()">Aceptar</button>
      </div>

    </div>
  </div>
</div>


    `;
  
    // Insertar el modal en el body
    document.body.insertAdjacentHTML('beforeend', agregarServicioModalHTML);
  
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('agregarServicioModal'));
    modal.show();
  }


 