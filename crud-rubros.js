//CRUD
let idEliminar=0;
let idActualiar=0;

function accionCreate(){
//alert("Crear nueva categoria");
let nombreRubro = document.getElementById("nombre-rubro").value;
/////////////////////////////////////////
let tienesubremas = 0;
if($("#si_subtemas").is(":checked"))
tienesubremas = 1;
else
tienesubtemas =0;
/////////////////////////////////////////
//Vamos a comunicarnos con el servidor
$.ajax({
    method:"POST",
    url: "plantilla/phppropios/crud-rubros.php",
    data: {
      rubro   : nombreRubro,
      subtemas:tienesubremas,
      accion  :"create"
    },
    success: function( respuesta ) {
      let miObjetoJSON = JSON.parse(respuesta);
      //.estado
      //.id
      //.mensaje

      if( miObjetoJSON.estado==1){
        //Agregamos el registro de tabla

        let tabla=$("#example1").DataTable();
        let botones = '<a class="btn btn-warning btn-sm" href="#"><i class="fas fa-clock"></i></a>';
            botones +=' <a class="btn btn-primary btn-sm" href="#" data-toggle="modal" data-target="#modal-actualizar-rubro" onclick="identificaActualiar('+miObjetoJSON.id+');"><i class="fas fa-pencil-alt"></i></a>';
            botones +=' <a class="btn btn-danger btn-sm" href="#" data-toggle="modal" data-target="#modal-delete" onclick="identificaEliminar('+miObjetoJSON.id+');" ><i class="fas fa-trash"></i></a>';
        

        if(tienesubremas==1)
          tabla.row.add([nombreRubro, "Si tiene subtema", botones]).draw().node().id="renglon_"+miObjetoJSON.id;
        else
          tabla.row.add([nombreRubro, "No tiene subtema", botones]).draw().node().id="renglon_"+miObjetoJSON.id;


        //Mostramos el mensaje de ususario
        toastr.success(miObjetoJSON.mensaje);
      }else{
        //Mandamos un error al usuario
        toastr.error(miObjetoJSON.mensaje);
      }
    }
  });
}

function accionRead(){
  $.ajax({
    method:"POST",
    url: "plantilla/phppropios/crud-rubros.php",
    data: {
      accion:"read"
    },
    success: function( respuesta ) {
      //alert(respuesta);
      //Agregar el listado de rubros a la tabla 
      let miObjetoJSON = JSON.parse(respuesta);

      if( miObjetoJSON.estado==1){
        //Mostrara en la tabla los rubros
        //Los rubros son un arreglo
        //miObjetoJSON.rubros = arreglo
        let tabla=$("#example1").DataTable();

        miObjetoJSON.rubros.forEach(rubro => {
          let botones = '<a class="btn btn-warning btn-sm" href="#"><i class="fas fa-clock"></i></a>';
          botones +=' <a class="btn btn-primary btn-sm" href="#" data-toggle="modal" data-target="#modal-actualizar-rubro" onclick="identificaActualiar('+rubro.id+');"><i class="fas fa-pencil-alt"></i></a>';
          botones +=' <a class="btn btn-danger btn-sm" href="#" data-toggle="modal" data-target="#modal-delete" onclick="identificaEliminar('+rubro.id+');" ><i class="fas fa-trash"></i></a>';

         if(rubro.subtemas==1)
          tabla.row.add([rubro.nombre_rubro,"Si tiene subtemas",botones]).draw().node().id="renglon_"+rubro.id;
          else
          tabla.row.add([rubro.nombre_rubro,"No tiene subtemas",botones]).draw().node().id="renglon_"+rubro.id;
        });

     }   
      //alert(respuesta)
  }
  });
}

function accionUpdate(){
  /////////////////////////////////////////
let tienesubremas = 0;
if($("#si_subtemas_actualizar").is(":checked"))
  tienesubremas = 1;
else
  tienesubtemas =0;
/////////////////////////////////////////


  let nombreRubroActualizar = document.getElementById("nombre-rubro-actualizar").value;
  $.ajax({
    method:"POST",
    url: "plantilla/phppropios/crud-rubros.php",
    data: {
      id      : idActualiar,//Esta es mi variable global
      rubro   : nombreRubroActualizar,
      subtemas: tienesubtemas,
      accion:"update"
    },
    success: function( respuesta ) {
      //alert(respuesta);
      miObjetoJSON = JSON.parse(respuesta);
      if(miObjetoJSON.estado==1){
        //Debemos mostrar en la tabla los datos de actualizado
        
        let tabla=$("#example1").DataTable();


        let temp = tabla.row("#renglon_"+idActualiar).data();
        temp[0] = nombreRubroActualizar

        if(tienesubremas==1)
        temp[1] = "Si tiene subtemas";
        else
        temp[1] = "No tiene subtemas";

        tabla.row("#renglon_"+idActualiar).data(temp).draw();

        toastr.success(miObjetoJSON.mensaje);
      
      }else{
        toastr.error(miObjetoJSON.mensaje);
      }
  }
  });
}

function accionDelete(){
  $.ajax({
    method:"POST",
    url: "plantilla/phppropios/crud-rubros.php",
    data: {
      id: idEliminar,//Esta es mi variable global
      accion:"delete"
    },
    success: function( respuesta ) {
      //alert(respuesta);
      //Actualizamos la tabla para no tener que actualizar la pagina
      let miObjetoJSON = JSON.parse(respuesta);
      if(miObjetoJSON.estado==1){
        let tabla=$("#example1").DataTable();
        tabla.row("#renglon_"+idEliminar).remove().draw();
        toastr.success(miObjetoJSON.mensaje);
      }else{
        toastr.error(miObjetoJSON.mensaje);
      }
      
  }
  });
}


function identificaEliminar(id){
  //Guadra en una variable global el id
  //alert(id);
  idEliminar = id;


}

function identificaActualiar(id){
  //Guadra en una variable global el id
  //alert(id);
  idActualiar = id;
  //Realizar solicitud al servidor para que regrese los datos 
  $.ajax({
    method:"POST",
    url: "plantilla/phppropios/crud-rubros.php",
    data: {
      id: idActualiar,//Esta es mi variable global
      accion:"read-id"
    },
    success: function( respuesta ) {
      //alert(respuesta);
      let miObjetoJSON = JSON.parse(respuesta);
      if(miObjetoJSON.estado==1){
        //Mostrar la ventana de Actualizar los datos recuperados del servidor
        let nombreRubroActualizar   = document.getElementById('nombre-rubro-actualizar');
        nombreRubroActualizar.value = miObjetoJSON.nombre_rubro;
        if(miObjetoJSON.subtemas==1)
        $("#si_subtemas_actualizar").prop("checked", true);
        else
        $("#no_subtemas_actualizar").prop("checked", true);

      }else{
        toastr.error(miObjetoJSON.mensaje);
      }
  }
  });
}
 