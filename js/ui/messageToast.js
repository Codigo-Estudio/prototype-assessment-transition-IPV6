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
          activeToast.remove();
          activeToast = null;
        }

        const toast = document.createElement("div");
        toast.className = "app-toast";
        toast.textContent = message;

        // Estilos alineados a la UI del proyecto
        Object.assign(toast.style, {
          position: "fixed",
          top: "16px",
          right: "16px",
          background: "var(--color-primary, #0ea5a4)", // color principal o azul por defecto
          color: "var(--color-neutral-100, #ffffff)", // texto invertido (blanco)
          fontFamily: "var(--font-sans, sans-serif)",
          fontSize: "15px",
          fontWeight: "500",
          padding: "10px 16px",
          borderRadius: "var(--radius-sm, 8px)",
          zIndex: "99999",
          boxShadow: "var(--shadow-md, 0 4px 12px rgba(16, 24, 40, 0.08))",
          opacity: "0",
          transition: "opacity 300ms ease, transform 300ms ease",
          transform: "translateY(-6px)",
          pointerEvents: "auto",
        });

        document.body.appendChild(toast);
        activeToast = toast;

        // Forzar reflow para animación
        requestAnimationFrame(() => {
          toast.style.opacity = "1";
          toast.style.transform = "translateY(0)";
        });

        // Ocultar después de duración estándar
        setTimeout(() => {
          toast.style.opacity = "0";
          toast.style.transform = "translateY(-6px)";
          setTimeout(() => {
            toast.remove();
            if (activeToast === toast) activeToast = null;
          }, 400);
        }, DEFAULT_DURATION);
      } catch (e) {
        console.warn("toast.show error", e);
      }
    },
  };
})(window.App);
