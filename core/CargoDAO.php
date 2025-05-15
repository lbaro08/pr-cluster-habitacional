<?php
require_once __DIR__ . '/../config/connection.php';

class CargoDAO {
    private $pdo;

    public function __construct($pdo) {
        $this->pdo = $pdo;
    }

    public function create($cargo) {
        $stmt = $this->pdo->prepare("INSERT INTO cargo (cg_id, cg_nombre, cg_descripcion, cg_costo) VALUES (?, ?, ?, ?)");
        return $stmt->execute([
            $cargo->cg_id,
            $cargo->cg_nombre,
            $cargo->cg_descripcion,
            $cargo->cg_costo
        ]);
    }

    public function read($id = null) {
        if ($id) {
            $stmt = $this->pdo->prepare("SELECT * FROM cargo WHERE cg_id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            $stmt = $this->pdo->prepare("SELECT * FROM cargo");
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }
    }

    public function update($cargo) {
        $stmt = $this->pdo->prepare("UPDATE cargo SET cg_nombre = ?, cg_descripcion = ?, cg_costo = ? WHERE cg_id = ?");
        return $stmt->execute([
            $cargo->cg_nombre,
            $cargo->cg_descripcion,
            $cargo->cg_costo,
            $cargo->cg_id
        ]);
    }

    public function delete($id) {
        $stmt = $this->pdo->prepare("DELETE FROM cargo WHERE cg_id = ?");
        return $stmt->execute([$id]);
    }

    public function generarCargos($calle, $numero, $fechaCobro, $fechaLimite) {
        $stmt = $this->pdo->prepare("CALL aux_generar_cargos(?, ?, ?, ?)");
        return $stmt->execute([
            $calle,
            $numero,
            $fechaCobro,
            $fechaLimite
        ]);
    }

    public function cobrarServicios($fechaCobro, $fechaLimite) {
        $stmt = $this->pdo->prepare("CALL cobrar_servicios(?, ?)");
        return $stmt->execute([
            $fechaCobro,
            $fechaLimite
        ]);
    }
}