// js/core/utils.js
// Utilidades generales usadas por la aplicación.
// Responsable único: helpers reutilizables (SRP).
// No tiene efectos secundarios al cargarse.
// Expuesto en window.App.utils

window.App = window.App || {};

(function (App) {
  "use strict";

  /**
   * Namespace de utilidades
   * @namespace App.utils
   */
  App.utils = App.utils || {};

  /**
   * Encode a UTF-8 safe Base64 string.
   * @param {string} str - Texto normal a codificar.
   * @returns {string} Base64 codificado o '' en caso de error.
   */
  App.utils.encodeBase64 = function (str) {
    try {
      // encodeURIComponent + unescape para manejar caracteres UTF-8 correctamente
      return btoa(unescape(encodeURIComponent(String(str))));
    } catch (e) {
      // En entornos que no soporten btoa correctamente, devolver string vacío
      console.warn("App.utils.encodeBase64 error:", e);
      return "";
    }
  };

  /**
   * Decode a UTF-8 safe Base64 string.
   * @param {string} b64 - Cadena Base64.
   * @returns {string} Texto decodificado o '' en caso de error.
   */
  App.utils.decodeBase64 = function (b64) {
    try {
      return decodeURIComponent(escape(atob(String(b64))));
    } catch (e) {
      console.warn("App.utils.decodeBase64 error:", e);
      return "";
    }
  };

  /**
   * Obtener elemento DOM de forma segura.
   * @param {string} id - id del elemento.
   * @returns {HTMLElement|null}
   */
  App.utils.safeGet = function (id) {
    if (!id) return null;
    try {
      return document.getElementById(id) || null;
    } catch (e) {
      return null;
    }
  };

  /**
   * Clonador profundo simple (basado en JSON).
   * Útil para clonar estados primarios (no funciona con funciones ni Date/RegExp).
   * @param {any} obj
   * @returns {any}
   */
  App.utils.clone = function (obj) {
    try {
      return JSON.parse(JSON.stringify(obj));
    } catch (e) {
      console.warn("App.utils.clone warning: non-cloneable value", e);
      return null;
    }
  };

  /**
   * Debounce: limita la frecuencia de ejecución de una función.
   * @param {Function} fn
   * @param {number} wait - ms
   * @returns {Function}
   */
  App.utils.debounce = function (fn, wait) {
    let timeout = null;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn.apply(this, args), wait);
    };
  };

  /**
   * Throttle simple: garantiza ejecución como máximo una vez cada `limit` ms.
   * @param {Function} fn
   * @param {number} limit - ms
   * @returns {Function}
   */
  App.utils.throttle = function (fn, limit) {
    let inThrottle = false;
    return function (...args) {
      if (!inThrottle) {
        fn.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  /**
   * Valida un email de forma básica.
   * @param {string} email
   * @returns {boolean}
   */
  App.utils.isValidEmail = function (email) {
    if (!email || typeof email !== "string") return false;
    // regex simple y suficiente para validación de formulario (no para verificación absoluta)
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email.trim());
  };

  /**
   * Formatea un nombre de archivo seguro (quita caracteres problemáticos).
   * @param {string} name
   * @returns {string}
   */
  App.utils.safeFilename = function (name) {
    if (!name) return "archivo";
    return (
      String(name)
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-zA-Z0-9_\-\.]/g, "")
        .slice(0, 120) || "archivo"
    );
  };

  /**
   * Merge shallow de dos objetos (retorna nuevo objeto).
   * Evita mutar los argumentos.
   * @param {Object} a
   * @param {Object} b
   * @returns {Object}
   */
  App.utils.merge = function (a, b) {
    return Object.assign({}, a || {}, b || {});
  };

  /**
   * Safe text truncation (para UI).
   * @param {string} text
   * @param {number} maxLen
   * @returns {string}
   */
  App.utils.truncate = function (text, maxLen) {
    if (!text) return "";
    const s = String(text);
    if (s.length <= maxLen) return s;
    return s.slice(0, maxLen - 1) + "…";
  };

  // pequeña utilidad de logging condicionado (activar durante debugging)
  App.utils._debug = false;
  App.utils.log = function (...args) {
    if (App.utils._debug) console.log("[App.utils]", ...args);
  };

  /**
   * Calcula el porcentaje de madurez de un módulo.
   * @param {string} moduleId - ID del módulo (ej: "mod_datos_basicos")
   * @param {Object} respuestas - Objeto { preguntaId: scoreSeleccionado }
   * @returns {number} Porcentaje de madurez (0-100)
   */
  App.utils.calcularPorcentajeMadurezModulo = function (moduleId, respuestas) {
    // Excluir módulo de perfilamiento
    if (moduleId === "mod_perfilamiento") return 0;
    // Solo considerar preguntas habilitadas por la ruta activa
    let preguntasModulo = [];
    if (
      typeof App.getEnabledQuestionsByProfile === "function" &&
      window.App &&
      window.App._profileAnswers
    ) {
      const enabled = App.getEnabledQuestionsByProfile(
        window.App._profileAnswers
      );
      preguntasModulo = window.App.questions.filter(
        (q) => q.module === moduleId && enabled.includes(q.id)
      );
    } else {
      preguntasModulo = window.App.questions.filter(
        (q) => q.module === moduleId
      );
    }
    if (preguntasModulo.length === 0) return 0;
    const sumaScores = preguntasModulo.reduce((acc, pregunta) => {
      // respuestas[pregunta.id] puede ser un objeto { answer, ts }
      const respuesta = respuestas[pregunta.id];
      let score = 0;
      if (
        respuesta &&
        typeof respuesta === "object" &&
        respuesta.answer !== undefined
      ) {
        // Si la respuesta es un objeto, puede ser el objeto de la opción seleccionada o solo el score
        if (
          typeof respuesta.answer === "object" &&
          respuesta.answer.score !== undefined
        ) {
          score = respuesta.answer.score;
        } else if (typeof respuesta.answer === "number") {
          score = respuesta.answer;
        } else if (typeof respuesta.answer === "string") {
          // Buscar el score en las opciones de la pregunta usando el id
          const opt = pregunta.options.find((o) => o.id === respuesta.answer);
          score = opt ? opt.score : 0;
        }
      } else if (typeof respuesta === "number") {
        score = respuesta;
      }
      return acc + score;
    }, 0);
    return (sumaScores / preguntasModulo.length) * 100;
  };

  /**
   * Calcula el porcentaje de madurez general.
   * @param {Object} respuestas - Objeto { preguntaId: scoreSeleccionado }
   * @returns {number} Porcentaje de madurez general (0-100)
   */
  App.utils.calcularPorcentajeMadurezGeneral = function (respuestas) {
    // Excluir módulo de perfilamiento
    // Solo considerar módulos con preguntas habilitadas por la ruta activa
    let modulos = [];
    if (
      typeof App.getEnabledQuestionsByProfile === "function" &&
      window.App &&
      window.App._profileAnswers
    ) {
      const enabled = App.getEnabledQuestionsByProfile(
        window.App._profileAnswers
      );
      modulos = [...new Set(window.App.questions.map((q) => q.module))]
        .filter((m) => m !== "mod_perfilamiento")
        .filter((m) =>
          window.App.questions.some(
            (q) => q.module === m && enabled.includes(q.id)
          )
        );
    } else {
      modulos = [...new Set(window.App.questions.map((q) => q.module))].filter(
        (m) => m !== "mod_perfilamiento"
      );
    }
    const porcentajes = modulos.map((modulo) =>
      App.utils.calcularPorcentajeMadurezModulo(modulo, respuestas)
    );
    if (porcentajes.length === 0) return 0;
    return porcentajes.reduce((acc, val) => acc + val, 0) / porcentajes.length;
  };

  /**
   * Exporta un elemento HTML como PDF usando html2canvas y jsPDF
   * @param {HTMLElement} el - Elemento a exportar
   * @param {string} filename - Nombre del archivo PDF
   */
  App.utils.exportElementToPDF = function (el, filename = "reporte.pdf") {
    if (!el || !window.html2canvas || !window.jspdf) return;

    // 1. Clonar el elemento para forzar layout de escritorio sin alterar la vista actual
    const clone = el.cloneNode(true);
    clone.classList.add("force-desktop-report");
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px"; // fuera de pantalla
    wrapper.style.top = "0";
    wrapper.style.width = "820px"; // espacio suficiente para 800px + padding
    wrapper.style.zIndex = "-1"; // no interferir con interacción
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    // 2. Forzar fuentes reflow (pequeño timeout opcional)
    setTimeout(function () {
      window
        .html2canvas(clone, {
          scale: 2, // buena resolución
          useCORS: true,
          backgroundColor: "#ffffff",
          windowWidth: 820, // asegurar ancho lógico
        })
        .then(function (canvas) {
          try {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new window.jspdf.jsPDF({
              orientation: "portrait",
              unit: "pt",
              format: "a4",
            });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 20;
            const imgWidth = pageWidth - margin * 2;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let remainingHeight = imgHeight;
            let positionY = margin;

            if (imgHeight <= pageHeight - margin * 2) {
              pdf.addImage(
                imgData,
                "PNG",
                margin,
                positionY,
                imgWidth,
                imgHeight
              );
            } else {
              const pageImgHeight = pageHeight - margin * 2;
              let pageNum = 0;
              while (remainingHeight > 0) {
                const sourceY =
                  (canvas.height * (pageNum * pageImgHeight)) / imgHeight;
                const sourceHeight =
                  (canvas.height * pageImgHeight) / imgHeight;
                const pageCanvas = document.createElement("canvas");
                pageCanvas.width = canvas.width;
                pageCanvas.height = sourceHeight;
                const ctx = pageCanvas.getContext("2d");
                ctx.drawImage(
                  canvas,
                  0,
                  sourceY,
                  canvas.width,
                  sourceHeight,
                  0,
                  0,
                  canvas.width,
                  sourceHeight
                );
                const pageImgData = pageCanvas.toDataURL("image/png");
                pdf.addImage(
                  pageImgData,
                  "PNG",
                  margin,
                  positionY,
                  imgWidth,
                  pageImgHeight
                );
                remainingHeight -= pageImgHeight;
                pageNum++;
                if (remainingHeight > 0) pdf.addPage();
              }
            }
            pdf.save(filename);
          } finally {
            // 3. Limpiar el DOM temporal
            if (wrapper && wrapper.parentNode)
              wrapper.parentNode.removeChild(wrapper);
          }
        })
        .catch(function (err) {
          console.error("Error exportando PDF:", err);
          if (wrapper && wrapper.parentNode)
            wrapper.parentNode.removeChild(wrapper);
        });
    }, 50);
  };

  /**
   * Obtiene los ids de preguntas habilitadas según las respuestas del perfilamiento.
   * @param {Object} respuestasPerfil - { qns_mod_perfilamiento_1: optionId, ... }
   * @returns {Array<string>} - Array de ids de preguntas habilitadas
   */
  App.utils.getEnabledQuestionsByProfile = function (respuestasPerfil) {
    if (!respuestasPerfil) return [];
    // Construir la clave de opciones
    const key = [
      respuestasPerfil["qns_mod_perfilamiento_1"],
      respuestasPerfil["qns_mod_perfilamiento_2"],
      respuestasPerfil["qns_mod_perfilamiento_3"],
      respuestasPerfil["qns_mod_perfilamiento_4"],
      respuestasPerfil["qns_mod_perfilamiento_5"],
    ].join("|");
    const route =
      window.App.profileRoutes &&
      window.App.profileRoutes.find((r) => r.options === key);
    return route ? route.questions : [];
  };
})(window.App);
