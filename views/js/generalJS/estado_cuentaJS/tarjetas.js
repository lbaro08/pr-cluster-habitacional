const movimientos = [
    { tipo: 'abono', id: '#idcargo', monto: 1500, fecha: '2025-05-01', casa: 'BarcossBarcossBarcoss' },
    { tipo: 'cargo', id: '#idcargo', estado: "Aceptado", fecha: '2025-05-03', casa: 'papu papu despierta papu' },
    { tipo: 'abono', id: '#idcargo', monto: 2500, fecha: '2025-05-10', casa: 'vayale coooñooooooooo' },
    { tipo: 'cargo', id: '#idcargo', estado: "Rechazado", fecha: '2025-05-03', casa: 'papu papu despierta papu' }
  ];

const contenedor = document.getElementById('contenedor-movimientos');

movimientos.forEach(mov => {
  const fila = document.createElement('div');
  fila.className = 'd-flex align-items-stretch mb-3 gap-3';

  pagar = mov.tipo == "abono" ? true : false;

  const tarjeta = document.createElement('div');
  tarjeta.className = `card shadow-sm ${mov.tipo}`;
  tarjeta.style.flex = '1';

    if(pagar){
        tarjeta.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="text-uppercase text-start text-muted mb-2">Cargo: ${mov.id}</h6>
          <small>Casa: ${mov.casa}</small><br>
          <small>Fecha: ${mov.fecha}</small>
        </div>
        <div class="text-end">
          <div class="fs-4 fw-bold mb-3">
            Monto: $${mov.monto.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  `;
    }else{
        tarjeta.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="text-uppercase text-start text-muted mb-2">Cargo: ${mov.id}</h6>
          <small>Casa: ${mov.casa}</small><br>
          <small>Fecha: ${mov.fecha}</small>
        </div>
        <div class="text-end">
          <div class="fs-4 fw-bold mb-3">
            Estado: ${mov.estado}
          </div>
        </div>
      </div>
    </div>
  `;
    }

  const crearBotonDetalles = () => {
    const boton = document.createElement('button');
    boton.className = 'd-flex flex-column justify-content-center align-items-center px-3 btn btn-custom';
    boton.style.height = '100%';
    boton.innerHTML = `
      <img src="../../assets/pics/icon_ver.png" alt="Detalles" style="width: 32px; height: 32px; margin-bottom: 5px;">
      <span>Ver Detalles</span>
    `;

    return boton;
  };

  const crearBotonPagar = () => {
    const boton = document.createElement('button');
    boton.className = 'd-flex flex-column justify-content-center align-items-center px-3 btn btn-custom';
    boton.style.height = '100%';
    boton.innerHTML = `
      <img src="../../assets/pics/icon_pagar.png" alt="Detalles" style="width: 32px; height: 32px; margin-bottom: 5px;">
      <span>Pagar</span>
    `;

    return boton;
  };

  const boton1 = crearBotonDetalles();
  
  fila.appendChild(tarjeta);
  fila.appendChild(boton1);
  if(pagar){const boton2 = crearBotonPagar(); fila.appendChild(boton2);}

  contenedor.appendChild(fila);
});
