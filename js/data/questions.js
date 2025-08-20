// js/data/questions.js
// Contiene todas las preguntas de la encuesta, clasificadas por módulo.
// Responsable único: datos de preguntas.
// No tiene lógica, solo definición de datos para uso en otros módulos.

window.App = window.App || {};

(function (App) {
  "use strict";

  /**
   * Lista de preguntas de la encuesta
   * @type {Array<{ id: string, module: string, text: string, options: string[] }> }
   */
  App.questions = [
    // ---------------- Perfil de la organización ----------------
    {
      id: "qns_perfil_1",
      module: "mod_perfil",
      text: "¿Cuál es el tamaño de su organización?",
      options: ["Pequeña", "Mediana", "Grande", "Muy grande"],
    },
    {
      id: "qns_perfil_2",
      module: "mod_perfil",
      text: "¿En qué sector opera su organización?",
      options: ["Tecnología", "Educación", "Salud", "Otro"],
    },
    {
      id: "qns_perfil_3",
      module: "mod_perfil",
      text: "¿Cuál es el número aproximado de empleados?",
      options: ["1-50", "51-200", "201-500", "Más de 500"],
    },

    // ---------------- Infraestructura y red ----------------
    {
      id: "qns_infraestructura_1",
      module: "mod_infraestructura",
      text: "¿Su red interna utiliza direccionamiento IPv6 actualmente?",
      options: [
        "Sí, completamente",
        "Sí, parcialmente",
        "No, solo IPv4",
        "No lo sé",
      ],
    },
    {
      id: "qns_infraestructura_2",
      module: "mod_infraestructura",
      text: "¿Tiene hardware compatible con IPv6?",
      options: ["Sí, todo", "Sí, parcialmente", "No", "No lo sé"],
    },

    // ---------------- Planificación y gobernanza ----------------
    {
      id: "qns_planificacion_1",
      module: "mod_planificacion",
      text: "¿Existe un plan formal para la transición a IPv6?",
      options: [
        "Sí, documentado",
        "En elaboración",
        "No, pero previsto",
        "No, sin plan",
      ],
    },
    {
      id: "qns_planificacion_2",
      module: "mod_planificacion",
      text: "¿Quién lidera el proyecto de transición a IPv6?",
      options: ["Equipo de TI", "Proveedor externo", "No definido", "Otro"],
    },

    // ---------------- Operaciones y pruebas ----------------
    {
      id: "qns_operaciones_1",
      module: "mod_operaciones",
      text: "¿Ha realizado pruebas de compatibilidad IPv6?",
      options: [
        "Sí, exitosas",
        "Sí, con errores",
        "No, planificadas",
        "No realizadas",
      ],
    },
    {
      id: "qns_operaciones_2",
      module: "mod_operaciones",
      text: "¿Cuenta con un entorno de pruebas dedicado para IPv6?",
      options: ["Sí", "No", "No, pero en proceso", "No lo sé"],
    },

    // ---------------- Seguridad ----------------
    {
      id: "qns_seguridad_1",
      module: "mod_seguridad",
      text: "¿Sus firewalls soportan IPv6?",
      options: ["Sí, todos", "Sí, algunos", "No", "No lo sé"],
    },
    {
      id: "qns_seguridad_2",
      module: "mod_seguridad",
      text: "¿Tiene políticas de seguridad específicas para IPv6?",
      options: ["Sí, implementadas", "En desarrollo", "No", "No lo sé"],
    },

    // ---------------- Proveedores y nube ----------------
    {
      id: "qns_proveedores_1",
      module: "mod_proveedores",
      text: "¿Sus proveedores de internet ofrecen soporte IPv6?",
      options: ["Sí, todos", "Sí, algunos", "No", "No lo sé"],
    },
    {
      id: "qns_proveedores_2",
      module: "mod_proveedores",
      text: "¿Sus servicios en la nube soportan IPv6?",
      options: ["Sí, todos", "Sí, algunos", "No", "No lo sé"],
    },

    // ---------------- Capacitación y talento ----------------
    {
      id: "qns_capacitacion_1",
      module: "mod_capacitacion",
      text: "¿Su equipo de TI ha recibido capacitación en IPv6?",
      options: ["Sí, completa", "Sí, parcial", "No", "No lo sé"],
    },
    {
      id: "qns_capacitacion_2",
      module: "mod_capacitacion",
      text: "¿Existen planes de formación continua en IPv6?",
      options: ["Sí", "No", "En evaluación", "No lo sé"],
    },

    // ---------------- Ecosistema y tecnologías futuras ----------------
    {
      id: "qns_ecosistema_1",
      module: "mod_ecosistema",
      text: "¿Colabora con otras organizaciones para la transición a IPv6?",
      options: ["Sí, activamente", "Ocasionalmente", "No", "No lo sé"],
    },
    {
      id: "qns_ecosistema_2",
      module: "mod_ecosistema",
      text: "¿Su organización investiga tecnologías emergentes relacionadas con IPv6?",
      options: ["Sí, regularmente", "Ocasionalmente", "No", "No lo sé"],
    },
  ];
})(window.App);
