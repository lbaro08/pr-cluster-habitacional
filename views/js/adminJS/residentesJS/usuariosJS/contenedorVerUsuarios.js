document.addEventListener("DOMContentLoaded", function () {


    fetch("/api/usuario.php")
  .then(response => response.json())
  .then(async usuariosJSON => {
          console.log(usuariosJSON);
            const contenedor = document.getElementById("contenedorVerUsuarios");
        const inputBuscar = document.getElementById("inputBuscarUsuarios");

        // Función para renderizar los usuarios
        function renderizarUsuarios(filtrados) {
          contenedor.innerHTML = ""; // Limpiar la tabla

          filtrados.forEach(usuario => {
            const tr = document.createElement("tr");
            const tipoUsuario = usuario.u_tipo === '1' ? 'Comité' : 'Inquilino';

            tr.innerHTML = `
              <td>${usuario.u_rfc}</td>
              <td>${usuario.u_nombre}</td>
              <td>${usuario.u_telefono}</td>
              <td>${tipoUsuario}</td>
            `;
            contenedor.appendChild(tr);
          });
        }

        // Mostrar todos al cargar
        renderizarUsuarios(usuariosJSON);

        // Buscar mientras escribe
        inputBuscar.addEventListener("input", function () {
          const texto = inputBuscar.value.toLowerCase();

          const filtrados = usuariosJSON.filter(usuario =>
            usuario.u_rfc.toLowerCase().includes(texto) ||
            usuario.u_nombre.toLowerCase().includes(texto) ||
            usuario.u_telefono.includes(texto) ||
            (usuario.u_tipo === 1 ? "comité" : "inquilino").includes(texto)
          );

          renderizarUsuarios(filtrados);
        });
    });
  
  
});// fin de function