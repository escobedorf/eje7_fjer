<?php

//1.- Conectarnos a la base de datos
    //$conexion = mysqli_connect('localhost', 'root', '', 'sistete');
    $conexion = mysqli_connect('sql106.byethost16.com', 'b16_31897878', 'ESCOBEDO2001', 'b16_31897878_sistete');
    //1.1.- Revisar la conecion
    if(!$conexion){
        die("Error al conectarse: " . mysqli_connect_error());
    }
    ?>