<?php
class Pago {
    public $p_id;
    public $c_calle;
    public $c_numero;
    public $u_rfc;
    public $p_fecha;
    public $p_folio;
    public $p_monto;

    public function __construct($data) {
        $this->p_id = $data['p_id'] ?? null;
        $this->c_calle = $data['c_calle'] ?? null;
        $this->c_numero = $data['c_numero'] ?? null;
        $this->u_rfc = $data['u_rfc'] ?? null;
        $this->p_fecha = $data['p_fecha'] ?? null;
        $this->p_folio = $data['p_folio'] ?? null;
        $this->p_monto = isset($data['p_monto']) ? floatval($data['p_monto']) : null;
    }
}