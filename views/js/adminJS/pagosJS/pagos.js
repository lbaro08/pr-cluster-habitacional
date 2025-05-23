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
    fetch(`/api/pago.php?tipo=por_usuario&rfc=${rfc}`)
      .then(response => response.json())
      .then(pagos => {
        if (pagos.error) {
          console.error("Error en la respuesta:", pagos.error);
          return;
        }

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
        <div class="card-body tarjeta">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="text-uppercase text-start text-muted mb-2">Folio: ${pago.p_folio}</h6>
              <small>Casa: ${pago.c_calle} ${pago.c_numero}</small><br>
              <small>Fecha: ${pago.p_fecha}</small><br>
              <small>Monto: $${parseFloat(pago.p_monto).toFixed(2)}</small>
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
        <p><strong>Folio:</strong> ${pago.p_folio}</p>
        <p><strong>Cliente:</strong> ${usuarioLogueado.nombre}</p>
        <p><strong>Dirección:</strong> ${pago.c_calle} ${pago.c_numero}</p>
        <p><strong>Fecha:</strong> ${pago.p_fecha}</p>
        <p><strong>Monto:</strong> $${parseFloat(pago.p_monto).toFixed(2)}</p>
      `;
    });

    return boton;
  }

  // Inicializar modales
  const modalVerificarPago = new bootstrap.Modal(document.getElementById('modalVerificarPago'));
  const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));

  document.getElementById('modalVerificarPago').addEventListener('shown.bs.modal', () => {
    const btnAbrirSegundaModal = document.getElementById('abrirSegundaModalBtn');
    if (btnAbrirSegundaModal) {
      btnAbrirSegundaModal.addEventListener('click', () => {
        modalVerificarPago.hide();
        modalConfirmacion.show();
      });
    }
  });

  document.getElementById('confirmarBtn').addEventListener('click', () => {
    alert('Pago confirmado!');
    modalConfirmacion.hide();
  });

  // Cargar los pagos al iniciar
  cargarPagos();
});