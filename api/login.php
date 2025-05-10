<?php
require_once '../config/connection.php';

header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

$rfc = $data['u_rfc'] ?? '';
$password = $data['u_password'] ?? '';

if (!preg_match('/^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/', $rfc) || empty($password)) {
    http_response_code(400);
    echo json_encode(["error" => "Credenciales inválidas"]);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT * FROM usuario WHERE u_rfc = ? AND u_password = ?");
    $stmt->execute([$rfc, $password]);
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$usuario) {
        http_response_code(401);
        echo json_encode(["error" => "RFC o contraseña incorrectos"]);
        exit;
    }

    // Verificar si es propietario o inquilino de alguna casa
    $stmtCasa = $pdo->prepare("
        SELECT 
            CASE 
                WHEN c_rfc_propietario = :rfc THEN 'propietario' 
                WHEN c_rfc_inquilino = :rfc THEN 'inquilino'
                ELSE 'ninguno' 
            END AS rol,
            c_calle, c_numero
        FROM casa
        WHERE c_rfc_propietario = :rfc OR c_rfc_inquilino = :rfc
    ");
    $stmtCasa->execute(['rfc' => $rfc]);
    $casas = $stmtCasa->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "usuario" => [
            "rfc" => $usuario['u_rfc'],
            "nombre" => $usuario['u_nombre'],
            "telefono" => $usuario['u_telefono'],
            "tipo" => $usuario['u_tipo'], // 0: usuario normal, 1: superusuario
        ],
        "casas" => $casas
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Error del servidor", "detalle" => $e->getMessage()]);
}
?>
