<?php
require_once '../models/Cargo.php';
require_once '../core/CargoDAO.php';
require_once '../config/connection.php';

header("Content-Type: application/json");
$dao = new CargoDAO($pdo);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['cg_id'])) {
            $cargo = $dao->read($_GET['cg_id']);
            echo json_encode($cargo ?: ["error" => "Cargo no encontrado"]);
        } else {
            echo json_encode($dao->read());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (isset($data['accion'])) {
            switch ($data['accion']) {
                case 'generar_cargos':
                    if (!isset($data['calle'], $data['numero'], $data['fecha_cobro'], $data['fecha_limite'])) {
                        http_response_code(400);
                        echo json_encode(["error" => "Datos incompletos"]);
                        break;
                    }
                    $resultado = $dao->generarCargos(
                        $data['calle'],
                        $data['numero'],
                        $data['fecha_cobro'],
                        $data['fecha_limite']
                    );
                    echo json_encode(["success" => $resultado, "message" => "Cargos generados"]);
                    break;

                case 'cobrar_servicios':
                    if (!isset($data['fecha_cobro'], $data['fecha_limite'])) {
                        http_response_code(400);
                        echo json_encode(["error" => "Datos incompletos"]);
                        break;
                    }
                    $resultado = $dao->cobrarServicios(
                        $data['fecha_cobro'],
                        $data['fecha_limite']
                    );
                    echo json_encode(["success" => $resultado, "message" => "Servicios cobrados"]);
                    break;

                default:
                    $cargo = new Cargo($data);
                    if (!$cargo->isValid()) {
                        http_response_code(400);
                        echo json_encode(["error" => "Datos inválidos"]);
                        break;
                    }
                    $resultado = $dao->create($cargo);
                    echo json_encode(["success" => $resultado, "message" => "Cargo creado"]);
                    break;
            }
        } else {
            $cargo = new Cargo($data);
            if (!$cargo->isValid()) {
                http_response_code(400);
                echo json_encode(["error" => "Datos inválidos"]);
                break;
            }
            $resultado = $dao->create($cargo);
            echo json_encode(["success" => $resultado, "message" => "Cargo creado"]);
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        $cargo = new Cargo($data);
        if (!$cargo->isValid()) {
            http_response_code(400);
            echo json_encode(["error" => "Datos inválidos"]);
            break;
        }
        $resultado = $dao->update($cargo);
        echo json_encode(["success" => $resultado, "message" => "Cargo actualizado"]);
        break;

    case 'DELETE':
        if (!isset($_GET['cg_id'])) {
            http_response_code(400);
            echo json_encode(["error" => "ID no proporcionado"]);
            break;
        }
        $resultado = $dao->delete($_GET['cg_id']);
        echo json_encode(["success" => $resultado, "message" => "Cargo eliminado"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}