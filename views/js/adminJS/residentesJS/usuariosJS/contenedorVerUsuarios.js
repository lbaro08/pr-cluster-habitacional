document.addEventListener("DOMContentLoaded", function () {
  const usuariosJSON = [
    { u_rfc: '1234567890123', u_nombre: 'Tralalero Tralala', u_telefono: '1111111111', u_tipo: 1 },
    { u_rfc: '9876543210987', u_nombre: 'Montse Rivera', u_telefono: '2222222222', u_tipo: 0 },
    { u_rfc: '4567891234567', u_nombre: 'Luis Pérez', u_telefono: '3333333333', u_tipo: 1 },
    { u_rfc: '6543219876543', u_nombre: 'Ana López', u_telefono: '4444444444', u_tipo: 0 }
  ];

  const contenedor = document.getElementById("contenedorVerUsuarios");
  const inputBuscar = document.getElementById("inputBuscarUsuarios");

  // Función para renderizar los usuarios
  function renderizarUsuarios(filtrados) {
    contenedor.innerHTML = ""; // Limpiar la tabla

    filtrados.forEach(usuario => {
      const tr = document.createElement("tr");
      const tipoUsuario = usuario.u_tipo === 1 ? 'Comité' : 'Inquilino';

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


  
});// fin de function