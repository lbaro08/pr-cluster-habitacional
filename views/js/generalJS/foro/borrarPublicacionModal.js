function borrarPublicacionModal(publicacion_id,publicacion_rfc_usuario) {

    const anterior = document.getElementById('borrarPublicacionModal');
    if (anterior) anterior.remove();

    // Crear contenido HTML del modal
    const borrarPublicacionModalHTML = `
<div class="modal fade" id="borrarPublicacionModal" tabindex="-1" aria-labelledby="tituloBorrarPublicacion" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4 border-0 shadow">

      <div class="modal-header border-0">
        <h5 class="modal-title w-100 text-center" id="tituloModificarCorreo">Eliminar Publicacion</h5>
        <button type="button" class="btn-close position-absolute end-0 me-3 mt-2" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>

      <div class="modal-body text-center" style="background-color: #dff0ff; border-radius: 0 0 1rem 1rem;">
        <p class="mb-4 fs-5 fw-semibold">Esta seguro que desea eliminar su publicacion: ${publicacion_id}</p>

        <button id="btnEliminarPublicacion" type="button" class="btn btn-primary px-4" onclick="">Eliminar</button>
      </div>

    </div>
  </div>
</div>

    `;
  
    // Insertar el modal en el body
    document.body.insertAdjacentHTML('beforeend', borrarPublicacionModalHTML);
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('borrarPublicacionModal'));
    modal.show();


  // ////////////////////////////////////////////////////////////
  //                    evente listener
  // ////////////////////////////////////////////////////////////
 
  // Funcion del boton para conseguir los datos
    const btnEliminarPublicacion = document.getElementById("btnEliminarPublicacion");

    btnEliminarPublicacion.addEventListener("click", function(event) {
        genEliminarPublicacion(publicacion_id,publicacion_rfc_usuario);
        modal.hide();
  });// cierre del addevent al btn  
  


  
}// fin del modal


  function genEliminarPublicacion(publicacion_id,publicacion_rfc_usuario){
    // hay que hacer la logica de que el usuario que la elimno sea el dueño
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    
    if(usuarioLogueado.tipo=="1"){
    publicacionJSON = {
    id:publicacion_id,
    rfc_usuario:publicacion_rfc_usuario};

    }else
    publicacionJSON = {
    id:publicacion_id,
    rfc_usuario:usuarioLogueado.rfc};

    console.log("Datos para enviar",publicacionJSON);

  fetch(`/api/publicaciones.php?id=${publicacionJSON.id}&rfc=${publicacionJSON.rfc_usuario}`,{
    method:"DELETE"
  }).then(response => response.json())
    .then(result =>{
      console.log("Respuesta del servidor",result);
      if(result.success){
        alert("Publicacion Eliminada Correctamente");
        location.reload();
      }else{
        alert("Error Aqui: ",result.mensaje)
      }

    })
    .catch(error => {

      console.error("Error en la solicitud",error);


    });


  }

