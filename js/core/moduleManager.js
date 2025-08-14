// js/core/moduleManager.js
// Lógica central para manejo de módulos, preguntas, respuestas, saltos y persistencia.
// Responsable: startModule, navegar preguntas, responder/saltar, cerrar con 'X', calcular progreso y exponer API pública.

window.App = window.App || {};

(function (App) {
  "use strict";

  // --- storage helpers (usa App.storage si existe, sino localStorage) ---
  const STORAGE_KEY = "ipv6_survey_v1";

  function readStore() {
    try {
      if (App.storage && typeof App.storage.get === "function") {
        const s = App.storage.get(STORAGE_KEY);
        return s ? JSON.parse(s) : {};
      } else {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      }
    } catch (e) {
      console.warn("moduleManager: error reading store", e);
      return {};
    }
  }

  function writeStore(obj) {
    try {
      const str = JSON.stringify(obj || {});
      if (App.storage && typeof App.storage.set === "function") {
        App.storage.set(STORAGE_KEY, str);
      } else {
        localStorage.setItem(STORAGE_KEY, str);
      }
    } catch (e) {
      console.warn("moduleManager: error writing store", e);
    }
  }

  // shape of store:
  // {
  //   answers: { [questionId]: { answer: 'op', ts: 123 } },
  //   skipped: { [questionId]: true },
  //   seen: { [questionId]: true } // optional: questions already shown at least once
  // }

  // --- module manager object ---
  App.moduleManager = App.moduleManager || {};

  // Current runtime session state
  let state = {
    currentModuleId: null,
    questionList: [], // ordered array of question objects to navigate in this session
    index: 0, // current index in questionList
    seenCount: 0, // number of questions seen in this modal session (used for modal progress)
    totalForModule: 0, // total number of questions in this module (constant for calculating modal progress)
  };

  // Utility to get all questions for a module from App.questions
  function getModuleQuestions(moduleId) {
    if (!Array.isArray(App.questions)) return [];
    return App.questions.filter((q) => q.module === moduleId);
  }

  // Public: compute per-module answered count (only counts real answers, not skipped)
  App.moduleManager.getAnsweredCount = function (moduleId) {
    const store = readStore();
    const answers = store.answers || {};
    const moduleQs = getModuleQuestions(moduleId).map((q) => q.id);
    let cnt = 0;
    moduleQs.forEach((qid) => {
      if (answers[qid]) cnt++;
    });
    return cnt;
  };

  // Public: compute per-module skipped count
  App.moduleManager.getSkippedCount = function (moduleId) {
    const store = readStore();
    const skipped = store.skipped || {};
    const moduleQs = getModuleQuestions(moduleId).map((q) => q.id);
    let cnt = 0;
    moduleQs.forEach((qid) => {
      if (skipped[qid]) cnt++;
    });
    return cnt;
  };

  // Public: total questions for module
  App.moduleManager.getTotalQuestions = function (moduleId) {
    return getModuleQuestions(moduleId).length;
  };

  // Public: dashboard progress for module (only answered count / total)
  App.moduleManager.getModuleProgress = function (moduleId) {
    const total = App.moduleManager.getTotalQuestions(moduleId) || 0;
    if (total === 0) return 0;
    const answered = App.moduleManager.getAnsweredCount(moduleId);
    return Math.round((answered / total) * 100);
  };

  // Internal: build a question list when entering a module
  // Behavior:
  //  - If there are skipped questions for this module, load only those (in original order)
  //  - Otherwise load all questions of the module that are NOT answered yet
  function buildQuestionList(moduleId) {
    const allQs = getModuleQuestions(moduleId);
    const store = readStore();
    const answers = store.answers || {};
    const skipped = store.skipped || {};

    // Build skipped list for this module (original ordering)
    const skippedList = allQs.filter((q) => skipped[q.id]);

    if (skippedList.length > 0) {
      // We will revisit only skipped ones (pending)
      return skippedList.slice();
    }

    // Otherwise return unanswered questions (exclude answers)
    const unanswered = allQs.filter((q) => !answers[q.id]);
    return unanswered.slice();
  }

  // Public: start a module (called from UI when clicking a card)
  App.moduleManager.startModule = function (moduleId) {
    // prepare state
    state.currentModuleId = moduleId;
    const list = buildQuestionList(moduleId);
    state.questionList = list;
    state.index = 0;
    state.seenCount = 0;
    state.totalForModule =
      App.moduleManager.getTotalQuestions(moduleId) || list.length;

    // If there are no questions to show (all answered and no skipped), show toast and return.
    const answered = App.moduleManager.getAnsweredCount(moduleId);
    const total = App.moduleManager.getTotalQuestions(moduleId);
    if (total > 0 && answered === total) {
      // toast: module already complete
      showToast(
        `El módulo "${getModuleTitle(moduleId)}" ya está completo.`,
        5000
      );
      return;
    }

    // Start by loading the first question (or show message if none)
    if (state.questionList.length === 0) {
      // nothing to do (maybe everything answered)
      App.ui.showDashboard && App.ui.showDashboard();
      return;
    }

    // Show first question via chatbot API
    const q = state.questionList[state.index];
    App.chatbot.loadQuestion(q, computeModalProgress()); // pass current modal progress percent
  };

  // Helper to compute modal progress percent (seen / total)
  function computeModalProgress() {
    const total = state.totalForModule || 1;
    return Math.round((state.seenCount / total) * 100);
  }

  // Helper to get module title by id (App.modules)
  function getModuleTitle(moduleId) {
    if (!Array.isArray(App.modules)) return moduleId;
    const m = App.modules.find((x) => x.id === moduleId);
    return m ? m.title : moduleId;
  }

  // Answer current question with selected option value
  App.moduleManager.answerCurrent = function (selectedOption) {
    const q = state.questionList[state.index];
    if (!q) return;

    const store = readStore();
    store.answers = store.answers || {};
    store.skipped = store.skipped || {};
    // Save answer
    store.answers[q.id] = { answer: selectedOption, ts: Date.now() };
    // If it was previously skipped, remove from skipped
    if (store.skipped[q.id]) delete store.skipped[q.id];
    writeStore(store);

    // Mark seen and advance progress
    state.seenCount++;
    state.index++;

    // If we exhausted questionList -> end module session
    if (state.index >= state.questionList.length) {
      // final step: close modal and refresh dashboard
      finalizeAndCloseModule();
      return;
    }

    // otherwise load next question
    const nextQ = state.questionList[state.index];
    App.chatbot.loadQuestion(nextQ, computeModalProgress());
  };

  // Skip current question (mark as pending)
  App.moduleManager.skipCurrent = function () {
    const q = state.questionList[state.index];
    if (!q) return;

    const store = readStore();
    store.skipped = store.skipped || {};
    store.skipped[q.id] = true;
    writeStore(store);

    state.seenCount++;
    state.index++;

    // If we exhausted questionList -> end module session
    if (state.index >= state.questionList.length) {
      finalizeAndCloseModule();
      return;
    }

    // otherwise load next
    const nextQ = state.questionList[state.index];
    App.chatbot.loadQuestion(nextQ, computeModalProgress());
  };

  // Finalize module session: close modal, refresh dashboard UI
  function finalizeAndCloseModule() {
    // Notify UI to refresh (dashboard)
    if (
      App.ui &&
      App.ui.dashboard &&
      typeof App.ui.dashboard.refresh === "function"
    ) {
      App.ui.dashboard.refresh();
    }
    // Close chatbot modal
    if (App.chatbot && typeof App.chatbot.hide === "function") {
      App.chatbot.hide();
    } else {
      // fallback: remove active class
      const modal = document.getElementById("chatbotModal");
      modal && modal.classList.remove("active");
    }
    // Reset runtime state
    state.currentModuleId = null;
    state.questionList = [];
    state.index = 0;
    state.seenCount = 0;
    state.totalForModule = 0;
  }

  // Close via X: mark all remaining questions in the session as skipped (pending),
  // persist, refresh dashboard, and close modal
  App.moduleManager.closeModuleSession = function () {
    if (!state.currentModuleId) {
      // nothing to do
      if (App.chatbot && typeof App.chatbot.hide === "function")
        App.chatbot.hide();
      return;
    }

    const store = readStore();
    store.skipped = store.skipped || {};

    // Mark remaining questions as skipped
    for (let i = state.index; i < state.questionList.length; i++) {
      const q = state.questionList[i];
      if (q && !store.skipped[q.id]) store.skipped[q.id] = true;
    }
    writeStore(store);

    // Refresh dashboard
    if (
      App.ui &&
      App.ui.dashboard &&
      typeof App.ui.dashboard.refresh === "function"
    ) {
      App.ui.dashboard.refresh();
    }

    // Close modal
    if (App.chatbot && typeof App.chatbot.hide === "function") {
      App.chatbot.hide();
    } else {
      const modal = document.getElementById("chatbotModal");
      modal && modal.classList.remove("active");
    }

    // Reset state
    state.currentModuleId = null;
    state.questionList = [];
    state.index = 0;
    state.seenCount = 0;
    state.totalForModule = 0;
  };

  // Public: get number of pending questions for a module
  App.moduleManager.getPendingCount = function (moduleId) {
    const store = readStore();
    const skipped = store.skipped || {};
    const moduleQs = getModuleQuestions(moduleId).map((q) => q.id);
    let cnt = 0;
    moduleQs.forEach((qid) => {
      if (skipped[qid]) cnt++;
    });
    return cnt;
  };

  // Toast helper (top-right, fades after duration). Creates ephemeral element.
  function showToast(message, duration = 5000) {
    try {
      const toast = document.createElement("div");
      toast.className = "app-toast";
      toast.textContent = message;
      Object.assign(toast.style, {
        position: "fixed",
        top: "16px",
        right: "16px",
        background: "rgba(15,23,36,0.95)",
        color: "#fff",
        padding: "10px 14px",
        borderRadius: "8px",
        zIndex: 99999,
        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
        opacity: "0",
        transition: "opacity 300ms ease, transform 300ms ease",
        transform: "translateY(-6px)",
      });
      document.body.appendChild(toast);
      // force reflow
      setTimeout(() => {
        toast.style.opacity = "1";
        toast.style.transform = "translateY(0)";
      }, 20);

      setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(-6px)";
        setTimeout(() => toast.remove(), 400);
      }, duration);
    } catch (e) {
      console.warn("showToast error", e);
    }
  }

  // Expose for tests/debug
  App.moduleManager._state = state;
})(window.App);
