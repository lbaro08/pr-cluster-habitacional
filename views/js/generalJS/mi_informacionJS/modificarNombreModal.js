function modificarNombreModal() {

  const anterior = document.getElementById('modificarNombreModal');
  if (anterior) anterior.remove();

  const modificarNombreModalHTML = `
<div class="modal fade" id="modificarNombreModal" tabindex="-1" aria-labelledby="tituloModificarNombre" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloModificarNombre">Modificar Nombre</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <form id="formModificarNombre">
        <div class="modal-body text-center" style="background-color: #dff0ff; border-radius: 0 0 1rem 1rem;">
          <p class="mb-4 fs-5 fw-semibold">Ingrese el nuevo nombre:</p>

          <div class="row mb-3">
            <div class="col-12">
              <input 
                type="text" 
                id="inputNuevoNombre" 
                class="form-control" 
                placeholder="Nuevo nombre" 
                required>
            </div>
          </div>

          <button id="btnModificarNombre" type="submit" class="btn btn-primary px-4">Modificar</button>
        </div>
      </form>

    </div>
  </div>
</div>
`;

  document.body.insertAdjacentHTML('beforeend', modificarNombreModalHTML);

  const modal = new bootstrap.Modal(document.getElementById('modificarNombreModal'));
  modal.show();

  // -------------------------
  // Evento del formulario
  // -------------------------
  const formModificarNombre = document.getElementById("formModificarNombre");
  formModificarNombre.addEventListener("submit", function(event) {
    event.preventDefault();

    const inputNuevoNombre = document.getElementById("inputNuevoNombre").value;

    genModificarNombre('rfc_usuario', inputNuevoNombre);
    modal.hide();
  });

} // cierre de la función


function genModificarNombre(usuario_rfc, inputNuevoNombre) {
  const modificarNombreJSON = [{
    u_rfc: usuario_rfc,
    u_nombre: inputNuevoNombre
  }];

  console.log("Datos a enviar:", modificarNombreJSON);


}
