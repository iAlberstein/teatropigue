<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

$basePath = dirname(__DIR__);
$conexionPath = $basePath . '/conexion.php';

if (!file_exists($conexionPath)) {
    $response['message'] = 'Archivo de conexión no encontrado en ' . $conexionPath;
    echo json_encode($response);
    exit;
}

try {
    include $conexionPath;
} catch (Exception $e) {
    $response['message'] = 'Error al incluir el archivo de conexión: ' . $e->getMessage();
    echo json_encode($response);
    exit;
}

if ($conex->connect_error) {
    $response['message'] = 'Error de conexión a la base de datos: ' . $conex->connect_error;
    echo json_encode($response);
    exit;
}

try {
    $currentDate = date('Y-m-d');
    $query = "SELECT * FROM shows WHERE date >= '$currentDate' ORDER BY date ASC";
    $result = $conex->query($query);

    if ($result === false) {
        $response['message'] = 'Error en la consulta: ' . $conex->error;
        echo json_encode($response);
        exit;
    }

    $shows = [];
    while ($show = $result->fetch_assoc()) {
        $shows[] = $show;
    }

    if (!empty($shows)) {
        $response['success'] = true;
        $response['data'] = $shows;
    } else {
        $response['message'] = 'No se encontraron espectáculos futuros';
    }
} catch (Exception $e) {
    $response['message'] = 'Error al obtener los espectáculos futuros: ' . $e->getMessage();
}

echo json_encode($response);
?>