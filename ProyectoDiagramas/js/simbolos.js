var Simbolos = {
  ancho: 140,
  alto: 70,
  ns: "http://www.w3.org/2000/svg",

  catalogo: {
    inicio:     { nombre: "Inicio",     texto: "INICIO" },
    variable:   { nombre: "Variable",   texto: "calif" },
    entrada:    { nombre: "Entrada",    texto: "num" },
    salida:     { nombre: "Salida",     texto: "\"Los datos son\"" },
    sentencia:  { nombre: "Sentencia",  texto: "i = 0" },
    condicion:  { nombre: "Condición",  texto: "condición" },
    repeticion: { nombre: "Repetición", texto: "i < 10" },
    fin:        { nombre: "Fin",        texto: "FIN" }
  },

  medidas: function (tipo) {
    if (tipo == "condicion") return { w: this.ancho / 2 + 10, h: this.alto / 2 + 5 };
    return { w: this.ancho / 2, h: this.alto / 2 };
  },

  existe: function (tipo) {
    return this.catalogo.hasOwnProperty(tipo);
  },

  crearForma: function (tipo, contorno, relleno) {
    var grupo = document.createElementNS(this.ns, "g");
    var forma = this.formaBase(tipo);
    forma.setAttribute("class", "forma");
    forma.setAttribute("stroke", contorno);
    forma.setAttribute("fill", relleno);
    forma.setAttribute("stroke-width", 2);
    grupo.appendChild(forma);

    if (tipo == "variable") this.agregarLineasVariable(grupo, contorno);
    return grupo;
  },

  formaBase: function (tipo) {
    var w = this.ancho / 2, h = this.alto / 2, forma;

    if (tipo == "condicion") {
      forma = this.nuevo("polygon");
      forma.setAttribute("points", "0," + (-h - 5) + " " + (w + 10) + ",0 0," + (h + 5) + " " + (-w - 10) + ",0");
    } else if (tipo == "repeticion") {
      forma = this.nuevo("polygon");
      forma.setAttribute("points", (-w + 20) + "," + (-h) + " " + (w - 20) + "," + (-h) + " " + w + ",0 " +
        (w - 20) + "," + h + " " + (-w + 20) + "," + h + " " + (-w) + ",0");
    } else if (tipo == "entrada") {
      forma = this.nuevo("path");
      forma.setAttribute("d", "M" + (-w) + "," + (-h) + " H" + w + " V" + (h - 12) +
        " Q" + (w / 2) + "," + (h - 32) + " 0," + (h - 12) + " T" + (-w) + "," + (h - 12) + " Z");
    } else if (tipo == "salida") {
      forma = this.nuevo("polygon");
      forma.setAttribute("points", (-w) + "," + (-h + 20) + " " + (-w + 20) + "," + (-h) + " " + w + "," + (-h) + " " + w + "," + h + " " + (-w) + "," + h);
    } else {
      forma = this.nuevo("rect");
      forma.setAttribute("x", -w); forma.setAttribute("y", -h);
      forma.setAttribute("width", this.ancho); forma.setAttribute("height", this.alto);
      if (tipo == "inicio" || tipo == "fin") forma.setAttribute("rx", 30);
    }
    return forma;
  },

  agregarLineasVariable: function (grupo, contorno) {
    var w = this.ancho / 2, h = this.alto / 2;
    [-h + 9, h - 9].forEach(function (y) {
      var linea = Simbolos.nuevo("line");
      linea.setAttribute("x1", -w); linea.setAttribute("x2", w);
      linea.setAttribute("y1", y);  linea.setAttribute("y2", y);
      linea.setAttribute("stroke", contorno);
      linea.setAttribute("stroke-width", 2);
      grupo.appendChild(linea);
    });
  },

  nuevo: function (etiqueta) {
    return document.createElementNS(this.ns, etiqueta);
  }
};
