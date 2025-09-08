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
      orientation = "p", // p | l
    } = options;

    // Forzar formato consistente (A4) y unidades en mm para evitar variaciones por DPR en móviles
    const doc = new jsPDF({ orientation, unit: "mm", format: "a4" });

    const marginTop = 18;
    const marginLeft = 12;
    const marginRight = 12;
    const marginBottom = 18;
    const usableWidth =
      doc.internal.pageSize.getWidth() - marginLeft - marginRight;
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = marginTop;

    function ensureSpace(blockHeight) {
      if (y + blockHeight > pageHeight - marginBottom) {
        doc.addPage();
        y = marginTop;
      }
    }

    // Encabezado
    doc.setFontSize(18);
    const titleLines = doc.splitTextToSize(title, usableWidth);
    ensureSpace(titleLines.length * 7 + 10);
    titleLines.forEach((ln) => {
      doc.text(ln, marginLeft, y);
      y += 7;
    });
    y += 2;

    // Fecha de generación
    doc.setFontSize(10);
    const fecha = `Generado el: ${new Date().toLocaleString()}`;
    const fechaLines = doc.splitTextToSize(fecha, usableWidth);
    fechaLines.forEach((ln) => {
      doc.text(ln, marginLeft, y);
      y += 5;
    });
    y += 4;

    // Datos
    const answers = (App.storage && App.storage.getAnswers()) || {};
    const modules = App.modules || [];
    const questions = App.questions || [];

    modules.forEach((module, mIndex) => {
      const moduleAnswers = answers[module.id] || [];
      const moduleQuestions = questions.filter((q) => q.module === module.id);
      const totalQuestions = moduleQuestions.length || 1;
      const answeredCount = moduleAnswers.filter(
        (ans) => ans !== undefined && ans !== null
      ).length;
      const progress = Math.round((answeredCount / totalQuestions) * 100) || 0;

      // Título módulo
      doc.setFontSize(13);
      const header = `${module.title} - ${progress}% completado`;
      const headerLines = doc.splitTextToSize(header, usableWidth);
      ensureSpace(headerLines.length * 6 + 4);
      headerLines.forEach((ln) => {
        doc.text(ln, marginLeft, y);
        y += 6;
      });
      y += 1;

      // Preguntas
      doc.setFontSize(10);
      moduleQuestions.forEach((question, qIndex) => {
        const numero = qIndex + 1;
        const qTextLines = doc.splitTextToSize(
          `${numero}. ${question.text}`,
          usableWidth
        );
        const respRaw = moduleAnswers[qIndex];
        const respMostrar =
          respRaw === undefined || respRaw === null || respRaw === ""
            ? "No respondida"
            : String(respRaw);
        const respLines = doc.splitTextToSize(
          `Respuesta: ${respMostrar}`,
          usableWidth - 4
        );
        const blockHeight = qTextLines.length * 5 + respLines.length * 5 + 4;
        ensureSpace(blockHeight);
        qTextLines.forEach((ln) => {
          doc.text(ln, marginLeft, y);
          y += 5;
        });
        doc.setFontSize(9);
        respLines.forEach((ln) => {
          doc.text(ln, marginLeft + 4, y);
          y += 5;
        });
        doc.setFontSize(10);
        y += 2;
      });

      // Separación entre módulos
      y += 2;
      // Si el siguiente módulo no cabe mínimo su encabezado, forzar salto limpio
      if (mIndex < modules.length - 1 && y > pageHeight - marginBottom - 20) {
        doc.addPage();
        y = marginTop;
      }
    });

    doc.save(fileName);
    if (App.utils && typeof App.utils.log === "function") {
      App.utils.log(`Reporte PDF "${fileName}" generado`);
    }
  };
})(window.App);
