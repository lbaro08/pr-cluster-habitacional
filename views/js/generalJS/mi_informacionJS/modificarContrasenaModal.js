function modificarContrasenaModal() {

    const anterior = document.getElementById('modificarContrasenaModal');
    if (anterior) anterior.remove();

    // Crear contenido HTML del modal
    const modificarContrasenaModalHTML = `
<div class="modal fade" id="modificarContrasenaModal" tabindex="-1" aria-labelledby="tituloCambioContrasena" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloCambioContrasena">Cambiar Contraseña</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body text-center" style="background-color: #dff0ff; border-radius: 0 0 1rem 1rem;">
        <p class="mb-4 fs-5 fw-semibold">Ingrese los siguientes datos:</p>

        <div class="row mb-3">
          <div class="col-12">
            <input 
              type="password" 
              id="inputAntiguaContrasena" 
              class="form-control" 
              placeholder="Antigua Contraseña" 
              required>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-12">
            <input 
              type="password" 
              id="inputNuevaContrasena" 
              class="form-control" 
              placeholder="Nueva Contraseña" 
              required>
          </div>
        </div>

        <div class="row mb-3">
          <div class="col-12">
            <input 
              type="password" 
              id="inputConfirmarContrasena" 
              class="form-control" 
              placeholder="Confirmar Nueva Contraseña" 
              required>
          </div>
        </div>

        <button 
          type="button" 
          class="btn btn-primary px-4" 
          onclick="validarCambioContrasena()">Confirmar</button>
      </div>

    </div>
  </div>
</div>


    `;
  
    // Insertar el modal en el body
    document.body.insertAdjacentHTML('beforeend', modificarContrasenaModalHTML);
  
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modificarContrasenaModal'));
    modal.show();
  }


 