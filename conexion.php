<?php
$conex = new mysqli("localhost", "c1382483_teatro", "mePU03vugo", "c1382483_teatro");

if ($conex->connect_error) {
    die("Error de conexión: " . $conex->connect_error);
}
?>