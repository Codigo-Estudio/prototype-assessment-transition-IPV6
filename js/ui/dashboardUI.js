// js/ui/dashboardUI.js
// Responsable único: renderizar el dashboard y manejar interacciones de sus elementos.

window.App = window.App || {};

(function (App) {
  "use strict";

  App.ui = App.ui || {};
  App.ui.dashboard = {};

  const dashboardContainer = document.getElementById("dashboard");
  const cardsContainer = document.getElementById("dashboardCards");
  // No mantener referencia fija al botón de resultados para evitar problemas tras clonados
  // Usaremos query dinámica dentro de updateExportButton()
  const exportButton = document.getElementById("btnResultados");
  const resetButton = document.getElementById("resetSurvey");

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
    attachResetHandler();
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
   * Actualiza el estado del botón de Ver resultados.
   */
  function updateExportButton() {
    const btn = document.getElementById("btnResultados");
    if (!btn) return;
    const allComplete = App.dashboard.allModulesComplete();
    btn.disabled = !allComplete;
    if (allComplete) btn.removeAttribute("aria-disabled");
    else btn.setAttribute("aria-disabled", "true");
    // Reemplazar cualquier handler previo asignando onclick directamente
    btn.onclick = function () {
      if (App.dashboard.allModulesComplete() && App.ui.showReport) {
        App.ui.showReport();
      }
    };
  }

  /**
   * Refresca el dashboard (cards y botón) después de cambios.
   */
  App.ui.dashboard.refresh = function () {
    renderCards();
    updateExportButton();
  };

  function attachResetHandler() {
    if (!resetButton) return;
    // avoid duplicate listeners
    try {
      resetButton.replaceWith(resetButton.cloneNode(true));
    } catch (e) {}
    const btn = document.getElementById("resetSurvey");
    if (!btn) return;
    btn.addEventListener("click", () => {
      // Clear app storage via App.storage if available
      try {
        if (App.storage && typeof App.storage.clearState === "function") {
          App.storage.clearState();
        }
      } catch (e) {}

      // Also clear other known keys used by moduleManager
      try {
        localStorage.removeItem("ipv6_survey_v1");
      } catch (e) {}

      // Optionally clear chat histories per module keys
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k && k.indexOf("chat_history_") === 0) localStorage.removeItem(k);
          if (k && k.indexOf("chat_welcome_seen_") === 0)
            localStorage.removeItem(k);
        });
      } catch (e) {}

      // Refresh dashboard and modules
      try {
        if (
          App.ui &&
          App.ui.dashboard &&
          typeof App.ui.dashboard.refresh === "function"
        )
          App.ui.dashboard.refresh();
        if (App.ui && typeof App.ui.showDashboard === "function")
          App.ui.showDashboard();
        if (App.moduleManager && App.moduleManager._state) {
          App.moduleManager._state = {
            currentModuleId: null,
            questionList: [],
            index: 0,
            seenCount: 0,
            totalForModule: 0,
          };
        }
        // Limpiar historial visual del chat
        if (App.chatbot) {
          // Vaciar contenedor de conversación
          var convoEl = document.getElementById("chatConversation");
          if (convoEl) convoEl.innerHTML = "";
          // Reiniciar estado interno
          App.chatbot._currentModuleId = null;
          App.chatbot._currentQuestionId = null;
          if (typeof App.chatbot._loadHistory === "function") {
            App.chatbot._loadHistory(null);
          }
        }
      } catch (e) {}

      // Notify user
      try {
        if (App.toast && typeof App.toast.show === "function") {
          App.toast.show(
            "Datos reiniciados. Puedes iniciar una nueva evaluación."
          );
        } else {
          alert("Datos reiniciados. Puedes iniciar una nueva evaluación.");
        }
      } catch (e) {}
    });
  }

  /**
   * Muestra el dashboard y oculta otros contenedores.
   */
  App.ui.showDashboard = function () {
    dashboardContainer.classList.remove("hidden");
    if (App.chatbot) App.chatbot.hide();
    App.ui.dashboard.refresh();
  };
})(window.App);
