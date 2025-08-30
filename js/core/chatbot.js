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

  // Limpia el historial visual y estado interno del chatbot para un módulo o todos
  App.chatbot.clearHistoryUI = function (moduleId) {
    try {
      // limpiar DOM del contenedor conversacional si existe
      if (convoEl) convoEl.innerHTML = "";

      // reset estado interno
      App.chatbot._currentModuleId = null;
      App.chatbot._currentQuestionId = null;

      // si se indica moduleId, borrar su clave; si no, borrar todas las chat_history_*
      try {
        if (moduleId) {
          localStorage.removeItem(App.chatbot._historyKey(moduleId));
        } else {
          Object.keys(localStorage).forEach((k) => {
            if (k && k.indexOf(App.chatbot._historyPrefix) === 0)
              localStorage.removeItem(k);
          });
        }
      } catch (e) {
        // noop
      }
    } catch (e) {
      console.warn("chatbot: clearHistoryUI fallo", e);
    }
  };

  // Conveniencia: recargar el historial visual para un módulo (usa la función interna)
  App.chatbot.reloadHistoryForModule = function (moduleId) {
    try {
      App.chatbot._loadHistory(moduleId);
    } catch (e) {
      // noop
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
  // timers pendientes (para cancelar cuando el modal se cierra)
  App.chatbot._pendingTimers = [];

  App.chatbot._schedule = function (fn, ms) {
    try {
      const id = setTimeout(function () {
        try {
          fn();
        } finally {
          const idx = App.chatbot._pendingTimers.indexOf(id);
          if (idx !== -1) App.chatbot._pendingTimers.splice(idx, 1);
        }
      }, ms);
      App.chatbot._pendingTimers.push(id);
      return id;
    } catch (e) {
      return null;
    }
  };

  App.chatbot._clearPending = function () {
    try {
      (App.chatbot._pendingTimers || []).forEach((id) => clearTimeout(id));
    } catch (e) {
      // noop
    }
    App.chatbot._pendingTimers = [];
    // Ensure skip is disabled when clearing pending typing/messages
    try {
      App.chatbot._setSkipEnabled && App.chatbot._setSkipEnabled(false);
    } catch (e) {}
    // remover indicadores de typing actuales del DOM
    try {
      if (convoEl) {
        const typingEls = convoEl.querySelectorAll(".chat-bubble.typing");
        typingEls.forEach((el) => {
          const parent = el.parentNode;
          parent && parent.parentNode && parent.parentNode.removeChild(parent);
        });
      }
    } catch (e) {
      // noop
    }
  };

  // Habilitar / deshabilitar el botón de "Saltar pregunta"
  App.chatbot._setSkipEnabled = function (enabled) {
    try {
      if (!skipBtn) return;
      skipBtn.disabled = !enabled;
      // visual indicator class when disabled (spinner / opacity)
      if (!enabled) {
        skipBtn.classList.add("skip-loading");
        skipBtn.setAttribute("aria-busy", "true");
        skipBtn.setAttribute("aria-disabled", "true");
      } else {
        skipBtn.classList.remove("skip-loading");
        skipBtn.removeAttribute("aria-busy");
        skipBtn.removeAttribute("aria-disabled");
      }
    } catch (e) {
      // noop
    }
  };

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
      // start disabled until a question is rendered
      try {
        App.chatbot._setSkipEnabled && App.chatbot._setSkipEnabled(false);
      } catch (e) {}
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
      App.chatbot._schedule(() => {
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

    // cancelar timers pendientes y limpiar typing indicators
    App.chatbot._clearPending();
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

    // Disable skip until the question is fully rendered
    App.chatbot._setSkipEnabled && App.chatbot._setSkipEnabled(false);

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
      if (modalProgressFill)
        modalProgressFill.style.width = (modalProgressPercent || 0) + "%";

      App.chatbot._showTyping(1500);
      App.chatbot._schedule(() => {
        App.chatbot._pushBotMessage(
          "Hola, soy **Alex**. Te acompañaré en esta evaluación para ayudarte en la transición a IPv6."
        );
        App.chatbot._showTyping(900);
        App.chatbot._schedule(() => {
          App.chatbot._pushBotMessage(
            "Así que empecemos con la primera pregunta."
          );
          App.chatbot._markWelcomeSeen(moduleId);
          // después del saludo, mostrar la pregunta
          App.chatbot._showTyping(900);
          App.chatbot._schedule(() => {
            App.chatbot._pushBotMessage(question.text || "", {
              avatar: "bot",
              questionId: App.chatbot._currentQuestionId,
              quickReplies: Array.isArray(question.options)
                ? question.options
                : undefined,
            });
            // enable skip once the question has been pushed/rendered
            App.chatbot._setSkipEnabled && App.chatbot._setSkipEnabled(true);
          }, 1000);
        }, 1000);
      }, 1600);
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
      if (modalProgressFill)
        modalProgressFill.style.width = (modalProgressPercent || 0) + "%";

      App.chatbot._showTyping(1500);
      App.chatbot._schedule(() => {
        App.chatbot._pushBotMessage(
          "**Hola, estás de regreso. Vamos a continuar con las preguntas pendientes.**"
        );
        // luego la pregunta
        App.chatbot._showTyping(900);
        App.chatbot._schedule(() => {
          App.chatbot._pushBotMessage(question.text || "", {
            avatar: "bot",
            questionId: App.chatbot._currentQuestionId,
            quickReplies: Array.isArray(question.options)
              ? question.options
              : undefined,
          });
          App.chatbot._setSkipEnabled && App.chatbot._setSkipEnabled(true);
        }, 1000);
      }, 1600);
      return;
    }

    // Caso normal: mostrar pregunta sin mensajes adicionales
    App.chatbot._showTyping(900);
    App.chatbot._schedule(() => {
      App.chatbot._pushBotMessage(question.text || "", {
        avatar: "bot",
        questionId: App.chatbot._currentQuestionId,
        quickReplies: Array.isArray(question.options)
          ? question.options
          : undefined,
      });
      App.chatbot._setSkipEnabled && App.chatbot._setSkipEnabled(true);
      if (modalProgressFill)
        modalProgressFill.style.width = (modalProgressPercent || 0) + "%";
    }, 1000);
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
    // programar eliminación usando el scheduler para poder cancelarlo si el modal se cierra
    App.chatbot._schedule(() => {
      try {
        if (typingEl && typingEl.parentNode)
          typingEl.parentNode.removeChild(typingEl);
      } catch (e) {}
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
    // soportar marcado simple **bold** dentro del texto
    (function () {
      const raw = text || "";
      // escape básico de HTML para evitar inyección
      const escapeHtml = (s) =>
        String(s)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");

      const safe = escapeHtml(raw);
      // reemplazar **texto** por <strong>texto</strong>
      const html = safe.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      bubble.innerHTML = html;
    })();

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
          App.chatbot._schedule(() => App.moduleManager.answerCurrent(r), 250);
        });
        qr.appendChild(b);
      });
      convoEl.appendChild(qr);
    }

    // autoscroll al final
    convoEl.scrollTop = convoEl.scrollHeight;
    // If this is the bot message that contains the current question, enable skip
    try {
      if (
        role === "bot" &&
        opts &&
        opts.questionId &&
        App.chatbot._currentQuestionId &&
        opts.questionId === App.chatbot._currentQuestionId
      ) {
        App.chatbot._setSkipEnabled && App.chatbot._setSkipEnabled(true);
      }
    } catch (e) {
      /* noop */
    }
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
