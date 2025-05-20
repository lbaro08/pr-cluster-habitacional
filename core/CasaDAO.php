<?php
require_once __DIR__ . '/../config/connection.php';

class CasaDAO {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function crear($casa) {
        $stmt = $this->pdo->prepare("INSERT INTO casa (c_calle, c_numero, c_rfc_propietario) VALUES (?, ?, ?)");
        return $stmt->execute([
            $casa->c_calle,
            $casa->c_numero,
            $casa->c_rfc_propietario
        ]);
    }

    public function asignarInquilino($calle, $numero, $rfc) {
        $stmt = $this->pdo->prepare("CALL asignar_inquilino(?, ?, ?)");
        return $stmt->execute([$calle, $numero, $rfc]);
    }

    public function revocarInquilino($calle, $numero, $rfc) {
        $stmt = $this->pdo->prepare("CALL revocar_inquilino(?, ?, ?)");
        return $stmt->execute([$calle, $numero, $rfc]);
    }

    public function modificarPropietario($calle, $numero, $rfc) {
        $stmt = $this->pdo->prepare("CALL modificar_propietario(?, ?, ?)");
        return $stmt->execute([$calle, $numero, $rfc]);
    }

    public function casaDisponible($calle, $numero) {
        $stmt = $this->pdo->prepare("SELECT casa_inquilino_disponible(?, ?) as disponible");
        $stmt->execute([$calle, $numero]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['disponible'] == 1;
    }

    public function obtener($calle, $numero) {
        $stmt = $this->pdo->prepare("SELECT * FROM casa WHERE c_calle = ? AND c_numero = ?");
        $stmt->execute([$calle, $numero]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("
        SELECT
        casa.c_calle,
        casa.c_numero,
        casa.c_rfc_propietario,
        propietario.u_nombre AS nombre_propietario,
        casa.c_rfc_inquilino,
        inquilino.u_nombre AS nombre_inquilino
        FROM casa
        LEFT JOIN usuario propietario ON casa.c_rfc_propietario = propietario.u_rfc
        LEFT JOIN usuario inquilino ON casa.c_rfc_inquilino = inquilino.u_rfc");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
