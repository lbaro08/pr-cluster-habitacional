<?php
require_once __DIR__ . '/../config/connection.php';
require_once __DIR__ . '/ComentarioDAO.php';

class PublicacionDAO {
    private $pdo;
    private $comentarioDAO;

    public function __construct($pdo) {
        $this->pdo = $pdo;
        $this->comentarioDAO = new ComentarioDAO($pdo);
    }

    public function crear($publicacion) {
        $stmt = $this->pdo->prepare("
            INSERT INTO publicacion (f_rfc_usuario, f_titulo, f_contenido, f_fecha)
            VALUES (?, ?, ?, NOW())
        ");
        return $stmt->execute([
            $publicacion->f_rfc_usuario,
            $publicacion->f_titulo,
            $publicacion->f_contenido
        ]);
    }

    public function obtenerTodas() {
        $stmt = $this->pdo->prepare("
            SELECT p.*, u.u_nombre
            FROM publicacion p
            JOIN usuario u ON p.f_rfc_usuario = u.u_rfc
            ORDER BY p.f_fecha DESC
        ");
        $stmt->execute();
        $publicaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // Agregamos los comentarios a cada publicación
        foreach ($publicaciones as &$publicacion) {
            $publicacion['comentarios'] = $this->comentarioDAO->obtenerPorPublicacion($publicacion['f_id']);
        }
        
        return $publicaciones;
    }

    public function obtenerPorId($id) {
        $stmt = $this->pdo->prepare("
            SELECT p.*, u.u_nombre
            FROM publicacion p
            JOIN usuario u ON p.f_rfc_usuario = u.u_rfc
            WHERE p.f_id = ?
        ");
        $stmt->execute([$id]);
        $publicacion = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($publicacion) {
            $publicacion['comentarios'] = $this->comentarioDAO->obtenerPorPublicacion($id);
        }
        
        return $publicacion;
    }

    public function obtenerPorUsuario($rfc) {
        $stmt = $this->pdo->prepare("
            SELECT p.*, u.u_nombre
            FROM publicacion p
            JOIN usuario u ON p.f_rfc_usuario = u.u_rfc
            WHERE p.f_rfc_usuario = ?
            ORDER BY p.f_fecha DESC
        ");
        $stmt->execute([$rfc]);
        $publicaciones = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($publicaciones as &$publicacion) {
            $publicacion['comentarios'] = $this->comentarioDAO->obtenerPorPublicacion($publicacion['f_id']);
        }
        
        return $publicaciones;
    }

    public function actualizar($publicacion) {
        try {
            $this->pdo->beginTransaction();
            
            if (!$this->verificarPropietario($publicacion->f_id, $publicacion->f_rfc_usuario)) {
                throw new Exception("No autorizado para editar esta publicación");
            }

            $stmt = $this->pdo->prepare("
                UPDATE publicacion 
                SET f_titulo = ?, f_contenido = ?
                WHERE f_id = ? AND f_rfc_usuario = ?
            ");
            $resultado = $stmt->execute([
                $publicacion->f_titulo,
                $publicacion->f_contenido,
                $publicacion->f_id,
                $publicacion->f_rfc_usuario
            ]);

            $this->pdo->commit();
            return $resultado;
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function eliminar($id, $rfc_usuario) {
        try {
            $this->pdo->beginTransaction();

            if (!$this->verificarPropietario($id, $rfc_usuario)) {
                throw new Exception("No autorizado para eliminar esta publicación");
            }

            // Primero eliminamos todos los comentarios asociados
            $stmt = $this->pdo->prepare("DELETE FROM comentario WHERE c_id_f = ?");
            $stmt->execute([$id]);

            // Luego eliminamos la publicación
            $stmt = $this->pdo->prepare("
                DELETE FROM publicacion 
                WHERE f_id = ? AND f_rfc_usuario = ?
            ");
            $resultado = $stmt->execute([$id, $rfc_usuario]);

            $this->pdo->commit();
            return $resultado;
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function verificarPropietario($id, $rfc_usuario) {
        $stmt = $this->pdo->prepare("
            SELECT COUNT(*) FROM publicacion 
            WHERE f_id = ? AND f_rfc_usuario = ?
        ");
        $stmt->execute([$id, $rfc_usuario]);
        return $stmt->fetchColumn() > 0;
    }
}