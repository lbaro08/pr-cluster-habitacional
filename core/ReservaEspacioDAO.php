<?php
require_once __DIR__ . '/../config/connection.php';

class ReservaEspacioDAO
{
    private $pdo;

    public function __construct($pdo)
    {
        $this->pdo = $pdo;
    }

    public function crear($reserva)
    {
        $stmt = $this->pdo->prepare("CALL registrar_solicitud_espacio(?, ?, ?, ?)");
        return $stmt->execute([
            $reserva->re_fecha,
            $reserva->re_espacio,
            $reserva->re_rfc_usuario,
            $reserva->re_detalle
        ]);
    }

    public function verificarDisponibilidad($fecha, $espacio)
    {
        $stmt = $this->pdo->prepare("SELECT re_verificar_disponibilidad(?, ?) as disponible");
        $stmt->execute([$fecha, $espacio]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['disponible'] == 1;
    }

    public function obtenerPorFecha($fecha)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM reserva_espacio WHERE re_fecha = ?");
        $stmt->execute([$fecha]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerPorUsuario($rfc)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM reserva_espacio WHERE re_rfc_usuario = ?");
        $stmt->execute([$rfc]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function obtenerTodas()
    {
        $stmt = $this->pdo->prepare("
        SELECT reserva_espacio.*,u_nombre FROM reserva_espacio
        inner JOIN usuario u on reserva_espacio.re_rfc_usuario = u.u_rfc
        ORDER BY re_fecha");
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function actualizar($reserva, $fecha_original)
    {
        try {
            $this->pdo->beginTransaction();

            $stmt = $this->pdo->prepare("
                SELECT COUNT(*) 
                FROM reserva_espacio 
                WHERE re_fecha = ? AND re_espacio = ? AND re_rfc_usuario = ?
            ");
            $stmt->execute([$fecha_original, $reserva->re_espacio, $reserva->re_rfc_usuario]);

            if ($stmt->fetchColumn() == 0) {
                throw new Exception("No se encontró la reservación original");
            }

            if ($fecha_original != $reserva->re_fecha) {
                $disponible = $this->verificarDisponibilidad($reserva->re_fecha, $reserva->re_espacio);
                if (!$disponible) {
                    throw new Exception("El espacio no está disponible para la nueva fecha");
                }
            }

            $stmt = $this->pdo->prepare("
                UPDATE reserva_espacio 
                SET re_fecha = ?,
                    re_detalle = ?
                WHERE re_fecha = ? 
                    AND re_espacio = ? 
                    AND re_rfc_usuario = ?
            ");

            $resultado = $stmt->execute([
                $reserva->re_fecha,
                $reserva->re_detalle,
                $fecha_original,
                $reserva->re_espacio,
                $reserva->re_rfc_usuario
            ]);

            $this->pdo->commit();
            return $resultado;
        } catch (Exception $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function eliminarReservacion($fecha, $espacio, $rfc)
    {
        try {
            $stmt = $this->pdo->prepare("
                DELETE FROM reserva_espacio
                WHERE re_fecha = ? AND re_espacio = ? AND re_rfc_usuario = ?
            ");
            return $stmt->execute([$fecha, $espacio, $rfc]);
        } catch (PDOException $e) {
            throw new Exception("Error al eliminar la reservación: " . $e->getMessage());
        }
    }

    public function eliminarPorFecha($fecha)
    {
        try {
            $stmt = $this->pdo->prepare("DELETE FROM reserva_espacio WHERE re_fecha = ?");
            return $stmt->execute([$fecha]);
        } catch (PDOException $e) {
            throw new Exception("Error al eliminar las reservaciones: " . $e->getMessage());
        }
    }
}