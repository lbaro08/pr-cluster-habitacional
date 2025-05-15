document.addEventListener("DOMContentLoaded", function () {
const publicaciones = [
  {
    id:123,
    usuario: "Carlos",
    titulo: "Mi primera publicación",
    contenido: "Este es el contenido de la publicación número uno.",
    comentarios: [
      { usuario: "Lucía", texto: "¡Buen post!" },
      { usuario: "Marco", texto: "Gracias por compartir." }
    ]
  },
  {
    id:12345,
    usuario: "Andrea",
    titulo: "Reflexión del día",
    contenido: "Hoy aprendí algo importante sobre la perseverancia.",
    comentarios: [
      { usuario: "Leo", texto: "Inspirador." }
    ]
  },
   {
    id:1515,
    usuario: "Yamileth",
    titulo: "Reflexión del día",
    contenido: "Hoy aprendí algo importante sobre la perseverancia.",
    comentarios: [
      { usuario: "Leo", texto: "Inspirador." }
    ]
  },
   {
    id:515155,
    usuario: "Monchirrat",
    titulo: "Reflexión del día",
    contenido: "Hoy aprendí algo importante sobre la perseverancia.",
    comentarios: [
      { usuario: "Leo", texto: "Inspirador." }
    ]
  }
];

const contenedor = document.getElementById("contenedorPublicaciones");

publicaciones.forEach(pub => {
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
        <li><a class="dropdown-item" href="#" onclick="borrarPublicacionModal(${pub.id})">Eliminar comentario</a></li>
      </ul>
    </div>

    <!-- Publicacion -->
    <div class="post-title">
      <strong>${pub.usuario}:</strong> ${pub.titulo}
    </div>
    <div class="post-content">
      <p>${pub.contenido}</p>
    </div>
    <div class="comments-section">
      <h6 class="mb-3">💬 Comentarios</h6>
      ${pub.comentarios.map(com => `
        <div class="comment-item">
          <strong>${com.usuario}:</strong> ${com.texto}
        </div>`).join('')}
      <form class="formNuevoComentario comment-form mt-3" data-id-Publicacion="${pub.id}">
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
      genNuevoComentario(pubId,valorComentario);      
      inputComentario.value = "";
    } else {
      alert("Escribe algo antes de comentar.");
    }
  });
});

});


function genNuevoComentario(publicacion_id,comentario_contenido){

  comentarioJSON = [{p_id:publicacion_id,c_contenido:comentario_contenido}];
  console.log("Datos a enviar",comentarioJSON);




}


