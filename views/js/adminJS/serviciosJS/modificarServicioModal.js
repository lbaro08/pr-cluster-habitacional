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
            <label for="inputI" class="form-label fw-semibold">ID del Servicio:</label>
            <input type="text" id="inputIdModificar" class="form-control" placeholder="ID">
          </div>
        </div>

        <button id='btnModificarServicio' type="button" class="btn btn-primary px-4" onclick="">Aceptar</button>
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
  // /////////////////////////////////////////////
  // event listener

  
// event listener para el botonsitoooooooooooooooooo
///////////////////////////////////////////////////
    const btnAgregarServicio = document.getElementById('btnModificarServicio');
    btnAgregarServicio.addEventListener('click',function(evenet){

      const inputId = document.getElementById('inputIdModificar').value;

      // Validaciones (mismos regex del PHP)
      const validaciones = {id: /^[A-Za-z0-9]{4}$/.test(inputId)};

      if (!validaciones.id) {
        alert("ID inválido (debe tener exactamente 4 caracteres alfanuméricos).");
        return;
      }
      recuperarServicio(inputId);


    });
  }


  function recuperarServicio(inputId){

    ///////////////////////////////////////////////////////////////////////////////////////
    // aqui se hace el show de conseguir los datos para re mandarlos al siguiente frame para pdoer modificarlos ejeje
    ///////////////////////////////////////////////////
    
    // cerramos el modal anterior
    const anterior = document.getElementById('modificarServicioMainModal');
    if (anterior) anterior.remove();


    fetch(`../../../../api/cargo.php?cg_id=${inputId}`, {
          method: "GET"
        })
        .then(async response => {
        if (!response.ok) {
          // Error HTTP (como 404 o 500)
          const errorData = await response.json();
          throw new Error(errorData.error || "Error desconocido en el servidor");
        }
        return response.json();
      })
      .then(cargo => {
        
        if (cargo.error) {
          console.error("Error:", cargo.error);
          alert(cargo.error); // Opcional: muestra alerta al usuario
          location.reload();
        } else {
          console.log("Cargo recibido:", cargo);
          modificarServicioDatosModal(cargo.cg_id,cargo.cg_nombre,cargo.cg_descripcion,cargo.cg_costo);
        }
      })
      .catch(error => {
        console.error("Fallo en la petición:", error.message);
        alert("Error al obtener el cargo: " + error.message);
      });
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
            <input type="text" id="inputIdModificar2" class="form-control" placeholder="ID del servicio" value="${d_id}" disabled>
          </div>
        </div>

        <div class="row mb-3 text-start">
          <div class="col-12">
            <label for="inputConcepto" class="form-label fw-semibold">Concepto del servicio:</label>
            <input type="text" id="inputConceptoModificar2" class="form-control" placeholder="Ej: Agua, Luz..." value="${d_concepto}">
          </div>
        </div>

        <div class="row mb-3 text-start">
          <div class="col-12">
            <label for="inputDescripcion" class="form-label fw-semibold">Descripción:</label>
            <textarea id="inputDescripcionModificar2" class="form-control" rows="3" placeholder="Detalles del servicio">${d_descripcion}</textarea>
          </div>
        </div>

        <div class="row mb-4 text-start">
          <div class="col-12">
            <label for="inputCosto" class="form-label fw-semibold">Costo:</label>
            <input type="number" id="inputCostoModificar2" class="form-control" placeholder="Costo en pesos" min="0" step="100" value="${d_costo}">
          </div>
        </div>

        <button id='btnAceptarModificarServicio' type="button" class="btn btn-primary px-4" onclick="">Aceptar</button>
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

// event listenet para aceptar cambios jjsjsjss


    // ///////////////////////////
    // event listener
    // ////////////////////////////////
    
    const btnAceptarModificarServicio = document.getElementById('btnAceptarModificarServicio');

    btnAceptarModificarServicio.addEventListener('click',function(evenet){

      const inputId = document.getElementById('inputIdModificar2').value;
      const inputNombre = document.getElementById('inputConceptoModificar2').value;
      const inputDescripcion = document.getElementById('inputDescripcionModificar2').value;
      const inputCosto = document.getElementById('inputCostoModificar2').value;
      
      // Validaciones (mismos regex del PHP)
      const validaciones = {
        id: /^[A-Za-z0-9]{4}$/.test(inputId),
        nombre: /^[A-Za-zÑñ ]{1,10}$/.test(inputNombre),
        descripcion: /^[A-Za-zÑñ0-9 ,.]{1,25}$/.test(inputDescripcion),
        costo: !isNaN(inputCosto) && Number(inputCosto) >= 0
      };

      if (!validaciones.id) {
        alert("ID inválido (debe tener exactamente 4 caracteres alfanuméricos).");
        return;
      }

      if (!validaciones.nombre) {
        alert("Concepto inválido (solo letras y espacios, máx. 10 caracteres).");
        return;
      }

      if (!validaciones.descripcion) {
        alert("Descripción inválida (máx. 25 caracteres, solo letras, números, espacios, coma y punto).");
        return;
      }

      if (!validaciones.costo) {
        alert("Costo inválido (debe ser un número mayor o igual a 0).");
        return;
      }
      genModificarServicio(inputId,inputNombre,inputDescripcion,inputCosto);
      
    });


  }


  function genModificarServicio(inputId,inputNombre,inputDescripcion,inputCosto){


    modificarServicioJSON = {

    cg_id:inputId,
    cg_nombre:inputNombre,
    cg_descripcion:inputDescripcion,
    cg_costo:inputCosto,

    }

    console.log("Datos a enviar:", modificarServicioJSON);


    fetch("../../../../api/cargo.php", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(modificarServicioJSON)
      })
        .then(response => response.json())
        .then(result => {
        console.log("Respuesta del servidor:", result);
          if (result.success) {
            alert("Cargo creado correctamente");
            location.reload(); // recargar la página para mostrar la nueva publicación
          } else {
            alert("Error: " + result.mensaje);
          }
        })
        .catch(error => {
          console.error("Error en la solicitud:", error);
        });






  }
