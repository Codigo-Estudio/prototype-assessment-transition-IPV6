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

    // barra de progreso del modal (opcional)
    const progressContainer = document.querySelector(".modal-progress");
    modalProgressFill = progressContainer
      ? progressContainer.querySelector(".fill")
      : null;

    // Limpia y vuelve a asignar listener al botón de saltar
    if (skipBtn) {
      const newSkipBtn = skipBtn.cloneNode(true);
      skipBtn.parentNode.replaceChild(newSkipBtn, skipBtn);
      skipBtn = newSkipBtn;
      skipBtn.addEventListener("click", () => {
        App.moduleManager.skipCurrent();
      });
    }

    // Limpia y vuelve a asignar listener al botón de cerrar
    if (closeBtn) {
      const newCloseBtn = closeBtn.cloneNode(true);
      closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
      closeBtn = newCloseBtn;
      closeBtn.addEventListener("click", () => {
        App.moduleManager.closeModuleSession();
      });
    }

    // Asegurar que el modal inicie oculto
    App.chatbot.hide();
  };

  // Mostrar modal
  App.chatbot.show = function () {
    if (App.ui && App.ui.modal && typeof App.ui.modal.open === "function") {
      App.ui.modal.open("chatbotModal");
    } else {
      const modal = document.getElementById("chatbotModal");
      modal && modal.classList.add("active");
      modal && modal.setAttribute("aria-hidden", "false");
    }
  };

  // Ocultar modal
  App.chatbot.hide = function () {
    if (App.ui && App.ui.modal && typeof App.ui.modal.close === "function") {
      App.ui.modal.close("chatbotModal");
    } else {
      const modal = document.getElementById("chatbotModal");
      modal && modal.classList.remove("active");
      modal && modal.setAttribute("aria-hidden", "true");
    }
  };

  // Cargar una pregunta en el modal
  // question = { id, text, options: [...] }
  // modalProgressPercent: porcentaje de progreso 0-100
  App.chatbot.loadQuestion = function (question, modalProgressPercent = 0) {
    if (!questionEl || !optionsEl) {
      console.error("chatbot: elementos DOM no encontrados");
      return;
    }

    // Texto de la pregunta
    questionEl.textContent = question.text || "";

    // Limpiar opciones previas y sus listeners
    optionsEl.innerHTML = "";

    if (Array.isArray(question.options) && question.options.length) {
      question.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.type = "button";
        btn.textContent = opt;
        btn.addEventListener("click", () => {
          btn.classList.add("selected");
          setTimeout(() => {
            App.moduleManager.answerCurrent(opt);
          }, 200);
        });
        optionsEl.appendChild(btn);
      });
    } else {
      // Fallback si no hay opciones
      const btn = document.createElement("button");
      btn.className = "option-btn";
      btn.textContent = "Continuar";
      btn.addEventListener("click", () => App.moduleManager.answerCurrent(""));
      optionsEl.appendChild(btn);
    }

    // Actualizar barra de progreso del modal
    if (modalProgressFill) {
      modalProgressFill.style.width = (modalProgressPercent || 0) + "%";
    }

    // Mostrar modal
    App.chatbot.show();
  };

  // Actualizar barra de progreso externamente
  App.chatbot.setModalProgress = function (percent) {
    if (modalProgressFill) {
      modalProgressFill.style.width = (percent || 0) + "%";
    }
  };

  // Inicializar cuando el DOM esté listo
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
