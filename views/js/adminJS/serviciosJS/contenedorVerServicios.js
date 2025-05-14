document.addEventListener("DOMContentLoaded", function () {
const serviciosJSON = [
    {
        cg_id:'xxxx',
        cg_nombre:'Limpieza de alberca',
        cg_descripcion:'Se limpiara la alberca xd',
        cg_costo:'2300'
    },

    {
        cg_id:'xxxx',
        cg_nombre:'Luz',
        cg_descripcion:'Se cobrara la luz',
        cg_costo:'2100'
    },

    {
        cg_id:'xxxx',
        cg_nombre:'test3',
        cg_descripcion:'descripcion 3',
        cg_costo:'2020'
    },

    {
        cg_id:'xxxx',
        cg_nombre:'test34',
        cg_descripcion:'descripcion 4',
        cg_costo:'2300'
    }

];

const contenedor = document.getElementById("contenedorVerServicios");

serviciosJSON.forEach(vJSON => {

const tr = document.createElement("tr");

tr.innerHTML=`
    <td>${vJSON.cg_id}</td>
    <td>${vJSON.cg_nombre}</td>
    <td>${vJSON.cg_descripcion}</td>
    <td>${vJSON.cg_costo}</td>
`;


contenedor.appendChild(tr);



});




});