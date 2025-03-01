<?php
header('Content-Type: application/json');
include 'conexion.php';

$query = "SELECT * FROM shows ORDER BY date ASC";
$result = $conex->query($query);

$shows = [];
while ($row = $result->fetch_assoc()) {
    $shows[] = $row;
}

echo json_encode($shows);
?>