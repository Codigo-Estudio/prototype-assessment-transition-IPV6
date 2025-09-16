// js/ui/welcomeUI.js
// Maneja la animación de bienvenida: loader y revelado del CTA

window.App = window.App || {};
(function (App) {
  "use strict";

  App.ui = App.ui || {};

  App.ui.welcome = App.ui.welcome || {};

  App.ui.welcome.init = function () {
    const loader = document.getElementById("welcomeLoader");
    const cta = document.querySelector("#startSurvey");
    const logoContainer = document.getElementById("welcomeLogo");

    // populate logo from App.moduleIcons if available
    try {
      if (logoContainer) {
        if (window.App && App.moduleIcons && App.moduleIcons.welcome_logo) {
          logoContainer.innerHTML = App.moduleIcons.welcome_logo;
        } else if (
          window.App &&
          App.moduleIcons &&
          App.moduleIcons.avatar_bot
        ) {
          logoContainer.innerHTML = App.moduleIcons.avatar_bot;
        }
      }
    } catch (e) {
      // noop
    }

    if (!cta) return;

    // ocultar el CTA al inicio
    cta.classList.remove("show");
    cta.setAttribute("aria-hidden", "true");

    // Simular carga: después de unos segundos eliminar loader y mostrar CTA
    try {
      setTimeout(() => {
        if (loader) loader.style.display = "none";
        cta.classList.add("show");
        cta.removeAttribute("aria-hidden");
        cta.focus();
      }, 2500);
    } catch (e) {
      // noop
    }

    // En caso de que el usuario quiera saltarse la animación (accesibilidad)
    document.addEventListener("keydown", (ev) => {
      if (ev.key === "Enter" || ev.key === " ") {
        if (cta && !cta.classList.contains("show")) {
          // forzar mostrar
          if (loader) loader.style.display = "none";
          cta.classList.add("show");
          cta.removeAttribute("aria-hidden");
        }
      }
    });

    // cuando el usuario hace click en iniciar, ocultar la sección welcome
    try {
      if (cta) {
        cta.addEventListener("click", () => {
          const sec = document.getElementById("welcome");
          if (sec) sec.classList.add("hidden");
          // Resetear estado antes de mostrar dashboard, sin toast
          try {
            if (App.ui && typeof App.ui.resetSurveyState === "function") {
              App.ui.resetSurveyState({ silent: true });
            } else {
              App.ui && App.ui.showDashboard && App.ui.showDashboard();
            }
          } catch (e) {}
        });
      }
    } catch (e) {}
  };

  // Inicializar cuando el DOM esté listo
  if (
    document.readyState === "complete" ||
    document.readyState === "interactive"
  ) {
    setTimeout(() => {
      App.ui.welcome.init();
    }, 0);
  } else {
    document.addEventListener("DOMContentLoaded", () => App.ui.welcome.init());
  }
})(window.App);
