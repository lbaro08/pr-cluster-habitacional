<?php
require_once __DIR__ . '/../config/connection.php';

class CXCDAO {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($cxc) {
        $stmt = $this->pdo->prepare("INSERT INTO cxc (cxc_id, cxc_id_cg, cxc_calle_casa, cxc_numero_casa, cxc_costo, cxc_fecha_cobro, cxc_fecha_limite) VALUES (?, ?, ?, ?, ?, ?, ?)");
        return $stmt->execute([
            $cxc->cxc_id,
            $cxc->cxc_id_cg,
            $cxc->cxc_calle_casa,
            $cxc->cxc_numero_casa,
            $cxc->cxc_costo,
            $cxc->cxc_fecha_cobro,
            $cxc->cxc_fecha_limite
        ]);
    }

    public function read($id = null) {
        if ($id) {
            $stmt = $this->pdo->prepare("SELECT * FROM cxc WHERE cxc_id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $this->pdo->prepare("SELECT * FROM cxc");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    public function obtenerPorCasa($calle, $numero) {
        $stmt = $this->pdo->prepare("SELECT * FROM cxc WHERE cxc_calle_casa = ? AND cxc_numero_casa = ?");
        $stmt->execute([$calle, $numero]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function generarCargos($calle, $numero, $fechaCobro, $fechaLimite) {
        $stmt = $this->pdo->prepare("CALL aux_generar_cargos(?, ?, ?, ?)");
        return $stmt->execute([
            $calle,
            $numero,
            $fechaCobro,
            $fechaLimite
        ]);
    }

    public function cobrarServicios($fechaCobro, $fechaLimite) {
        $stmt = $this->pdo->prepare("CALL cobrar_servicios(?, ?)");
        return $stmt->execute([
            $fechaCobro,
            $fechaLimite
        ]);
    }

    public function obtenerEstadoCuenta($calle = null, $numero = null) {
        if ($calle && $numero) {
            $stmt = $this->pdo->prepare("SELECT * FROM estado_cuentas WHERE v_calle_casa = ? AND v_numero_casa = ?");
            $stmt->execute([$calle, $numero]);
        } else {
            $stmt = $this->pdo->prepare("SELECT * FROM estado_cuentas");
            $stmt->execute();
        }
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerMovimientos($calle = null, $numero = null) {
        if ($calle && $numero) {
            $stmt = $this->pdo->prepare("SELECT * FROM movimiento_cxc_recibo WHERE v_calle_casa = ? AND v_numero_casa = ?");
            $stmt->execute([$calle, $numero]);
        } else {
            $stmt = $this->pdo->prepare("SELECT * FROM movimiento_cxc_recibo");
            $stmt->execute();
        }
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerDetallesPorCXC($cxc_id) {
    $stmt = $this->pdo->prepare("
        SELECT 
            cargo.cg_nombre, 
            cargo.cg_descripcion, 
            cargo.cg_costo 
        FROM cxc 
        JOIN cargo ON cxc.cxc_id_cg = cargo.cg_id 
        WHERE cxc.cxc_id = ?
    ");
    $stmt->execute([$cxc_id]);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

}