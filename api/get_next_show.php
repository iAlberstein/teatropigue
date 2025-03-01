<?php
// Habilitar la visualización de errores para depuración (puedes quitar esto en producción)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Asegurarse de que siempre devolvamos JSON
header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

// Incluir archivo de conexión
$basePath = dirname(__DIR__); // Esto sube un nivel desde /api/ a /teatropigue/
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

// Verificar conexión a la base de datos
if ($conex->connect_error) {
    $response['message'] = 'Error de conexión a la base de datos: ' . $conex->connect_error;
    echo json_encode($response);
    exit;
}

// Obtener el próximo espectáculo
try {
    $currentDate = date('Y-m-d');
    $query = "SELECT * FROM shows WHERE date >= '$currentDate' ORDER BY date ASC LIMIT 1";
    $result = $conex->query($query);

    if ($result === false) {
        $response['message'] = 'Error en la consulta: ' . $conex->error;
        echo json_encode($response);
        exit;
    }

    $show = $result->fetch_assoc();
    if ($show) {
        $response['success'] = true;
        $response['data'] = $show;
    } else {
        $response['message'] = 'No se encontraron espectáculos futuros';
    }
} catch (Exception $e) {
    $response['message'] = 'Error al obtener el próximo espectáculo: ' . $e->getMessage();
}

echo json_encode($response);
?>