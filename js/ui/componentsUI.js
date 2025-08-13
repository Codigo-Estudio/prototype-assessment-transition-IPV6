// js/ui/componentsUI.js
// Responsable único: generar elementos UI reutilizables.

window.App = window.App || {};
App.ui = App.ui || {};

(function (App) {
  "use strict";

  App.ui.components = {};

  /**
   * Crea una barra de progreso.
   * @param {number} percentage
   * @returns {HTMLElement}
   */
  App.ui.components.createProgressBar = function (percentage) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("card-progress");

    const bar = document.createElement("div");
    bar.classList.add("progress-bar");

    const fill = document.createElement("div");
    fill.classList.add("progress-fill");
    fill.style.width = `${percentage}%`;

    bar.appendChild(fill);
    wrapper.appendChild(bar);

    const label = document.createElement("span");
    label.textContent = `${percentage}%`;
    wrapper.appendChild(label);

    return wrapper;
  };

  /**
   * Crea una card de módulo.
   * @param {Object} module - Módulo con {id, title, icon}.
   * @param {number} progress - Porcentaje de avance del módulo.
   * @param {Function} onClick - Función a ejecutar al hacer clic.
   * @returns {HTMLElement}
   */
  App.ui.components.createModuleCard = function (module, progress, onClick) {
    const card = document.createElement("div");
    card.classList.add("dashboard-card");

    const icon = document.createElement("div");
    icon.classList.add("card-icon");
    icon.textContent = module.icon || "📊";

    const title = document.createElement("div");
    title.classList.add("card-title");
    title.textContent = module.title;

    const progressBar = App.ui.components.createProgressBar(progress);

    card.appendChild(icon);
    card.appendChild(title);
    card.appendChild(progressBar);

    if (typeof onClick === "function") {
      card.addEventListener("click", onClick);
    }

    return card;
  };
})(window.App);
