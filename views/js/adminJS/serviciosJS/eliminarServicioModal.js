function eliminarServicioModal() {

    const anterior = document.getElementById('eliminarServicioModal');
    if (anterior) anterior.remove();

    // Crear contenido HTML del modal
    const eliminarServicioModalHTML = `
<div class="modal fade" id="eliminarServicioModal" tabindex="-1" aria-labelledby="tituloDireccion" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloDireccion">Eliminar Servicio</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body text-center" style="background-color: #dff0ff; border-radius: 0 0 1rem 1rem;">
        <p class="mb-4 fs-5 fw-semibold">Ingrese el ID del servicio a eliminar:</p>

        <div class="row mb-4 text-start">
          <div class="col-12">
            <label for="inputID" class="form-label fw-semibold">ID del Servicio:</label>
            <input type="text" id="inputIdEliminar" class="form-control" placeholder="ID">
          </div>
        </div>

        <button id="btnEliminarServicio" type="button" class="btn btn-danger px-4" onclick="">Eliminar</button>
      </div>

    </div>
  </div>
</div>


    `;
  
    // Insertar el modal en el body
    document.body.insertAdjacentHTML('beforeend', eliminarServicioModalHTML);
  
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('eliminarServicioModal'));
    modal.show();

    // ///////////////////////////
    // event listener
    // ////////////////////////////////
    
    const btnEliminarServicio = document.getElementById('btnEliminarServicio');

    btnEliminarServicio.addEventListener('click',function(evenet){

      const inputId = document.getElementById('inputIdEliminar').value;

      // Validaciones (mismos regex del PHP)
      const validaciones = {
        id: /^[A-Za-z0-9]{4}$/.test(inputId)

      };

      if (!validaciones.id) {
        alert("ID inválido (debe tener exactamente 4 caracteres alfanuméricos).");
        return;
      }

      genEliminarServicio(inputId);
      
    });
  
  }

  function genEliminarServicio(inputId){
    console.log(inputId)
    fetch(`../../../../api/cargo.php?cg_id=${inputId}`, {
      method: "DELETE"
    })
    .then(response => response.json())
        .then(result => {
        console.log("Respuesta del servidor:", result);
          if (result.success) {
            alert("Se elimino correctamente");
            location.reload(); // recargar la página para mostrar la nueva publicación
          } else {
            alert("Error: " + result.mensaje);
          }
        })
        .catch(error => {
          console.error("Error en la solicitud:", error);
        });

    
  }
