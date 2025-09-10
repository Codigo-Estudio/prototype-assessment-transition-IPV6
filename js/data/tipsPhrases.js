// js/data/tipsPhrases.js
// Frases y textos para informes de madurez general y por módulo
// Estructura: { id, texto }

window.App = window.App || {};

(function (App) {
  "use strict";

  /**
   * Frases para madurez general
   * @type {Array<{ id: string, texto: string }>}
   */
  App.tipsGeneral = [
    {
      id: "general_bajo",
      texto:
        "El nivel de madurez general es bajo. Se recomienda fortalecer los procesos y recursos.",
    },
    {
      id: "general_medio",
      texto:
        "El nivel de madurez general es medio. Hay avances, pero aún existen áreas de mejora.",
    },
    {
      id: "general_alto",
      texto:
        "El nivel de madurez general es alto. La organización está bien preparada para la transición a IPv6.",
    },
  ];

  /**
   * Frases para madurez por módulo
   * @type {Array<{ id: string, modulo: string, texto: string }>}
   */
  App.tipsModulo = [
    // ---------------- Hardware y Dispositivos ----------------
    {
      id: "mod_hardware_bajo",
      modulo: "mod_hardware",
      texto:
        "El módulo de Hardware y Dispositivos presenta debilidades en la preparación tecnológica para IPv6.",
    },
    {
      id: "mod_hardware_medio",
      modulo: "mod_hardware",
      texto:
        "El módulo de Hardware y Dispositivos muestra un nivel de preparación intermedio con margen de mejora.",
    },
    {
      id: "mod_hardware_alto",
      modulo: "mod_hardware",
      texto:
        "El módulo de Hardware y Dispositivos evidencia una infraestructura robusta y lista para IPv6.",
    },

    // ---------------- Software y Sistemas ----------------
    {
      id: "mod_software_bajo",
      modulo: "mod_software",
      texto:
        "El módulo de Software y Sistemas presenta limitaciones en compatibilidad y gestión de entornos.",
    },
    {
      id: "mod_software_medio",
      modulo: "mod_software",
      texto:
        "El módulo de Software y Sistemas refleja un nivel de compatibilidad intermedio con áreas de mejora.",
    },
    {
      id: "mod_software_alto",
      modulo: "mod_software",
      texto:
        "El módulo de Software y Sistemas cuenta con una gestión sólida y entornos compatibles con IPv6.",
    },

    // ---------------- Nube y Proveedores Externos ----------------
    {
      id: "mod_nube_bajo",
      modulo: "mod_nube",
      texto:
        "El módulo de Nube y Proveedores Externos presenta baja preparación en servicios y coordinación con proveedores.",
    },
    {
      id: "mod_nube_medio",
      modulo: "mod_nube",
      texto:
        "El módulo de Nube y Proveedores Externos refleja un nivel intermedio de adopción con oportunidades de mejora.",
    },
    {
      id: "mod_nube_alto",
      modulo: "mod_nube",
      texto:
        "El módulo de Nube y Proveedores Externos muestra una integración sólida y alineación con los proveedores.",
    },

    // ---------------- Personal y Capacitación ----------------
    {
      id: "mod_personal_bajo",
      modulo: "mod_personal",
      texto:
        "El módulo de Personal y Capacitación presenta carencias en formación y liderazgo técnico en IPv6.",
    },
    {
      id: "mod_personal_medio",
      modulo: "mod_personal",
      texto:
        "El módulo de Personal y Capacitación refleja un nivel de preparación intermedio con avances puntuales.",
    },
    {
      id: "mod_personal_alto",
      modulo: "mod_personal",
      texto:
        "El módulo de Personal y Capacitación muestra un equipo bien preparado y con liderazgo definido en IPv6.",
    },

    // ---------------- Seguridad y Riesgos ----------------
    {
      id: "mod_seguridad_bajo",
      modulo: "mod_seguridad",
      texto:
        "El módulo de Seguridad y Riesgos evidencia baja preparación frente a incidentes y vulnerabilidades en IPv6.",
    },
    {
      id: "mod_seguridad_medio",
      modulo: "mod_seguridad",
      texto:
        "El módulo de Seguridad y Riesgos refleja una preparación intermedia con procesos parcialmente definidos.",
    },
    {
      id: "mod_seguridad_alto",
      modulo: "mod_seguridad",
      texto:
        "El módulo de Seguridad y Riesgos muestra una gestión madura y protocolos sólidos frente a IPv6.",
    },

    // ---------------- Planificación, Recursos y Estrategia ----------------
    {
      id: "mod_planificacion_bajo",
      modulo: "mod_planificacion",
      texto:
        "El módulo de Planificación, Recursos y Estrategia presenta debilidades en la definición de planes y recursos.",
    },
    {
      id: "mod_planificacion_medio",
      modulo: "mod_planificacion",
      texto:
        "El módulo de Planificación, Recursos y Estrategia refleja un nivel intermedio de planificación con aspectos a fortalecer.",
    },
    {
      id: "mod_planificacion_alto",
      modulo: "mod_planificacion",
      texto:
        "El módulo de Planificación, Recursos y Estrategia evidencia una estrategia sólida y bien estructurada.",
    },

    // ---------------- Conectividad Externa y Cumplimiento ----------------
    {
      id: "mod_conectividad_bajo",
      modulo: "mod_conectividad",
      texto:
        "El módulo de Conectividad Externa y Cumplimiento presenta baja preparación y cumplimiento parcial en normativas.",
    },
    {
      id: "mod_conectividad_medio",
      modulo: "mod_conectividad",
      texto:
        "El módulo de Conectividad Externa y Cumplimiento refleja un nivel intermedio de cumplimiento y adopción.",
    },
    {
      id: "mod_conectividad_alto",
      modulo: "mod_conectividad",
      texto:
        "El módulo de Conectividad Externa y Cumplimiento muestra un cumplimiento robusto y conectividad adecuada en IPv6.",
    },
  ];
})(window.App);
