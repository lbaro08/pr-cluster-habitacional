<?php
class Comentario {
    public $c_id;
    public $c_id_f;
    public $c_rfc_usuario;
    public $c_contenido;
    public $c_fecha;

    public function __construct($data) {
        $this->c_id = $data['c_id'] ?? null;
        $this->c_id_f = $data['c_id_f'] ?? null;
        $this->c_rfc_usuario = $data['c_rfc_usuario'] ?? null;
        $this->c_contenido = $data['c_contenido'] ?? null;
        $this->c_fecha = $data['c_fecha'] ?? null;
    }

    public function validar() {
        $validaciones = [
            'id_publicacion' => is_numeric($this->c_id_f),
            'rfc' => preg_match('/^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/', $this->c_rfc_usuario),
            'contenido' => !empty($this->c_contenido)
        ];

        return !in_array(false, $validaciones);
    }
}