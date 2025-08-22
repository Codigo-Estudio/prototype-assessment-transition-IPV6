// js/core/storage.js
// Responsable único: persistencia de datos en localStorage
// Expone funciones para guardar, cargar, eliminar y limpiar datos.
// Depende de App.utils para clonado y merge seguro.

window.App = window.App || {};

(function (App) {
  "use strict";

  const STORAGE_KEY = "chatbotState";

  /**
   * Guarda un estado completo en localStorage.
   * @param {Object} state - Estado a guardar.
   */
  App.storage = {};

  App.storage.saveState = function (state) {
    if (!state || typeof state !== "object") return;
    try {
      const cloned = App.utils.clone(state);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloned));
      App.utils.log("State guardado en localStorage:", cloned);
    } catch (e) {
      console.error("Error guardando en localStorage:", e);
    }
  };

  /**
   * Carga el estado completo desde localStorage.
   * @returns {Object} Estado cargado o objeto vacío si no existe.
   */
  App.storage.loadState = function () {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return {};
      const parsed = JSON.parse(raw);
      App.utils.log("State cargado desde localStorage:", parsed);
      return parsed || {};
    } catch (e) {
      console.error("Error cargando desde localStorage:", e);
      return {};
    }
  };

  /**
   * Actualiza parcialmente el estado en localStorage (merge shallow).
   * @param {Object} partialState - Propiedades a actualizar.
   */
  App.storage.updateState = function (partialState) {
    if (!partialState || typeof partialState !== "object") return;
    const current = App.storage.loadState();
    const updated = App.utils.merge(current, partialState);
    App.storage.saveState(updated);
  };

  /**
   * Elimina el estado completo del localStorage.
   */
  App.storage.clearState = function () {
    try {
      localStorage.removeItem(STORAGE_KEY);
      App.utils.log("State eliminado de localStorage");
    } catch (e) {
      console.error("Error eliminando state:", e);
    }
  };

  /**
   * Guarda una respuesta individual de pregunta en el estado persistente.
   * @param {string} moduleId - ID del módulo.
   * @param {number} questionIndex - Índice de la pregunta dentro del módulo.
   * @param {any} answer - Respuesta seleccionada.
   */
  App.storage.saveAnswer = function (moduleId, questionIndex, answer) {
    if (!moduleId || typeof questionIndex !== "number") return;
    const state = App.storage.loadState();
    state.answers = state.answers || {};
    state.answers[moduleId] = state.answers[moduleId] || [];
    state.answers[moduleId][questionIndex] = answer;
    App.storage.saveState(state);
  };

  /**
   * Obtiene todas las respuestas guardadas.
   * @returns {Object} answers - { [moduleId]: [respuestas...] }
   */
  App.storage.getAnswers = function () {
    const state = App.storage.loadState();
    return state.answers || {};
  };

  /**
   * Guarda el array completo de mensajes de conversación para un módulo.
   * @param {string} moduleId
   * @param {Array} messages - [{role, text, ts}]
   */
  App.storage.saveConversation = function (moduleId, messages) {
    if (!moduleId) return;
    const state = App.storage.loadState();
    state.conversations = state.conversations || {};
    state.conversations[moduleId] = Array.isArray(messages) ? messages : [];
    App.storage.saveState(state);
  };

  /**
   * Obtiene la conversación guardada para un módulo.
   * @param {string} moduleId
   * @returns {Array}
   */
  App.storage.getConversation = function (moduleId) {
    if (!moduleId) return [];
    const state = App.storage.loadState();
    state.conversations = state.conversations || {};
    return state.conversations[moduleId] || [];
  };

  /**
   * Añade un mensaje al final de la conversación de un módulo.
   * @param {string} moduleId
   * @param {Object} message - {role, text, ts}
   */
  App.storage.appendConversationMessage = function (moduleId, message) {
    if (!moduleId || !message) return;
    const state = App.storage.loadState();
    state.conversations = state.conversations || {};
    state.conversations[moduleId] = state.conversations[moduleId] || [];
    state.conversations[moduleId].push(message);
    App.storage.saveState(state);
  };
})(window.App);
