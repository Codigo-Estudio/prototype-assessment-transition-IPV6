// js/ui/reportUI.js
// Componente para mostrar el informe de madurez como sección dinámica

window.App = window.App || {};
App.ui = App.ui || {};

(function (App) {
  "use strict";

  /**
   * Muestra el informe de madurez en la SPA
   */
  App.ui.showReport = function () {
    // Posicionar en el top al mostrar el informe
    window.scrollTo({ top: 0, behavior: "instant" });
    // Ocultar dashboard y mostrar solo el informe
    const dashboardEl = document.getElementById("dashboard");
    if (dashboardEl) dashboardEl.classList.add("hidden");

    // Elimina cualquier sección activa
    document
      .querySelectorAll(".spa-section.active")
      .forEach((el) => el.classList.remove("active"));

    let reportEl = document.getElementById("reportSection");
    if (!reportEl) {
      reportEl = document.createElement("section");
      reportEl.id = "reportSection";
      reportEl.className = "spa-section active report-section";
      document.body.appendChild(reportEl);
    } else {
      reportEl.classList.add("active");
      reportEl.innerHTML = "";
    }

    // Header
    const header = document.createElement("header");
    header.className = "report-header";
    header.innerHTML = `
      <h1>Informe de Madurez IPv6</h1>
      <p>Este informe resume el nivel de madurez general y por módulo de tu organización en la transición a IPv6.</p>
    `;
    reportEl.appendChild(header);

    // Sección 1: Puntaje general
    const respuestas = App.storage.getAnswers ? App.storage.getAnswers() : {};
    const generalScore = App.utils.calcularPorcentajeMadurezGeneral(respuestas);
    let generalTip = App.tipsGeneral[0].texto;
    if (generalScore >= 80)
      generalTip = App.tipsGeneral.find((t) => t.id === "general_alto").texto;
    else if (generalScore >= 50)
      generalTip = App.tipsGeneral.find((t) => t.id === "general_medio").texto;
    else
      generalTip = App.tipsGeneral.find((t) => t.id === "general_bajo").texto;

    const section1 = document.createElement("section");
    section1.className = "report-general";
    section1.innerHTML = `
      <h2>Puntaje General de Madurez</h2>
      <div class="general-score">${Math.round(generalScore)}%</div>
      <p class="general-tip">${generalTip}</p>
    `;
    reportEl.appendChild(section1);

    // Sección 2: Módulos con iconos y porcentaje
    const modulos = Array.from(new Set(App.questions.map((q) => q.module)));
    const section2 = document.createElement("section");
    section2.className = "report-modules";
    section2.innerHTML = `<h2>Madurez por Módulo</h2>`;
    const moduleList = document.createElement("div");
    moduleList.className = "module-list";
    modulos.forEach((modId) => {
      const score = App.utils.calcularPorcentajeMadurezModulo(
        modId,
        respuestas
      );
      const modulo = App.modules.find((m) => m.id === modId);
      const icon =
        App.moduleIcons && App.moduleIcons[modId]
          ? App.moduleIcons[modId]
          : "<span>📦</span>";
      moduleList.innerHTML += `
        <div class="module-card">
          <div class="module-icon">${icon}</div>
          <div class="module-info">
            <div class="module-title">${modulo ? modulo.title : modId}</div>
            <div class="module-score">${Math.round(score)}%</div>
          </div>
        </div>
      `;
    });
    section2.appendChild(moduleList);
    reportEl.appendChild(section2);

    // Sección 3: Recomendaciones por módulo
    const section3 = document.createElement("section");
    section3.className = "report-tips";
    section3.innerHTML = `<h2>Recomendaciones por Módulo</h2>`;
    const tipsList = document.createElement("div");
    tipsList.className = "tips-list";
    modulos.forEach((modId) => {
      const score = App.utils.calcularPorcentajeMadurezModulo(
        modId,
        respuestas
      );
      let nivel = "bajo";
      if (score >= 80) nivel = "alto";
      else if (score >= 50) nivel = "medio";
      const tipObj = App.tipsModulo.find(
        (t) => t.modulo === modId && t.id.endsWith(nivel)
      );
      const modulo = App.modules.find((m) => m.id === modId);
      tipsList.innerHTML += `
        <div class="tip-card">
          <div class="tip-title">${modulo ? modulo.title : modId}</div>
          <div class="tip-text">${
            tipObj ? tipObj.texto : "Sin recomendación definida."
          }</div>
        </div>
      `;
    });
    section3.appendChild(tipsList);
    reportEl.appendChild(section3);

    // Botones
    const btnWrap = document.createElement("div");
    btnWrap.className = "report-btns";
    // Botón atrás
    const backBtn = document.createElement("button");
    backBtn.className = "btn-back";
    backBtn.innerHTML =
      App.moduleIcons && App.moduleIcons["icon_back"]
        ? App.moduleIcons["icon_back"]
        : "⬅";
    backBtn.title = "Volver al dashboard";
    backBtn.onclick = function () {
      // Eliminar la sección del informe del DOM para evitar duplicados
      if (reportEl && reportEl.parentNode) {
        reportEl.parentNode.removeChild(reportEl);
      }
      // Mostrar dashboard
      const dashboardEl = document.getElementById("dashboard");
      if (dashboardEl) dashboardEl.classList.remove("hidden");
      App.ui.showDashboard && App.ui.showDashboard();
      // Posicionar en el top al volver al dashboard
      window.scrollTo({ top: 0, behavior: "instant" });
    };
    btnWrap.appendChild(backBtn);
    // Botón descargar
    const downloadBtn = document.createElement("button");
    downloadBtn.className = "btn-download";
    downloadBtn.innerHTML = "Descargar";
    downloadBtn.title = "Descargar informe";
    downloadBtn.onclick = function () {
      if (App.pdfExport && typeof App.pdfExport.exportReport === "function") {
        App.pdfExport.exportReport(reportEl);
      } else {
        window.print();
      }
    };
    btnWrap.appendChild(downloadBtn);
    reportEl.appendChild(btnWrap);
  };
})(window.App);
