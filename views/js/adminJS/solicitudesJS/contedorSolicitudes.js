document.addEventListener("DOMContentLoaded", function () {
const solicitudesJSON = [
    {
        s_fecha:'15/11/2020',
        s_solicitante:'Luis Feliciano',
        s_palapa:'Si',
        s_alberca:'No'
    },

    {
        s_fecha:'16/11/2020',
        s_solicitante:'tralalero talala',
        s_palapa:'Si',
        s_alberca:'No'
    },

    {
        s_fecha:'17/11/2020',
        s_solicitante:'Valerina capuchina',
        s_palapa:'Si',
        s_alberca:'No'
    },

    {
        s_fecha:'18/11/2020',
        s_solicitante:'Luis Galileo galei',
        s_palapa:'Si',
        s_alberca:'No'
    }

];

const contenedor = document.getElementById("contenedorSolicitudes");

solicitudesJSON.forEach(pub => {

const tr = document.createElement("tr");

tr.innerHTML=`
    <td>${pub.s_fecha}</td>
    <td>${pub.s_solicitante}</td>
    <td>${pub.s_palapa}</td>
    <td>${pub.s_alberca}</td>
`;


contenedor.appendChild(tr);



});




});