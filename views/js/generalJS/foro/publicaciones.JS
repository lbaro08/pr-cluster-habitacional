document.addEventListener("DOMContentLoaded", function () {
  fetch("../../../api/publicaciones.php")
    .then(response => response.json())
    .then(async publicaciones => {
      // Para cada publicación, pedimos sus comentarios y los agregamos
      const publicacionesConComentarios = await Promise.all(publicaciones.map(async pub => {
        const resComentarios = await fetch(`../../../api/comentarios.php?publicacion_id=${pub.f_id}`);
        const comentarios = await resComentarios.json();
        return { ...pub, comentarios: comentarios };
      }));

      console.log("Publicaciones con comentarios:", publicacionesConComentarios);
      // ////////////////////
      const contenedor = document.getElementById("contenedorPublicaciones");

      publicacionesConComentarios.forEach(pub => {
        const card = document.createElement("div");
        card.className = "card mb-4 shadow-sm";

        // Plantilla HTML dinámica
        card.innerHTML = `
     <!-- Botón de opciones -->
    <div class="dropdown position-absolute top-0 end-0 m-2">
      <button class="btn btn-sm btn-light" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        ⋮
      </button>
      <ul class="dropdown-menu">
        <li><a class="dropdown-item" href="#" onclick="borrarPublicacionModal(${pub.f_id},'${pub.f_rfc_usuario}')">Eliminar Publicacion</a></li>
      </ul>
    </div>

    <!-- Publicacion -->
    <div class="post-title">
     ${pub.f_fecha.split(" ")[0]} <strong> ${pub.f_rfc_usuario}:</strong> ${pub.f_titulo}
    </div>
    <div class="post-content">
      <p>${pub.f_contenido}</p>
    </div>
    <div class="comments-section">
      <h6 class="mb-3">💬 Comentarios</h6>
      ${pub.comentarios.map(com => `
        <div class="comment-item">
          <strong>${com.c_rfc_usuario}:</strong> ${com.c_contenido}
        </div>`).join('')}
      <form class="formNuevoComentario comment-form mt-3" data-id-Publicacion="${pub.f_id}">
        <div class="mb-2">
          <label class="form-label">Agregar un comentario:</label>
          <textarea class="inputComentario form-control" rows="2" placeholder="Escribe tu comentario..."></textarea>
        </div>
        <button id="btnComentar" type="submit" class="btn btn-primary btn-sm">Comentar</button>
      </form>
    </div>
  `;

        contenedor.appendChild(card);
      });


      document.querySelectorAll(".formNuevoComentario").forEach(form => {
        form.addEventListener("submit", function (event) {
          event.preventDefault();

          const inputComentario = form.querySelector(".inputComentario");
          const valorComentario = inputComentario.value;
          const pubId = form.dataset.idPublicacion;

          if (valorComentario.trim() !== "") {
            genNuevoComentario(pubId, valorComentario);
            inputComentario.value = "";
          } else {
            alert("Escribe algo antes de comentar.");
          }
        });
      });



    });// fin del fetch




});


function genNuevoComentario(publicacion_id, comentario_contenido) {
  const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));

  comentarioJSON = {
    c_id_f: publicacion_id,
    c_rfc_usuario: usuarioLogueado.rfc,
    c_contenido: comentario_contenido
  };
  console.log("Datos a enviar", comentarioJSON);

  fetch("../../../api/comentarios.php", {
    method: "POST",
    headers:
      { "Content-Type": "application/json" },
    body: JSON.stringify(comentarioJSON)
  }).then(response => response.json())
    .then(result => {
      console.log("Respuesta del servidor", result);
      if (result.success) {
        alert("Comentario creado Correctamente");
        location.reload();
      } else {
        alert("Error: ", result.mensaje)
      }

    })
    .catch(error => {

      console.error("Error en la solicitud", error);


    });




}


