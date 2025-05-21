function cobrarServiciosModal() {

    const anterior = document.getElementById('cobrarServiciosModal');
    if (anterior) anterior.remove();

    // Crear contenido HTML del modal
    const cobrarServiciosModalHTML = `
<div class="modal fade" id="cobrarServiciosModal" tabindex="-1" aria-labelledby="tituloCobrarServicios" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloCobrarServicios">Cobrar Servicios</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body text-center" style="background-color: #dff0ff; border-radius: 0 0 1rem 1rem;">
        <p class="mb-4 fs-5 fw-semibold">Ingrese los siguientes datos:</p>

        <div class="row mb-3">
          <div class="col-12">
            <label for="fechaCobro" class="form-label">Fecha programada para cobrar el servicio:</label>
            <input type="date" id="inputFechaCobro" class="form-control">
          </div>
        </div>

        <div class="row mb-4">
          <div class="col-12">
            <label for="diasProrroga" class="form-label">Fecha Limite de Pago:</label>
            <input type="date" id="inputFechaLimite" class="form-control">
          </div>
        </div>

        <button id='btnCobrarServicios' type="button" class="btn btn-primary px-4" onclick="">Aceptar</button>
      </div>

    </div>
  </div>
</div>



    `;
  
    // Insertar el modal en el body
    document.body.insertAdjacentHTML('beforeend', cobrarServiciosModalHTML);
  
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('cobrarServiciosModal'));
    modal.show();

    // /////////////////////////////////////////////
    // ////////even listener

    const btnCobrarServicios = document.getElementById("btnCobrarServicios");
    btnCobrarServicios.addEventListener('click',function(){


      const inputFechaCobro = document.getElementById('inputFechaCobro').value;
      const inputFechaLimite = document.getElementById('inputFechaLimite').value;

      const date_cobro = new Date(inputFechaCobro);
      const date_limite = new Date(inputFechaLimite);
      const date_hoy = new Date();
      if(date_cobro>= date_hoy && date_limite>=date_cobro){genCobrarServicios(inputFechaCobro,inputFechaLimite);}
      else{
        alert("Error en Fecha:\n 1. La fecha debe ser posterior al dia de ayer\n 2. La fecha limite no puede ser anterior a la fecha de cobro");
        return;}

      


    });

  }


  function genCobrarServicios(inputFechaCobro,inputFechaLimite){

    cobroJSON = {
      accion:'cobrar_servicios',
      fecha_cobro : inputFechaCobro,
      fecha_limite : inputFechaLimite


    }
    console.log(cobroJSON);


    
    fetch("/api/cargo.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cobroJSON)
      })
        .then(response => response.json())
        .then(result => {
        console.log("Respuesta del servidor:", result);
          if (result.success) {
            alert("Cargos cobrados correctamente");
            location.reload(); // recargar la página para mostrar la nueva publicación
          } else {
            alert("Error: " + result.mensaje);
          }
        })
        .catch(error => {
          console.error("Error en la solicitud:", error);
        });

  }