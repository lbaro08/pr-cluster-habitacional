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
      <form class="comment-form mt-3">
        <div class="mb-2">
          <label class="form-label">Agregar un comentario:</label>
          <textarea class="form-control" rows="2" placeholder="Escribe tu comentario..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary btn-sm">Comentar</button>
      </form>
    </div>
  `;

  contenedor.appendChild(card);
});
});



