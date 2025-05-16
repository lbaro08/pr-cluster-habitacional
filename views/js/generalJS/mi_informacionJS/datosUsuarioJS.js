document.addEventListener("DOMContentLoaded", async function () {

  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    console.log("Usuario detectado al entrar:",usuarioLogueado);
  if (!usuarioLogueado) {
    // No hay usuario, redirigir o mostrar mensaje
    return;
  }

  try {
    const respuesta = await fetch(`../../../api/usuario.php?u_rfc=${usuarioLogueado.rfc}`);

    if (!respuesta.ok) throw new Error('Error en la respuesta HTTP');

    const datos = await respuesta.json();

    console.log('Datos del usuario desde backend:', datos);

    // Asumiendo que `datos` tiene estructura con propiedades u_rfc, u_nombre, u_telefono...
    document.getElementById('datoRfc').value = datos.u_rfc || '';
    document.getElementById('datoNombre').value = datos.u_nombre || '';
    document.getElementById('datoTelefono').value = datos.u_telefono || '';

  } catch (error) {
    console.error('Error al obtener usuario:', error);
  }
});
