<?php
// Habilitar la visualización de errores para depuración (puedes quitar esto en producción)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Asegurarse de devolver siempre JSON
header('Content-Type: application/json');

include 'conexion.php';

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['register'])) {
    $nombre = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');

    // Validar que los campos no estén vacíos
    if (strlen($nombre) >= 1 && strlen($email) >= 1) {
        $fechareg = date("d/m/y");
        $consulta = "INSERT INTO baseDatos(nombre, email, fecha_reg) VALUES (?, ?, ?)";
        
        // Usar prepared statements para mayor seguridad
        $stmt = $conex->prepare($consulta);
        $stmt->bind_param('sss', $nombre, $email, $fechareg);
        
        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'Suscripción exitosa';
        } else {
            $response['message'] = 'Error al guardar los datos en la base de datos';
        }
        
        $stmt->close();
    } else {
        $response['message'] = 'Por favor, complete todos los campos';
    }
} else {
    $response['message'] = 'Método no permitido';
}

// Siempre devolver una respuesta JSON
echo json_encode($response);
?>