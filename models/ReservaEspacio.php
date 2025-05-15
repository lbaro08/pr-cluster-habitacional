<?php
class ReservaEspacio {
    public $re_fecha;
    public $re_espacio;
    public $re_rfc_usuario;
    public $re_detalle;

    public function __construct($data) {
        $this->re_fecha = $data['re_fecha'] ?? null;
        $this->re_espacio = isset($data['re_espacio']) ? intval($data['re_espacio']) : null;
        $this->re_rfc_usuario = $data['re_rfc_usuario'] ?? null;
        $this->re_detalle = $data['re_detalle'] ?? null;
    }

    public function validar() {
        $validaciones = [
            'fecha' => strtotime($this->re_fecha) !== false,
            'espacio' => $this->re_espacio >= 1 && $this->re_espacio <= 3,
            'rfc' => preg_match('/^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/', $this->re_rfc_usuario),
            'detalle' => strlen($this->re_detalle) <= 30
        ];

        return !in_array(false, $validaciones);
    }
}