<?php
header('Content-Type: application/json');
include 'conexion.php';

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = $_POST['name'] ?? '';
    $description = $_POST['description'] ?? '';
    $price = $_POST['price'] ?? 0;
    $mes = $_POST['mes'] ?? '';
    $date = $_POST['date'] ?? '';
    $hora = $_POST['hora'] ?? '';
    $link = $_POST['link'] ?? '';
    $id = isset($_POST['id']) ? intval($_POST['id']) : 0;

    // Manejo de archivos (imagen y bannerImage)
    $image = '';
    $bannerImage = '';
    $uploadDir = 'uploads/';

    if (!file_exists($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $image = $uploadDir . basename($_FILES['image']['name']);
        move_uploaded_file($_FILES['image']['tmp_name'], $image);
    }

    if (isset($_FILES['bannerImage']) && $_FILES['bannerImage']['error'] === UPLOAD_ERR_OK) {
        $bannerImage = $uploadDir . basename($_FILES['bannerImage']['name']);
        move_uploaded_file($_FILES['bannerImage']['tmp_name'], $bannerImage);
    }

    if ($id > 0) {
        // Actualizar espectáculo existente
        $query = "UPDATE shows SET name = ?, description = ?, price = ?, mes = ?, date = ?, hora = ?, link = ?";
        $params = [$name, $description, $price, $mes, $date, $hora, $link];

        if ($image) {
            $query .= ", image = ?";
            $params[] = $image;
        }
        if ($bannerImage) {
            $query .= ", bannerImage = ?";
            $params[] = $bannerImage;
        }

        $query .= " WHERE id_show = ?";
        $params[] = $id;

        $stmt = $conex->prepare($query);
        $stmt->bind_param(str_repeat('s', count($params) - 1) . 'i', ...$params);
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
        $response['message'] = 'Error al guardar el espectáculo';
    }

    $stmt->close();
}

echo json_encode($response);
?>