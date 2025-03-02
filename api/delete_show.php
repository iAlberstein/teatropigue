<?php
// Habilitar la visualización de errores para depuración
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

    if ($id <= 0) {
        $response['message'] = 'ID inválido';
        echo json_encode($response);
        exit;
    }

    try {
        $query = "DELETE FROM shows WHERE id_show = ?";
        $stmt = $conex->prepare($query);
        if (!$stmt) {
            throw new Exception('Error al preparar la consulta: ' . $conex->error);
        }

        $stmt->bind_param('i', $id);

        if ($stmt->execute()) {
            if ($stmt->affected_rows > 0) {
                $response['success'] = true;
                $response['message'] = 'Espectáculo eliminado correctamente';
            } else {
                $response['message'] = 'No se encontró el espectáculo con el ID proporcionado';
            }
        } else {
            $response['message'] = 'Error al eliminar el espectáculo: ' . $stmt->error;
        }

        $stmt->close();
    } catch (Exception $e) {
        $response['message'] = 'Error al procesar la solicitud: ' . $e->getMessage();
    }
} else {
    $response['message'] = 'Método no permitido';
}

echo json_encode($response);
?>