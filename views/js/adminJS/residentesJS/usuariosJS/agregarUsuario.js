document.addEventListener("DOMContentLoaded", function () {

const formAgregarNuevoUsuario = document.querySelector('form');

formAgregarNuevoUsuario.addEventListener('submit',function(event){

    event.preventDefault();

    const inputRfc = document.getElementById('inputRfc').value.trim();
    const inputNombre = document.getElementById('inputNombre').value.trim();
    const inputTelefono = document.getElementById('inputTelefono').value.trim();
    const inputContrasena = document.getElementById('inputContrasena').value.trim();
    const inputTipo = document.getElementById('inputTipo').value;

    const regexRfc = /^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/;
    const regexNombre = /^[A-Za-zÑñ& ]{1,100}$/;
    const regexTelefono = /^[0-9]{10}$/;
    const regexPassword = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!regexRfc.test(inputRfc)) {
      alert("RFC inválido. Debe tener el formato correcto (13 caracteres).");
      return;
    }

    if (!regexNombre.test(inputNombre)) {
      alert("Nombre inválido. Solo letras, espacios y &. Máximo 100 caracteres.");
      return;
    }

    if (!regexTelefono.test(inputTelefono)) {
      alert("Teléfono inválido. Deben ser 10 dígitos numéricos.");
      return;
    }

    if (!regexPassword.test(inputContrasena)) {
      alert("La contraseña debe tener al menos:\n- 8 caracteres\n- Una letra\n- Un número\n(No se permiten símbolos especiales)");
      return;
    }

    if(inputTipo==''){
        alert("Escoja un tipo de usuario");
        return;
    }
    
    document.getElementById('inputRfc').value = '';
    document.getElementById('inputNombre').value = '';
    document.getElementById('inputTelefono').value = '';
    document.getElementById('inputContrasena').value = '';
    document.getElementById('inputTipo').value =  '';
    nuevoUsuarioJSON = {
        u_rfc:inputRfc,
        u_nombre:inputNombre,
        u_telefono:inputTelefono,
        u_password:inputContrasena,
        u_tipo:inputTipo
    }



console.log(nuevoUsuarioJSON);


    fetch("/api/usuario.php", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoUsuarioJSON)
    })
        .then(response => response.json())
        .then(result => {
        console.log("Respuesta del servidor:", result);
        if (result.success) {
            alert("Usuario creada correctamente");
            location.reload(); // recargar la página para mostrar la nueva publicación
        } else {
            alert("Error: " + result.mensaje);
        }
        })
        .catch(error => {
        alert("Hubo un error al crear el usuario: ", error)
        });


    });

});