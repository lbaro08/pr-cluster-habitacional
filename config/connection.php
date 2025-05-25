<?php
$host = "localhost";
$dbname = "u117281852_25011403";
$username = "u117281852_25011403"; 
$password = "P4lm425$";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error al conectar: " . $e->getMessage());
}
