// js/core/inactivity.js
// Responsable único: control de inactividad del usuario y cierre de sesión automático.
// Expone funciones para iniciar, detener y reiniciar el temporizador de inactividad.

window.App = window.App || {};

(function (App) {
  "use strict";

  const DEFAULT_TIMEOUT = 10 * 60 * 1000; // 10 minutos en ms
  let inactivityTimer = null;
  let timeoutCallback = null;
  let timeoutMs = DEFAULT_TIMEOUT;

  App.inactivity = {};

  /**
   * Inicializa el control de inactividad.
   * @param {Function} callback - Función que se ejecutará al superar el tiempo de inactividad.
   * @param {number} [customTimeout] - Tiempo en ms (opcional).
   */
  App.inactivity.init = function (callback, customTimeout) {
    timeoutCallback = typeof callback === "function" ? callback : null;
    timeoutMs =
      typeof customTimeout === "number" ? customTimeout : DEFAULT_TIMEOUT;

    // Eventos que se consideran "actividad"
    const events = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
      "touchmove",
    ];

    events.forEach((evt) => {
      window.addEventListener(evt, App.inactivity.resetTimer, {
        passive: true,
      });
    });

    App.inactivity.resetTimer();
    App.utils.log(`Inactividad inicializada (timeout = ${timeoutMs / 1000}s)`);
  };

  /**
   * Resetea el temporizador de inactividad.
   */
  App.inactivity.resetTimer = function () {
    if (inactivityTimer) clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(() => {
      if (timeoutCallback) timeoutCallback();
    }, timeoutMs);
  };

  /**
   * Detiene el control de inactividad.
   */
  App.inactivity.stop = function () {
    if (inactivityTimer) {
      clearTimeout(inactivityTimer);
      inactivityTimer = null;
    }
    App.utils.log("Control de inactividad detenido.");
  };
})(window.App);
