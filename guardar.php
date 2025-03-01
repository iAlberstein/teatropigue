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
            echo "success";  // Respuesta exitosa
        } else {
            echo "error";  // Respuesta de error
        }
    } else {
        echo "empty";  // Respuesta si los campos están vacíos
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