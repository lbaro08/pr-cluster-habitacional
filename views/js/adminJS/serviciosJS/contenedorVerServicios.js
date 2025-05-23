document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/cargo.php")
    .then(response => response.json())
    .then(async serviciosJSON => {
      const contenedor = document.getElementById("contenedorVerServicios");
      const inputBuscar = document.getElementById("inputBuscarServicios"); // Input en el HTML

      function renderizarServicios(filtrados) {
        contenedor.innerHTML = ""; // Limpiar la tabla

        filtrados.forEach(servicio => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
            <td>${servicio.cg_id}</td>
            <td>${servicio.cg_nombre}</td>
            <td>${servicio.cg_descripcion}</td>
            <td>${servicio.cg_costo}</td>
          `;

          contenedor.appendChild(tr);
        });
      }

      // Mostrar todos al cargar
      renderizarServicios(serviciosJSON);

      // Filtrar mientras se escribe
      inputBuscar.addEventListener("input", function () {
        const texto = inputBuscar.value.toLowerCase().trim();

        const filtrados = serviciosJSON.filter(servicio => {
          return (
            servicio.cg_id.toString().toLowerCase().includes(texto) ||
            servicio.cg_nombre.toLowerCase().includes(texto) ||
            servicio.cg_descripcion.toLowerCase().includes(texto) ||
            servicio.cg_costo.toString().toLowerCase().includes(texto)
          );
        });

        renderizarServicios(filtrados);
      });

    });
});