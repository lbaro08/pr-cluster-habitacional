<?php
class CXC {
    public $cxc_id;
    public $cxc_id_cg;
    public $cxc_calle_casa;
    public $cxc_numero_casa;
    public $cxc_costo;
    public $cxc_fecha_cobro;
    public $cxc_fecha_limite;

    public function __construct($data) {
        $this->cxc_id = $data['cxc_id'] ?? null;
        $this->cxc_id_cg = $data['cxc_id_cg'] ?? null;
        $this->cxc_calle_casa = $data['cxc_calle_casa'] ?? null;
        $this->cxc_numero_casa = $data['cxc_numero_casa'] ?? null;
        $this->cxc_costo = isset($data['cxc_costo']) ? floatval($data['cxc_costo']) : null;
        $this->cxc_fecha_cobro = $data['cxc_fecha_cobro'] ?? null;
        $this->cxc_fecha_limite = $data['cxc_fecha_limite'] ?? null;
    }

    public function validar() {
        $validaciones = [
            'id' => preg_match('/^[0-9]{7}$/', $this->cxc_id),
            'id_cg' => preg_match('/^[A-Z0-9]{4}$/', $this->cxc_id_cg),
            'calle' => preg_match('/^[A-Z]$/', $this->cxc_calle_casa),
            'numero' => preg_match('/^[0-9]{2}$/', $this->cxc_numero_casa),
            'costo' => is_numeric($this->cxc_costo) && $this->cxc_costo > 0,
            'fecha_cobro' => strtotime($this->cxc_fecha_cobro) !== false,
            'fecha_limite' => strtotime($this->cxc_fecha_limite) !== false
        ];

        return !in_array(false, $validaciones);
    }
}