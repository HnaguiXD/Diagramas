var Mensaje = {
  ayuda: "Elige un símbolo y toca el lienzo (o arrástralo). Toca dos veces una figura, o usa Texto, para editar su contenido.",

  mostrar: function (texto) {
    document.getElementById("mensaje").textContent = texto;
  },

  mostrarAyuda: function () {
    this.mostrar(this.ayuda);
  }
};
