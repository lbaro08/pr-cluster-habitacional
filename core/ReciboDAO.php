<?php
require_once  __DIR__ . '/../config/connection.php';

class ReciboDAO {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function crearPago($recibo) {
        $stmt = $this->pdo->prepare("CALL realizar_pago(?, ?, ?, ?)");
        return $stmt->execute([
            $recibo->r_id_cxc,
            $recibo->r_folio,
            $recibo->r_monto,
            $recibo->r_rfc_usuario_cliente
        ]);
    }

    public function validarPago($recibo) {
        $stmt = $this->pdo->prepare("CALL validar_recibo(?, ?, ?, ?)");
        return $stmt->execute([
            $recibo->r_id_cxc,
            $recibo->r_folio,
            $recibo->r_status,
            $recibo->r_rfc_usuario_verificador
        ]);
    }

    public function obtenerPorCXC($id_cxc) {
        $stmt = $this->pdo->prepare("SELECT * FROM recibo WHERE r_id_cxc = ?");
        $stmt->execute([$id_cxc]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorFolio($folio) {
        $stmt = $this->pdo->prepare("SELECT * FROM recibo WHERE r_folio = ?");
        $stmt->execute([$folio]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function obtenerPorCliente($rfc_cliente) {
        $stmt = $this->pdo->prepare("SELECT * FROM recibo WHERE r_rfc_usuario_cliente = ?");
        $stmt->execute([$rfc_cliente]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerTodos() {
        $stmt = $this->pdo->prepare("SELECT * FROM recibo");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}