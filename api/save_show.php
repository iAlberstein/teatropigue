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
        if (!mkdir($uploadDir, 0777, true)) {
            $response['message'] = 'Error al crear el directorio de uploads';
            echo json_encode($response);
            exit;
        }
    }

    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $image = $uploadDir . basename($_FILES['image']['name']);
        if (!move_uploaded_file($_FILES['image']['tmp_name'], $image)) {
            $response['message'] = 'Error al subir la imagen';
            echo json_encode($response);
            exit;
        }
    }

    if (isset($_FILES['bannerImage']) && $_FILES['bannerImage']['error'] === UPLOAD_ERR_OK) {
        $bannerImage = $uploadDir . basename($_FILES['bannerImage']['name']);
        if (!move_uploaded_file($_FILES['bannerImage']['tmp_name'], $bannerImage)) {
            $response['message'] = 'Error al subir la imagen del banner';
            echo json_encode($response);
            exit;
        }
    }

    try {
        if ($id > 0) {
            // Actualizar espectáculo existente
            $query = "UPDATE shows SET name = ?, description = ?, price = ?, mes = ?, date = ?, hora = ?, link = ?";
            $params = [$name, $description, $price, $mes, $date, $hora, $link];
            $paramTypes = str_repeat('s', 7); // name, description, mes, date, hora, link son strings; price es double

            if ($image) {
                $query .= ", image = ?";
                $params[] = $image;
                $paramTypes .= 's';
            }
            if ($bannerImage) {
                $query .= ", bannerImage = ?";
                $params[] = $bannerImage;
                $paramTypes .= 's';
            }

            $query .= " WHERE id_show = ?";
            $params[] = $id;
            $paramTypes .= 'i';

            $stmt = $conex->prepare($query);
            if (!$stmt) {
                throw new Exception('Error al preparar la consulta: ' . $conex->error);
            }

            $stmt->bind_param($paramTypes, ...$params);
        } else {
            // Crear nuevo espectáculo
            $query = "INSERT INTO shows (name, description, price, mes, date, hora, link, image, bannerImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
            $stmt = $conex->prepare($query);
            if (!$stmt) {
                throw new Exception('Error al preparar la consulta: ' . $conex->error);
            }
            $stmt->bind_param('ssdssssss', $name, $description, $price, $mes, $date, $hora, $link, $image, $bannerImage);
        }

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = $id > 0 ? 'Espectáculo actualizado' : 'Espectáculo creado';
        } else {
            $response['message'] = 'Error al guardar el espectáculo: ' . $stmt->error;
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