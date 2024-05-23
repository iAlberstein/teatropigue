<?php
error_reporting(E_ALL);
ini_set('display_errors', '1');
include 'conexion.php';

if (isset($_POST['register'])) {
    if (strlen($_POST['name']) >= 1 && strlen($_POST['email']) >= 1) {
        $nombre = trim($_POST['name']);
        $email = trim($_POST['email']);
        $fechareg = date("d/m/y");
        $consulta = "INSERT INTO baseDatos(nombre, email, fecha_reg) VALUES ('$nombre','$email','$fechareg')";
        $resultado = mysqli_query($conex, $consulta);
        ob_start();
        if ($resultado) {
            header('Location: pages/suscripcionExitosa.html');
            exit;
        } else {
            ?>
            <h3 class="bad">¡Ups, ha ocurrido un error!</h3>
            <?php
        }
    } else {
        ?>
        <h3 class="bad">¡Por favor, complete los campos!</h3>
        <?php
    }
}
?>