var Herramientas = {
  iniciar: function () {
    document.getElementById("botonBorrar").addEventListener("click", this.borrar);
    document.getElementById("botonEditar").addEventListener("click", this.editar);

    document.addEventListener("keydown", function (e) {
      var escribiendo = /^(INPUT|SELECT|TEXTAREA)$/.test(e.target.tagName);
      if (escribiendo) return;

      if (e.key == "Delete" || e.key == "Backspace") Herramientas.borrar();
      if (e.key == "e" || e.key == "E") Herramientas.editar();
    });

    this.conectarEstilo("colorContorno", "input", "contorno");
    this.conectarEstilo("colorRelleno", "input", "relleno");
    this.conectarEstilo("tamanoLetra", "change", "tamano");
  },

  conectarEstilo: function (idControl, evento, propiedad) {
    document.getElementById(idControl).addEventListener(evento, function (e) {
      if (Estado.figuraSeleccionada) {
        Estado.figuraSeleccionada[propiedad] = e.target.value;
        Lienzo.dibujar();
      }
    });
  },

  editar: function () {
    if (!Estado.figuraSeleccionada) {
      Mensaje.mostrar("Selecciona algo primero.");
      return;
    }
    Lienzo.editarTexto(Estado.figuraSeleccionada);
  },

  borrar: function () {
    if (!Estado.borrarSeleccionada()) {
      Mensaje.mostrar("No hay nada seleccionado.");
      return;
    }
    Lienzo.dibujar();
  },

  estiloActual: function () {
    return {
      contorno: document.getElementById("colorContorno").value,
      relleno: document.getElementById("colorRelleno").value,
      tamano: document.getElementById("tamanoLetra").value
    };
  },

  mostrarEstilo: function (figura) {
    document.getElementById("colorContorno").value = figura.contorno;
    document.getElementById("colorRelleno").value = figura.relleno;
    document.getElementById("tamanoLetra").value = figura.tamano;
  }
};