async function iniciarSesionUsuario() {
  localStorage.clear(); // Borra todo
  const u_rfc = document.getElementById("inputUsuarioRFC").value;
  const u_password = document.getElementById("inputUsuarioPassword").value;
  const u_tipo = document.getElementById("0").value;
  
  try {
    const respuesta = await fetch('./api/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        u_rfc: u_rfc,
        u_password: u_password
      })
    });

    const datos = await respuesta.json();

    if (respuesta.ok && datos.success) {
      // Guardar al usuario en localStorage
      localStorage.clear(); // Borra todo
      localStorage.setItem('usuarioLogueado', JSON.stringify(datos.usuario));
      localStorage.setItem('casas', JSON.stringify(datos.casas));
      window.location.href = './views/templates/userMenu.html';
    } else {
      mensaje.textContent = datos.error || 'Error desconocido';
    }

  } catch (error) {
    console.error('Error de red:', error);
    mensaje.textContent = 'No se pudo conectar con el servidor.';
  }

}


async function iniciarSesionAdministrador() {
  localStorage.clear(); // Borra todo

   

  const u_rfc = document.getElementById("inputUsuarioRFC").value;
  const u_password = document.getElementById("inputUsuarioPassword").value;
  const u_tipo = document.getElementById("1").value;



  try {
    const respuesta = await fetch('./api/login.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        u_rfc: u_rfc,
        u_password: u_password
      })
    });

    const datos = await respuesta.json();

    if (respuesta.ok && datos.success) {
      if (datos.usuario.tipo == '1') {  // ← asegúrate de que `datos.usuario.tipo` existe
        localStorage.clear(); // Borra todo
        localStorage.setItem('usuarioLogueado', JSON.stringify(datos.usuario));
        localStorage.setItem('casas', JSON.stringify(datos.casas));
        window.location.href = './views/templates/adminMenu.html';
      } else {
        alert('Error: el usuario no es administrador.')
      }
    } else {
      alert('Error desconocido');
    }

  } catch (error) {
    console.error('Error de red:', error);
    alert('No se pudo conectar con el servidor.');
  }
}
