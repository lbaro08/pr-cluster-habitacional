<?php
class Casa {
    public $c_calle;
    public $c_numero;
    public $c_rfc_propietario;
    public $c_rfc_inquilino;

    public function __construct($data) {
        $this->c_calle = $data['c_calle'] ?? null;
        $this->c_numero = $data['c_numero'] ?? null;
        $this->c_rfc_propietario = $data['c_rfc_propietario'] ?? null;
        $this->c_rfc_inquilino = $data['c_rfc_inquilino'] ?? null;
    }

    public function validar() {
        return (
            preg_match('/^[A-Z]$/', $this->c_calle) &&
            preg_match('/^[0-9]{2}$/', $this->c_numero) &&
            preg_match('/^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/', $this->c_rfc_propietario) &&
            preg_match('/^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/', $this->c_rfc_inquilino)
        );
    }
}
