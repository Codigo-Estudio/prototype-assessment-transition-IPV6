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
    // Calcular total dinámico: contar solo preguntas elegibles (no excluidas por dependencias)
    const todas = obtenerPreguntasModulo(moduleId);
    const store = leerAlmacenamiento();
    const answers = store.answers || {};

    let count = 0;
    todas.forEach((q) => {
      if (!q) return;
      if (q.requires && Array.isArray(q.requires)) {
        let excluded = false;
        for (let i = 0; i < q.requires.length; i++) {
          const r = q.requires[i];
          if (!r || !r.questionId) continue;
          const recorded =
            answers[r.questionId] && answers[r.questionId].answer;
          if (typeof recorded !== "undefined" && recorded !== null) {
            if (
              Array.isArray(r.answers) &&
              r.answers.length &&
              r.answers.indexOf(recorded) === -1
            ) {
              excluded = true;
              break;
            }
          }
        }
        if (excluded) return;
      }
      count++;
    });
    return count;
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

    // Mantener comportamiento previo: si hay preguntas marcadas como saltadas, devolver solo esas
    const saltadas = todas.filter((q) => skipped[q.id]);
    if (saltadas.length > 0) return saltadas.slice();

    // Excluir preguntas cuya dependencia ya fue respondida con una respuesta incompatible
    const excludedIds = new Set();
    todas.forEach((q) => {
      if (!q || !q.requires || !Array.isArray(q.requires)) return;
      for (let i = 0; i < q.requires.length; i++) {
        const r = q.requires[i];
        if (!r || !r.questionId) continue;
        const recorded = answers[r.questionId] && answers[r.questionId].answer;
        if (typeof recorded !== "undefined" && recorded !== null) {
          if (
            Array.isArray(r.answers) &&
            r.answers.length &&
            r.answers.indexOf(recorded) === -1
          ) {
            excludedIds.add(q.id);
            break;
          }
        }
      }
    });

    // Devolver preguntas no respondidas y no excluidas
    return todas.filter((q) => !answers[q.id] && !excludedIds.has(q.id));
  }

  // Verifica si una pregunta tiene dependencias (requires) y si estas están satisfechas
  // returns { blocked: boolean, dependency: { questionId, answers } | null }
  function verificarDependencias(question) {
    if (!question || !question.requires || !Array.isArray(question.requires))
      return { blocked: false, dependency: null };

    const store = leerAlmacenamiento();
    const answers = store.answers || {};

    for (let i = 0; i < question.requires.length; i++) {
      const r = question.requires[i];
      if (!r || !r.questionId) continue;
      const recorded = answers[r.questionId] && answers[r.questionId].answer;
      // if not answered or answer not in allowed list -> blocked
      if (
        !recorded ||
        (Array.isArray(r.answers) &&
          r.answers.length &&
          r.answers.indexOf(recorded) === -1)
      ) {
        return {
          blocked: true,
          dependency: { questionId: r.questionId, answers: r.answers || [] },
        };
      }
    }

    return { blocked: false, dependency: null };
  }

  // Devuelve un snippet legible (primeras N palabras) de la pregunta identificada por id
  function getQuestionSnippet(questionId, wordCount = 8) {
    if (!questionId || !Array.isArray(App.questions)) return questionId || "";
    const q = App.questions.find((x) => x.id === questionId);
    if (!q || !q.text) return questionId;
    const words = q.text.trim().split(/\s+/);
    const snippet = words.slice(0, wordCount).join(" ");
    return `"${snippet}..."`;
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
    // verificar dependencias antes de mostrar
    const check = verificarDependencias(q);
    if (check.blocked) {
      try {
        const depQId = check.dependency.questionId;
        const snippet = getQuestionSnippet(depQId, 8);
        const sourceModule =
          (App.questions.find((x) => x.id === depQId) || {}).module || "";
        const sourceTitle = getModuleTitle(sourceModule);
        const currentTitle = getModuleTitle(moduleId);
        const title = "¡Ups!";
        const body = `Para continuar con el módulo **${currentTitle}** primero debe responder la pregunta **${snippet}** del módulo **${sourceTitle}**`;
        if (
          App.ui &&
          App.ui.messageModal &&
          typeof App.ui.messageModal.show === "function"
        ) {
          App.ui.messageModal.show({
            iconKey: "avatar_bot",
            title: title,
            body: body,
            opacity: 0.6,
          });
        } else {
          alert(
            `Para continuar con el módulo ${currentTitle} primero debe responder la pregunta **${snippet}** del módulo ${sourceTitle}`
          );
        }
      } catch (e) {}
      // redirigir al dashboard
      App.ui.showDashboard && App.ui.showDashboard();
      return;
    }

    App.chatbot.loadQuestion(q, calcularProgresoModal());
  };

  // Calcula el porcentaje de progreso del modal (solo respondidas)
  function calcularProgresoModal() {
    const store = leerAlmacenamiento();
    const answers = store.answers || {};
    const todas = obtenerPreguntasModulo(state.currentModuleId);

    // construir lista de preguntas elegibles
    const elegibles = todas.filter((q) => {
      if (!q) return false;
      if (q.requires && Array.isArray(q.requires)) {
        for (let i = 0; i < q.requires.length; i++) {
          const r = q.requires[i];
          if (!r || !r.questionId) continue;
          const recorded =
            answers[r.questionId] && answers[r.questionId].answer;
          if (typeof recorded !== "undefined" && recorded !== null) {
            if (
              Array.isArray(r.answers) &&
              r.answers.length &&
              r.answers.indexOf(recorded) === -1
            ) {
              return false; // excluida
            }
          }
        }
      }
      return true;
    });

    const total = elegibles.length || 1;
    const respondidas = elegibles.filter((q) => answers[q.id]).length;
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

    // Avanzar hasta encontrar la siguiente pregunta elegible. Si la dependencia está
    // no respondida -> bloquear y mostrar modal; si la dependencia fue respondida
    // con una respuesta incompatible -> omitir la pregunta silenciosamente.
    while (state.index < state.questionList.length) {
      const nextQ = state.questionList[state.index];
      const check = verificarDependencias(nextQ);
      if (!check.blocked) {
        App.chatbot.loadQuestion(nextQ, calcularProgresoModal());
        return;
      }

      // check.blocked === true
      try {
        const dep = check.dependency;
        const depQId = dep && dep.questionId;
        const store = leerAlmacenamiento();
        const recorded =
          store.answers &&
          store.answers[depQId] &&
          store.answers[depQId].answer;

        // Si la dependencia fue respondida pero con una respuesta NO permitida -> omitir esta pregunta
        if (
          typeof recorded !== "undefined" &&
          recorded !== null &&
          Array.isArray(dep.answers) &&
          dep.answers.length &&
          dep.answers.indexOf(recorded) === -1
        ) {
          // omitir y continuar al siguiente
          state.index++;
          continue;
        }

        // Si la dependencia NO fue respondida -> bloquear mostrando modal
        const snippet = getQuestionSnippet(depQId, 8);
        const sourceModule =
          (App.questions.find((x) => x.id === depQId) || {}).module || "";
        const sourceTitle = getModuleTitle(sourceModule);
        const currentTitle = getModuleTitle(state.currentModuleId);
        const title = "¡Ups!";
        const body = `Para continuar con el módulo **${currentTitle}** primero debe responder la pregunta **${snippet}** del módulo **${sourceTitle}**`;
        if (
          App.ui &&
          App.ui.messageModal &&
          typeof App.ui.messageModal.show === "function"
        ) {
          App.ui.messageModal.show({
            iconKey: "avatar_bot",
            title: title,
            body: body,
            opacity: 0.6,
          });
        } else {
          alert(
            `Para continuar con el módulo ${currentTitle} primero debe responder la pregunta **${snippet}** del módulo ${sourceTitle}`
          );
        }
      } catch (e) {}
      App.ui.showDashboard && App.ui.showDashboard();
      return;
    }

    // Si salimos del while, no quedan preguntas
    finalizarYCerrarModulo();
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
    // Avanzar hasta encontrar la siguiente pregunta elegible igual que en answerCurrent
    while (state.index < state.questionList.length) {
      const nextQ = state.questionList[state.index];
      const check = verificarDependencias(nextQ);
      if (!check.blocked) {
        App.chatbot.loadQuestion(nextQ, calcularProgresoModal());
        return;
      }

      try {
        const dep = check.dependency;
        const depQId = dep && dep.questionId;
        const store = leerAlmacenamiento();
        const recorded =
          store.answers &&
          store.answers[depQId] &&
          store.answers[depQId].answer;

        // Si la dependencia fue respondida pero con una respuesta NO permitida -> omitir esta pregunta
        if (
          typeof recorded !== "undefined" &&
          recorded !== null &&
          Array.isArray(dep.answers) &&
          dep.answers.length &&
          dep.answers.indexOf(recorded) === -1
        ) {
          state.index++;
          continue;
        }

        // Si la dependencia NO fue respondida -> bloquear mostrando modal
        const snippet = getQuestionSnippet(depQId, 8);
        const sourceModule =
          (App.questions.find((x) => x.id === depQId) || {}).module || "";
        const sourceTitle = getModuleTitle(sourceModule);
        const currentTitle = getModuleTitle(state.currentModuleId);
        const title = "¡Ups!";
        const body = `Para continuar con el módulo **${currentTitle}** primero debe responder la pregunta **${snippet}** del módulo **${sourceTitle}**`;
        if (
          App.ui &&
          App.ui.messageModal &&
          typeof App.ui.messageModal.show === "function"
        ) {
          App.ui.messageModal.show({
            iconKey: "avatar_bot",
            title: title,
            body: body,
            opacity: 0.6,
          });
        } else {
          alert(
            `Para continuar con el módulo ${currentTitle} primero debe responder la pregunta **${snippet}** del módulo ${sourceTitle}`
          );
        }
      } catch (e) {}
      App.ui.showDashboard && App.ui.showDashboard();
      return;
    }

    // Si no quedan preguntas
    finalizarYCerrarModulo();
  };

  // Finaliza la sesión y cierra el modal
  function finalizarYCerrarModulo() {
    if (App.ui?.dashboard?.refresh) App.ui.dashboard.refresh();
    if (App.chatbot?.hide) {
      App.chatbot.hide();
    } else {
      document.getElementById("chatbotModal")?.classList.remove("active");
    }
    // Mostrar modal de felicitaciones al completar el módulo
    try {
      const mid = state.currentModuleId;
      const pending = App.moduleManager.getPendingCount(mid);
      if (pending === 0) {
        const title = "Felicidades";
        const moduleName =
          Array.isArray(App.modules) && App.modules.find((m) => m.id === mid)
            ? App.modules.find((m) => m.id === mid).title
            : mid;
        const body = `Has logrado completar con satisfacción el modulo **${moduleName}**.`;
        if (
          App.ui &&
          App.ui.messageModal &&
          typeof App.ui.messageModal.show === "function"
        ) {
          App.ui.messageModal.show({
            iconKey: "avatar_bot",
            title: title,
            body: body,
            opacity: 0.7,
          });
        }
      }
      if (pending > 0) {
        const wordQ = pending === 1 ? "pregunta" : "preguntas";
        const wordP = pending === 1 ? "pendiente" : "pendientes";
        const body = `Tienes **${pending}** ${wordQ} ${wordP} por responder`;
        if (
          App.ui &&
          App.ui.messageModal &&
          typeof App.ui.messageModal.show === "function"
        ) {
          App.ui.messageModal.show({
            iconKey: "avatar_bot",
            title: "No lo olvides",
            body: body,
            opacity: 0.6,
          });
        }
      }
    } catch (e) {
      // noop
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

    // Mostrar recordatorio si quedan pendientes al cerrar sesión
    try {
      const mid = state.currentModuleId;
      const pending = App.moduleManager.getPendingCount(mid);
      if (pending > 0) {
        const wordQ = pending === 1 ? "pregunta" : "preguntas";
        const wordP = pending === 1 ? "pendiente" : "pendientes";
        const body = `Tienes aún **${pending}** ${wordQ} ${wordP} por responder`;
        if (
          App.ui &&
          App.ui.messageModal &&
          typeof App.ui.messageModal.show === "function"
        ) {
          App.ui.messageModal.show({
            iconKey: "avatar_bot",
            title: "No lo olvides",
            body: body,
            opacity: 0.6,
          });
        }
      }
    } catch (e) {
      // noop
    }

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
