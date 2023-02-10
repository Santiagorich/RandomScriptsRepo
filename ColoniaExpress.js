let partidasIda = [];
let partidasVuelta = [];

async function cargarPartidas(index) {
  return new Promise(async (resolve, reject) => {
    console.log("Cargando partidas: ", index);
    if (!Outlet.vm.suspenderCarga) {
      if (Outlet.vm.destinoSeleccionado() !== Outlet.vm.getRutaIda()) {
        Outlet.vm.index(0);
      }

      Outlet.vm.pasajerosAdultos(Outlet.vm.PARAMETROS.pasajerosAdultos());
      Outlet.vm.pasajerosNinos(Outlet.vm.PARAMETROS.pasajerosNinos());
      Outlet.vm.pasajerosBebes(Outlet.vm.PARAMETROS.pasajerosBebes());
      Outlet.vm.partidaIda(null);
      Outlet.vm.partidaVuelta(null);
      Outlet.vm.loading(true);

      const response = await fetch(
        Site.normalizar(
          "api/Outlet?codigoRuta=" + Outlet.vm.getRutaIda() + "&index=" + index
        )
      );
      const data = await response.json();

      partidasIda = partidasIda.concat(data.partidasIda);
      partidasVuelta = partidasVuelta.concat(data.partidasVuelta);
    }
    console.log("Partidas cargadas - ", index);
    resolve();
  });
}

function updateAll() {
  console.log("Actualizando partidas");
  partidasIda = partidasIda.sort((a, b) => {
    if (a.precio !== b.precio) {
      return a.precio - b.precio;
    }
    return new Date(a.fechaSalida) - new Date(b.fechaSalida);
  });
  partidasVuelta = partidasVuelta.sort((a, b) => {
    if (a.precio !== b.precio) {
      return a.precio - b.precio;
    }
    return new Date(a.fechaSalida) - new Date(b.fechaSalida);
  });
  partidasIda.forEach((partida) => {
    partida.horaSalidaUI =
      partida.stockTT1 + " left" + " - " + partida.horaSalida;
  });
  partidasVuelta.forEach((partida) => {
    partida.horaSalidaUI =
      partida.stockTT1 + " left" + " - " + partida.horaSalida;
  });
  Outlet.vm.completarListados(Outlet.vm.partidasIda, partidasIda);
  Outlet.vm.completarListados(Outlet.vm.partidasVuelta, partidasVuelta);
  console.log("Partidas Ida", partidasIda);
  console.log("Partidas Vuelta", partidasVuelta);
  Outlet.vm.loading(false);
}

async function forLoop() {
    console.log("Iniciando carga");
  const promises = [];
  for (var i = 0; i < 10; i++) {
    promises.push(cargarPartidas(i));
  }
  Promise.all(promises).then(() => {
    console.log("Terminado");
    updateAll();
  });
}
forLoop();
