// js/ui/messageModal.js
// Componente reutilizable para mostrar un mensaje modal con backdrop y control de opacidad
window.App = window.App || {};

(function (App) {
  "use strict";

  App.ui = App.ui || {};
  App.ui.messageModal = App.ui.messageModal || {};

  let backdropEl = null;
  let modalEl = null;

  function ensureElements() {
    if (backdropEl && modalEl) return;
    backdropEl = document.getElementById("messageModalBackdrop");
    modalEl = document.getElementById("messageModal");
    if (!backdropEl || !modalEl) return;

    // close handler
    const btn = modalEl.querySelector("button[data-message-dismiss]");
    if (btn) {
      btn.addEventListener("click", () => {
        App.ui.messageModal.hide();
      });
    }
  }

  // show opts: { iconKey, title, body, opacity: 0..1, onClose }
  App.ui.messageModal.show = function (opts) {
    ensureElements();
    if (!backdropEl || !modalEl) return;
    opts = opts || {};

    // backdrop opacity maps to rgba(0,0,0,opacity)
    const op =
      typeof opts.opacity === "number"
        ? Math.max(0, Math.min(1, opts.opacity))
        : 0.6;
    backdropEl.style.backgroundColor = `rgba(0,0,0,${op})`;

    // icon
    const iconWrap = modalEl.querySelector(".icon");
    if (iconWrap) {
      let html = "";
      try {
        if (App.moduleIcons && opts.iconKey && App.moduleIcons[opts.iconKey])
          html = App.moduleIcons[opts.iconKey];
      } catch (e) {
        html = "";
      }
      iconWrap.innerHTML = html || "";
    }

    // title: allow simple **bold** markers: convert **text** to <strong>text</strong>
    const titleEl = modalEl.querySelector(".title");
    if (titleEl) {
      const raw = opts.title || "";
      const html = raw.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      titleEl.innerHTML = html;
    }

    // body: same bold marker support
    const bodyEl = modalEl.querySelector(".body");
    if (bodyEl) {
      const raw = opts.body || "";
      const html = raw.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      bodyEl.innerHTML = html;
    }

    // show
    backdropEl.classList.add("active");
    modalEl.classList.add("active");

    // store onClose
    App.ui.messageModal._onClose =
      typeof opts.onClose === "function" ? opts.onClose : null;
  };

  App.ui.messageModal.hide = function () {
    ensureElements();
    if (!backdropEl || !modalEl) return;
    backdropEl.classList.remove("active");
    modalEl.classList.remove("active");
    if (App.ui.messageModal._onClose) {
      try {
        App.ui.messageModal._onClose();
      } catch (e) {}
      App.ui.messageModal._onClose = null;
    }
  };

  // init on DOM ready to ensure elements exist
  function init() {
    ensureElements();
  }

  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(init, 0);
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})(window.App);
