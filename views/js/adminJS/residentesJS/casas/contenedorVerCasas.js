document.addEventListener("DOMContentLoaded", function () {
const casasJSON = [
    {c_calle:'A',c_numero:'1',c_duenio:'Luis',c_inquilino:'montse'},
    {c_calle:'A',c_numero:'2',c_duenio:'montse',c_inquilino:'CrisNo'},
    {c_calle:'A',c_numero:'3',c_duenio:'Luis',c_inquilino:'montse'},
    {c_calle:'A',c_numero:'4',c_duenio:'montse',c_inquilino:'CrisNo'},
    {c_calle:'B',c_numero:'1',c_duenio:'Mar',c_inquilino:'Luis'},
    {c_calle:'B',c_numero:'2',c_duenio:'Cris',c_inquilino:'No'}

];

const contenedor = document.getElementById("contenedorVerCasas");

casasJSON.forEach(vJSON => {

const tr = document.createElement("tr");

tr.innerHTML=`
    <td>${vJSON.c_calle}</td>
    <td>${vJSON.c_numero}</td>
    <td>${vJSON.c_duenio}</td>
    <td>${vJSON.c_inquilino}</td>
`;


contenedor.appendChild(tr);



});




});