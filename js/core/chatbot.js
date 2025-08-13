// js/core/chatbot.js
// Responsable único: manejo de la interfaz y experiencia del chatbot.

window.App = window.App || {};

(function (App) {
  "use strict";

  App.chatbot = {};

  let questionText, optionsContainer, skipButton, closeButton;

  /**
   * Inicializa el chatbot y enlaza eventos.
   */
  App.chatbot.init = function () {
    questionText = document.getElementById("chatbotQuestion");
    optionsContainer = document.getElementById("chatbotOptions");
    skipButton = document.getElementById("skipQuestion");
    closeButton = document.getElementById("closeChatbot");

    if (!questionText || !optionsContainer) {
      console.error("No se encontraron los elementos del chatbot");
      return;
    }

    // Evento para saltar pregunta
    skipButton?.addEventListener("click", () => {
      App.moduleManager.skipQuestion();
    });

    // Evento para cerrar el chatbot
    closeButton?.addEventListener("click", () => {
      App.ui.showDashboard();
    });
  };

  /**
   * Muestra el modal del chatbot.
   */
  App.chatbot.show = function () {
    App.ui.modal.open("chatbotModal"); // ✅ usando modalUI.js
  };

  /**
   * Oculta el modal del chatbot.
   */
  App.chatbot.hide = function () {
    App.ui.modal.close("chatbotModal"); // ✅ usando modalUI.js
  };

  /**
   * Carga una pregunta en el chatbot.
   * @param {Object} question
   */
  App.chatbot.loadQuestion = function (question) {
    if (!question) {
      App.utils.log("No hay más preguntas para mostrar");
      App.ui.showDashboard();
      return;
    }

    questionText.textContent = question.text;
    optionsContainer.innerHTML = "";

    // Crear botones de opciones múltiples
    question.options.forEach((option) => {
      const btn = document.createElement("button");
      btn.textContent = option;
      btn.classList.add("chatbot-option");
      btn.addEventListener("click", () => {
        App.moduleManager.answerQuestion(option);
      });
      optionsContainer.appendChild(btn);
    });

    App.chatbot.show();
  };
})(window.App);
