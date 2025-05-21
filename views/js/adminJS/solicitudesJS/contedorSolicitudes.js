document.addEventListener("DOMContentLoaded", function () {
const contenedor = document.getElementById("contenedorSolicitudes");

        fetch('/api/reserva_espacio.php')
        .then(response => {
            if (!response.ok) {
            throw new Error('Error al obtener las reservas');
            }
            return response.json();
        })
        .then(solicitudesJSON => {
            console.log('Todas las reservas:', solicitudesJSON);

           
            solicitudesJSON.forEach(soli => {

            let re_palapa,re_alberca;    

            switch(soli.re_espacio){
                case 1:
                    re_palapa = 'No';
                    re_alberca = 'Si';
                    break;
                case 2:
                    re_palapa = 'Si';
                    re_alberca = 'No';
                    break;
                case 3:
                    re_palapa = 'Si';
                    re_alberca = 'Si';
                    break;
                    

            }

            const tr = document.createElement("tr");

            tr.innerHTML=`
                <td>${soli.re_fecha}</td>
                <td>${soli.re_rfc_usuario}</td>
                <td>${soli.u_nombre}</td>
                <td>${re_palapa}</td>
                <td>${re_alberca}</td>
            `;


            contenedor.appendChild(tr);

        });

        })
        .catch(error => {
            console.error('Error:', error);
        });









});