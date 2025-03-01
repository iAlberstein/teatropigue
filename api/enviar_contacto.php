<?php
// Habilitar la visualización de errores para depuración
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Asegurarse de que siempre devolvamos JSON
header('Content-Type: application/json');

// Incluir PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

try {
    require '../lib/PHPMailer/src/Exception.php';
    require '../lib/PHPMailer/src/PHPMailer.php';
    require '../lib/PHPMailer/src/SMTP.php';
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
        $mail->Username = EMAIL_USER; // Usar la constante
        $mail->Password = EMAIL_PASS; // Usar la constante
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL
        $mail->Port = 465;

        // Configurar el remitente y destinatario
        $mail->setFrom($email, $name); // El correo del usuario como remitente
        $mail->addAddress('teatropigue@gmail.com', 'Teatro Español Pigüé'); // Tu correo como destinatario

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