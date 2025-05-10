<?php
require_once __DIR__ . '/../config/connection.php';

class UsuarioDAO {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($usuario) {
        $stmt = $this->pdo->prepare("INSERT INTO usuario (u_rfc, u_nombre, u_telefono, u_tipo, u_password) VALUES (?, ?, ?, ?, ?)");
        return $stmt->execute([$usuario->u_rfc, $usuario->u_nombre, $usuario->u_telefono, $usuario->u_tipo, $usuario->u_password]);
    }

    public function read($rfc) {
        $stmt = $this->pdo->prepare("SELECT * FROM usuario WHERE u_rfc = ?");
        $stmt->execute([$rfc]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function update($usuario) {
        $stmt = $this->pdo->prepare("UPDATE usuario SET u_nombre = ?, u_telefono = ?, u_tipo = ?, u_password = ? WHERE u_rfc = ?");
        return $stmt->execute([$usuario->u_nombre, $usuario->u_telefono, $usuario->u_tipo, $usuario->u_password, $usuario->u_rfc]);
    }

    public function delete($rfc) {
        $stmt = $this->pdo->prepare("DELETE FROM usuario WHERE u_rfc = ?");
        return $stmt->execute([$rfc]);
    }
}
?>
