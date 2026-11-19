var Mensaje = {
  ayuda: "Elige y suelta en el lienzo, doble click para editar.",

  mostrar: function (texto) {
    document.getElementById("mensaje").textContent = texto;
  },

  mostrarAyuda: function () {
    this.mostrar(this.ayuda);
  },

  limpiar: function () {
    this.mostrar("");
  }
};