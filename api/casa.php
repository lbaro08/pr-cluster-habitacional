<?php
require_once '../models/Casa.php';
require_once '../core/CasaDAO.php';
require_once '../config/connection.php';

header("Content-Type: application/json");
$dao = new CasaDAO($pdo);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['c_calle']) && isset($_GET['c_numero'])) {
            $casa = $dao->obtener($_GET['c_calle'], $_GET['c_numero']);
            echo json_encode($casa ?: ["error" => "Casa no encontrada"]);
        } else {
            echo json_encode($dao->obtenerTodos());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $casa = new Casa($data);
        if (!$casa->validar()) {
            http_response_code(400);
            echo json_encode(["error" => "Datos inválidos"]);
            break;
        }
        try {
            $dao->crear($casa);
            echo json_encode(["success" => true, "message" => "Casa creada"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al crear casa", "detalle" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $casa = new Casa($data);
        if (!$casa->validar()) {
            http_response_code(400);
            echo json_encode(["error" => "Datos inválidos"]);
            break;
        }
        try {
            $dao->actualizar($casa);
            echo json_encode(["success" => true, "message" => "Casa actualizada"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al actualizar casa", "detalle" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"), true);
        if (!isset($data['c_calle'], $data['c_numero'])) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan datos de identificación"]);
            break;
        }
        try {
            $dao->eliminar($data['c_calle'], $data['c_numero']);
            echo json_encode(["success" => true, "message" => "Casa eliminada"]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al eliminar casa", "detalle" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}
