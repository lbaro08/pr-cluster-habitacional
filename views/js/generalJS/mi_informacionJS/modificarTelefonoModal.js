function modificarTelefonoModal() {

  const anterior = document.getElementById('modificarTelefonoModal');
  if (anterior) anterior.remove();

  // Crear contenido HTML del modal
  const modificarTelefonoModalHTML = `
<div class="modal fade" id="modificarTelefonoModal" tabindex="-1" aria-labelledby="tituloModificarTelefono" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloModificarTelefono">Modificar Teléfono</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body text-center" style="background-color: #dff0ff; border-radius: 0 0 1rem 1rem;">
        <p class="mb-4 fs-5 fw-semibold">Ingrese el nuevo teléfono:</p>
<form id="formModificarTelefono">
        <div class="row mb-3">
          <div class="col-12">
            <input 
              type="tel" 
              id="inputNuevoTelefono" 
              class="form-control" 
              placeholder="Nuevo teléfono" 
              required 
              pattern="[0-9]{10}"
              title="El teléfono debe contener exactamente 10 dígitos numéricos">
          </div>
        </div>

        <button id="btnModificarTelefono" type="button" class="btn btn-primary px-4" >Modificar</button>
      </div>
</form>
    </div>
  </div>
</div>

<script src="../../../bootstrap/js/bootstrap.bundle.min.js"></script>


    `;

  // Insertar el modal en el body
  document.body.insertAdjacentHTML('beforeend', modificarTelefonoModalHTML);

  // Mostrar el modal
  const modal = new bootstrap.Modal(document.getElementById('modificarTelefonoModal'));
  modal.show();

  // -------------------------
  // Evento del formulario
  // -------------------------

  const btnModificarTelefono = document.getElementById("btnModificarTelefono");
  btnModificarTelefono.addEventListener("click", function (event) {
    event.preventDefault();

    const inputNuevoTelefono = document.getElementById("inputNuevoTelefono").value;

    const regex = /^[0-9]{10}$/;

    if (!regex.test(inputNuevoTelefono)) {
      alert("El teléfono debe contener exactamente 10 dígitos numéricos");
      document.getElementById("inputNuevoTelefono").focus();
    }
    else {
      genModificarTelefono(inputNuevoTelefono);
      modal.hide();
    }


  });


}// fin del modal


function genModificarTelefono(inputNuevoTelefono) {
const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

  const modificar_usuario_telefonoJSON = {
    u_rfc: usuarioLogueado.rfc,
    u_telefono: inputNuevoTelefono
  };

  console.log("Datos a enviar:", modificar_usuario_telefonoJSON);

// ///////////////////////////////////SOLICITUD////////////////////////
    fetch('../../../api/usuario.php', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(modificar_usuario_telefonoJSON)
  })
    .then(res => res.json())
    .then(data => {
      console.log("Respuesta del servidor:", data);
      if (data.status) {
        // /////////////////////////
        // ////////////// SI TODO SALE BIEN
        console.log("Telefono modificado exitosamente");
        console.log("Nuevo telefono:", data.data.u_telefono);
        location.reload(); // Recarga la página actual

      } else {
        console.error("Error al modificar el nombre:", data.error);
      }
    })
    .catch(err => console.error(err));

}


