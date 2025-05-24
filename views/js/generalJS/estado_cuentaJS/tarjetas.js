let idCxcSeleccionado = null;
let numero_casa = null;
let calle_casa = null;
let cargo = null;

document.addEventListener("DOMContentLoaded", function () {
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
  console.log("Usuario detectado al entrar:", usuarioLogueado);

  if (!usuarioLogueado || !usuarioLogueado.rfc) {
    console.error("No hay usuario logueado o no tiene RFC");
    return;
  }

  const rfc = usuarioLogueado.rfc;

  fetch(`/api/cxc.php?tipo=por_usuario&rfc=${rfc}`)
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error("Error en la respuesta:", data.error);
        return;
      }

      const movimientos = Array.isArray(data) ? data : [data];

      renderizarTarjetas(movimientos);
    })
    .catch(error => {
      console.error("Error al cargar movimientos:", error);
    });
});


function renderizarTarjetas(movimientos) {
  const contenedor = document.getElementById('contenedor-movimientos');
  contenedor.innerHTML = ""; // Limpiar contenido anterior

  // Calcular el saldo total sumando solo los cargos (no los abonos)
  let saldoTotal = 0;
  
  movimientos.forEach(mov => {
    if(mov.v_tipo == 'Cargo'||(mov.v_tipo == 'Abono' && mov.v_estado=='1') ) {
      saldoTotal += parseFloat(mov.v_monto) || 0;
    }
  });
  
  // Mostrar el saldo total
  document.getElementById('saldoActual').textContent = `$${saldoTotal.toFixed(2)}`;
console.log(movimientos);
  movimientos.forEach(mov => {
    const fila = document.createElement('div');
    fila.className = 'd-flex align-items-stretch mb-3 gap-3';



    const tarjeta = document.createElement('div');
    if(mov.v_tipo == 'Cargo'){
      tarjeta.className = `card shadow-sm cargo`;
      pagar = false;
    }else{
      tarjeta.className = `card shadow-sm abono`;
      pagar = true;
    }
    
    tarjeta.style.flex = '1';


    let estadoText = '';
    
    switch(mov.v_estado){
      case '1': {estadoText='Aceptado'; break;}
      case '0': {estadoText='Rechazado';break;}
      default: {estadoText='Pendiente';break;}
    }
  
    
    tarjeta.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h6 class="text-uppercase text-start text-muted mb-2">${mov.v_tipo}: ${mov.v_id_cxc}</h6>
            <small>Casa: ${mov.v_calle_casa || "N/A"} ${mov.v_numero_casa}</small><br>
            <small>Fecha: ${mov.v_fecha_pc || "N/A"}</small>
          </div>
          <div class="text-end">
            <div class="fs-4 fw-bold mb-3">
              ${!pagar ? `Monto: $${mov.v_monto}` : `Estado: ${estadoText|| "N/A"}`}
            </div>
          </div>
        </div>
      </div>
    `;

    const crearBotonDetallesCobro = (mov) => {
    const boton = document.createElement('button');
    boton.className = 'd-flex flex-column justify-content-center align-items-center px-3 btn btn-custom';
    boton.style.height = '100%';
    boton.innerHTML = `
      <img src="../../assets/pics/icon_ver.png" alt="Detalles" style="width: 32px; height: 32px; margin-bottom: 5px;">
      <span>Ver Detalles</span>
    `;

    boton.addEventListener('click', async () => {
      const cuerpoTabla = document.getElementById('tabla-detalles-body');
      cuerpoTabla.innerHTML = ""; // Limpiar tabla

      let total = 0;
      let i = 1;

      try {
        const res = await fetch(`/api/cxc.php?tipo=detalles_cxc&cxc_id=${mov.v_id_cxc}`);
        const detalles = await res.json();

        detalles.forEach(det => {
          const fila = document.createElement("tr");
          fila.innerHTML = `
            <td>${i}</td>
            <td>${det.cg_nombre} - ${det.cg_descripcion}</td>
            <td>$${parseFloat(det.cg_costo).toFixed(2)}</td>
          `;
          total += parseFloat(det.cg_costo);
          cuerpoTabla.appendChild(fila);
          i++;
        });

        document.getElementById('total').textContent = '$' + total.toFixed(2);
        const modalDetalles = new bootstrap.Modal(document.getElementById('modalDetallesCobro'));
        modalDetalles.show();
      } catch (error) {
        console.error('Error al obtener detalles del cargo:', error);
      }
    });

    return boton;
  };

  const crearBotonDetallesPago = (mov) => {
  const boton = document.createElement('button');
  boton.className = 'd-flex flex-column justify-content-center align-items-center px-3 btn btn-custom';
  boton.style.height = '100%';
  boton.innerHTML = `
    <img src="../../assets/pics/icon_ver.png" alt="Detalles" style="width: 32px; height: 32px; margin-bottom: 5px;">
    <span>Ver Detalles</span>
  `;

  boton.addEventListener('click', async () => {
    try {
      // Set the values in the modal
      document.getElementById('modal-idcargo').textContent = mov.v_id_cxc;
      document.getElementById('modal-casa').textContent = `${mov.v_calle_casa || "N/A"} ${mov.v_numero_casa || ""}`;
      document.getElementById('fechaPeticion').textContent = mov.v_fecha_pc || "-";
      document.getElementById('estado').textContent = mov.v_estado || "-";
      document.getElementById('fechaRevision').textContent = mov.v_fecha_revision || "-";
      document.getElementById('revision').textContent = mov.v_revisado_por || "-";
      document.getElementById('monto').textContent = `$${parseFloat(mov.v_monto || 0).toFixed(2)}`;

      const modalDetalles = new bootstrap.Modal(document.getElementById('modalDetallesPago'));
      modalDetalles.show();
    } catch (error) {
      console.error('Error al mostrar detalles del pago:', error);
    }
  });

  return boton;
};



    const crearBotonPagar = (mov) => {
      const boton = document.createElement('button');
      boton.className = 'd-flex flex-column justify-content-center align-items-center px-3 btn btn-custom';
      boton.style.height = '100%';
      boton.innerHTML = `
        <img src="../../assets/pics/icon_pagar.png" alt="Pagar" style="width: 32px; height: 32px; margin-bottom: 5px;">
        <span>Pagar</span>
      `;
      boton.addEventListener('click', () => {

        idCxcSeleccionado = mov.v_id_cxc;
        numero_casa = mov.v_numero_casa;
        calle_casa = mov.v_calle_casa;
        cargo = mov.v_monto;
        // Insertar valores en el modal
        document.getElementById('modal-idcargo').textContent = `$${mov.v_monto}`;
        document.getElementById('modal-casa').textContent = `${mov.v_calle_casa} ${mov.v_numero_casa}`;
        document.getElementById('modal-fecha').textContent = mov.v_fecha_pc;

        const modal = new bootstrap.Modal(document.getElementById('modalPago'));
        modal.show();
      });
      return boton;
    };




    fila.appendChild(tarjeta);
    if (!pagar) {
      const boton1 = crearBotonDetallesCobro(mov);
      fila.appendChild(boton1);
      const boton2 = crearBotonPagar(mov);
      fila.appendChild(boton2);
    }else{
      const boton1 = crearBotonDetallesPago(mov);
      fila.appendChild(boton1);
    }


    contenedor.appendChild(fila);
  });
}

document.getElementById("btnAceptar").addEventListener("click", async () => {
  const folio = document.getElementById("folio").value.trim();
  const usuario = JSON.parse(localStorage.getItem('usuarioLogueado'));

  if (!folio || !usuario.rfc || !idCxcSeleccionado) {
    alert("Faltan datos para registrar el pago.");
    return;
  }

  const datos = {
    id_cxc: idCxcSeleccionado,
    p_folio: folio,
    u_rfc: usuario.rfc,
    c_calle: calle_casa,
    c_numero: numero_casa,
    p_monto: cargo
  };

  try {
    const response = await fetch("/api/pago.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(datos)
    });

    const resultado = await response.json();

    if (resultado.success) {
      alert("Pago registrado exitosamente.");
    }
  } catch (error) {
    console.error("Error al enviar el pago:", error);
    alert("Error al registrar el pago.");
  }
});
