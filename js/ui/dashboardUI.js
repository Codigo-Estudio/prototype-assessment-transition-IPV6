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
  // Estado de nivel actual (persistente en memoria)
  let nivelActual = 1;

  function getModulosHabilitados(modules, nivelActual, progresoPorModulo) {
    return modules.map((modulo) => ({
      ...modulo,
      habilitado:
        modulo.nivel === nivelActual || progresoPorModulo[modulo.id] === 100,
    }));
  }

  function getSiguienteNivel(modules, progresoPorModulo, nivelActual) {
    const modulosNivelActual = modules.filter((m) => m.nivel === nivelActual);
    const todosCompletos = modulosNivelActual.every(
      (m) => progresoPorModulo[m.id] === 100
    );
    return todosCompletos ? nivelActual + 1 : nivelActual;
  }

  function renderCards() {
    cardsContainer.innerHTML = "";
    // Obtener progreso por módulo
    const progresoPorModulo = {};
    App.modules.forEach((m) => {
      progresoPorModulo[m.id] = App.dashboard.getModuleProgress(m.id);
    });

    // Actualizar nivelActual si corresponde
    nivelActual = getSiguienteNivel(
      App.modules,
      progresoPorModulo,
      nivelActual
    );

    // Obtener estado de habilitación por módulo
    const modulosConEstado = getModulosHabilitados(
      App.modules,
      nivelActual,
      progresoPorModulo
    );

    // Separar el módulo Datos Básicos
    const modBasicos = modulosConEstado.find(
      (m) => m.id === "mod_datos_basicos"
    );
    const otrosModulos = modulosConEstado.filter(
      (m) => m.id !== "mod_datos_basicos"
    );

    // Card principal (fila completa)
    if (modBasicos) {
      const progress = App.dashboard.getModuleProgress(modBasicos.id);
      const card = App.ui.components.createModuleCard(
        modBasicos,
        progress,
        () => App.moduleManager.startModule(modBasicos.id)
      );
      card.classList.add("dashboard-card-full");
      if (!modBasicos.habilitado) card.classList.add("modulo-inhabilitado");
      cardsContainer.appendChild(card);
    }

    // Grid para los otros módulos (2 filas de 3 cards)
    const grid = document.createElement("div");
    grid.className = "dashboard-card-grid";
    otrosModulos.forEach((module, i) => {
      const progress = App.dashboard.getModuleProgress(module.id);
      const card = App.ui.components.createModuleCard(module, progress, () =>
        App.moduleManager.startModule(module.id)
      );
      if (!module.habilitado) card.classList.add("modulo-inhabilitado");
      grid.appendChild(card);
    });
    cardsContainer.appendChild(grid);
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

      // Reiniciar nivelActual a 1 para habilitar los módulos de nivel 1
      nivelActual = 1;

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
