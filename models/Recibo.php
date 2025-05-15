<?php
class Recibo { 
    public $r_id_cxc;
    public $r_folio;
    public $r_monto;
    public $r_fecha_peticion;
    public $r_status;
    public $r_rfc_usuario_cliente;
    public $r_rfc_usuario_verificador;
    public $r_fecha_verificacion;

    public function __construct($data) {
        $this->r_id_cxc = $data['r_id_cxc'] ?? null;
        $this->r_folio = $data['r_folio'] ?? null;
        $this->r_monto = isset($data['r_monto']) ? floatval($data['r_monto']) : null;
        $this->r_fecha_peticion = $data['r_fecha_peticion'] ?? null;
        $this->r_status = $data['r_status'] ?? null;
        $this->r_rfc_usuario_cliente = $data['r_rfc_usuario_cliente'] ?? null;
        $this->r_rfc_usuario_verificador = $data['r_rfc_usuario_verificador'] ?? null;
        $this->r_fecha_verificacion = $data['r_fecha_verificacion'] ?? null;
    }

    public function validar() {
        $validaciones = [
            'id_cxc' => preg_match('/^[0-9]{7}$/', $this->r_id_cxc),
            'folio' => preg_match('/^[0-9]{10}$/', $this->r_folio),
            'monto' => is_numeric($this->r_monto) && $this->r_monto > 0,
            'rfc_cliente' => preg_match('/^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/', $this->r_rfc_usuario_cliente)
        ];

        if ($this->r_status !== null) {
            $validaciones['status'] = preg_match('/^[01]$/', $this->r_status);
        }

        if ($this->r_rfc_usuario_verificador !== null) {
            $validaciones['rfc_verificador'] = preg_match('/^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/', $this->r_rfc_usuario_verificador);
        }

        return !in_array(false, $validaciones);
    }
}