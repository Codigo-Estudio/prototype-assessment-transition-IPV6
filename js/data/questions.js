// js/data/questions.js
// Contiene todas las preguntas de la encuesta, clasificadas por módulo.
// Responsable único: datos de preguntas.
// No tiene lógica, solo definición de datos para uso en otros módulos.

window.App = window.App || {};

(function (App) {
  "use strict";

  /**
   * Lista de preguntas de la encuesta
   * @type {Array<{ module: string, text: string, options: string[] }>}
   */
  App.questions = [
    // ---------------- Perfil de la organización ----------------
    {
      module: "perfil",
      text: "¿Cuál es el tamaño de su organización?",
      options: ["Pequeña", "Mediana", "Grande", "Muy grande"],
    },
    {
      module: "perfil",
      text: "¿En qué sector opera su organización?",
      options: ["Tecnología", "Educación", "Salud", "Otro"],
    },
    {
      module: "perfil",
      text: "¿Cuál es el número aproximado de empleados?",
      options: ["1-50", "51-200", "201-500", "Más de 500"],
    },

    // ---------------- Infraestructura y red ----------------
    {
      module: "infraestructura",
      text: "¿Su red interna utiliza direccionamiento IPv6 actualmente?",
      options: [
        "Sí, completamente",
        "Sí, parcialmente",
        "No, solo IPv4",
        "No lo sé",
      ],
    },
    {
      module: "infraestructura",
      text: "¿Tiene hardware compatible con IPv6?",
      options: ["Sí, todo", "Sí, parcialmente", "No", "No lo sé"],
    },

    // ---------------- Planificación y gobernanza ----------------
    {
      module: "planificacion",
      text: "¿Existe un plan formal para la transición a IPv6?",
      options: [
        "Sí, documentado",
        "En elaboración",
        "No, pero previsto",
        "No, sin plan",
      ],
    },
    {
      module: "planificacion",
      text: "¿Quién lidera el proyecto de transición a IPv6?",
      options: ["Equipo de TI", "Proveedor externo", "No definido", "Otro"],
    },

    // ---------------- Operaciones y pruebas ----------------
    {
      module: "operaciones",
      text: "¿Ha realizado pruebas de compatibilidad IPv6?",
      options: [
        "Sí, exitosas",
        "Sí, con errores",
        "No, planificadas",
        "No realizadas",
      ],
    },
    {
      module: "operaciones",
      text: "¿Cuenta con un entorno de pruebas dedicado para IPv6?",
      options: ["Sí", "No", "No, pero en proceso", "No lo sé"],
    },

    // ---------------- Seguridad ----------------
    {
      module: "seguridad",
      text: "¿Sus firewalls soportan IPv6?",
      options: ["Sí, todos", "Sí, algunos", "No", "No lo sé"],
    },
    {
      module: "seguridad",
      text: "¿Tiene políticas de seguridad específicas para IPv6?",
      options: ["Sí, implementadas", "En desarrollo", "No", "No lo sé"],
    },

    // ---------------- Proveedores y nube ----------------
    {
      module: "proveedores",
      text: "¿Sus proveedores de internet ofrecen soporte IPv6?",
      options: ["Sí, todos", "Sí, algunos", "No", "No lo sé"],
    },
    {
      module: "proveedores",
      text: "¿Sus servicios en la nube soportan IPv6?",
      options: ["Sí, todos", "Sí, algunos", "No", "No lo sé"],
    },

    // ---------------- Capacitación y talento ----------------
    {
      module: "capacitacion",
      text: "¿Su equipo de TI ha recibido capacitación en IPv6?",
      options: ["Sí, completa", "Sí, parcial", "No", "No lo sé"],
    },
    {
      module: "capacitacion",
      text: "¿Existen planes de formación continua en IPv6?",
      options: ["Sí", "No", "En evaluación", "No lo sé"],
    },

    // ---------------- Ecosistema y tecnologías futuras ----------------
    {
      module: "ecosistema",
      text: "¿Colabora con otras organizaciones para la transición a IPv6?",
      options: ["Sí, activamente", "Ocasionalmente", "No", "No lo sé"],
    },
    {
      module: "ecosistema",
      text: "¿Su organización investiga tecnologías emergentes relacionadas con IPv6?",
      options: ["Sí, regularmente", "Ocasionalmente", "No", "No lo sé"],
    },
  ];
})(window.App);
