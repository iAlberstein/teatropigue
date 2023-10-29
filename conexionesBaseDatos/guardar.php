<?php
    require 'conexion.php';
  
    $nombre  = $_POST['name'];
    $email = $_POST['email'];

    $insertar = "INSERT INTO baseDatos VALUES ('$nombre','$email') ";

    $query = mysqli_query($conn, $insertar);

    if($query){

        echo "<script> alert('correcto');
        location.href = '../index.html';
        </script>";

    }else{
        echo "<script> alert('incorrecto');
        location.href = '../index.html';
        </script>";
    }
?>