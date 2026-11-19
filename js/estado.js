var Estado = {
  figuras: [],
  simboloElegido: null,
  figuraSeleccionada: null,
  contador: 0,

  plantillaRamas: {
    condicion:  [["si", -100, 90, 1], ["si", -100, 170, 2], ["no", 100, 90, 1], ["no", 100, 170, 2]],
    repeticion: [["si", 0, 90, 1], ["si", 0, 170, 2]]
  },

  agregar: function (tipo, x, y, estilo) {
    var figura = this.crearFigura(tipo, x, y, estilo);
    var plantilla = this.plantillaRamas[tipo] || [];
    plantilla.forEach(function (datos) {
      var hija = Estado.crearFigura("sentencia", x + datos[1], y + datos[2], estilo);
      hija.texto = "instrucción";
      hija.ramaDe = figura.id;
      hija.rama = datos[0];
      hija.orden = datos[3];
    });
    this.figuraSeleccionada = figura;
    return figura;
  },

  crearFigura: function (tipo, x, y, estilo) {
    this.contador++;
    var figura = {
      id: this.contador,
      tipo: tipo,
      x: x,
      y: y,
      texto: Simbolos.catalogo[tipo].texto,
      contorno: estilo.contorno,
      relleno: estilo.relleno,
      tamano: estilo.tamano
    };
    this.figuras.push(figura);
    return figura;
  },

  buscar: function (id) {
    return this.figuras.filter(function (f) { return f.id == id; })[0] || null;
  },

  hijas: function (figura) {
    return this.figuras.filter(function (f) { return f.ramaDe == figura.id; });
  },

  borrarSeleccionada: function () {
    if (!this.figuraSeleccionada) return false;
    var quitar = [this.figuraSeleccionada].concat(this.hijas(this.figuraSeleccionada));
    this.figuras = this.figuras.filter(function (f) { return quitar.indexOf(f) < 0; });
    this.figuraSeleccionada = null;
    return true;
  },

  seleccionar: function (figura) {
    this.figuraSeleccionada = figura;
    if (figura) Herramientas.mostrarEstilo(figura);
  },

  elegirSimbolo: function (tipo) {
    this.simboloElegido = (this.simboloElegido == tipo) ? null : tipo;
    return this.simboloElegido;
  }
};
