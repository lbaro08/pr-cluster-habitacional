<?php
class Publicacion {
    public $f_id;
    public $f_rfc_usuario;
    public $f_titulo;
    public $f_contenido;
    public $f_fecha;

    public function __construct($data) {
        $this->f_id = $data['f_id'] ?? null;
        $this->f_rfc_usuario = $data['f_rfc_usuario'] ?? null;
        $this->f_titulo = $data['f_titulo'] ?? null;
        $this->f_contenido = $data['f_contenido'] ?? null;
        $this->f_fecha = $data['f_fecha'] ?? null;
    }

    public function validar() {
        $validaciones = [
            'rfc' => preg_match('/^[A-ZÑ&]{4}[0-9]{6}[A-Z0-9]{3}$/', $this->f_rfc_usuario),
            'titulo' => !empty($this->f_titulo) && strlen($this->f_titulo) <= 255,
            'contenido' => !empty($this->f_contenido)
        ];

        return !in_array(false, $validaciones);
    }
}