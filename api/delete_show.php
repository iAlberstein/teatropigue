<?php
header('Content-Type: application/json');
include 'conexion.php';

$response = ['success' => false, 'message' => ''];

if (isset($_POST['id'])) {
    $id = intval($_POST['id']);
    $query = "DELETE FROM shows WHERE id_show = ?";
    $stmt = $conex->prepare($query);
    $stmt->bind_param('i', $id);

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = 'Espectáculo eliminado';
    } else {
        $response['message'] = 'Error al eliminar el espectáculo';
    }

    $stmt->close();
}

echo json_encode($response);
?>