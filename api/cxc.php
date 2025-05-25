<?php
require_once '../models/CXC.php';
require_once '../core/CXCDAO.php';
require_once '../config/connection.php';

header("Content-Type: application/json");
$dao = new CXCDAO($pdo);

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Obtener estado de cuenta o movimientos
        if (isset($_GET['tipo'])) {
            switch ($_GET['tipo']) {
                case 'estado_cuenta':
                    $calle = $_GET['calle'] ?? null;
                    $numero = $_GET['numero'] ?? null;
                    $resultado = $dao->obtenerEstadoCuenta($calle, $numero);
                    echo json_encode($resultado);
                    break;

                case 'movimientos':
                    $calle = $_GET['calle'] ?? null;
                    $numero = $_GET['numero'] ?? null;
                    $resultado = $dao->obtenerMovimientos($calle, $numero);
                    echo json_encode($resultado);
                    break;

                case 'por_casa':
                    if (!isset($_GET['calle']) || !isset($_GET['numero'])) {
                        http_response_code(400);
                        echo json_encode(["error" => "Faltan parámetros de casa"]);
                        break;
                    }
                    $resultado = $dao->obtenerPorCasa($_GET['calle'], $_GET['numero']);
                    echo json_encode($resultado);
                    break;

                    case 'por_usuario':
                        if (!isset($_GET['rfc'])) {
                            http_response_code(400);
                            echo json_encode(["error" => "Falta el RFC del usuario"]);
                            break;
                        }

                        require_once '../core/CasaDAO.php';
                        $casaDAO = new CasaDAO($pdo);
                        $rfc = $_GET['rfc'];

                        // Buscar todas las casas donde el usuario es propietario o inquilino
                        $stmt = $pdo->prepare("
                            SELECT c_calle, c_numero
                            FROM casa
                            WHERE c_rfc_propietario = ? OR c_rfc_inquilino = ?
                        ");
                        $stmt->execute([$rfc, $rfc]);
                        $casas = $stmt->fetchAll(PDO::FETCH_ASSOC);

                        if (!$casas) {
                            echo json_encode([]);
                            break;
                        }

                        // Buscar los cargos de esas casas
                        $resultados = [];
                        foreach ($casas as $casa) {
                            $resultado = $dao->obtenerMovimientos($casa['c_calle'], $casa['c_numero']);
                            $resultados = array_merge($resultados, $resultado);
                        }

                        echo json_encode($resultados);
                        break;

                        case 'detalles_cxc':
                            if (!isset($_GET['cxc_id'])) {
                                http_response_code(400);
                                echo json_encode(["error" => "Falta el ID del CXC"]);
                                break;
                            }
                            $resultado = $dao->obtenerDetallesPorCXC($_GET['cxc_id']);
                            echo json_encode($resultado);
                        break;
                    default:
                        http_response_code(400);
                        echo json_encode(["error" => "Tipo de consulta no válido"]);
                        break;
            }
        }
        // Obtener CXC específico o todos
        else if (isset($_GET['cxc_id'])) {
            $cxc = $dao->read($_GET['cxc_id']);
            echo json_encode($cxc ?: ["error" => "CXC no encontrado"]);
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
                    $cxc = new CXC($data);
                    if (!$cxc->validar()) {
                        http_response_code(400);
                        echo json_encode(["error" => "Datos inválidos"]);
                        break;
                    }
                    $resultado = $dao->create($cxc);
                    echo json_encode(["success" => $resultado, "message" => "CXC creado"]);
                    break;
            }
        } else {
            $cxc = new CXC($data);
            if (!$cxc->validar()) {
                http_response_code(400);
                echo json_encode(["error" => "Datos inválidos"]);
                break;
            }
            $resultado = $dao->create($cxc);
            echo json_encode(["success" => $resultado, "message" => "CXC creado"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["error" => "Método no permitido"]);
        break;
}