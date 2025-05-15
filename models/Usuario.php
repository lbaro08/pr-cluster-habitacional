<?php
class Usuario {
    public $u_rfc;
    public $u_nombre;
    public $u_telefono;
    public $u_tipo;
    public $u_password;
    public $u_old_password;

    public function __construct($data) {
        $this->u_rfc = $data['u_rfc'] ?? null;
        $this->u_nombre = $data['u_nombre'] ?? null;
        $this->u_telefono = $data['u_telefono'] ?? null;
        $this->u_tipo = $data['u_tipo'] ?? null;
        $this->u_password = $data['u_password'] ?? null;
        $this->u_old_password = $data['u_old_password'] ?? null;
    }

    public function validar() {
        $validaciones = [
            'rfc' => preg_match('/^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/', $this->u_rfc),
            'nombre' => !$this->u_nombre || preg_match('/^[A-Za-zÑñ& ]{1,100}$/', $this->u_nombre),
            'telefono' => !$this->u_telefono || preg_match('/^[0-9]{10}$/', $this->u_telefono),
            'tipo' => !$this->u_tipo || preg_match('/^[01]$/', $this->u_tipo)
        ];

        // Validar contraseña solo si se proporciona
        if ($this->u_password) {
            $validaciones['password'] = preg_match('/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/', $this->u_password);
        }

        // Validar contraseña antigua solo si se proporciona
        if ($this->u_old_password) {
            $validaciones['old_password'] = preg_match('/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/', $this->u_old_password);
        }

        // Validar que la contraseña antigua y nueva sean diferentes
        if ($this->u_old_password && $this->u_password) {
            $validaciones['password_diff'] = $this->u_old_password !== $this->u_password;
        }

        // Devolver el resultado de las validaciones
        // Si alguna validación falla, se devuelve false
        return !in_array(false, $validaciones);
    }
}