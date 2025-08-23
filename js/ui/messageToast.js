// js/core/messageToast.js
// Sistema global de notificaciones tipo toast, alineado al estilo de la web

window.App = window.App || {};

(function (App) {
  "use strict";

  const DEFAULT_DURATION = 3000;
  let activeToast = null;
  let activeHideTimer = null;
  let activeRemoveTimer = null;

  App.toast = {
    show(message) {
      try {
        // Si hay un toast visible, eliminarlo antes de mostrar el nuevo
        if (activeToast) {
          // cancelar timers pendientes del toast anterior
          try {
            if (activeHideTimer) clearTimeout(activeHideTimer);
            if (activeRemoveTimer) clearTimeout(activeRemoveTimer);
          } catch (e) {}

          // animar salida y eliminar luego
          activeToast.classList.remove("show");
          const prev = activeToast;
          activeToast = null;
          // eliminar el nodo anterior tras la animación corta
          setTimeout(() => {
            try {
              prev.remove();
            } catch (e) {}
          }, 320);
        }

        const toast = document.createElement("div");
        toast.className = "app-toast";
        toast.textContent = message;

        document.body.appendChild(toast);
        activeToast = toast;

        // Forzar reflow para animación
        requestAnimationFrame(() => {
          toast.classList.add("show");
        });

        // Ocultar después de duración estándar
        if (activeHideTimer)
          try {
            clearTimeout(activeHideTimer);
          } catch (e) {}
        if (activeRemoveTimer)
          try {
            clearTimeout(activeRemoveTimer);
          } catch (e) {}

        activeHideTimer = setTimeout(() => {
          toast.classList.remove("show");
          activeRemoveTimer = setTimeout(() => {
            try {
              toast.remove();
            } catch (e) {}
            if (activeToast === toast) activeToast = null;
            activeHideTimer = null;
            activeRemoveTimer = null;
          }, 420);
        }, DEFAULT_DURATION);
      } catch (e) {
        console.warn("toast.show error", e);
      }
    },
  };
})(window.App);
