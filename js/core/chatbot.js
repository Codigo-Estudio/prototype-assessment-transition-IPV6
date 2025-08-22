// js/core/chatbot.js
// Manejo UI del chatbot modal: render preguntas, opciones, barra de progreso del modal
// Depende de App.moduleManager para la lógica

window.App = window.App || {};

(function (App) {
  "use strict";

  App.chatbot = App.chatbot || {};

  // historial por módulo y módulo actual
  App.chatbot._currentModuleId = null;
  App.chatbot._currentQuestionId = null;
  App.chatbot._historyPrefix = "chat_history_";

  App.chatbot._historyKey = function (moduleId) {
    return App.chatbot._historyPrefix + (moduleId || "global");
  };

  App.chatbot._loadHistory = function (moduleId) {
    if (!convoEl) return;
    const key = App.chatbot._historyKey(moduleId);
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(key) || "[]");
    } catch (e) {
      list = [];
    }
    convoEl.innerHTML = "";
    list.forEach((m) => {
      // reutiliza renderMessage pero evita re-guardar al renderizar desde el historial
      renderMessage(
        m.role,
        m.text,
        Object.assign({}, m.opts, { _fromHistory: true })
      );
    });
    App.chatbot._currentModuleId = moduleId;
    convoEl.scrollTop = convoEl.scrollHeight;
  };

  // Helpers para welcome por módulo (persistencia simple en localStorage)
  App.chatbot._welcomeKey = function (moduleId) {
    return `chat_welcome_seen_${moduleId || "global"}`;
  };

  App.chatbot._hasSeenWelcome = function (moduleId) {
    try {
      return localStorage.getItem(App.chatbot._welcomeKey(moduleId)) === "1";
    } catch (e) {
      return false;
    }
  };

  App.chatbot._markWelcomeSeen = function (moduleId) {
    try {
      localStorage.setItem(App.chatbot._welcomeKey(moduleId), "1");
    } catch (e) {
      // noop
    }
  };

  App.chatbot._appendToHistory = function (moduleId, msg) {
    if (!moduleId) moduleId = "global";
    const key = App.chatbot._historyKey(moduleId);
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(key) || "[]");
    } catch (e) {
      list = [];
    }
    list.push(msg);
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      // si storage falla, no romper la UI
      console.warn("chatbot: no se pudo guardar historial", e);
    }
  };

  // Marca en el historial del módulo que las quick replies del último mensaje del bot
  // fueron ocultadas/consumidas, para que al recargar la conversación no vuelvan a aparecer.
  App.chatbot._markQuickRepliesHidden = function (
    moduleId,
    botText,
    questionId
  ) {
    if (!moduleId) moduleId = App.chatbot._currentModuleId || "global";
    const key = App.chatbot._historyKey(moduleId);
    let list = [];
    try {
      list = JSON.parse(localStorage.getItem(key) || "[]");
    } catch (e) {
      list = [];
    }

    // buscar desde el final la última entrada del bot que tenga quickReplies y no esté marcada
    for (let i = list.length - 1; i >= 0; i--) {
      const m = list[i];
      if (
        !m ||
        m.role !== "bot" ||
        !m.opts ||
        !Array.isArray(m.opts.quickReplies) ||
        m.opts._repliesHidden
      )
        continue;
      // si se pasó questionId, emparejar por id; si no, caer a emparejar por texto
      if (typeof questionId !== "undefined" && questionId !== null) {
        if (m.opts.questionId && m.opts.questionId === questionId) {
          m.opts._repliesHidden = true;
          break;
        }
      } else {
        if (
          typeof botText === "undefined" ||
          (m.text || "") === (botText || "")
        ) {
          m.opts._repliesHidden = true;
          break;
        }
      }
    }

    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      // noop
    }
  };

  let questionEl, optionsEl, skipBtn, closeBtn, modalProgressFill;
  let convoEl;
  // flags
  App.chatbot._welcomeShown = false;
  App.chatbot._welcomeScheduled = false;

  App.chatbot.init = function () {
    questionEl = document.getElementById("chatbotQuestion");
    optionsEl = document.getElementById("chatbotOptions");
    convoEl = document.getElementById("chatConversation");
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
    // Mensaje de bienvenida del bot cada vez que se inicializa
    // (solo si existe el contenedor conversacional)
    if (convoEl) {
      // dejar _welcome como noop: el saludo será manejado por loadQuestion por módulo
      App.chatbot._welcome = function () {};
    }
  };

  // Mostrar modal
  App.chatbot.show = function () {
    // Detectar si el modal ya estaba activo antes de abrirlo
    let wasActive = false;
    const modalEl = document.getElementById("chatbotModal");
    if (modalEl) wasActive = modalEl.classList.contains("active");

    if (App.ui && App.ui.modal && typeof App.ui.modal.open === "function") {
      App.ui.modal.open("chatbotModal");
    } else {
      const modal = modalEl || document.getElementById("chatbotModal");
      modal && modal.classList.add("active");
      modal && modal.setAttribute("aria-hidden", "false");
    }

    // Programar saludo solo si el modal se está abriendo ahora (no si ya estaba activo)
    if (
      typeof App.chatbot._welcome === "function" &&
      !wasActive &&
      !App.chatbot._welcomeScheduled
    ) {
      App.chatbot._welcomeScheduled = true;
      setTimeout(() => {
        App.chatbot._welcomeScheduled = false;
        App.chatbot._welcome();
      }, 250);
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
  // Nueva API: carga una pregunta pero la renderiza en el flujo conversacional
  App.chatbot.loadQuestion = function (question, modalProgressPercent = 0) {
    if (!convoEl)
      return console.error("chatbot: contenedor de conversación no encontrado");

    // determinar moduleId: preferir question.module (usa moduleManager), luego question.moduleId,
    // luego intentar App.moduleManager._state.currentModuleId (internal state), finalmente 'global'
    const moduleId =
      (question && (question.module || question.moduleId)) ||
      (App.moduleManager &&
        App.moduleManager._state &&
        App.moduleManager._state.currentModuleId) ||
      "global";

    // detectar si esto es una entrada al módulo (modal no activo) o cambio de módulo
    const prevModuleId = App.chatbot._currentModuleId;
    // si cambió el módulo, cargar su historial
    if (moduleId !== prevModuleId) {
      App.chatbot._loadHistory(moduleId);
    }

    // Nota: el welcome ahora es solo un mensaje plano; no bloquea la carga de preguntas.

    // Detectar si el modal estaba activo antes de esta llamada (si no, es una entrada)
    const modalEl = document.getElementById("chatbotModal");
    let wasActive = false;
    if (modalEl) wasActive = modalEl.classList.contains("active");

    // Mostrar modal
    App.chatbot.show();

    // Decidir si mostrar welcome por primera vez o mensaje de regreso
    const seen = App.chatbot._hasSeenWelcome(moduleId);
    const totalQs = App.moduleManager.getTotalQuestions
      ? App.moduleManager.getTotalQuestions(moduleId)
      : 0;
    const answered = App.moduleManager.getAnsweredCount
      ? App.moduleManager.getAnsweredCount(moduleId)
      : 0;
    const pending = App.moduleManager.getPendingCount
      ? App.moduleManager.getPendingCount(moduleId)
      : 0;

    // establecer currentQuestionId para que los handlers puedan referenciarla
    App.chatbot._currentQuestionId =
      question && question.id ? question.id : null;

    if (!seen) {
      // Welcome por primera vez
      App.chatbot._showTyping(450);
      setTimeout(() => {
        App.chatbot._pushBotMessage(
          "Hola, soy Alex. Te acompa\u00f1aré en esta evaluación. Aquí tienes el módulo que seleccionaste."
        );
        App.chatbot._markWelcomeSeen(moduleId);
        // después del saludo, mostrar la pregunta
        App.chatbot._showTyping(500);
        setTimeout(() => {
          App.chatbot._pushBotMessage(question.text || "", {
            avatar: "bot",
            questionId: App.chatbot._currentQuestionId,
            quickReplies: Array.isArray(question.options)
              ? question.options
              : undefined,
          });
          if (modalProgressFill)
            modalProgressFill.style.width = (modalProgressPercent || 0) + "%";
        }, 600);
      }, 600);
      return;
    }

    // Si ya vio el welcome y vuelve con pendientes, mostrar mensaje de regreso
    // SOLO cuando el usuario está entrando al módulo: es nueva sesión para este módulo
    // (modal cerrado antes o cambio de módulo). Evitar mostrarlo en acciones internas
    // como skip/next dentro del mismo módulo cuando el modal ya estaba activo.
    if (
      seen &&
      (pending > 0 || answered < totalQs) &&
      (moduleId !== prevModuleId || !wasActive)
    ) {
      App.chatbot._showTyping(350);
      setTimeout(() => {
        App.chatbot._pushBotMessage(
          "Hola, estás de regreso. Vamos a continuar con las preguntas pendientes."
        );
        // luego la pregunta
        App.chatbot._showTyping(400);
        setTimeout(() => {
          App.chatbot._pushBotMessage(question.text || "", {
            avatar: "bot",
            questionId: App.chatbot._currentQuestionId,
            quickReplies: Array.isArray(question.options)
              ? question.options
              : undefined,
          });
          if (modalProgressFill)
            modalProgressFill.style.width = (modalProgressPercent || 0) + "%";
        }, 500);
      }, 450);
      return;
    }

    // Caso normal: mostrar pregunta sin mensajes adicionales
    App.chatbot._showTyping(400);
    setTimeout(() => {
      App.chatbot._pushBotMessage(question.text || "", {
        avatar: "bot",
        questionId: App.chatbot._currentQuestionId,
        quickReplies: Array.isArray(question.options)
          ? question.options
          : undefined,
      });
      if (modalProgressFill)
        modalProgressFill.style.width = (modalProgressPercent || 0) + "%";
    }, 500);
  };

  // Push helpers
  App.chatbot._pushBotMessage = function (text, opts) {
    renderMessage("bot", text, opts);
  };
  App.chatbot._pushUserMessage = function (text, opts) {
    renderMessage("user", text, opts);
  };

  // Mostrar indicador de escritura sencillo
  App.chatbot._showTyping = function (duration = 800) {
    if (!convoEl) return;
    const typingEl = document.createElement("div");
    typingEl.className = "chat-msg bot";

    // avatar (usar el mismo HTML que renderMessage si está disponible)
    const avatar = document.createElement("div");
    avatar.className = "chat-avatar bot";
    try {
      if (App && App.moduleIcons && App.moduleIcons.avatar_bot) {
        avatar.innerHTML = App.moduleIcons.avatar_bot;
      } else {
        avatar.textContent = "A";
      }
    } catch (e) {
      avatar.textContent = "A";
    }

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble typing";
    bubble.innerHTML =
      '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';

    typingEl.appendChild(avatar);
    typingEl.appendChild(bubble);

    convoEl.appendChild(typingEl);
    convoEl.scrollTop = convoEl.scrollHeight;
    setTimeout(() => {
      if (typingEl && typingEl.parentNode)
        typingEl.parentNode.removeChild(typingEl);
    }, duration);
  };

  // Oculta cualquier contenedor de quick-replies visible en la conversación
  App.chatbot._hideActiveQuickReplies = function () {
    if (!convoEl) return;
    try {
      const visibles = convoEl.querySelectorAll(".chat-quick-replies");
      visibles.forEach((el) => {
        el.querySelectorAll("button").forEach((b) => (b.disabled = true));
        el.style.display = "none";
        el.setAttribute("aria-hidden", "true");

        // marcar en el historial del módulo que estas quick replies están ocultas
        try {
          // intentar usar el currentQuestionId si está disponible; caer a texto si no
          const qid = App.chatbot._currentQuestionId || null;
          // intentar encontrar el texto del burbuja del bot asociada (anteriorSibling)
          const botBubble = el.previousElementSibling;
          const botText = botBubble ? botBubble.textContent : undefined;
          App.chatbot._markQuickRepliesHidden(
            App.chatbot._currentModuleId,
            botText,
            qid
          );
        } catch (e) {
          // noop
        }
      });
    } catch (e) {
      // noop
    }
  };

  // Render de mensaje en el contenedor conversacional
  function renderMessage(role, text, opts) {
    if (!convoEl) return;
    const wrap = document.createElement("div");
    wrap.className = `chat-msg ${role}`;

    const avatar = document.createElement("div");
    avatar.className = `chat-avatar ${role}`;
    // usar avatares definidos en App.moduleIcons si están disponibles
    try {
      let avatarHtml = null;
      if (window.App && App.moduleIcons) {
        if (role === "bot" && App.moduleIcons.avatar_bot)
          avatarHtml = App.moduleIcons.avatar_bot;
        if (role === "user" && App.moduleIcons.avatar_user)
          avatarHtml = App.moduleIcons.avatar_user;
      }
      if (avatarHtml) avatar.innerHTML = avatarHtml;
      else avatar.textContent = role === "bot" ? "A" : "U";
    } catch (e) {
      avatar.textContent = role === "bot" ? "A" : "U";
    }

    const bubble = document.createElement("div");
    bubble.className = "chat-bubble";
    bubble.textContent = text || "";

    if (role === "bot") {
      wrap.appendChild(avatar);
      wrap.appendChild(bubble);
    } else {
      wrap.appendChild(bubble);
      wrap.appendChild(avatar);
    }

    convoEl.appendChild(wrap);

    // Guardar en historial por módulo (evitar guardar cuando venimos del historial mismo)
    const fromHistory = opts && opts._fromHistory;
    if (!fromHistory) {
      const moduleId = App.chatbot._currentModuleId || "global";
      App.chatbot._appendToHistory(moduleId, {
        role: role,
        text: text || "",
        opts: opts || {},
        t: Date.now(),
      });
    }

    // quick replies: sólo renderizar si no vienen marcadas como ocultas
    if (
      opts &&
      Array.isArray(opts.quickReplies) &&
      opts.quickReplies.length &&
      !opts._repliesHidden
    ) {
      const qr = document.createElement("div");
      qr.className = "chat-quick-replies";
      opts.quickReplies.forEach((r) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = r;
        b.addEventListener("click", () => {
          // Desactivar y ocultar quick replies para esta burbuja inmediatamente
          try {
            qr.querySelectorAll("button").forEach(
              (btn) => (btn.disabled = true)
            );
            qr.style.display = "none";
            qr.setAttribute("aria-hidden", "true");
            // marcar en el historial que estas quick replies fueron consumidas/ocultas
            try {
              const moduleId = App.chatbot._currentModuleId || "global";
              const qid = App.chatbot._currentQuestionId || null;
              App.chatbot._markQuickRepliesHidden(moduleId, text, qid);
            } catch (e) {
              /* noop */
            }
          } catch (e) {
            /* noop */
          }

          // Mostrar la respuesta del usuario en la conversación
          App.chatbot._pushUserMessage(r);

          // delegar a moduleManager después de pequeña pausa para quick replies normales
          setTimeout(() => App.moduleManager.answerCurrent(r), 250);
        });
        qr.appendChild(b);
      });
      convoEl.appendChild(qr);
    }

    // autoscroll al final
    convoEl.scrollTop = convoEl.scrollHeight;
  }

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
