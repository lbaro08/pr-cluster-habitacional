<?php
require_once '../models/ReservaEspacio.php';
require_once '../core/ReservaEspacioDAO.php';
require_once '../config/connection.php';

header("Content-Type: application/json");
$dao = new ReservaEspacioDAO($pdo);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['verificar'])) {
            if (!isset($_GET['fecha']) || !isset($_GET['espacio'])) {
                http_response_code(400);
                echo json_encode(["error" => "Faltan parámetros para verificar disponibilidad"]);
                break;
            }
            $disponible = $dao->verificarDisponibilidad($_GET['fecha'], $_GET['espacio']);
            echo json_encode(["disponible" => $disponible]);

        } elseif (isset($_GET['fecha'])) {
            $reservas = $dao->obtenerPorFecha($_GET['fecha']);
            echo json_encode($reservas);
        } else if (isset($_GET['rfc'])) {
            $reservas = $dao->obtenerPorUsuario($_GET['rfc']);
            echo json_encode($reservas);
        } else {
            echo json_encode($dao->obtenerTodas());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $reserva = new ReservaEspacio($data);

        if (!$reserva->validar()) {
            http_response_code(400);
            echo json_encode(["error" => "Datos inválidos"]);
            break;
        }

        try {
            // Verificar disponibilidad antes de crear
            if (!$dao->verificarDisponibilidad($reserva->re_fecha, $reserva->re_espacio)) {
                http_response_code(400);
                echo json_encode(["error" => "Espacio no disponible para la fecha solicitada"]);
                break;
            }

            $resultado = $dao->crear($reserva);
            echo json_encode([
                "success" => $resultado,
                "message" => "Reserva creada exitosamente"
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la operación", "detalle" => $e->getMessage()]);
        }
        break;

    case 'PUT':
        try {
            if (!isset($_GET['fecha_original'])) {
                http_response_code(400);
                echo json_encode(["error" => "Se requiere la fecha original de la reserva"]);
                break;
            }

            $data = json_decode(file_get_contents("php://input"), true);
            $reserva = new ReservaEspacio($data);

            if (!$reserva->validar()) {
                http_response_code(400);
                echo json_encode(["error" => "Datos inválidos"]);
                break;
            }

            $resultado = $dao->actualizar($reserva, $_GET['fecha_original']);
            echo json_encode([
                "success" => true,
                "message" => "Reservación actualizada exitosamente"
            ]);
        } catch (Exception $e) {
            http_response_code($e->getMessage() === "El espacio no está disponible para la nueva fecha" ? 400 : 500);
            echo json_encode([
                "error" => "Error en la operación",
                "detalle" => $e->getMessage()
            ]);
        }
        break;

    // Ejemplo de fecha YYYY-MM-DD
    case 'DELETE':
        try {
            if (isset($_GET['fecha'])) {
                $resultado = $dao->eliminarPorFecha($_GET['fecha']);
                echo json_encode([
                    "success" => $resultado,
                    "message" => "Reservaciones eliminadas exitosamente"
                ]);
            } else if (isset($_GET['fecha']) && isset($_GET['espacio']) && isset($_GET['rfc'])) {
                $resultado = $dao->eliminarReservacion(
                    $_GET['fecha'],
                    $_GET['espacio'],
                    $_GET['rfc']
                );
                echo json_encode([
                    "success" => $resultado,
                    "message" => "Reservación eliminada exitosamente"
                ]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Faltan parámetros requeridos"]);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "error" => "Error en la operación",
                "detalle" => $e->getMessage()
            ]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}