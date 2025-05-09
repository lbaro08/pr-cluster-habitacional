
function inquilinoModal(opc) {

    const anterior = document.getElementById('inquilinoModal');
    if (anterior) anterior.remove();


    switch (opc) {
        case 1:
            titulo = 'Agregar Inquilino';
            textoBoton = 'Asignar';
            break;
        case 0:
            titulo = 'Revocar Inquilino';
            textoBoton = 'Revocar';
            break;
        case 2:
            titulo = 'Cambiar Propietario';
            textoBoton = 'Cambiar';
            break;
        default:
            titulo = 'Acción Desconocida';
            textoBoton = 'Realizar Acción';
            break;
    }

    // Crear contenido HTML del modal
    const inquilinoModalHTML = `
<div class="modal fade" id="inquilinoModal" tabindex="-1" aria-labelledby="tituloDireccion" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloDireccion">${titulo}</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body text-center" style="background-color: #dff0ff; border-radius: 0 0 1rem 1rem;">
        <p class="mb-4 fs-5 fw-semibold">Ingrese los siguientes datos:</p>

        <div class="row mb-3">
          <div class="col-6">
            <input type="text" id="inputCalle" class="form-control" placeholder="Calle">
          </div>
          <div class="col-6">
            <input type="text" id="inputNumeroCasa" class="form-control" placeholder="Número" pattern="[0-9]{3}">
            
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-12">
          <input 
            type="text" 
            id="inputRFC" 
            class="form-control" 
            placeholder="RFC del cliente" 
            maxlength="13" 
            pattern="[A-Za-z0-9]{13}" 
            required 
            title="El RFC debe tener exactamente 13 caracteres alfanuméricos">
            
          </div>
        </div>

        <button type="button" class="btn btn-primary px-4" onclick="peticionInquilino(${opc})">${textoBoton}</button>
      </div>

    </div>
  </div>
</div>
    `;
  
    // Insertar el modal en el body
    document.body.insertAdjacentHTML('beforeend', inquilinoModalHTML);
  
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('inquilinoModal'));
    modal.show();
  }

  

  

  function peticionInquilino(peticion){


    
    switch (peticion) {
        case 1:
            alert("Agregacion sepsi");
            break;
        case 0:
            alert("Eliminacion Sepsi");
            break;
        case 2:
            alert("Modificacion Sepsi");
            break;
        default:
            alert("ALC NO SE QUE PASO");
            break;
    }


  }