<?php
require_once '../models/Usuario.php';
require_once '../core/UsuarioDAO.php';
require_once '../config/connection.php';

header("Content-Type: application/json");
$dao = new UsuarioDAO($pdo);
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $usuario = new Usuario($data);
        if (!$usuario->validar()) {
            http_response_code(400);
            echo json_encode(["error" => "Datos inválidos"]);
            exit;
        }
        echo json_encode(["success" => $dao->create($usuario)]);
        break;

    case 'GET':
        $rfc = $_GET['u_rfc'] ?? null;
        if ($rfc) {
            $res = $dao->read($rfc);
            echo $res ? json_encode($res) : json_encode(["error" => "No encontrado"]);
        } else {
            echo json_encode(["error" => "RFC requerido"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $usuario = new Usuario($data);
        if (!$usuario->validar()) {
            http_response_code(400);
            echo json_encode(["error" => "Datos inválidos"]);
            exit;
        }
        echo json_encode(["success" => $dao->update($usuario)]);
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        $rfc = $data['u_rfc'] ?? null;
        echo json_encode(["success" => $dao->delete($rfc)]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
}
?>
