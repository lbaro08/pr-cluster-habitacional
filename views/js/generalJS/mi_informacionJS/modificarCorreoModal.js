function modificarCorreoModal() {

    const anterior = document.getElementById('modificarCorreoModal');
    if (anterior) anterior.remove();

    // Crear contenido HTML del modal
    const modificarCorreoModalHTML = `
<div class="modal fade" id="modificarCorreoModal" tabindex="-1" aria-labelledby="tituloModificarCorreo" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloModificarCorreo">Modificar Correo</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body text-center" style="background-color: #dff0ff; border-radius: 0 0 1rem 1rem;">
        <p class="mb-4 fs-5 fw-semibold">Ingrese el nuevo correo:</p>

        <div class="row mb-3">
          <div class="col-12">
            <input 
              type="email" 
              id="inputNuevoCorreo" 
              class="form-control" 
              placeholder="Nuevo correo" 
              required
              pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" 
              title="Por favor ingrese un correo electrónico válido">
          </div>
        </div>

        <button type="button" class="btn btn-primary px-4" onclick="modificarCorreo()">Modificar</button>
      </div>

    </div>
  </div>
</div>



    `;
  
    // Insertar el modal en el body
    document.body.insertAdjacentHTML('beforeend', modificarCorreoModalHTML);
  
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modificarCorreoModal'));
    modal.show();
  }


 