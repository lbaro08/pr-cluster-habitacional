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
            <label for="inputId" class="form-label fw-semibold">ID:</label>
            <input type="text" id="inputIdAgregar" class="form-control" placeholder="ID del servicio">
          </div>
        </div>

        <div class="row mb-3 text-start">
          <div class="col-12">
            <label for="inputConcepto" class="form-label fw-semibold">Concepto del servicio:</label>
            <input type="text" id="inputConceptoAgregar" class="form-control" placeholder="Ej: Agua, Luz...">
          </div>
        </div>

        <div class="row mb-3 text-start">
          <div class="col-12">
            <label for="inputDescripcion" class="form-label fw-semibold">Descripción:</label>
            <textarea id="inputDescripcionAgregar" class="form-control" rows="3" placeholder="Detalles del servicio"></textarea>
          </div>
        </div>

        <div class="row mb-4 text-start">
          <div class="col-12">
            <label for="inputCosto" class="form-label fw-semibold">Costo:</label>
            <input type="number" id="inputCostoAgregar" class="form-control" placeholder="Costo en pesos" min="0" step="100">
          </div>
        </div>

        <button id="btnAgregarServicio" type="button" class="btn btn-primary px-4" onclick="">Aceptar</button>
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

// event listener para el botonsitoooooooooooooooooo
///////////////////////////////////////////////////
    const btnAgregarServicio = document.getElementById('btnAgregarServicio');
    btnAgregarServicio.addEventListener('click',function(evenet){

      const inputId = document.getElementById('inputIdAgregar').value;
      const inputConcepto = document.getElementById('inputConceptoAgregar').value;
      const inputDescripcion = document.getElementById('inputDescripcionAgregar').value;
      const inputCosto = document.getElementById('inputCostoAgregar').value;

      // Validaciones (mismos regex del PHP)
      const validaciones = {
        id: /^[A-Za-z0-9]{4}$/.test(inputId),
        nombre: /^[A-Za-zÑñ ]{1,10}$/.test(inputConcepto),
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
      genAgregarServicio(inputId,inputConcepto,inputDescripcion,inputCosto);


    });
  
  
  
  }


  function genAgregarServicio(inputId,inputConcepto,inputDescripcion,inputCosto){


    agregarServicioJSON = {

    cg_id:inputId,
    cg_nombre:inputConcepto,
    cg_descripcion:inputDescripcion,
    cg_costo:inputCosto,

    }

    console.log("Datos a enviar:", agregarServicioJSON);


    fetch("/api/cargo.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(agregarServicioJSON)
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


 