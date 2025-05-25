
document.addEventListener("DOMContentLoaded", function () {
 const container = document.getElementById('recibos-container');
 const params = new URLSearchParams(window.location.search);
 const tipoReporte = params.get('tipoReporte');
let fechaInicio = '';
let fechaFin = '';

const hoy = new Date();
const anioActual = hoy.getFullYear();
const mesActual = hoy.getMonth() + 1; 

if (tipoReporte === 'anual') {
  const anioReporte = parseInt(params.get('anioReporte'));
  console.log('Año del reporte:', anioReporte);

  fechaInicio = `${anioReporte}-01-01`;
  fechaFin = `${anioReporte}-12-31`;

} else {
  const mesReporte = parseInt(params.get('mesReporte')); 
  let anioFinal = anioActual;


  if (mesReporte > mesActual) {
    anioFinal -= 1;
  }

  console.log('Mes del reporte:', mesReporte);
  console.log('Año calculado:', anioFinal);


  const primerDia = `${anioFinal}-${String(mesReporte).padStart(2, '0')}-01`; 
  const ultimoDiaDate = new Date(anioFinal, mesReporte, 0); 
  const ultimoDia = `${anioFinal}-${String(mesReporte).padStart(2, '0')}-${String(ultimoDiaDate.getDate()).padStart(2, '0')}`;

  fechaInicio = primerDia;
  fechaFin = ultimoDia;
}

console.log('Dato a enviar Fecha inicio:', fechaInicio);
console.log('Dato a enviar Fecha fin:', fechaFin);




fetch(`../../../../api/recibo.php?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`)
  .then(response => response.json())
  .then(data => {
    console.log('Recibos filtrados:', data);
    let totalIngresos = 0;
    data.forEach(recibo=>{totalIngresos+= recibo.r_monto; });
        const titulo = `
  <div class="mb-3">
    <h5 class="text-primary fw-bold">Abonos del ${fechaInicio} al ${fechaFin}</h5>
  </div>
  <div class="bg-secondary bg-opacity-25 text-dark px-5 py-3 rounded-pill text-center fw-bold fs-4 shadow-sm mb-4">
  Total de Ingresos: ${totalIngresos}
</div>
`;
container.innerHTML += titulo;
    data.forEach(recibo => {
const template = `
<div class="d-flex align-items-center bg-primary bg-opacity-25 p-4 rounded-pill mb-4 shadow-sm">
  <div class="flex-grow-1 text-start text-dark">
    <div class="d-flex justify-content-between mb-3">
      <strong class="fs-3">Abono: ${recibo.r_id_cxc}</strong>
      <strong class="fs-3">Monto: $${recibo.r_monto}</strong>
    </div>
    <div class="mb-3 fs-4">🏠 Casa: <span class="fw-bold">${recibo.cxc_calle_casa}/${recibo.cxc_numero_casa}</span></div>
    <div class="d-flex justify-content-between align-items-center">
      <div class="fs-4">📅 Fecha: <span class="fw-bold">${recibo.r_fecha_peticion}</span></div>
      <div class="d-flex align-items-center">
        <span class="me-2 fs-4 fw-bold">Estado: Aceptado</span>
        <span class="badge bg-success rounded-circle p-3">
          <i class="bi bi-check-lg text-white fs-5"></i>
        </span>
      </div>
    </div>
  </div>

</div>
`;


container.innerHTML += template;
    });



  })
  .catch(error => {
    console.error('Error al obtener los datos:', error);
  });


});// fin del dom