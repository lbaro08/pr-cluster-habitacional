let pagoSeleccionado = null;
document.addEventListener("DOMContentLoaded", function () {
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
  
  if (!usuarioLogueado || !usuarioLogueado.rfc) {
    console.error("No hay usuario logueado o no tiene RFC");
    return;
  }

  const rfc = usuarioLogueado.rfc;
  console.log(rfc);

  // Función para cargar y mostrar los pagos
  function cargarPagos() {
    fetch(`../../../../api/recibo.php`)
      .then(response => response.json())
      .then(pagos => {
        if (pagos.error) {
          console.error("Error en la respuesta:", pagos.error);
          return;
        }
        console.log("Datos obtenidos",pagos);
        renderizarPagos(Array.isArray(pagos) ? pagos : [pagos]);
      })
      .catch(error => {
        console.error("Error al cargar pagos:", error);
      });
  }

  // Función para renderizar los pagos en el contenedor
  function renderizarPagos(pagos) {
    const contenedor = document.getElementById('contenedor-pagos');
    contenedor.innerHTML = "";

    pagos.forEach(pago => {
      const fila = document.createElement('div');
      fila.className = 'd-flex align-items-stretch mb-3 gap-3';

      const tarjeta = document.createElement('div');
      tarjeta.className = 'card shadow-sm';
      tarjeta.style.flex = '1';

      tarjeta.innerHTML = `
 <div class="d-flex align-items-center bg-primary bg-opacity-25 p-4 rounded-pill mb-2 mt-2 shadow-sm">
  <div class="flex-grow-1 text-start text-dark">
    <div class="d-flex justify-content-between mb-3">
      <strong class="fs-3">Abono: ${pago.r_id_cxc}</strong>
      <strong class="fs-3">Monto: $${pago.r_monto}</strong>
    </div>
    <div class="mb-3 fs-4">🏠 Casa: <span class="fw-bold">${pago.cxc_calle_casa}/${pago.cxc_numero_casa}</span></div>
    <div class="d-flex justify-content-between align-items-center">
      <div class="fs-4">📅 Fecha de Peticion: <span class="fw-bold">${pago.r_fecha_peticion}</span></div>
    </div>
  </div>

</div>
      `;

      const boton = crearBotonVerificar(pago);
      
      fila.appendChild(tarjeta);
      fila.appendChild(boton);
      contenedor.appendChild(fila);
    });
  }

  // Función para crear el botón de verificación
  function crearBotonVerificar(pago) {
    pagoSeleccionado = pago;
    const boton = document.createElement('button');
    boton.className = 'd-flex flex-column justify-content-center align-items-center px-3 btn';
    boton.style.height = '100%';
    boton.innerHTML = `
      <img src="../../../assets/pics/icon_verificar.png" alt="Detalles" style="width: 32px; height: 32px; margin-bottom: 5px;">
      <span>Verificar</span>
    `;
    boton.setAttribute('data-bs-toggle', 'modal');
    boton.setAttribute('data-bs-target', '#modalVerificarPago');

    boton.addEventListener('click', () => {
      const modalBody = document.getElementById('modal-body-content');
      modalBody.innerHTML = `
        <p><strong>Folio:</strong> ${pago.r_id_cxc}</p>
        <p><strong>Cliente:</strong> ${pago.r_rfc_usuario_cliente}</p>
        <p><strong>Dirección:</strong> ${pago.cxc_calle_casa} ${pago.cxc_numero_casa}</p>
        <p><strong>Fecha:</strong> ${pago.r_fecha_peticion}</p>
        <p><strong>Monto:</strong> $${parseFloat(pago.r_monto).toFixed(2)}</p>
      `;
    });

    return boton;
  }

  // Inicializar modales
  const modalVerificarPago = new bootstrap.Modal(document.getElementById('modalVerificarPago'));
  const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));

  document.getElementById('modalVerificarPago').addEventListener('shown.bs.modal', () => {
    const btnAbrirSegundaModal = document.getElementById('abrirSegundaModalBtn');
    const btnRechazarPago = document.getElementById('btnRechazarPago');

    if (btnAbrirSegundaModal) {
      btnAbrirSegundaModal.addEventListener('click', () => {
        validacionActual = "1";
        modalVerificarPago.hide();
        modalConfirmacion.show();

      });
    }

    if(btnRechazarPago){
      btnRechazarPago.addEventListener('click',() =>{
        validacionActual = "0";
        modalVerificarPago.hide();
        modalConfirmacion.show();


      });
    }


  });// fin de modal


const btnConfirmar = document.getElementById('confirmarBtn');
if (btnConfirmar) {
  btnConfirmar.addEventListener('click', () => {
    const inputKeyPass = document.getElementById('inputPalabraConfirmacion').value.trim().toLowerCase();

    if (inputKeyPass !== "confirmar") {
      alert('❌ Debes escribir la palabra "confirmar" exactamente para continuar.');
      return;
    }

   
    validacioJSON = {
      r_id_cxc:pagoSeleccionado.r_id_cxc,
      r_folio:pagoSeleccionado.r_folio,
      r_status:validacionActual,
      r_rfc_usuario_verificador:usuarioLogueado.rfc,
      accion:'validar'

    }

            fetch('../../../../api/recibo.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(validacioJSON)
        })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('✅ Pago validado correctamente.');
            this.location.reload();
            // Puedes recargar los datos u ocultar el modal, etc.
          } else {
            alert('❌ Error al validar el pago: ' + (data.message || data.error));
          }
        })
        .catch(error => {
          console.error('Error al validar el pago:', error);
          alert('❌ Ocurrió un error al validar el pago.');
        });



  });
}





  // Cargar los pagos al iniciar
  cargarPagos();
});