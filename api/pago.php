<?php
require_once '../models/Pago.php';
require_once '../core/PagoDAO.php';
require_once '../config/connection.php';

header('Content-Type: application/json');
$data = json_decode(file_get_contents('php://input'), true);



if (!isset($data['p_folio'], $data['u_rfc'], $data['c_calle'], $data['c_numero'], $data['p_monto'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Faltan datos obligatorios']);
    exit;
}

// Agregar la fecha de pago actual si no viene en la petición
$p_fecha = $data['p_fecha'] ?? date('Y/m/d');


$pago = new Pago([
    'c_calle' => $data['c_calle'],
    'c_numero' => $data['c_numero'],
    'u_rfc' => $data['u_rfc'],
    'p_fecha' => $p_fecha,
    'p_folio' => $data['p_folio'],
    'p_monto' => $data['p_monto']
]);

$pagoDAO = new PagoDAO($pdo);

if ($pagoDAO->create($pago)) {
    echo json_encode(['success' => true, 'message' => 'Pago registrado correctamente']);
} else {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Error al registrar el pago']);
}
