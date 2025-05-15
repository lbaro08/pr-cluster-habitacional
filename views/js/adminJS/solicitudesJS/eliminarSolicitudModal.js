function eliminarSolicitudModal() {

    const anterior = document.getElementById('eliminarSolicitudModal');
    if (anterior) anterior.remove();

    // Crear contenido HTML del modal
    const eliminarSolicitudModalHTML = `
<div class="modal fade" id="eliminarSolicitudModal" tabindex="-1" aria-labelledby="tituloEliminarSolicitud" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloEliminarSolicitud">Eliminar Solicitud</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body text-center" style="background-color: #f8d7da; border-radius: 0 0 1rem 1rem;">
        <p class="mb-4 fs-5 fw-semibold">Ingrese la fecha de la solicitud que desea eliminar:</p>
    
        <div class="row mb-3">
          <div class="col-12">
            <input 
              type="date" 
              id="inputFechaSolicitud" 
              class="form-control" 
              required>
          </div>
        </div>

        <button id="btnEliminarSolicitud" type="button" class="btn btn-danger px-4">Eliminar</button>
      </div>

    </div>
  </div>
</div>

    `;
  
    // Insertar el modal en el body
    document.body.insertAdjacentHTML('beforeend', eliminarSolicitudModalHTML);
  
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('eliminarSolicitudModal'));
    modal.show();

  // //////////////////////////////////////////////////////
  //                event listeenr
  // ////////////////////////////////////////////////////

  const btnEliminarSolicitud = document.getElementById("btnEliminarSolicitud");
  btnEliminarSolicitud.addEventListener('click',function(event){

    inputFechaSolicitud = document.getElementById('inputFechaSolicitud').value;
    genEliminarFechaSolicitud(inputFechaSolicitud);
    modal.hide();

  });// fin del btn event


  }


  function genEliminarFechaSolicitud(inputFechaSolicitud){

    console.log('Dato a enviar',inputFechaSolicitud)



  }

 