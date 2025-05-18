<?php
require_once '../models/Publicacion.php';
require_once '../core/PublicacionDAO.php';
require_once '../config/connection.php';

header("Content-Type: application/json");
$dao = new PublicacionDAO($pdo);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        try {
            if (isset($_GET['id'])) {
                $publicacion = $dao->obtenerPorId($_GET['id']);
                if ($publicacion) {
                    echo json_encode($publicacion);
                } else {
                    http_response_code(404);
                    echo json_encode(["error" => "Publicación no encontrada"]);
                }
            }
            else if (isset($_GET['rfc'])) {
                $publicaciones = $dao->obtenerPorUsuario($_GET['rfc']);
                echo json_encode($publicaciones);
            }
            else {
                echo json_encode($dao->obtenerTodas());
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error al obtener publicaciones", "detalle" => $e->getMessage()]);
        }
        break;

    case 'POST':
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $publicacion = new Publicacion($data);

            if (!$publicacion->validar()) {
                http_response_code(400);
                echo json_encode(["error" => "Datos inválidos"]);
                break;
            }

            $resultado = $dao->crear($publicacion);
            if ($resultado) {
                http_response_code(201);
                echo json_encode([
                    "success" => true,
                    "message" => "Publicación creada exitosamente"
                ]);
            } else {
                throw new Exception("Error al crear la publicación");
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la operación", "detalle" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        try {
            $data = json_decode(file_get_contents("php://input"), true);
            $publicacion = new Publicacion($data);

            if (!$publicacion->validar()) {
                http_response_code(400);
                echo json_encode(["error" => "Datos inválidos"]);
                break;
            }

            $resultado = $dao->actualizar($publicacion);
            echo json_encode([
                "success" => true,
                "message" => "Publicación actualizada exitosamente"
            ]);
        } catch (Exception $e) {
            http_response_code($e->getMessage() === "No autorizado para editar esta publicación" ? 403 : 500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        try {
            if (!isset($_GET['id']) || !isset($_GET['rfc'])) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan parámetros requeridos"]);
                break;
            }

            $resultado = $dao->eliminar($_GET['id'], $_GET['rfc']);
            echo json_encode([
                "success" => true,
                "message" => "Publicación eliminada exitosamente"
            ]);
        } catch (Exception $e) {
            http_response_code($e->getMessage() === "No autorizado para eliminar esta publicación" ? 403 : 500);
            echo json_encode(["error" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}