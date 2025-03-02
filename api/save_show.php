<?php
header('Content-Type: application/json');
$response = ['success' => false, 'message' => ''];

// Incluir archivo de conexión
include '../conexion.php';

// Verificar conexión a la base de datos
if ($conex->connect_error) {
    $response['message'] = 'Error de conexión a la base de datos: ' . $conex->connect_error;
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Capturar datos del formulario
    $name = isset($_POST['name']) ? trim($_POST['name']) : '';
    $description = isset($_POST['description']) ? trim($_POST['description']) : '';
    $price = isset($_POST['price']) ? floatval($_POST['price']) : 0;
    $mes = isset($_POST['mes']) ? trim($_POST['mes']) : '';
    $date = isset($_POST['date']) ? trim($_POST['date']) : '';
    $hora = isset($_POST['hora']) ? trim($_POST['hora']) : '';
    $link = isset($_POST['link']) ? trim($_POST['link']) : '';
    $id = isset($_POST['edit-id']) ? intval($_POST['edit-id']) : 0;

    // Validar campos requeridos
    if (empty($name) || empty($mes) || empty($date) || empty($hora) || empty($link)) {
        $response['message'] = 'Complete todos los campos requeridos';
        echo json_encode($response);
        exit;
    }

    // Manejo de archivos (simplificado)
    $image = '';
    $bannerImage = '';
    $uploadDir = '../uploads/';
    if (!file_exists($uploadDir)) mkdir($uploadDir, 0777, true);

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $image = 'uploads/' . basename($_FILES['image']['name']);
        move_uploaded_file($_FILES['image']['tmp_name'], $uploadDir . basename($_FILES['image']['name']));
    }

    if (isset($_FILES['bannerImage']) && $_FILES['bannerImage']['error'] === UPLOAD_ERR_OK) {
        $bannerImage = 'uploads/' . basename($_FILES['bannerImage']['name']);
        move_uploaded_file($_FILES['bannerImage']['tmp_name'], $uploadDir . basename($_FILES['bannerImage']['name']));
    }

    // Guardar en la base de datos
    if ($id > 0) {
        // Actualizar espectáculo existente
        $query = "UPDATE shows SET name = ?, description = ?, price = ?, mes = ?, date = ?, hora = ?, link = ?, image = ?, bannerImage = ? WHERE id_show = ?";
        $stmt = $conex->prepare($query);
        $stmt->bind_param('ssdssssssi', $name, $description, $price, $mes, $date, $hora, $link, $image, $bannerImage, $id);
    } else {
        // Crear nuevo espectáculo
        $query = "INSERT INTO shows (name, description, price, mes, date, hora, link, image, bannerImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conex->prepare($query);
        $stmt->bind_param('ssdssssss', $name, $description, $price, $mes, $date, $hora, $link, $image, $bannerImage);
    }

    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = $id > 0 ? 'Espectáculo actualizado' : 'Espectáculo creado';
    } else {
        $response['message'] = 'Error al guardar: ' . $stmt->error;
    }

    $stmt->close();
} else {
    $response['message'] = 'Método no permitido';
}

echo json_encode($response);
?>