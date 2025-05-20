<?php
require_once __DIR__ . '/../config/connection.php';

class UsuarioDAO {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($usuario) {
        $stmt = ($usuario->u_tipo == '1') ? 
            $this->pdo->prepare("CALL registrar_superusuario(?, ?, ?, ?)") : 
            $this->pdo->prepare("CALL registrar_usuario(?, ?, ?, ?)");
        return $stmt->execute([
            $usuario->u_rfc, 
            $usuario->u_nombre, 
            $usuario->u_telefono, 
            $usuario->u_password
        ]);
    }

    public function read($rfc) {
        $stmt = $this->pdo->prepare("SELECT * FROM usuario WHERE u_rfc = ?");
        $stmt->execute([$rfc]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function readAll() {
    $stmt = $this->pdo->query("SELECT * FROM usuario");
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

    public function update($usuario) {
        try {
            if (!empty($usuario->u_nombre)) {
                $stmtNombre = $this->pdo->prepare("CALL modificar_usuario_nombre(?, ?)");
                $stmtNombre->execute([$usuario->u_rfc, $usuario->u_nombre]);
            }

            if (!empty($usuario->u_telefono)) {
                $stmtTelefono = $this->pdo->prepare("CALL modificar_usuario_telefono(?, ?)");
                $stmtTelefono->execute([$usuario->u_rfc, $usuario->u_telefono]);
            }

            if (!empty($usuario->u_password)) {
                $stmtPassword = $this->pdo->prepare("CALL modificar_usuario_password(?, ?, ?)");
                $stmtPassword->execute([
                    $usuario->u_rfc,
                    $usuario->u_old_password, 
                    $usuario->u_password
                ]);
            }

            return true;
        } catch (PDOException $e) {
            return false;
        }
    }

    public function delete($rfc) {
        $stmt = $this->pdo->prepare("DELETE FROM usuario WHERE u_rfc = ?");
        return $stmt->execute([$rfc]);
    }
}
?>
