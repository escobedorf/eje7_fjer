<?php
//Por GET y POST
//El servidor debe de contestar en formato JSON
include 'conexion.php';

$Respuesta = array();
$accion = $_POST["accion"];

switch ($accion) {
    case "create":
        accionCreatePHP($conexion);
        break;
    case "update":
        accionUpdatePHP($conexion);
        break;
    case "delete":
        accionDeletePHP($conexion);
        break;
    case "read":
        accionReadPHP($conexion);
        break;
    case "read-id":
        accionReadByIdPHP($conexion);
        break;
    default:
        accionErrorPHP($conexion);
        break;
}

function accionErrorPHP($conexion){
    $Respuesta ["estado"]=0;
    $Respuesta ["mensaje"]="Accion no valida";
    echo json_encode($Respuesta);
    mysqli_close($conexion);
}

function accionCreatePHP($conexion){
    $rubro                   = $_POST["rubro"];
    $subtemas                =$_POST["subtemas"];
    $QueryCreate = "INSERT INTO rubro(id,nombre_rubro, subtemas) VALUES (NULL,'".$rubro."',".$subtemas.")";
    if (mysqli_query($conexion, $QueryCreate)){
    $Respuesta ["estado"]    =1;
    $Respuesta ["id"]        =mysqli_insert_id($conexion);//Temporal: id que la base de datos genera
    $Respuesta ["mensaje"]   ="Se agrego correctamente";
}else{
    $Respuesta ["estado"]    =0;
    $Respuesta ["id"]        =-1;//Temporal: id que la base de datos genera
    $Respuesta ["mensaje"]   ="Ocurrio un error desconocido";
}
    echo json_encode($Respuesta);
    mysqli_close($conexion);
}

function accionUpdatePHP($conexion){
    $id             = $_POST["id"];
    $rubro          = $_POST["rubro"];
    $subtemas       = $_POST["subtemas"];
    $QueryUpdate    ="UPDATE rubro SET nombre_subro='".$rubro."', subtemas=".$subtemas." WHERE id=".$id;
    mysqli_query($conexion, $QueryUpdate);
    if(mysqli_affected_rows($conexion)>0)
    {
    $Respuesta ["estado"]=1;
    $Respuesta ["mensaje"]="Se actualizo correctamente";
    }else{

    $Respuesta ["estado"]=0;
    $Respuesta ["mensaje"]="Se actualizo correctamente";
    }
    echo json_encode($Respuesta);
    mysqli_close($conexion);
}

function accionDeletePHP($conexion){
    $id          = $_POST['id'];
    $QueryDelete = "DELETE FROM rubro WHERE id=".$id;
    mysqli_query($conexion,$QueryDelete);
    if(mysqli_affected_rows($conexion)>0){
        $Respuesta["estado"]  =1;
        $Respuesta["mensaje"] ="El registro se elimino correctamente";
   
    }else{
        $Respuesta["estado"]   = 0;
        $Respuesta["mensaje"]  ="Ocurrio un error desconocido";
    }
    echo json_encode($Respuesta);
    mysqli_close($conexion);
}

function accionReadByIdPHP($conexion){
    $id                 = $_POST["id"];
    $QueryReadById      = "SELECT * FROM rubro where id= ".$id;
    $ResultadoReadById  = mysqli_query($conexion, $QueryReadById);
    $numeroRegistro = mysqli_num_rows($ResultadoReadById);
    if($numeroRegistro>0){
        $Respuesta ["estado"]   = 1;
        $Respuesta ["mensaje"]  = "Registros encontrados";

        $RenglonRubroById                = mysqli_fetch_assoc($ResultadoReadById);

            $Respuesta["id"]             = $RenglonRubroById["id"];
            $Respuesta["nombre_rubro"]   = $RenglonRubroById["nombre_rubro"];
            $Respuesta["subtemas"]       = $RenglonRubroById["subtemas"];
        }   
    else{
        $Respuesta["estado"]   = 0;
        $Respuesta["mensaje"]  ="Registros no encontrados";
    }
    echo json_encode($Respuesta);
    mysqli_close($conexion);
}

function accionReadPHP($conexion){
    //Diseñamos la consulta
    $QueryRead = "SELECT * FROM rubro";

    //Ejecutamos la consulta
    $ResultadoRead  = mysqli_query($conexion, $QueryRead);

    //Obtenemos el numero de registros
    $numeroRegistro = mysqli_num_rows($ResultadoRead);

    //Preguntamos si hay registros o no
    if($numeroRegistro>0){
        $Respuesta ["estado"]  =1;
        $Respuesta ["mensaje"] ="Registros encontrados";
        $Respuesta ["rubros"]  = array();
        while($RenglonRubro=mysqli_fetch_assoc($ResultadoRead)){
            $Rubro = array();
            $Rubro["id"]             = $RenglonRubro["id"];
            $Rubro["nombre_rubro"]   = $RenglonRubro["nombre_rubro"];
            $Rubro["subtemas"]       = $RenglonRubro["subtemas"];
            array_push($Respuesta ["rubros"],$Rubro);
        }   
    }else{
        $Respuesta["estado"]   = 0;
        $Respuesta["mensaje"]  ="Registros no encontrados";
    }
    echo json_encode($Respuesta);
    mysqli_close($conexion);
}
?>