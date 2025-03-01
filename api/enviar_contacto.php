<?php
// Habilitar la visualización de errores para depuración (puedes quitar esto en producción)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Asegurarse de que siempre devolvamos JSON
header('Content-Type: application/json');

// Incluir archivo de configuración para credenciales
$basePath = dirname(__DIR__); // Esto sube un nivel desde /api/ a /teatropigue/
$configPath = $basePath . '/config/config.php';
if (!file_exists($configPath)) {
    echo json_encode(['success' => false, 'message' => 'Archivo de configuración no encontrado en ' . $configPath]);
    exit;
}
require $configPath;

// Incluir PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Usar rutas absolutas para PHPMailer
$phpMailerPath = $basePath . '/lib/PHPMailer/src/';

// Verificar si los archivos de PHPMailer existen antes de incluirlos
$requiredFiles = ['Exception.php', 'PHPMailer.php', 'SMTP.php'];
foreach ($requiredFiles as $file) {
    if (!file_exists($phpMailerPath . $file)) {
        echo json_encode(['success' => false, 'message' => "Archivo de PHPMailer no encontrado: $file en $phpMailerPath"]);
        exit;
    }
}

try {
    require $phpMailerPath . 'Exception.php';
    require $phpMailerPath . 'PHPMailer.php';
    require $phpMailerPath . 'SMTP.php';
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error al cargar PHPMailer: ' . $e->getMessage()]);
    exit;
}

$response = ['success' => false, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $subject = $_POST['subject'] ?? '';
    $name = $_POST['name'] ?? '';
    $email = $_POST['email'] ?? '';
    $message = $_POST['message'] ?? '';

    // Validar que los campos no estén vacíos
    if (empty($subject) || empty($name) || empty($email) || empty($message)) {
        $response['message'] = 'Por favor, complete todos los campos';
        echo json_encode($response);
        exit;
    }

    // Validar formato de email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $response['message'] = 'Correo electrónico inválido';
        echo json_encode($response);
        exit;
    }

    // Configurar PHPMailer
    $mail = new PHPMailer(true);

    try {
        // Configuración del servidor SMTP (Gmail)
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = EMAIL_USER; // Usar la constante definida en config.php
        $mail->Password = EMAIL_PASS; // Usar la constante definida en config.php
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL
        $mail->Port = 465;

        // Configurar el remitente y destinatario
        $mail->setFrom($email, $name);
        $mail->addAddress('teatropigue@gmail.com', 'Teatro Español Pigüé');

        // Configurar el contenido del correo
        $mail->isHTML(false);
        $mail->Subject = "Nuevo mensaje: $subject";
        $mail->Body = "Nombre: $name\nCorreo: $email\nMensaje: $message";

        // Enviar el correo
        $mail->send();
        $response['success'] = true;
        $response['message'] = 'Mensaje enviado correctamente';
    } catch (Exception $e) {
        $response['message'] = "Error al enviar el mensaje: {$mail->ErrorInfo}";
    }
} else {
    $response['message'] = 'Método no permitido';
}

echo json_encode($response);
?>