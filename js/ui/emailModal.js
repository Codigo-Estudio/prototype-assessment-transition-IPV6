// js/ui/emailModal.js
// Componente para mostrar un modal de formulario de email con backdrop y cierre
window.App = window.App || {};

(function (App) {
  "use strict";

  App.ui = App.ui || {};
  App.ui.emailModal = {};

  let backdropEl = null;
  let modalEl = null;

  function ensureElements() {
    if (backdropEl && modalEl) return;
    backdropEl = document.getElementById("emailModalBackdrop");
    modalEl = document.getElementById("emailModal");
    if (!backdropEl) {
      backdropEl = document.createElement("div");
      backdropEl.id = "emailModalBackdrop";
      backdropEl.className = "message-modal-backdrop email-modal-backdrop";
      backdropEl.style.display = "none";
      document.body.appendChild(backdropEl);
    }
    if (!modalEl) {
      modalEl = document.createElement("div");
      modalEl.id = "emailModal";
      modalEl.className = "email-modal";
      backdropEl.appendChild(modalEl);
    }
  }

  // opts: { title, onSend, onClose }
  App.ui.emailModal.show = function (opts) {
    ensureElements();
    opts = opts || {};
    // Opacidad del backdrop
    const op =
      typeof opts.opacity === "number"
        ? Math.max(0, Math.min(1, opts.opacity))
        : 0.6;
    backdropEl.style.backgroundColor = `rgba(0,0,0,${op})`;
    backdropEl.style.display = "flex";
    backdropEl.classList.add("active");
    modalEl.classList.add("active");
    modalEl.innerHTML = `
        <div class="content email-modal-content">
          <h3 class="title email-modal-title">${
            opts.title || "Enviar resultados"
          }</h3>
          <input type="email" id="inputEmailResultados" placeholder="Correo electrónico" class="email-modal-input" required />
          <div id="emailError"></div>
          <div>
            <button id="btnEnviarEmailResultados" class="btn btn-primary">Enviar</button>
            <button id="btnCancelarEmailResultados" class="btn btn-secondary">Cancelar</button>
          </div>
        </div>
      `;
    // Evento enviar
    setTimeout(() => {
      const btnEnviar = document.getElementById("btnEnviarEmailResultados");
      const inputEmail = document.getElementById("inputEmailResultados");
      const errorEl = document.getElementById("emailError");
      function validarEmail(valor) {
        // Validación simple de email
        return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(valor);
      }
      if (btnEnviar) {
        btnEnviar.onclick = function () {
          const email = inputEmail.value.trim();
          if (!validarEmail(email)) {
            errorEl.textContent = "Formato invalido";
            errorEl.style.display = "block";
            inputEmail.style.borderColor = "#e11d48";
            return;
          }
          errorEl.textContent = "";
          errorEl.style.display = "none";
          inputEmail.style.borderColor = "#c7d2fe";
          if (typeof opts.onSend === "function") opts.onSend(email);
          App.ui.emailModal.hide();
        };
      }
      const btnCancelar = document.getElementById("btnCancelarEmailResultados");
      if (btnCancelar) {
        btnCancelar.onclick = function () {
          App.ui.emailModal.hide();
        };
      }
    }, 100);
  };

  App.ui.emailModal.hide = function () {
    ensureElements();
    backdropEl.style.display = "none";
    backdropEl.classList.remove("active");
    modalEl.classList.remove("active");
  };
})(window.App);
