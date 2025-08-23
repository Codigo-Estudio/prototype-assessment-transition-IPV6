// js/core/messageToast.js
// Sistema global de notificaciones tipo toast, alineado al estilo de la web

window.App = window.App || {};

(function (App) {
  "use strict";

  const DEFAULT_DURATION = 3000;
  let activeToast = null;

  App.toast = {
    show(message) {
      try {
        // Si hay un toast visible, eliminarlo antes de mostrar el nuevo
        if (activeToast) {
          activeToast.classList.remove("show");
          setTimeout(() => {
            try {
              activeToast.remove();
            } catch (e) {}
          }, 320);
          activeToast = null;
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
        setTimeout(() => {
          toast.classList.remove("show");
          setTimeout(() => {
            try {
              toast.remove();
            } catch (e) {}
            if (activeToast === toast) activeToast = null;
          }, 420);
        }, DEFAULT_DURATION);
      } catch (e) {
        console.warn("toast.show error", e);
      }
    },
  };
})(window.App);
