<?php
require_once __DIR__ . '/../config/connection.php';

class PagoDAO {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create(Pago $pago) {
    $stmt = $this->pdo->prepare("
        INSERT INTO pago (c_calle, c_numero, u_rfc, p_fecha, p_folio, p_monto)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    return $stmt->execute([
        $pago->c_calle,
        $pago->c_numero,
        $pago->u_rfc,
        $pago->p_fecha,
        $pago->p_folio,
        $pago->p_monto
    ]);
}
}

