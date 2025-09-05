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
  // Ahora cada opción es un objeto { text, score }
  App.questions = [
    // ---------------- Datos Básicos ----------------
    {
      id: "qns_datos_basicos_1",
      module: "mod_datos_basicos",
      text: "¿Su organización dispone de equipos de red gestionables (routers/ switches/ firewalls) bajo su control o por proveedor gestionado?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
      ],
    },
    {
      id: "qns_datos_basicos_2",
      module: "mod_datos_basicos",
      text: "¿Tiene su organización servicios expuestos a Internet que gestiona o contrata (por ejemplo: DNS, servidor de correo, sitio web, APIs)?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
      ],
    },
    {
      id: "qns_datos_basicos_3",
      module: "mod_datos_basicos",
      text: "¿Dispone su organización de procesos regulares de respaldo (backups) y procedimientos de restauración documentados?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
      ],
    },
    {
      id: "qns_datos_basicos_4",
      module: "mod_datos_basicos",
      text: "¿Cuenta su organización con personal de TI o un proveedor IT responsable de la infraestructura (interno o contratado)?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
      ],
    },
    {
      id: "qns_datos_basicos_5",
      module: "mod_datos_basicos",
      text: "¿Existe un inventario básico de activos (equipos de red, servidores, servicios críticos) aunque sea en hoja de cálculo?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
      ],
    },

    // ---------------- Hardware ----------------
    {
      id: "qns_hardware_1",
      module: "mod_hardware",
      text: "¿Cuenta su empresa con un inventario completo de los activos de hardware y dispositivos de red actualmente en uso?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
        { text: "No lo sé", score: 0.5 },
      ],
    },
    {
      id: "qns_hardware_2",
      module: "mod_hardware",
      text: "¿Qué tan actualizado y documentado considera que está el inventario actual de hardware?",
      options: [
        { text: "Nada documentado", score: 0 },
        { text: "Medianamente documentado", score: 0.5 },
        { text: "Totalmente actualizado y documentado", score: 1 },
      ],
    },
    {
      id: "qns_hardware_3",
      module: "mod_hardware",
      text: "¿Qué nivel de dificultad considera que tendrá la actualización del inventario de dispositivos con información sobre compatibilidad IPv6?",
      options: [
        { text: "Alta", score: 1 },
        { text: "Moderada", score: 0.5 },
        { text: "Baja", score: 0 },
      ],
    },

    // ---------------- Software ----------------
    {
      id: "qns_software_1",
      module: "mod_software",
      text: "¿Cuál considera que es el nivel de avance en la implementación de IPv6 en el entorno de software de su organización?",
      options: [
        { text: "Bajo", score: 0 },
        { text: "Medio", score: 0.5 },
        { text: "Alto", score: 1 },
      ],
    },
    {
      id: "qns_software_2",
      module: "mod_software",
      text: "¿Qué nivel de conocimiento considera que tiene el área de TI para realizar configuraciones en el software durante la transición a IPv6?",
      options: [
        { text: "Bajo", score: 0 },
        { text: "Medio", score: 0.5 },
        { text: "Alto", score: 1 },
      ],
    },
    {
      id: "qns_software_3",
      module: "mod_software",
      text: "¿Cuál es el nivel de experiencia y capacitación del personal de TI en la gestión de tecnologías IPv6?",
      options: [
        { text: "Bajo", score: 0 },
        { text: "Medio", score: 0.5 },
        { text: "Alto", score: 1 },
      ],
    },

    // ---------------- Planeación ----------------
    {
      id: "qns_planeacion_1",
      module: "mod_planeacion",
      text: "¿Cuenta su empresa con presupuesto asignado para la transición a IPv6?",
      options: [
        { text: "Sí, definido", score: 1 },
        { text: "No", score: 0 },
        { text: "No lo sé", score: 0.5 },
      ],
    },
    {
      id: "qns_planeacion_2",
      module: "mod_planeacion",
      text: "¿En qué medida considera que los recursos asignados (personal, tiempo, presupuesto) son adecuados para la transición?",
      options: [
        { text: "Totalmente inadecuados", score: 0 },
        { text: "Neutrales", score: 0.5 },
        { text: "Totalmente adecuados", score: 1 },
      ],
    },
    {
      id: "qns_planeacion_3",
      module: "mod_planeacion",
      text: "¿Qué nivel de análisis financiero y operativo se ha realizado respecto a la transición a IPv6?",
      options: [
        { text: "Bajo", score: 0 },
        { text: "Medio", score: 0.5 },
        { text: "Alto", score: 1 },
      ],
    },

    // ---------------- Implementación ----------------
    {
      id: "qns_implementacion_1",
      module: "mod_implementacion",
      text: "¿Cómo evaluaría el funcionamiento general del software y hardware de la organización tras la implementación de IPv6 (desempeño, estabilidad y compatibilidad)?",
      options: [
        { text: "Malo", score: 0 },
        { text: "Regular", score: 0.5 },
        { text: "Bueno", score: 1 },
      ],
    },
    {
      id: "qns_implementacion_2",
      module: "mod_implementacion",
      text: "¿Cómo evaluaría la estabilidad y confiabilidad de la red IPv6 después de la transición?",
      options: [
        { text: "Inestable", score: 0 },
        { text: "Medianamente estable", score: 0.5 },
        { text: "Estable", score: 1 },
      ],
    },
    {
      id: "qns_implementacion_3",
      module: "mod_implementacion",
      text: "¿Cómo percibe el funcionamiento del servidor DNS al resolver direcciones IPv6 tras la reconfiguración?",
      options: [
        { text: "Malo", score: 0 },
        { text: "Regular", score: 0.5 },
        { text: "Bueno", score: 1 },
      ],
    },

    // ---------------- Capacitación ----------------
    {
      id: "qns_capacitacion_1",
      module: "mod_capacitacion",
      text: "¿Cómo calificaría el nivel de conocimiento del área de TI para diferenciar entre IPv4 e IPv6?",
      options: [
        { text: "Bajo", score: 0 },
        { text: "Medio", score: 0.5 },
        { text: "Alto", score: 1 },
      ],
    },
    {
      id: "qns_capacitacion_2",
      module: "mod_capacitacion",
      text: "¿Considera que el área de TI tiene los conocimientos necesarios para afrontar los desafíos de la transición a IPv6?",
      options: [
        { text: "Insuficientes", score: 0 },
        { text: "Moderados", score: 0.5 },
        { text: "Suficientes", score: 1 },
      ],
    },
    {
      id: "qns_capacitacion_3",
      module: "mod_capacitacion",
      text: "¿El área de TI conoce cómo llevar a cabo una transición de IPv4 a IPv6 en un entorno real?",
      options: [
        { text: "Nada de conocimiento", score: 0 },
        { text: "Conocimiento básico", score: 0.5 },
        { text: "Conocimiento avanzado", score: 1 },
      ],
    },

    // ---------------- Seguridad ----------------
    {
      id: "qns_seguridad_1",
      module: "mod_seguridad",
      text: "¿En qué medida cree que se han implementado políticas de seguridad adecuadas para proteger la red IPv6?",
      options: [
        { text: "Nada implementadas", score: 0 },
        { text: "Parcialmente implementadas", score: 0.5 },
        { text: "Totalmente implementadas", score: 1 },
      ],
    },
    {
      id: "qns_seguridad_2",
      module: "mod_seguridad",
      text: "¿Cómo evaluaría la planificación y actualización de reglas de firewall para IPv4/IPv6?",
      options: [
        { text: "Baja", score: 0 },
        { text: "Media", score: 0.5 },
        { text: "Alta", score: 1 },
      ],
    },
    {
      id: "qns_seguridad_3",
      module: "mod_seguridad",
      text: "¿En qué medida cree que podrían surgir vulnerabilidades en los sistemas de seguridad durante la transición a IPv6?",
      options: [
        { text: "Baja", score: 0 },
        { text: "Media", score: 0.5 },
        { text: "Alta", score: 1 },
      ],
    },
  ];
})(window.App);
