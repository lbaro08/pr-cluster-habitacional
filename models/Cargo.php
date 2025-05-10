<?php

class Cargo {
    public $cg_id;
    public $cg_nombre;
    public $cg_descripcion;
    public $cg_costo;

    public function __construct($data) {
        $this->cg_id = isset($data['cg_id']) ? $data['cg_id'] : null;
        $this->cg_nombre = isset($data['cg_nombre']) ? $data['cg_nombre'] : null;
        $this->cg_descripcion = isset($data['cg_descripcion']) ? $data['cg_descripcion'] : null;
        $this->cg_costo = isset($data['cg_costo']) ? floatval($data['cg_costo']) : null;
    }

    public function isValid() {
        return $this->validateId() &&
               $this->validateNombre() &&
               $this->validateDescripcion() &&
               $this->validateCosto();
    }

    private function validateId() {
        return preg_match('/^[A-Za-z0-9]{4}$/', $this->cg_id);
    }

    private function validateNombre() {
        return preg_match('/^[A-Za-zÑñ ]{1,10}$/u', $this->cg_nombre);
    }

    private function validateDescripcion() {
        return preg_match('/^[A-Za-zÑñ0-9 ,.]{1,25}$/u', $this->cg_descripcion);
    }

    private function validateCosto() {
        return is_numeric($this->cg_costo) && $this->cg_costo >= 0;
    }
}
