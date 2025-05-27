<?php
session_start();

// Tiempo máximo de inactividad (30 minutos)
define('SESSION_TIMEOUT', 1800);

function verificarSesion() {
    // Verificar si existe la sesión
    if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin']) {
        return false;
    }

    // Verificar timeout de sesión
    if (isset($_SESSION['last_activity']) && 
        (time() - $_SESSION['last_activity'] > SESSION_TIMEOUT)) {
        session_unset();
        session_destroy();
        return false;
    }

    // Actualizar último tiempo de actividad
    $_SESSION['last_activity'] = time();
    return true;
}

// Si se llama directamente al script
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    header('Content-Type: application/json');
    echo json_encode(['sesion_activa' => verificarSesion()]);
}