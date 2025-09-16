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

    // Botón Enviar resultados
    const enviarBtn = document.getElementById("btnEnviarResultados");
    if (enviarBtn) {
      enviarBtn.onclick = function () {
        App.ui.emailModal.show({
          title:
            "Ingresa el email a donde se enviarán los resultados de la evaluación",
          onSend: function (email) {
            App.ui.messageModal.show({
              iconKey: "avatar_bot",
              title: "¡Enviado!",
              body: "Los resultados de la evaluación han sido enviados con éxito.",
              opacity: 0.6,
              onClose: null,
              buttonText: "Entendido",
            });
          },
          onClose: null,
        });
      };
    }
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
    // Obtener progreso por módulo
    const progresoPorModulo = {};
    App.modules.forEach((m) => {
      progresoPorModulo[m.id] = App.dashboard.getModuleProgress(m.id);
    });

    // Mostrar solo el módulo de perfilamiento si no está completo
    const perfilId = "mod_perfilamiento";
    const perfilCompletado = progresoPorModulo[perfilId] === 100;

    let modulosVisibles = [];
    if (!perfilCompletado) {
      // Solo mostrar perfilamiento
      modulosVisibles = App.modules.filter((m) => m.id === perfilId);
    } else {
      // Mostrar solo los módulos con preguntas habilitadas por la ruta
      if (
        App.utils &&
        typeof App.utils.getEnabledQuestionsByProfile === "function" &&
        window.App &&
        window.App._profileAnswers
      ) {
        const enabledQuestions = App.utils.getEnabledQuestionsByProfile(
          window.App._profileAnswers
        );
        modulosVisibles = App.modules.filter((m) => {
          if (m.id === perfilId) return false;
          // ¿Hay preguntas habilitadas para este módulo?
          return App.questions.some(
            (q) => q.module === m.id && enabledQuestions.includes(q.id)
          );
        });
      } else {
        // Si no hay respuestas de perfil, no mostrar ningún módulo
        modulosVisibles = [];
      }
    }

    // Cambiar clase según contexto: perfilamiento o módulos activos
    if (
      modulosVisibles.length === 1 &&
      modulosVisibles[0].id === "mod_perfilamiento"
    ) {
      cardsContainer.className = "dashboardCards dashboardCards-perfil";
    } else {
      cardsContainer.className = "dashboardCards dashboard-card-grid";
    }
    cardsContainer.innerHTML = "";
    // Renderizar cards visibles en orden, solo habilitar el primero pendiente
    let moduloHabilitado = false;
    modulosVisibles.forEach((modulo) => {
      const progress = App.dashboard.getModuleProgress(modulo.id);
      let habilitado = false;
      if (progress === 100) {
        habilitado = true;
      } else if (!moduloHabilitado && progress < 100) {
        habilitado = true;
        moduloHabilitado = true;
      }
      const card = App.ui.components.createModuleCard(
        modulo,
        progress,
        habilitado ? () => App.moduleManager.startModule(modulo.id) : null
      );
      if (!habilitado) card.classList.add("modulo-inhabilitado");
      cardsContainer.appendChild(card);
    });
  }

  /**
   * Actualiza el estado del botón de Ver resultados.
   */
  function updateExportButton() {
    const btn = document.getElementById("btnResultados");
    const enviarBtn = document.getElementById("btnEnviarResultados");
    if (!btn) return;
    // Solo considerar módulos visibles (excluyendo perfilamiento)
    const perfilId = "mod_perfilamiento";
    let modulosVisibles = [];
    if (
      App.utils &&
      typeof App.utils.getEnabledQuestionsByProfile === "function" &&
      window.App &&
      window.App._profileAnswers
    ) {
      const enabledQuestions = App.utils.getEnabledQuestionsByProfile(
        window.App._profileAnswers
      );
      modulosVisibles = App.modules.filter((m) => {
        if (m.id === perfilId) return false;
        return App.questions.some(
          (q) => q.module === m.id && enabledQuestions.includes(q.id)
        );
      });
    }
    // Verificar si todos los módulos visibles están completos
    const allComplete =
      modulosVisibles.length > 0 &&
      modulosVisibles.every(
        (m) => App.dashboard.getModuleProgress(m.id) === 100
      );
    btn.disabled = !allComplete;
    if (allComplete) btn.removeAttribute("aria-disabled");
    else btn.setAttribute("aria-disabled", "true");
    btn.onclick = function () {
      if (allComplete && App.ui.showReport) {
        App.ui.showReport();
      }
    };
    // Sincronizar estado de habilitación del botón Enviar resultados
    if (enviarBtn) {
      enviarBtn.disabled = !allComplete;
      if (allComplete) enviarBtn.removeAttribute("aria-disabled");
      else enviarBtn.setAttribute("aria-disabled", "true");
    }
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
      if (App.ui && typeof App.ui.resetSurveyState === "function") {
        App.ui.resetSurveyState();
      }
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

  /**
   * Resetea el estado de la encuesta y la interfaz.
   * @param {Object} [opts] - Opciones, por ejemplo { silent: true } para no mostrar toast
   */
  App.ui.resetSurveyState = function (opts) {
    opts = opts || {};
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
    if (typeof nivelActual !== "undefined") nivelActual = 1;

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

    // Notify user (solo si no es silent)
    if (!opts.silent) {
      try {
        if (App.toast && typeof App.toast.show === "function") {
          App.toast.show(
            "Datos reiniciados. Puedes iniciar una nueva evaluación."
          );
        } else {
          alert("Datos reiniciados. Puedes iniciar una nueva evaluación.");
        }
      } catch (e) {}
    }
  };
})(window.App);
