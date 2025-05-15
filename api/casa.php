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
            if (isset($_GET['disponibilidad'])) {
                $disponible = $dao->casaDisponible($_GET['c_calle'], $_GET['c_numero']);
                echo json_encode(['disponible' => $disponible]);
            } else {
                $casa = $dao->obtener($_GET['c_calle'], $_GET['c_numero']);
                echo json_encode($casa ?: ["error" => "Casa no encontrada"]);
            }
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
            if (isset($data['accion'])) {
                switch ($data['accion']) {
                    case 'asignar_inquilino':
                        $resultado = $dao->asignarInquilino(
                            $casa->c_calle,
                            $casa->c_numero,
                            $casa->c_rfc_inquilino
                        );
                        echo json_encode(["success" => $resultado, "message" => "Inquilino asignado"]);
                        break;

                    case 'revocar_inquilino':
                        $resultado = $dao->revocarInquilino(
                            $casa->c_calle,
                            $casa->c_numero,
                            $casa->c_rfc_inquilino
                        );
                        echo json_encode(["success" => $resultado, "message" => "Inquilino revocado"]);
                        break;

                    case 'modificar_propietario':
                        $resultado = $dao->modificarPropietario(
                            $casa->c_calle,
                            $casa->c_numero,
                            $casa->c_rfc_propietario
                        );
                        echo json_encode(["success" => $resultado, "message" => "Propietario modificado"]);
                        break;

                    default:
                        $resultado = $dao->crear($casa);
                        echo json_encode(["success" => $resultado, "message" => "Casa creada"]);
                        break;
                }
            } else {
                $resultado = $dao->crear($casa);
                echo json_encode(["success" => $resultado, "message" => "Casa creada"]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(["error" => "Error en la operación", "detalle" => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}
