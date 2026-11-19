var Flechas = {

  punto: function (f, lado) {
    var m = Simbolos.medidas(f.tipo);
    if (lado == "arriba")    return { x: f.x,       y: f.y - m.h };
    if (lado == "abajo")     return { x: f.x,       y: f.y + m.h };
    if (lado == "izquierda") return { x: f.x - m.w, y: f.y };
    return { x: f.x + m.w, y: f.y };
  },

  vertical: function (a, b) {
    var p = this.punto(a, "abajo"), q = this.punto(b, "arriba");
    if (p.x == q.x) return { puntos: [p, q], etiquetas: [] };
    var medio = (p.y + q.y) / 2;
    return { puntos: [p, { x: p.x, y: medio }, { x: q.x, y: medio }, q], etiquetas: [] };
  },

  rama: function (todas, padre, nombre) {
    return todas.filter(function (f) { return f.ramaDe == padre.id && f.rama == nombre; })
                .sort(function (a, b) { return a.orden - b.orden; });
  },

  calcular: function (figuras) {
    var lista = [];
    var principales = figuras.filter(function (f) { return !f.ramaDe; });

    principales.forEach(function (f, i) {
      var siguiente = principales[i + 1];
      if (f.tipo == "condicion")       Flechas.condicion(f, figuras, siguiente, lista);
      else if (f.tipo == "repeticion") Flechas.repeticion(f, figuras, siguiente, lista);
      else if (f.tipo != "fin" && siguiente) lista.push(Flechas.vertical(f, siguiente));
    });
    return lista;
  },

  cadena: function (rama, lista) {
    for (var i = 0; i < rama.length - 1; i++) lista.push(this.vertical(rama[i], rama[i + 1]));
  },

  condicion: function (c, todas, siguiente, lista) {
    var si = this.rama(todas, c, "si"), no = this.rama(todas, c, "no");
    this.salida(c, si, "izquierda", "SÍ", lista);
    this.salida(c, no, "derecha", "NO", lista);
    this.unirConSiguiente(c, si, siguiente, lista);
    this.unirConSiguiente(c, no, siguiente, lista);
  },

  salida: function (c, rama, lado, texto, lista) {
    if (!rama.length) return;
    var p = this.punto(c, lado), q = this.punto(rama[0], "arriba");
    var desvio = (lado == "izquierda") ? -18 : 18;
    lista.push({ puntos: [p, { x: q.x, y: p.y }, q], etiquetas: [{ x: p.x + desvio, y: p.y - 6, texto: texto }] });
    this.cadena(rama, lista);
  },

  unirConSiguiente: function (c, rama, siguiente, lista) {
    if (!siguiente) return;
    var ultima = rama.length ? rama[rama.length - 1] : c;
    lista.push(this.vertical(ultima, siguiente));
  },

  repeticion: function (c, todas, siguiente, lista) {
    var cuerpo = this.rama(todas, c, "si");
    if (cuerpo.length) {
      var entrada = this.vertical(c, cuerpo[0]);
      entrada.etiquetas.push({ x: c.x + 16, y: c.y + Simbolos.medidas("repeticion").h + 14, texto: "SÍ" });
      lista.push(entrada);
      this.cadena(cuerpo, lista);
      this.regreso(c, cuerpo[cuerpo.length - 1], lista);
    }
    if (siguiente) {
      var p = this.punto(c, "derecha"), q = this.punto(siguiente, "arriba");
      var y = q.y - 15;
      lista.push({
        puntos: [p, { x: p.x + 60, y: p.y }, { x: p.x + 60, y: y }, { x: q.x, y: y }, q],
        etiquetas: [{ x: p.x + 18, y: p.y - 6, texto: "NO" }]
      });
    }
  },

  regreso: function (c, ultima, lista) {
    var a = this.punto(ultima, "izquierda"), b = this.punto(c, "izquierda");
    var x = Math.min(a.x, b.x) - 30;
    lista.push({ puntos: [a, { x: x, y: a.y }, { x: x, y: b.y }, b], etiquetas: [] });
  },

  dibujar: function (svg, figuras) {
    svg.appendChild(this.crearPunta());
    this.calcular(figuras).forEach(function (flecha) {
      svg.appendChild(Flechas.crearLinea(flecha));
      flecha.etiquetas.forEach(function (e) { svg.appendChild(Flechas.crearEtiqueta(e)); });
    });
  },

  crearPunta: function () {
    var defs = Simbolos.nuevo("defs");
    var marca = Simbolos.nuevo("marker");
    var atributos = { id: "punta", markerWidth: 8, markerHeight: 8, refX: 9, refY: 5, orient: "auto" };
    Object.keys(atributos).forEach(function (k) { marca.setAttribute(k, atributos[k]); });
    var triangulo = Simbolos.nuevo("path");
    triangulo.setAttribute("d", "M0,0 L10,5 L0,10 z");
    triangulo.setAttribute("fill", "#5b21b6");
    marca.appendChild(triangulo);
    defs.appendChild(marca);
    return defs;
  },

  crearLinea: function (flecha) {
    var linea = Simbolos.nuevo("polyline");
    linea.setAttribute("points", flecha.puntos.map(function (p) { return p.x + "," + p.y; }).join(" "));
    linea.setAttribute("fill", "none");
    linea.setAttribute("stroke", "#5b21b6");
    linea.setAttribute("stroke-width", 2);
    linea.setAttribute("marker-end", "url(#punta)");
    linea.setAttribute("pointer-events", "none");
    return linea;
  },

  crearEtiqueta: function (e) {
    var texto = Simbolos.nuevo("text");
    texto.setAttribute("x", e.x);
    texto.setAttribute("y", e.y);
    texto.setAttribute("text-anchor", "middle");
    texto.setAttribute("font-size", 12);
    texto.setAttribute("font-weight", "bold");
    texto.setAttribute("fill", "#7e22ce");
    texto.setAttribute("pointer-events", "none");
    texto.textContent = e.texto;
    return texto;
  }
};