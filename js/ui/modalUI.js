// js/ui/modalUI.js
// Responsable único: controlar la apertura y cierre de modales en la UI.

window.App = window.App || {};
App.ui = App.ui || {};

(function (App) {
  "use strict";

  App.ui.modal = {};

  /**
   * Abre un modal por ID.
   * @param {string} modalId
   */
  App.ui.modal.open = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      App.utils.log(`Modal "${modalId}" abierto`);
    } else {
      console.warn(`No se encontró el modal con ID "${modalId}"`);
    }
  };

  /**
   * Cierra un modal por ID.
   * @param {string} modalId
   */
  App.ui.modal.close = function (modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
      App.utils.log(`Modal "${modalId}" cerrado`);
    } else {
      console.warn(`No se encontró el modal con ID "${modalId}"`);
    }
  };

  /**
   * Cierra todos los modales activos.
   */
  App.ui.modal.closeAll = function () {
    document.querySelectorAll(".modal.active").forEach((modal) => {
      modal.classList.remove("active");
    });
    App.utils.log("Todos los modales cerrados");
  };
})(window.App);
