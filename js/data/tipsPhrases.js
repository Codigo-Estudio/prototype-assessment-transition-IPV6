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
    // ---------------- Datos Básicos ----------------
    {
      id: "mod_datos_basicos_bajo",
      modulo: "mod_datos_basicos",
      texto:
        "El módulo de Datos Básicos presenta oportunidades de mejora en la gestión de activos y procesos.",
    },
    {
      id: "mod_datos_basicos_medio",
      modulo: "mod_datos_basicos",
      texto:
        "El módulo de Datos Básicos muestra una gestión regular y procesos no tan definidos.",
    },
    {
      id: "mod_datos_basicos_alto",
      modulo: "mod_datos_basicos",
      texto:
        "El módulo de Datos Básicos muestra una gestión sólida y procesos bien definidos.",
    },
    // ---------------- Hardware ----------------
    {
      id: "mod_hardware_bajo",
      modulo: "mod_hardware",
      texto:
        "El módulo de Hardware presenta carencias en el inventario y documentación de los dispositivos de red.",
    },
    {
      id: "mod_hardware_medio",
      modulo: "mod_hardware",
      texto:
        "El módulo de Hardware tiene un inventario parcialmente documentado, pero requiere mejoras.",
    },
    {
      id: "mod_hardware_alto",
      modulo: "mod_hardware",
      texto:
        "El módulo de Hardware cuenta con un inventario completo y actualizado de los dispositivos de red.",
    },
    // ---------------- Software ----------------
    {
      id: "mod_software_bajo",
      modulo: "mod_software",
      texto:
        "El módulo de Software muestra bajo avance en la implementación y conocimiento de IPv6.",
    },
    {
      id: "mod_software_medio",
      modulo: "mod_software",
      texto:
        "El módulo de Software tiene avances moderados en la transición y capacitación sobre IPv6.",
    },
    {
      id: "mod_software_alto",
      modulo: "mod_software",
      texto:
        "El módulo de Software está bien preparado y el personal tiene experiencia en IPv6.",
    },
    // ---------------- Planeación ----------------
    {
      id: "mod_planeacion_bajo",
      modulo: "mod_planeacion",
      texto:
        "El módulo de Planeación carece de presupuesto y recursos adecuados para la transición a IPv6.",
    },
    {
      id: "mod_planeacion_medio",
      modulo: "mod_planeacion",
      texto:
        "El módulo de Planeación tiene recursos parcialmente adecuados, pero requiere mayor análisis y asignación.",
    },
    {
      id: "mod_planeacion_alto",
      modulo: "mod_planeacion",
      texto:
        "El módulo de Planeación cuenta con presupuesto y recursos bien definidos para la transición a IPv6.",
    },
    // ---------------- Implementación ----------------
    {
      id: "mod_implementacion_bajo",
      modulo: "mod_implementacion",
      texto:
        "El módulo de Implementación presenta problemas de compatibilidad y estabilidad tras la transición a IPv6.",
    },
    {
      id: "mod_implementacion_medio",
      modulo: "mod_implementacion",
      texto:
        "El módulo de Implementación tiene una transición regular, pero aún existen áreas de mejora en desempeño y estabilidad.",
    },
    {
      id: "mod_implementacion_alto",
      modulo: "mod_implementacion",
      texto:
        "El módulo de Implementación muestra una transición exitosa y estable a IPv6 en la organización.",
    },
    // ---------------- Capacitación ----------------
    {
      id: "mod_capacitacion_bajo",
      modulo: "mod_capacitacion",
      texto:
        "El módulo de Capacitación evidencia falta de conocimiento y preparación del personal de TI para IPv6.",
    },
    {
      id: "mod_capacitacion_medio",
      modulo: "mod_capacitacion",
      texto:
        "El módulo de Capacitación tiene avances en formación, pero aún existen brechas de conocimiento sobre IPv6.",
    },
    {
      id: "mod_capacitacion_alto",
      modulo: "mod_capacitacion",
      texto:
        "El módulo de Capacitación demuestra que el personal de TI está bien preparado para la transición a IPv6.",
    },
    // ---------------- Seguridad ----------------
    {
      id: "mod_seguridad_bajo",
      modulo: "mod_seguridad",
      texto:
        "El módulo de Seguridad presenta vulnerabilidades y falta de políticas adecuadas para IPv6.",
    },
    {
      id: "mod_seguridad_medio",
      modulo: "mod_seguridad",
      texto:
        "El módulo de Seguridad tiene políticas parcialmente implementadas, pero requiere mayor actualización y control.",
    },
    {
      id: "mod_seguridad_alto",
      modulo: "mod_seguridad",
      texto:
        "El módulo de Seguridad cuenta con políticas robustas y actualizadas para proteger la red IPv6.",
    },
  ];
})(window.App);
