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
  $("#boton").click(function (e) { 
    var item = $("#boton");
    var inputFrase = $("[name='frase']"); 

    item.addClass("botonAplicado");
    item.text("Aplicada");
    frase = inputFrase.val();
  });
});