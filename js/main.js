// js/main.js
// Responsable: inicializar la aplicación y coordinar el flujo general.

window.App = window.App || {};

(function (App) {
  "use strict";

  /**
   * Inicializa toda la aplicación.
   */
  function initApp() {
    App.utils.log("Iniciando aplicación...");

    // Inicializar módulos core
    App.chatbot.init();
    App.ui.dashboard.init();

    // Control de inactividad (10 min = 600000 ms)
    App.inactivity.init(() => {
      App.utils.log("Sesión cerrada por inactividad");
      App.storage.clearSession();
      App.ui.showDashboard();
    }, 600000);

    // Mostrar bienvenida primero
    showWelcomeScreen();
  }

  /**
   * Muestra la pantalla de bienvenida y configura su botón.
   */
  function showWelcomeScreen() {
    const welcomeScreen = document.getElementById("welcome");
    const startButton = document.getElementById("startSurvey");

    if (welcomeScreen && startButton) {
      welcomeScreen.classList.remove("hidden");
      startButton.addEventListener("click", () => {
        welcomeScreen.classList.add("hidden");
        App.ui.showDashboard();
      });
    } else {
      App.ui.showDashboard(); // fallback si no existe bienvenida
    }
  }

  // Esperar que el DOM esté listo
  document.addEventListener("DOMContentLoaded", function () {
    initApp();
    // Listener para mostrar el informe dinámico
    const resultadosBtn = document.getElementById("btnResultados");
    if (resultadosBtn) {
      resultadosBtn.addEventListener("click", function () {
        if (App.ui.showReport) {
          App.ui.showReport();
        }
      });
    }
  });
})(window.App);
