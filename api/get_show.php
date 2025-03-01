<?php
header('Content-Type: application/json');
include 'conexion.php';

$id = isset($_GET['id']) ? intval($_GET['id']) : 0;
$query = "SELECT * FROM shows WHERE id_show = $id";
$result = $conex->query($query);

$show = $result->fetch_assoc();
echo json_encode($show);
?>