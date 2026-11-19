window.addEventListener("load", function () {
  console.log("editor v0.3 — arrancando");
  try {
    Mensaje.mostrarAyuda();
    PanelSimbolos.iniciar();
    Herramientas.iniciar();
    Lienzo.iniciar();
  } catch (err) {
    console.error(err);
    Mensaje.mostrar("error");
  }
});