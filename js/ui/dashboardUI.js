// js/ui/dashboardUI.js
// Responsable único: renderizar el dashboard y manejar interacciones de sus elementos.

window.App = window.App || {};

(function (App) {
  "use strict";

  App.ui = App.ui || {};
  App.ui.dashboard = {};

  const dashboardContainer = document.getElementById("dashboard");
  const cardsContainer = document.getElementById("dashboardCards");
  const exportButton = document.getElementById("exportPdf");

  /**
   * Inicializa el dashboard.
   */
  App.ui.dashboard.init = function () {
    if (!dashboardContainer || !cardsContainer) {
      console.error("No se encontró el contenedor del dashboard.");
      return;
    }

    renderCards();
    updateExportButton();
  };

  /**
   * Renderiza las cards de cada módulo usando componentsUI.
   */
  function renderCards() {
    cardsContainer.innerHTML = "";

    App.modules.forEach((module) => {
      const progress = App.dashboard.getModuleProgress(module.id);

      const card = App.ui.components.createModuleCard(
        module,
        progress,
        () => App.moduleManager.startModule(module.id) // callback click
      );

      cardsContainer.appendChild(card);
    });
  }

  /**
   * Actualiza el estado del botón de exportar PDF.
   */
  function updateExportButton() {
    const allComplete = App.dashboard.allModulesComplete();
    if (exportButton) {
      exportButton.disabled = !allComplete;
      exportButton.addEventListener("click", () => {
        if (allComplete) {
          App.pdfExport.generateReport();
        }
      });
    }
  }

  /**
   * Refresca el dashboard (cards y botón) después de cambios.
   */
  App.ui.dashboard.refresh = function () {
    renderCards();
    updateExportButton();
  };

  /**
   * Muestra el dashboard y oculta otros contenedores.
   */
  App.ui.showDashboard = function () {
    dashboardContainer.classList.remove("hidden");
    if (App.chatbot) App.chatbot.hide();
    App.ui.dashboard.refresh();
  };
})(window.App);
