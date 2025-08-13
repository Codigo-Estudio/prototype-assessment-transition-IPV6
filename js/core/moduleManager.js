// js/core/moduleManager.js
// Responsable único: gestionar el flujo de preguntas y avance por módulo.

window.App = window.App || {};

(function (App) {
  "use strict";

  App.moduleManager = {};

  let currentModuleId = null;
  let currentQuestionIndex = 0;

  /**
   * Inicia un módulo.
   * Si hay pendientes, empieza en la primera pendiente.
   * @param {string} moduleId - ID del módulo a iniciar.
   */
  App.moduleManager.startModule = function (moduleId) {
    currentModuleId = moduleId;
    const pendingIndex = App.moduleManager.getFirstPendingIndex(moduleId);
    currentQuestionIndex = pendingIndex !== -1 ? pendingIndex : 0;

    App.utils.log(
      `Iniciando módulo: ${moduleId} desde índice ${currentQuestionIndex}`
    );
    App.chatbot.loadQuestion(
      App.questionsByModule(moduleId)[currentQuestionIndex]
    );
  };

  /**
   * Obtiene las preguntas de un módulo.
   * @param {string} moduleId
   * @returns {Array}
   */
  App.questionsByModule = function (moduleId) {
    return App.questions.filter((q) => q.module === moduleId);
  };

  /**
   * Guarda una respuesta y pasa a la siguiente pregunta o finaliza el módulo.
   * @param {*} answer
   */
  App.moduleManager.answerQuestion = function (answer) {
    const moduleAnswers = App.storage.getAnswers()[currentModuleId] || [];
    moduleAnswers[currentQuestionIndex] = answer;
    App.storage.saveAnswer(currentModuleId, moduleAnswers);

    App.moduleManager.goToNextQuestion();
  };

  /**
   * Salta una pregunta y pasa a la siguiente (sin marcarla como respondida).
   */
  App.moduleManager.skipQuestion = function () {
    App.utils.log(
      `Pregunta ${
        currentQuestionIndex + 1
      } del módulo ${currentModuleId} saltada.`
    );
    App.moduleManager.goToNextQuestion(true);
  };

  /**
   * Avanza a la siguiente pregunta o finaliza el módulo.
   * @param {boolean} skipped - true si la pregunta fue saltada.
   */
  App.moduleManager.goToNextQuestion = function (skipped = false) {
    const questions = App.questionsByModule(currentModuleId);

    // Si hay más preguntas, avanza
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      App.chatbot.loadQuestion(questions[currentQuestionIndex]);
      return;
    }

    // Si está en la última, verificar si hay pendientes
    const firstPending =
      App.moduleManager.getFirstPendingIndex(currentModuleId);
    if (firstPending !== -1 && !skipped) {
      // Hay pendientes pero no fue salto en la última → preguntar siguiente pendiente
      currentQuestionIndex = firstPending;
      App.chatbot.loadQuestion(questions[currentQuestionIndex]);
    } else if (skipped && firstPending !== -1) {
      // Si la última fue saltada → salir al dashboard
      App.ui.showDashboard();
    } else {
      // No hay más pendientes → finalizar módulo
      App.ui.showDashboard();
    }
  };

  /**
   * Devuelve el índice de la primera pregunta pendiente.
   * @param {string} moduleId
   * @returns {number} índice o -1 si no hay pendientes
   */
  App.moduleManager.getFirstPendingIndex = function (moduleId) {
    const answers = App.storage.getAnswers()[moduleId] || [];
    const questions = App.questionsByModule(moduleId);
    return questions.findIndex((_, idx) => !answers[idx]);
  };

  /**
   * Calcula el porcentaje real de avance del módulo.
   * @param {string} moduleId
   * @returns {number}
   */
  App.moduleManager.getModuleProgress = function (moduleId) {
    const answers = App.storage.getAnswers()[moduleId] || [];
    const questions = App.questionsByModule(moduleId);
    const answeredCount = answers.filter(
      (ans) => ans !== undefined && ans !== null
    ).length;
    return Math.round((answeredCount / questions.length) * 100);
  };
})(window.App);
