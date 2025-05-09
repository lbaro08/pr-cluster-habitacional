<?php
include 'conexion.php';

$rfc = $_POST['rfc'];
$contrasena = $_POST['contrasena'];

$sql = "SELECT * FROM usuario WHERE u_rfc = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $rfc);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows === 1) {
    $usuario = $resultado->fetch_assoc();

    if (password_verify($contrasena, $usuario['contrasena'])) {
        session_start();
        $_SESSION['usuario'] = $usuario['correo'];
        echo "Login exitoso. Redirigiendo...";
        header("Location: panel.php");
        exit();
    } else {
        echo "Contraseña incorrecta.";
    }
} else {
    echo "El usuario no existe.";
}

$stmt->close();
$conexion->close();
?>
