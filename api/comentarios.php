<?php
require_once '../models/Comentario.php';
require_once '../core/ComentarioDAO.php';
require_once '../config/connection.php';

header("Content-Type: application/json");
$dao = new ComentarioDAO($pdo);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (!isset($_GET['publicacion_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "ID de publicación requerido"]);
            break;
        }
        echo json_encode($dao->obtenerPorPublicacion($_GET['publicacion_id']));
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $comentario = new Comentario($data);

        if (!$comentario->validar()) {
            http_response_code(400);
            echo json_encode(["error" => "Datos inválidos"]);
            break;
        }

        try {
            $resultado = $dao->crear($comentario);
            if ($resultado) {
                http_response_code(201);
                echo json_encode([
                    "success" => true,
                    "message" => "Comentario creado exitosamente"
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["error" => "Error al crear el comentario"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la operación"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $comentario = new Comentario($data);

        if (!$comentario->validar()) {
            http_response_code(400);
            echo json_encode(["error" => "Datos inválidos"]);
            break;
        }

        try {
            if (!$dao->verificarPropietario($comentario->c_id, $comentario->c_id_f, $comentario->c_rfc_usuario)) {
                http_response_code(403);
                echo json_encode(["error" => "No autorizado para editar este comentario"]);
                break;
            }

            $resultado = $dao->actualizar($comentario);
            echo json_encode([
                "success" => $resultado,
                "message" => "Comentario actualizado exitosamente"
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la operación"]);
        }
        break;

    case 'DELETE':
        if (!isset($_GET['id']) || !isset($_GET['publicacion_id']) || !isset($_GET['rfc'])) {
            http_response_code(400);
            echo json_encode(["error" => "Faltan parámetros requeridos"]);
            break;
        }

        try {
            if (!$dao->verificarPropietario($_GET['id'], $_GET['publicacion_id'], $_GET['rfc'])) {
                http_response_code(403);
                echo json_encode(["error" => "No autorizado para eliminar este comentario"]);
                break;
            }

            $resultado = $dao->eliminar($_GET['id'], $_GET['publicacion_id'], $_GET['rfc']);
            echo json_encode([
                "success" => $resultado,
                "message" => "Comentario eliminado exitosamente"
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la operación"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}