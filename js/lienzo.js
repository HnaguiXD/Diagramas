var Lienzo = {
  elemento: null,
  ultimoToque: null,

  iniciar: function () {
    this.elemento = document.getElementById("lienzo");

    this.elemento.addEventListener("click", function (e) {
      if (e.target !== Lienzo.elemento) return;
      if (Estado.simboloElegido) {
        var p = Lienzo.posicion(e);
        Lienzo.colocar(Estado.simboloElegido, p.x, p.y);
      } else {
        Estado.seleccionar(null);
        Lienzo.marcarSeleccion();
      }
    });

    this.elemento.addEventListener("pointerdown", function (e) { Lienzo.iniciarArrastre(e); });

    this.elemento.addEventListener("touchstart", function (e) {
      if (Lienzo.figuraDe(e.target)) e.preventDefault();
    }, { passive: false });

    this.elemento.addEventListener("dragover", function (e) { e.preventDefault(); });
    this.elemento.addEventListener("drop", function (e) {
      e.preventDefault();
      var tipo = e.dataTransfer.getData("text/plain");
      if (Simbolos.existe(tipo)) {
        var p = Lienzo.posicion(e);
        Lienzo.colocar(tipo, p.x, p.y);
      }
    });
  },

  posicion: function (evento) {
    var caja = this.elemento.getBoundingClientRect();
    return { x: evento.clientX - caja.left, y: evento.clientY - caja.top };
  },

  figuraDe: function (elemento) {
    var grupo = elemento.closest ? elemento.closest(".figura") : null;
    return grupo ? Estado.buscar(grupo.getAttribute("data-id")) : null;
  },

  colocar: function (tipo, x, y) {
    var figura = Estado.agregar(tipo, x, y, Herramientas.estiloActual());
    Estado.seleccionar(figura);
    this.dibujar();
  },

  dibujar: function () {
    this.elemento.innerHTML = "";
    Flechas.dibujar(this.elemento, Estado.figuras);
    Estado.figuras.forEach(function (figura) {
      Lienzo.elemento.appendChild(Lienzo.crearFigura(figura));
    });
  },

  crearFigura: function (figura) {
    var grupo = Simbolos.crearForma(figura.tipo, figura.contorno, figura.relleno);
    grupo.setAttribute("class", "figura");
    grupo.setAttribute("data-id", figura.id);
    grupo.setAttribute("transform", "translate(" + figura.x + "," + figura.y + ")");
    grupo.appendChild(this.crearTexto(figura));
    return grupo;
  },

  crearTexto: function (figura) {
    var texto = Simbolos.nuevo("text");
    texto.setAttribute("text-anchor", "middle");
    texto.setAttribute("dominant-baseline", "middle");
    texto.setAttribute("font-size", figura.tamano);
    texto.setAttribute("font-family", "Arial");
    texto.setAttribute("pointer-events", "none");
    texto.textContent = figura.texto;
    return texto;
  },

  marcarSeleccion: function () {
    var id = Estado.figuraSeleccionada ? Estado.figuraSeleccionada.id : null;
    this.elemento.querySelectorAll(".figura").forEach(function (grupo) {
      grupo.classList.toggle("seleccionada", grupo.getAttribute("data-id") == id);
    });
  },

  editarTexto: function (figura) {
    var nuevo = prompt("Texto:", figura.texto);
    if (nuevo !== null) {
      figura.texto = nuevo;
      this.dibujar();
      this.marcarSeleccion();
    }
  },

  revisarDobleToque: function (figura) {
    var ahora = Date.now();
    var anterior = this.ultimoToque;
    if (anterior && anterior.id == figura.id && ahora - anterior.tiempo < 400) {
      this.ultimoToque = null;
      this.editarTexto(figura);
    } else {
      this.ultimoToque = { id: figura.id, tiempo: ahora };
    }
  },

  iniciarArrastre: function (e) {
    if (e.button > 0) return;
    var figura = this.figuraDe(e.target);
    if (!figura) return;
    e.preventDefault();
    Estado.seleccionar(figura);
    this.marcarSeleccion();

    var inicio = this.posicion(e);
    var movibles = [figura].concat(Estado.hijas(figura));
    var originales = movibles.map(function (f) { return { x: f.x, y: f.y }; });
    var movido = false;

    function mover(ev) {
      if (ev.pointerId !== e.pointerId) return;
      var p = Lienzo.posicion(ev);
      var dx = p.x - inicio.x, dy = p.y - inicio.y;
      if (!movido && Math.abs(dx) + Math.abs(dy) < 5) return;
      movido = true;
      movibles.forEach(function (f, i) {
        f.x = originales[i].x + dx;
        f.y = originales[i].y + dy;
      });
      Lienzo.dibujar();
      Lienzo.marcarSeleccion();
    }

    function soltar(ev) {
      document.removeEventListener("pointermove", mover);
      document.removeEventListener("pointerup", soltar);
      document.removeEventListener("pointercancel", soltar);
      if (!movido && ev.type == "pointerup") Lienzo.revisarDobleToque(figura);
    }

    document.addEventListener("pointermove", mover);
    document.addEventListener("pointerup", soltar);
    document.addEventListener("pointercancel", soltar);
  }
};