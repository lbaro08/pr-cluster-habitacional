const contenedor = document.getElementById('contenedor-pagos');

pagos.forEach(mov => {
  const fila = document.createElement('div');
  fila.className = 'd-flex align-items-stretch mb-3 gap-3';

  const tarjeta = document.createElement('div');
  tarjeta.className = `card shadow-sm`;
  tarjeta.style.flex = '1';


    tarjeta.innerHTML = `
    <div class="card-body tarjeta">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="text-uppercase text-start text-muted mb-2">ID: ${mov.id}</h6>
          <small>Casa: ${mov.casa}</small><br>
          <small>Fecha: ${mov.fecha}</small>
        </div>
      </div>
    </div>
  `;

  const crearBoton = (mov) => {
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
      <p><strong>Cargo:</strong> ${mov.id}</p>
      <p><strong>Cliente:</strong> ${mov.cliente}</p>
      <p><strong>Folio:</strong> ${mov.folio}</p>
      <p><strong>Monto:</strong> ${mov.monto}</p>
    `;
  });

  return boton;
};



  const boton = crearBoton(mov);
  
  fila.appendChild(tarjeta);
  fila.appendChild(boton);

  contenedor.appendChild(fila);
});

document.addEventListener('DOMContentLoaded', () => {
  const modalVerificarPago = new bootstrap.Modal(document.getElementById('modalVerificarPago'));
  const modalConfirmacion = new bootstrap.Modal(document.getElementById('modalConfirmacion'));

  const modalElement = document.getElementById('modalVerificarPago');

  modalElement.addEventListener('shown.bs.modal', () => {
    const btnAbrirSegundaModal = document.getElementById('abrirSegundaModalBtn');
    if (btnAbrirSegundaModal) {
      btnAbrirSegundaModal.addEventListener('click', () => {
        modalVerificarPago.hide();
        modalConfirmacion.show();
      });
    }
  });
  const btnConfirmar = document.getElementById('confirmarBtn');
  btnConfirmar.addEventListener('click', () => {
    alert('Pago confirmado!');
    modalConfirmacion.hide();
  });
});

