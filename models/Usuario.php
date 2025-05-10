<?php
class Usuario {
    public $u_rfc;
    public $u_nombre;
    public $u_telefono;
    public $u_tipo;
    public $u_password;

    public function __construct($data) {
        $this->u_rfc = $data['u_rfc'] ?? null;
        $this->u_nombre = $data['u_nombre'] ?? null;
        $this->u_telefono = $data['u_telefono'] ?? null;
        $this->u_tipo = $data['u_tipo'] ?? null;
        $this->u_password = $data['u_password'] ?? '123';
    }

    public function validar() {
        return preg_match('/^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/', $this->u_rfc)
            && preg_match('/^[A-Za-zÑñ& ]{1,100}$/', $this->u_nombre)
            && preg_match('/^[0-9]{10}$/', $this->u_telefono)
            && preg_match('/^[01]$/', $this->u_tipo);
    }
}
?>
