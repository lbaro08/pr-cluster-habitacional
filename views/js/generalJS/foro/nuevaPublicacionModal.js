function nuevaPublicacionModal() {

    const anterior = document.getElementById('nuevaPublicacionModal');
    if (anterior) anterior.remove();

    // Crear contenido HTML del modal
  const nuevaPublicacionModalHTML = `
<div class="modal fade" id="nuevaPublicacionModal" tabindex="-1" aria-labelledby="modalPublicacionLabel" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
    
      <div class="modal-header">
        <h5 class="modal-title" id="modalPublicacionLabel">➕ Nueva Publicación</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
      </div>
      
      <div class="modal-body">


        <form id="formNuevaPublicacion">
          <div class="mb-3">
            <label for="titulo" class="form-label">Título</label>
            <input name="inputTitulo" type="text" class="form-control" id="titulo" placeholder="Título de la publicación"  required>
          </div>
          <div class="mb-3">
            <label for="contenido" class="form-label">Contenido</label>
            <textarea name="inputContenido" class="form-control" id="contenido" rows="4" placeholder="Escribe aquí tu publicación..." required></textarea>
          </div>
          <button id="btnNuevaPublicacion" type="submit" class="btn btn-primary">Publicar</button>
        </form>



      </div>
      
    </div>
  </div>
</div>
`;


    document.body.insertAdjacentHTML('beforeend',  nuevaPublicacionModalHTML);
  
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('nuevaPublicacionModal'));
    modal.show();


  
// ----------------------------------------------------------------------------
//     EVENT LISTENNER PARA EL AREA DE NUEVA PUBLICACION
// ----------------------------------------------------------------------------  


  // Funcion del boton para conseguir los datos
  const formulario = document.getElementById("formNuevaPublicacion");
  formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const inputTitulo = formulario.querySelector("#titulo").value;
    const inputContenido = formulario.querySelector("#contenido").value;

    genNuevaPublicacion(inputTitulo, inputContenido);

  
  });// cierre del addevent al btn



  
  }// CIERE DE MODAL-----------------------------------------


  // /////////////////////////////////////////////////
  //  METODO PARA GENERAR LOS JSON
  // /////////////////////////////////////////////////

  function genNuevaPublicacion(inputTitulo,inputContenido){
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));


    
    const nuevaPublicacionJSON = {
      f_rfc_usuario: usuarioLogueado.rfc,
      f_titulo: inputTitulo,
      f_contenido:inputContenido

    };
    console.log(nuevaPublicacionJSON);
    ////////////////////////////////// cholichitud
  fetch("/api/publicaciones.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(nuevaPublicacionJSON)
  })
    .then(response => response.json())
    .then(result => {
    console.log("Respuesta del servidor:", result);
      if (result.success) {
        alert("Publicación creada correctamente");
        location.reload(); // recargar la página para mostrar la nueva publicación
      } else {
        alert("Error: " + result.mensaje);
      }
    })
    .catch(error => {
      console.error("Error en la solicitud:", error);
    });

  }

