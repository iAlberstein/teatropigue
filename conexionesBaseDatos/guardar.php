<?php
    include 'conexion.php';
  
    $nombre  = $_POST['name'];
    $email = $_POST['email'];

    $insertar = "INSERT INTO baseDatos(nombre, email, fecha_reg) VALUES ('$name','$email','$fechareg')";

    $query = mysqli_query($conn, $insertar);

    if($query){

        ?>
        <h3 class="ok">¡Gracias por suscribirte!</h3>
        <?php

    }else{
        ?>
        <h3 class="bad">Intentar de nuevo</h3>
        <?php
    }
?>