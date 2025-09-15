// js/data/profileRoutes.js
// Define las rutas posibles según las respuestas del módulo de perfilamiento.
// Cada ruta es una combinación de ids de opción para las 5 preguntas de perfilamiento.
// Para cada ruta, se listan los ids de preguntas que se deben habilitar en los demás módulos.

window.App = window.App || {};

(function (App) {
  "use strict";

  /**
   * Rutas posibles de visualizacion de preguntas
   * @type {Array<{ id: string, options: string, questions: string[] }>}
   */
  App.profileRoutes = [
    {
      id: "route_1",
      options:
        "opt_perfil_1_a|opt_perfil_2_a|opt_perfil_3_a|opt_perfil_4_a|opt_perfil_5_a",
      questions: [
        "qns_mod_hardware_1",
        "qns_mod_hardware_2",
        "qns_mod_software_1",
        "qns_mod_software_3",
        "qns_mod_software_4",
        "qns_mod_software_6",
        "qns_mod_software_10",
        "qns_mod_nube_1",
        "qns_mod_personal_1",
        "qns_mod_personal_2",
        "qns_mod_seguridad_1",
        "qns_mod_seguridad_2",
        "qns_mod_planificacion_2",
        "qns_mod_planificacion_3",
        "qns_mod_planificacion_6",
        "qns_mod_conectividad_2",
        "qns_mod_conectividad_4",
        "qns_mod_conectividad_5",
      ],
    },
    {
      id: "route_2",
      options:
        "opt_perfil_1_c|opt_perfil_2_c|opt_perfil_3_c|opt_perfil_4_c|opt_perfil_5_a",
      questions: [
        "qns_mod_hardware_1",
        "qns_mod_hardware_4",
        "qns_mod_software_2",
        "qns_mod_nube_1",
        "qns_mod_seguridad_2",
      ],
    },
  ];

  /**
   * Obtiene los ids de preguntas habilitadas según las respuestas del perfilamiento.
   * @param {Object} respuestasPerfil - { qns_mod_perfilamiento_1: optionId, ... }
   * @returns {Array<string>} - Array de ids de preguntas habilitadas
   */
  App.getEnabledQuestionsByProfile = function (respuestasPerfil) {
    if (!respuestasPerfil) return [];
    // Construir la clave de opciones
    const key = [
      respuestasPerfil["qns_mod_perfilamiento_1"],
      respuestasPerfil["qns_mod_perfilamiento_2"],
      respuestasPerfil["qns_mod_perfilamiento_3"],
      respuestasPerfil["qns_mod_perfilamiento_4"],
      respuestasPerfil["qns_mod_perfilamiento_5"],
    ].join("|");
    const route = App.profileRoutes.find((r) => r.options === key);
    return route ? route.questions : [];
  };
})(window.App);
