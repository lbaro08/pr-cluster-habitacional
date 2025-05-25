<?php
require_once '../models/Recibo.php';
require_once '../core/ReciboDAO.php';
require_once '../config/connection.php';

header("Content-Type: application/json");
$dao = new ReciboDAO($pdo);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id_cxc'])) {
            $recibos = $dao->obtenerPorCXC($_GET['id_cxc']);
            echo json_encode($recibos);
        } 
        else if (isset($_GET['folio'])) {
            $recibo = $dao->obtenerPorFolio($_GET['folio']);
            echo json_encode($recibo ?: ["error" => "Recibo no encontrado"]);
        }
        else if (isset($_GET['rfc_cliente'])) {
            $recibos = $dao->obtenerPorCliente($_GET['rfc_cliente']);
            echo json_encode($recibos);
        }
        else if (isset($_GET['fecha_inicio']) && isset($_GET['fecha_fin'])) {
            $fecha_inicio = $_GET['fecha_inicio'];
            $fecha_fin = $_GET['fecha_fin'];

            $recibos = $dao->obtenerReporte($fecha_inicio, $fecha_fin);
            echo json_encode($recibos);
        }
        else {
            echo json_encode($dao->obtenerTodos());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        $recibo = new Recibo($data);


        try {
            if (isset($data['accion']) && $data['accion'] === 'validar') {
                $resultado = $dao->validarPago($recibo);
                echo json_encode(["success" => $resultado, "message" => "Pago validado"]);
            } else {
                $resultado = $dao->crearPago($recibo);
                echo json_encode(["success" => $resultado, "message" => "Pago registrado"]);
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