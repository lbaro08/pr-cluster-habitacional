function modificarServicioMainModal() {

    const anterior = document.getElementById('modificarServicioMainModal');
    if (anterior) anterior.remove();

    // Crear contenido HTML del modal
    const modificarServicioMainModalHTML = `
<div class="modal fade" id="modificarServicioMainModal" tabindex="-1" aria-labelledby="tituloDireccion" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloDireccion">Modificar Servicio</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body text-center" style="background-color: #dff0ff; border-radius: 0 0 1rem 1rem;">
        <p class="mb-4 fs-5 fw-semibold">Ingrese el ID del servicio que desea modificar:</p>

        <div class="row mb-4 text-start">
          <div class="col-12">
            <label for="inputID" class="form-label fw-semibold">ID del Servicio:</label>
            <input type="text" id="inputID" class="form-control" placeholder="ID">
          </div>
        </div>

        <button type="button" class="btn btn-primary px-4" onclick="recuperarServicio()">Aceptar</button>
      </div>

    </div>
  </div>
</div>


    `;
  
    // Insertar el modal en el body
    document.body.insertAdjacentHTML('beforeend', modificarServicioMainModalHTML);
  
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modificarServicioMainModal'));
    modal.show();
  }


  function recuperarServicio(){

    ///////////////////////////////////////////////////////////////////////////////////////
    // aqui se hace el show de conseguir los datos para re mandarlos al siguiente frame para pdoer modificarlos ejeje
    ///////////////////////////////////////////////////
    
    // cerramos el modal anterior
    const anterior = document.getElementById('modificarServicioMainModal');
    if (anterior) anterior.remove();


    id = "xxx";
    concepto = "piscina";
    descripcion = "lorem ipsum aominem centra jajajjaa";
    costo = "10"; 

    // llamamos al nuevo modal
    modificarServicioDatosModal(id,concepto,descripcion,costo);


  }
 
  function modificarServicioDatosModal(d_id,d_concepto,d_descripcion,d_costo) {

    const anterior = document.getElementById('modificarServicioDatosModal');
    if (anterior) anterior.remove();

    // Crear contenido HTML del modal
    const modificarServicioDatosModalHTML = `
<div class="modal fade" id="modificarServicioDatosModal" tabindex="-1" aria-labelledby="tituloServicio" aria-hidden="true">
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
            <input type="text" id="inputID" class="form-control" placeholder="ID del servicio" value="${d_id}">
          </div>
        </div>

        <div class="row mb-3 text-start">
          <div class="col-12">
            <label for="inputConcepto" class="form-label fw-semibold">Concepto del servicio:</label>
            <input type="text" id="inputConcepto" class="form-control" placeholder="Ej: Agua, Luz..." value="${d_concepto}">
          </div>
        </div>

        <div class="row mb-3 text-start">
          <div class="col-12">
            <label for="inputDescripcion" class="form-label fw-semibold">Descripción:</label>
            <textarea id="inputDescripcion" class="form-control" rows="3" placeholder="Detalles del servicio">${d_descripcion}</textarea>
          </div>
        </div>

        <div class="row mb-4 text-start">
          <div class="col-12">
            <label for="inputCosto" class="form-label fw-semibold">Costo:</label>
            <input type="number" id="inputCosto" class="form-control" placeholder="Costo en pesos" min="0" step="100" value="${d_costo}">
          </div>
        </div>

        <button type="button" class="btn btn-primary px-4" onclick="guardarServicio()">Aceptar</button>
      </div>

    </div>
  </div>
</div>


    `;
  
    // Insertar el modal en el body
    document.body.insertAdjacentHTML('beforeend', modificarServicioDatosModalHTML);
  
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modificarServicioDatosModal'));
    modal.show();
  }

