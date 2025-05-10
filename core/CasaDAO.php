<?php
require_once __DIR__ . '/../config/connection.php';

class CasaDAO {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function crear(Casa $casa) {
        $stmt = $this->pdo->prepare("
            INSERT INTO casa (c_calle, c_numero, c_rfc_propietario, c_rfc_inquilino)
            VALUES (?, ?, ?, ?)
        ");
        return $stmt->execute([
            $casa->c_calle, $casa->c_numero,
            $casa->c_rfc_propietario, $casa->c_rfc_inquilino
        ]);
    }

    public function obtenerTodos() {
        $stmt = $this->pdo->query("SELECT * FROM casa");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtener($calle, $numero) {
        $stmt = $this->pdo->prepare("SELECT * FROM casa WHERE c_calle = ? AND c_numero = ?");
        $stmt->execute([$calle, $numero]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function actualizar(Casa $casa) {
        $stmt = $this->pdo->prepare("
            UPDATE casa 
            SET c_rfc_propietario = ?, c_rfc_inquilino = ?
            WHERE c_calle = ? AND c_numero = ?
        ");
        return $stmt->execute([
            $casa->c_rfc_propietario, $casa->c_rfc_inquilino,
            $casa->c_calle, $casa->c_numero
        ]);
    }

    public function eliminar($calle, $numero) {
        $stmt = $this->pdo->prepare("DELETE FROM casa WHERE c_calle = ? AND c_numero = ?");
        return $stmt->execute([$calle, $numero]);
    }
}
