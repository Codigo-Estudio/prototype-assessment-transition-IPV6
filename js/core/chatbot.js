// js/core/chatbot.js
// Manejo UI del chatbot modal: render preguntas, opciones, barra de progreso del modal
// Depende de App.moduleManager para la lógica

window.App = window.App || {};

(function (App) {
  "use strict";

  App.chatbot = App.chatbot || {};

  let questionEl, optionsEl, skipBtn, closeBtn, modalProgressFill;

  App.chatbot.init = function () {
    questionEl = document.getElementById("chatbotQuestion");
    optionsEl = document.getElementById("chatbotOptions");
    skipBtn = document.getElementById("skipQuestion");
    closeBtn = document.getElementById("closeChatbot");

    // modal progress fill (optional)
    const progressContainer = document.querySelector(".modal-progress");
    modalProgressFill = progressContainer
      ? progressContainer.querySelector(".fill")
      : null;

    if (skipBtn) {
      skipBtn.addEventListener("click", () => {
        // delegate to moduleManager
        App.moduleManager.skipCurrent();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        // closing with X: persist remaining as skipped
        App.moduleManager.closeModuleSession();
      });
    }

    // Ensure modal hide on init
    App.chatbot.hide();
  };

  // Show modal (uses App.ui.modal if available, else toggles class)
  App.chatbot.show = function () {
    if (App.ui && App.ui.modal && typeof App.ui.modal.open === "function") {
      App.ui.modal.open("chatbotModal");
    } else {
      const modal = document.getElementById("chatbotModal");
      modal && modal.classList.add("active");
      modal && modal.setAttribute("aria-hidden", "false");
    }
  };

  App.chatbot.hide = function () {
    if (App.ui && App.ui.modal && typeof App.ui.modal.close === "function") {
      App.ui.modal.close("chatbotModal");
    } else {
      const modal = document.getElementById("chatbotModal");
      modal && modal.classList.remove("active");
      modal && modal.setAttribute("aria-hidden", "true");
    }
  };

  // Load a question object into the modal.
  // question = { id, text, options: [...] }
  // modalProgressPercent: optional number 0-100 to update the modal progress bar
  App.chatbot.loadQuestion = function (question, modalProgressPercent = 0) {
    if (!questionEl || !optionsEl) {
      console.error("chatbot: elementos DOM no encontrados");
      return;
    }

    // Render question text
    questionEl.textContent = question.text || "";

    // Render options as buttons
    optionsEl.innerHTML = "";
    if (Array.isArray(question.options) && question.options.length) {
      question.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.type = "button";
        btn.textContent = opt;
        btn.addEventListener("click", () => {
          // visual feedback
          btn.classList.add("selected");
          // short delay so user sees selection, then call moduleManager.answerCurrent
          setTimeout(() => {
            App.moduleManager.answerCurrent(opt);
          }, 200);
        });
        optionsEl.appendChild(btn);
      });
    } else {
      // If no options, show a fallback "Continuar" button
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = "Continuar";
      btn.addEventListener("click", () => App.moduleManager.answerCurrent(""));
      optionsEl.appendChild(btn);
    }

    // Update modal progress bar (if present)
    if (modalProgressFill) {
      modalProgressFill.style.width = (modalProgressPercent || 0) + "%";
    }

    // Show the modal
    App.chatbot.show();
  };

  // Optional helper: update modal progress externally
  App.chatbot.setModalProgress = function (percent) {
    if (modalProgressFill) {
      modalProgressFill.style.width = (percent || 0) + "%";
    }
  };

  // Initialize immediately if DOM is ready
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(() => {
      App.chatbot.init();
    }, 0);
  } else {
    document.addEventListener("DOMContentLoaded", () => App.chatbot.init());
  }
})(window.App);
