// js/core/moduleManager.js
// Lógica central para el manejo de módulos, preguntas, respuestas, saltos y persistencia.
// Controla el inicio de módulo, navegación de preguntas, responder/saltar, cierre con "X", cálculo de progreso y expone API pública.

window.App = window.App || {};

(function (App) {
  "use strict";

  // --- Manejo de almacenamiento (usa App.storage si existe, si no localStorage) ---
  const STORAGE_KEY = "ipv6_survey_v1";

  function leerAlmacenamiento() {
    try {
      if (App.storage && typeof App.storage.get === "function") {
        const s = App.storage.get(STORAGE_KEY);
        return s ? JSON.parse(s) : {};
      } else {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      }
    } catch (e) {
      console.warn("moduleManager: error leyendo almacenamiento", e);
      return {};
    }
  }

  function guardarAlmacenamiento(obj) {
    try {
      const str = JSON.stringify(obj || {});
      if (App.storage && typeof App.storage.set === "function") {
        App.storage.set(STORAGE_KEY, str);
      } else {
        localStorage.setItem(STORAGE_KEY, str);
      }
    } catch (e) {
      console.warn("moduleManager: error guardando almacenamiento", e);
    }
  }

  // Estructura de almacenamiento:
  // {
  //   answers: { [idPregunta]: { answer: 'op', ts: 123 } },
  //   skipped: { [idPregunta]: true }
  // }

  App.moduleManager = App.moduleManager || {};

  // Estado actual en memoria
  let state = {
    currentModuleId: null,
    questionList: [], // Lista de preguntas del módulo actual
    index: 0, // Índice de la pregunta actual
    seenCount: 0, // Preguntas vistas en esta sesión del modal
    totalForModule: 0, // Total de preguntas del módulo
  };

  // Obtiene todas las preguntas de un módulo
  function obtenerPreguntasModulo(moduleId) {
    if (!Array.isArray(App.questions)) return [];
    return App.questions.filter((q) => q.module === moduleId);
  }

  // Devuelve cuántas preguntas han sido respondidas (sin contar saltadas)
  App.moduleManager.getAnsweredCount = function (moduleId) {
    const store = leerAlmacenamiento();
    const answers = store.answers || {};
    const moduleQs = obtenerPreguntasModulo(moduleId).map((q) => q.id);
    return moduleQs.filter((qid) => answers[qid]).length;
  };

  // Devuelve cuántas preguntas han sido saltadas
  App.moduleManager.getSkippedCount = function (moduleId) {
    const store = leerAlmacenamiento();
    const skipped = store.skipped || {};
    const moduleQs = obtenerPreguntasModulo(moduleId).map((q) => q.id);
    return moduleQs.filter((qid) => skipped[qid]).length;
  };

  // Devuelve el total de preguntas de un módulo
  App.moduleManager.getTotalQuestions = function (moduleId) {
    return obtenerPreguntasModulo(moduleId).length;
  };

  // Calcula el progreso de un módulo (solo respondidas / total)
  App.moduleManager.getModuleProgress = function (moduleId) {
    const total = App.moduleManager.getTotalQuestions(moduleId) || 0;
    if (total === 0) return 0;
    const answered = App.moduleManager.getAnsweredCount(moduleId);
    return Math.round((answered / total) * 100);
  };

  // Construye la lista de preguntas para iniciar el módulo
  function construirListaPreguntas(moduleId) {
    const todas = obtenerPreguntasModulo(moduleId);
    const store = leerAlmacenamiento();
    const answers = store.answers || {};
    const skipped = store.skipped || {};

    const saltadas = todas.filter((q) => skipped[q.id]);
    if (saltadas.length > 0) return saltadas.slice();

    return todas.filter((q) => !answers[q.id]);
  }

  // Inicia un módulo desde el dashboard
  App.moduleManager.startModule = function (moduleId) {
    state.currentModuleId = moduleId;
    state.questionList = construirListaPreguntas(moduleId);
    state.index = 0;
    state.seenCount = 0;
    state.totalForModule =
      App.moduleManager.getTotalQuestions(moduleId) ||
      state.questionList.length;

    const total = App.moduleManager.getTotalQuestions(moduleId);
    const answered = App.moduleManager.getAnsweredCount(moduleId);

    if (total > 0 && answered === total) {
      App.toast.show(`El módulo ${getModuleTitle(moduleId)} ya está completo.`);

      return;
    }

    if (state.questionList.length === 0) {
      App.ui.showDashboard && App.ui.showDashboard();
      return;
    }

    const q = state.questionList[state.index];
    App.chatbot.loadQuestion(q, calcularProgresoModal());
  };

  // Calcula el porcentaje de progreso del modal (solo respondidas)
  function calcularProgresoModal() {
    const total = state.totalForModule || 1;
    const store = leerAlmacenamiento();
    const answers = store.answers || {};
    const respondidas = obtenerPreguntasModulo(state.currentModuleId).filter(
      (q) => answers[q.id]
    ).length;
    return Math.round((respondidas / total) * 100);
  }

  // Obtiene el título del módulo
  function getModuleTitle(moduleId) {
    if (!Array.isArray(App.modules)) return moduleId;
    const m = App.modules.find((x) => x.id === moduleId);
    return m ? m.title : moduleId;
  }

  // Registra respuesta y pasa a la siguiente pregunta
  App.moduleManager.answerCurrent = function (selectedOption) {
    const q = state.questionList[state.index];
    if (!q || !q.id) return;

    const store = leerAlmacenamiento();
    store.answers = store.answers || {};
    store.skipped = store.skipped || {};

    store.answers[q.id] = { answer: selectedOption, ts: Date.now() };
    if (store.skipped[q.id]) delete store.skipped[q.id];

    guardarAlmacenamiento(store);

    state.index++;
    if (state.index >= state.questionList.length) {
      finalizarYCerrarModulo();
      return;
    }

    App.chatbot.loadQuestion(
      state.questionList[state.index],
      calcularProgresoModal()
    );
  };

  // Marca la pregunta como saltada y pasa a la siguiente
  App.moduleManager.skipCurrent = function () {
    const q = state.questionList[state.index];
    if (!q || !q.id) return;

    const store = leerAlmacenamiento();
    store.skipped = store.skipped || {};
    store.skipped[q.id] = true;
    guardarAlmacenamiento(store);

    // ocultar quick replies visibles en el UI (si existe)
    try {
      App.chatbot &&
        typeof App.chatbot._hideActiveQuickReplies === "function" &&
        App.chatbot._hideActiveQuickReplies();
    } catch (e) {
      // noop
    }

    state.index++;
    if (state.index >= state.questionList.length) {
      finalizarYCerrarModulo();
      return;
    }

    App.chatbot.loadQuestion(
      state.questionList[state.index],
      calcularProgresoModal()
    );
  };

  // Finaliza la sesión y cierra el modal
  function finalizarYCerrarModulo() {
    if (App.ui?.dashboard?.refresh) App.ui.dashboard.refresh();
    if (App.chatbot?.hide) {
      App.chatbot.hide();
    } else {
      document.getElementById("chatbotModal")?.classList.remove("active");
    }
    state = {
      currentModuleId: null,
      questionList: [],
      index: 0,
      seenCount: 0,
      totalForModule: 0,
    };
  }

  // Cierra el modal con "X" guardando progreso
  App.moduleManager.closeModuleSession = function () {
    if (!state.currentModuleId) {
      App.chatbot?.hide?.();
      return;
    }

    const store = leerAlmacenamiento();
    store.skipped = store.skipped || {};

    for (let i = state.index; i < state.questionList.length; i++) {
      const q = state.questionList[i];
      if (q && !store.skipped[q.id]) store.skipped[q.id] = true;
    }
    guardarAlmacenamiento(store);

    // ocultar quick replies visibles en el UI (si existe)
    try {
      App.chatbot &&
        typeof App.chatbot._hideActiveQuickReplies === "function" &&
        App.chatbot._hideActiveQuickReplies();
    } catch (e) {
      // noop
    }

    if (App.ui?.dashboard?.refresh) App.ui.dashboard.refresh();
    App.chatbot?.hide?.() ||
      document.getElementById("chatbotModal")?.classList.remove("active");

    state = {
      currentModuleId: null,
      questionList: [],
      index: 0,
      seenCount: 0,
      totalForModule: 0,
    };
  };

  // Obtiene el número de preguntas pendientes
  App.moduleManager.getPendingCount = function (moduleId) {
    const store = leerAlmacenamiento();
    const skipped = store.skipped || {};
    const moduleQs = obtenerPreguntasModulo(moduleId).map((q) => q.id);
    return moduleQs.filter((qid) => skipped[qid]).length;
  };

  App.moduleManager._state = state;
})(window.App);
