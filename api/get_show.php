<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set JSON content type
header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

// Include database connection
$basePath = dirname(__DIR__);
$conexionPath = $basePath . '/conexion.php';

if (!file_exists($conexionPath)) {
    $response['message'] = 'Connection file not found at ' . $conexionPath;
    echo json_encode($response);
    exit;
}

try {
    include $conexionPath;
} catch (Exception $e) {
    $response['message'] = 'Error including connection file: ' . $e->getMessage();
    echo json_encode($response);
    exit;
}

// Verify database connection
if ($conex->connect_error) {
    $response['message'] = 'Database connection error: ' . $conex->connect_error;
    echo json_encode($response);
    exit;
}

// Get the show by ID
try {
    if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
        $response['message'] = 'Invalid or missing show ID';
        echo json_encode($response);
        exit;
    }

    $id = (int)$_GET['id'];
    $query = "SELECT * FROM shows WHERE id_show = ?";
    $stmt = $conex->prepare($query);
    $stmt->bind_param('i', $id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result === false) {
        $response['message'] = 'Query error: ' . $conex->error;
        echo json_encode($response);
        exit;
    }

    $show = $result->fetch_assoc();
    $stmt->close();

    if ($show) {
        $response['success'] = true;
        $response['data'] = $show;
    } else {
        $response['message'] = 'Show not found';
    }
} catch (Exception $e) {
    $response['message'] = 'Error fetching show: ' . $e->getMessage();
}

echo json_encode($response);
?>