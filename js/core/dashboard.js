// js/core/dashboard.js
// Responsable único: manejar la lógica de datos y estados del dashboard.

window.App = window.App || {};

(function (App) {
  "use strict";

  App.dashboard = {};

  /**
   * Obtiene el progreso total de un módulo.
   * @param {string} moduleId
   * @returns {number}
   */
  App.dashboard.getModuleProgress = function (moduleId) {
    return App.moduleManager.getModuleProgress(moduleId);
  };

  /**
   * Verifica si todos los módulos están completos al 100%.
   * @returns {boolean}
   */
  App.dashboard.allModulesComplete = function () {
    return App.modules.every(
      (m) => App.dashboard.getModuleProgress(m.id) === 100
    );
  };

  /**
   * Devuelve el progreso global (promedio de todos los módulos).
   * @returns {number}
   */
  App.dashboard.getGlobalProgress = function () {
    const totalProgress = App.modules
      .map((m) => App.dashboard.getModuleProgress(m.id))
      .reduce((a, b) => a + b, 0);
    return Math.round(totalProgress / App.modules.length);
  };
})(window.App);
