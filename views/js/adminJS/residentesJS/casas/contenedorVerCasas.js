document.addEventListener("DOMContentLoaded", function () {
  fetch("/api/casa.php")
    .then(response => response.json())
    .then(async casasJSON => {
      console.log(casasJSON);

      const contenedor = document.getElementById("contenedorVerCasas");
      const inputBuscar = document.getElementById("inputBuscarCasa");

      function renderizarCasas(casasFiltradas) {
        contenedor.innerHTML = ""; // Limpiar la tabla

        casasFiltradas.forEach(vJSON => {
          const tr = document.createElement("tr");

          tr.innerHTML = `
            <td>${vJSON.c_calle}</td>
            <td>${vJSON.c_numero}</td>
            <td>${vJSON.c_rfc_propietario}</td>
            <td>${vJSON.nombre_propietario}</td>
            <td>${vJSON.c_rfc_inquilino}</td>
            <td>${vJSON.nombre_inquilino}</td>
          `;
          contenedor.appendChild(tr);
        });
      }

      renderizarCasas(casasJSON);

      inputBuscar.addEventListener("input", function () {
        const texto = inputBuscar.value.toLowerCase();

        const filtrados = casasJSON.filter(casa => {
          return (
            (casa.c_calle || "").toLowerCase().includes(texto) ||
            (casa.c_numero || "").toLowerCase().includes(texto) ||
            (casa.c_rfc_inquilino || "").toLowerCase().includes(texto) ||
            (casa.c_rfc_propietario || "").toLowerCase().includes(texto) ||
            (casa.nombre_inquilino || "").toLowerCase().includes(texto) ||
            (casa.nombre_propietario || "").toLowerCase().includes(texto)
          );
        });

        renderizarCasas(filtrados);
      });
    });
});