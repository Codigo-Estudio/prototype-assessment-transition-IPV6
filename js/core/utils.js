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
})(window.App);
