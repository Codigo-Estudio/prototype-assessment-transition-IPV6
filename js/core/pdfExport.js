// js/core/pdfExport.js
// Responsable único: generación y descarga de reportes PDF usando jsPDF UMD.

window.App = window.App || {};

(function (App) {
  "use strict";

  App.pdfExport = {};

  /**
   * Genera y descarga un reporte PDF con los resultados actuales.
   * @param {Object} options - Configuración para el PDF.
   * @param {string} options.title - Título del reporte.
   * @param {string} options.fileName - Nombre del archivo PDF.
   */
  App.pdfExport.generateReport = function (options = {}) {
    // Obtener la clase jsPDF desde la versión UMD
    const { jsPDF } = window.jspdf || {};

    if (typeof jsPDF === "undefined") {
      console.error(
        "jsPDF no está cargado. Asegúrate de incluirlo antes de pdfExport.js"
      );
      return;
    }

    const {
      title = "Reporte de Transición IPv4 a IPv6",
      fileName = "reporte.pdf",
    } = options;
    const doc = new jsPDF();

    // Encabezado
    doc.setFontSize(18);
    doc.text(title, 10, 20);

    // Fecha de generación
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleString()}`, 10, 30);

    // Estado actual
    const answers = App.storage.getAnswers();
    const modules = App.modules || [];

    let y = 40;

    modules.forEach((module) => {
      const moduleAnswers = answers[module.id] || [];
      const totalQuestions = App.questions.filter(
        (q) => q.module === module.id
      ).length;
      const answeredCount = moduleAnswers.filter(
        (ans) => ans !== undefined && ans !== null
      ).length;
      const progress = ((answeredCount / totalQuestions) * 100).toFixed(0);

      doc.setFontSize(14);
      doc.text(`${module.title} - ${progress}% completado`, 10, y);
      y += 8;

      // Listar preguntas y respuestas
      App.questions
        .filter((q) => q.module === module.id)
        .forEach((question, index) => {
          doc.setFontSize(10);
          doc.text(`${index + 1}. ${question.text}`, 10, y);
          y += 5;
          doc.setFontSize(9);
          doc.text(
            `Respuesta: ${moduleAnswers[index] || "No respondida"}`,
            14,
            y
          );
          y += 6;
        });

      y += 4; // espacio extra entre módulos
    });

    doc.save(fileName);
    App.utils.log(`Reporte PDF "${fileName}" generado`);
  };
})(window.App);
