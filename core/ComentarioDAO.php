<?php
require_once __DIR__ . '/../config/connection.php';

class ComentarioDAO {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function crear($comentario) {
        $stmt = $this->pdo->prepare("
            INSERT INTO comentario (c_id_f, c_rfc_usuario, c_contenido)
            VALUES (?, ?, ?)
        ");
        return $stmt->execute([
            $comentario->c_id_f,
            $comentario->c_rfc_usuario,
            $comentario->c_contenido
        ]);
    }

    public function obtenerPorPublicacion($idPublicacion) {
        $stmt = $this->pdo->prepare("
            SELECT c.*, u.u_nombre
            FROM comentario c
            JOIN usuario u ON c.c_rfc_usuario = u.u_rfc
            WHERE c.c_id_f = ?
            ORDER BY c.c_fecha ASC
        ");
        $stmt->execute([$idPublicacion]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizar($comentario) {
        $stmt = $this->pdo->prepare("
            UPDATE comentario 
            SET c_contenido = ?
            WHERE c_id = ? AND c_id_f = ? AND c_rfc_usuario = ?
        ");
        return $stmt->execute([
            $comentario->c_contenido,
            $comentario->c_id,
            $comentario->c_id_f,
            $comentario->c_rfc_usuario
        ]);
    }

    public function eliminar($id, $id_publicacion, $rfc_usuario) {
        $stmt = $this->pdo->prepare("
            DELETE FROM comentario 
            WHERE c_id = ? AND c_id_f = ? AND c_rfc_usuario = ?
        ");
        return $stmt->execute([$id, $id_publicacion, $rfc_usuario]);
    }

    public function verificarPropietario($id, $id_publicacion, $rfc_usuario) {
        $stmt = $this->pdo->prepare("
            SELECT COUNT(*) FROM comentario 
            WHERE c_id = ? AND c_id_f = ? AND c_rfc_usuario = ?
        ");
        $stmt->execute([$id, $id_publicacion, $rfc_usuario]);
        return $stmt->fetchColumn() > 0;
    }
}