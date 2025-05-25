 document.addEventListener('DOMContentLoaded', function () {

    const calendarEl = document.getElementById('calendar');


            fetch('../../../api/reserva_espacio.php')
            .then(response => {
                if (!response.ok) {
                throw new Error('Error al obtener las reservas');
                }
                return response.json();
            })
            .then(data => {
                console.log('Reservas obtenidas:', data);
      const eventos = [];

      data.forEach(reserva => {
        const fecha = reserva.re_fecha;
        const detalle = reserva.re_detalle;

        if (reserva.re_espacio == 1) {
          eventos.push({
            title: `${detalle}`,
            start: fecha,
            allDay: true,
            backgroundColor: '#3498db', // azul
            borderColor: '#2980b9',
            classNames: ['evento-alberca']
          });
        } else if (reserva.re_espacio == 2) {
          eventos.push({
            title: `${detalle}`,
            start: fecha,
            allDay: true,
            backgroundColor: '#f39c12', // naranja
            borderColor: '#e67e22',
            classNames: ['evento-palapa']
          });
        } else if (reserva.re_espacio == 3) {
          eventos.push({
            title: `${detalle}`,
            start: fecha,
            allDay: true,
            classNames: ['evento-mixto'] // usaremos CSS para el degradado
          });
        }
      });

         const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title'
        },
        events: eventos,
        eventDidMount: function (info) {
          // Aplicar degradado si es evento mixto
          if (info.event.classNames.includes('evento-mixto')) {
            info.el.style.background = 'linear-gradient(45deg, #3498db, #f39c12)';
            info.el.style.border = '1px solid #555';
            info.el.style.color = 'white';
          }
        }
      });

      calendar.render();
                
            })
            .catch(error => {
                console.error('Error:', error);
            });



      

    });
