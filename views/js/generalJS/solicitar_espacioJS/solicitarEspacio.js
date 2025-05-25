 document.addEventListener('DOMContentLoaded', function () {

    
    const btnSolicitarEspacio = document.getElementById('btnSolicitarEspacio');
    
    btnSolicitarEspacio.addEventListener('click',function(){


    const cb_palapa = document.getElementById('checkbox_palapa').checked== true ?   1 : 0;
    const cb_alberca =  document.getElementById('checkbox_alberca').checked==true ? 2 : 0;
    const inputDetalleSolicitud = document.getElementById('inputDetalleSolicitud').value;
    const inputEspacio = cb_alberca+cb_palapa;
    
    
    const inputFecha = document.getElementById('inputFechaSolicitud').value;
    const date_solicitud = new Date(inputFecha);
    const fehaHoy = new Date();
    
    if(inputEspacio==0){
        alert("Para Solicitar un espacio debe marcar minimo una casilla");
        return;
    }
    
    if (!inputFecha || isNaN(date_solicitud.getTime()) || date_solicitud < new Date().setHours(0, 0, 0, 0)) {
        alert("Seleccione una fecha adecuada para su solicitud");
        return;
    }
    
    if(inputDetalleSolicitud.length>30 ||inputDetalleSolicitud.length<1 ){
    alert("La descripcion debe tener maximo 30 caracteres y no puede ser nula");
    return;
        
    }

 fetch(`../../../api/reserva_espacio.php?verificar=1&fecha=${inputFecha}&espacio=${inputEspacio}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener las reservas');
        }
        return response.json();
      })
      .then(data => {
        console.log('Respuesta del servidor:', data);
        if (data.disponible) {
          genSolicitudEspacio(inputEspacio, inputFecha,inputDetalleSolicitud);
        } else {
            console.log("data dispobile,",data.disponible)
          alert('El espacio seleccionado no está disponible para esa fecha.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Ocurrió un error al verificar disponibilidad');
      });




    });//end listener

 }); // end del dom

 function genSolicitudEspacio(inputEspacio,inputFecha,inputDetalleSolicitud){
 const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

    const solicitudJSON = {
        re_fecha : inputFecha,
        re_espacio:inputEspacio,
        re_rfc_usuario:usuarioLogueado.rfc,
        re_detalle:inputDetalleSolicitud

    }

    console.log('Datos a enviar',solicitudJSON);


        fetch('../../../api/reserva_espacio.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(solicitudJSON)
        })
        .then(response => {
        if (!response.ok) throw new Error('Error al crear reserva');
        return response.json();
        })
        .then(data => {
        console.log('Respuesta:', data);
        if (data.success) {
            alert('Reserva creada con éxito');
            window.history.back();
            
        } else if (data.error) {
            alert('Error: ' + data.error);
        }
        })
        .catch(err => {
        console.error(err);
        alert('Error en la comunicación con el servidor');
        });



 }