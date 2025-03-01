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
        
        if ($resultado) {
            // Mostrar SweetAlert y limpiar el formulario con JavaScript
            echo "<script>
                Swal.fire({
                    title: '¡Éxito!',
                    text: 'Tu suscripción fue realizada correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Cerrar'
                }).then(function() {
                    // Limpiar el formulario
                    document.getElementById('formSuscripcion').reset();
                });
            </script>";
        } else {
            // Si ocurre un error, mostrar un mensaje con SweetAlert
            echo "<script>
                Swal.fire({
                    title: '¡Error!',
                    text: '¡Ups, ha ocurrido un error al procesar tu solicitud!',
                    icon: 'error',
                    confirmButtonText: 'Cerrar'
                });
            </script>";
        }
    } else {
        // Si los campos están vacíos
        echo "<script>
            Swal.fire({
                title: '¡Advertencia!',
                text: '¡Por favor, complete los campos!',
                icon: 'warning',
                confirmButtonText: 'Cerrar'
            });
        </script>";
    }
}
?>