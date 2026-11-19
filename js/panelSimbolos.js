var PanelSimbolos = {
  elemento: null,

  iniciar: function () {
    this.elemento = document.getElementById("panelSimbolos");
    Object.keys(Simbolos.catalogo).forEach(function (tipo) {
      PanelSimbolos.elemento.appendChild(PanelSimbolos.crearBoton(tipo));
    });
  },

  crearBoton: function (tipo) {
    var boton = document.createElement("button");
    boton.draggable = true;
    boton.dataset.tipo = tipo;

    var mini = Simbolos.nuevo("svg");
    mini.setAttribute("width", 70);
    mini.setAttribute("height", 36);
    mini.setAttribute("viewBox", "-90 -50 180 100");
    mini.setAttribute("aria-hidden", "true");
    mini.appendChild(Simbolos.crearForma(tipo, "#5b21b6", "#f3e8ff"));
    boton.appendChild(mini);
    boton.appendChild(document.createTextNode(Simbolos.catalogo[tipo].nombre));

    boton.addEventListener("click", function () { PanelSimbolos.elegir(tipo); });
    boton.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", tipo);
    });
    return boton;
  },

  elegir: function (tipo) {
    var elegido = Estado.elegirSimbolo(tipo);
    this.elemento.querySelectorAll("button").forEach(function (b) {
      b.classList.toggle("activo", b.dataset.tipo == elegido);
    });
  }
};