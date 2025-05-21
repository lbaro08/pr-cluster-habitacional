<?php
require_once __DIR__ . '/../config/connection.php';

class ReservaEspacioDAO {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function crear($reserva) {
        $stmt = $this->pdo->prepare("CALL registrar_solicitud_espacio(?, ?, ?, ?)");
        return $stmt->execute([
            $reserva->re_fecha,
            $reserva->re_espacio,
            $reserva->re_rfc_usuario,
            $reserva->re_detalle
        ]);
    }

    public function verificarDisponibilidad($fecha, $espacio) {
        $stmt = $this->pdo->prepare("SELECT re_verificar_disponibilidad(?, ?) as disponible");
        $stmt->execute([$fecha, $espacio]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['disponible'] == 1;
    }

    public function obtenerPorFecha($fecha) {
        $stmt = $this->pdo->prepare("SELECT * FROM reserva_espacio WHERE re_fecha = ?");
        $stmt->execute([$fecha]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorUsuario($rfc) {
        $stmt = $this->pdo->prepare("SELECT * FROM reserva_espacio WHERE re_rfc_usuario = ?");
        $stmt->execute([$rfc]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerTodas() {
        $stmt = $this->pdo->prepare("
        SELECT reserva_espacio.*,u_nombre FROM reserva_espacio
        inner JOIN usuario u on reserva_espacio.re_rfc_usuario = u.u_rfc
        ORDER BY re_fecha");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}