$(document).ready(function () {
  var frase = "No me mandéis audios, por favor";

  /**
   * Botón checkbox para activar el código QR
   */
  $(".checkitem").click(function(){
    var item = $(".checkitem");
    if (item.hasClass("itemactive")){
      // Activado
      item.removeClass("itemactive");
      $(".customcheck").css("background-color", "#d8d8d8")
      $("input[name='switch']").prop("checked", false);
    } else {
      // Desactivado
      item.addClass("itemactive");
      $(".customcheck").css("background-color", "#befbbe")
      $("input[name='switch']").prop("checked", true);
    }
  });

  /**
   * Botón para aplicar la frase de respuesta
   */
  $("#botonAplicar").click(function (e) { 
    var item = $("#botonAplicar");
    var inputFrase = $("[name='frase']"); 

    item.addClass("botonAplicado");
    item.text("Aplicada");

    if(inputFrase.val() != ""){
      frase = inputFrase.val();
    }
  });

  /**
   * Botón para resetear la frase de respuesta
   */
   $("#botonReset").click(function (e) { 
    var item = $("#botonAplicar");

    item.removeClass("botonAplicado");
    item.text("Aplicar");
    frase = "No me mandéis audios, por favor";
  });

  $("[name='frase']").focus(function (e) { 
    var item = $("#botonAplicar"); 
    
    item.removeClass("botonAplicado");
    item.text("Aplicar");
  });
});