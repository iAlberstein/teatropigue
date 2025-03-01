<?php
header('Content-Type: application/json');
include 'conexion.php';

$currentDate = date('Y-m-d');
$query = "SELECT * FROM shows WHERE date >= '$currentDate' ORDER BY date ASC LIMIT 1";
$result = $conex->query($query);

$show = $result->fetch_assoc();
echo json_encode($show);
?>