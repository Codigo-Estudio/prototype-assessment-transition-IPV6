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
    // ---------------- Datos Básicos ----------------
    {
      id: "qns_datos_basicos_1",
      module: "mod_datos_basicos",
      text: "¿Su organización dispone de equipos de red gestionables (routers/ switches/ firewalls) bajo su control o por proveedor gestionado?",
      options: ["Sí", "No"],
      requires: [],
    },
    {
      id: "qns_datos_basicos_2",
      module: "mod_datos_basicos",
      text: "¿Tiene su organización servicios expuestos a Internet que gestiona o contrata (por ejemplo: DNS, servidor de correo, sitio web, APIs)?",
      options: ["Sí", "No"],
      requires: [],
    },
    {
      id: "qns_datos_basicos_3",
      module: "mod_datos_basicos",
      text: "¿Dispone su organización de procesos regulares de respaldo (backups) y procedimientos de restauración documentados?",
      options: ["Sí", "No"],
      requires: [],
    },
    {
      id: "qns_datos_basicos_4",
      module: "mod_datos_basicos",
      text: "¿Cuenta su organización con personal de TI o un proveedor IT responsable de la infraestructura (interno o contratado)?",
      options: ["Sí", "No"],
      requires: [],
    },
    {
      id: "qns_datos_basicos_5",
      module: "mod_datos_basicos",
      text: "¿Existe un inventario básico de activos (equipos de red, servidores, servicios críticos) aunque sea en hoja de cálculo?",
      options: ["Sí", "No"],
      requires: [],
    },

    // ---------------- Hardware ----------------
    {
      id: "qns_hardware_1",
      module: "mod_hardware",
      text: "¿Cuenta su empresa con un inventario completo de los activos de hardware y dispositivos de red actualmente en uso?",
      options: ["Sí", "No", "No lo sé"],
      requires: [],
    },
    {
      id: "qns_hardware_2",
      module: "mod_hardware",
      text: "¿Qué tan actualizado y documentado considera que está el inventario actual de hardware?",
      options: [
        "Nada documentado",
        "Poco documentado",
        "Medianamente documentado",
        "Bien documentado",
        "Totalmente actualizado y documentado",
      ],
      requires: [],
    },
    {
      id: "qns_hardware_3",
      module: "mod_hardware",
      text: "¿Qué nivel de dificultad considera que tendrá la actualización del inventario de dispositivos con información sobre compatibilidad IPv6?",
      options: ["Muy alta", "Alta", "Moderada", "Baja", "Muy baja"],
      requires: [
        { questionId: "qns_datos_basicos_1", answers: ["Sí"] },
        { questionId: "qns_datos_basicos_2", answers: ["No"] },
      ],
    },

    // ---------------- Software ----------------
    {
      id: "qns_software_1",
      module: "mod_software",
      text: "¿Cuál considera que es el nivel de avance en la implementación de IPv6 en el entorno de software de su organización?",
      options: ["Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"],
      requires: [],
    },
    {
      id: "qns_software_2",
      module: "mod_software",
      text: "¿Qué nivel de conocimiento considera que tiene el área de TI para realizar configuraciones en el software durante la transición a IPv6?",
      options: ["Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"],
      /* Ejemplo de dependencia: solo mostrar esta pregunta si qns_hardware_1 fue respondida 'Sí' */
      requires: [{ questionId: "qns_hardware_1", answers: ["Sí"] }],
    },
    {
      id: "qns_software_3",
      module: "mod_software",
      text: "¿Cuál es el nivel de experiencia y capacitación del personal de TI en la gestión de tecnologías IPv6?",
      options: ["Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"],
      requires: [],
    },
    // ---------------- Planeación ----------------
    {
      id: "qns_planeacion_1",
      module: "mod_planeacion",
      text: "¿Cuenta su empresa con presupuesto asignado para la transición a IPv6?",
      options: ["Sí, definido", "Sí, parcialmente definido", "No", "No lo sé"],
      /* Example dependency: only show this question if qns_hardware_1 was answered 'Sí' */
      requires: [],
    },
    {
      id: "qns_planeacion_2",
      module: "mod_planeacion",
      text: "¿En qué medida considera que los recursos asignados (personal, tiempo, presupuesto) son adecuados para la transición?",
      options: [
        "Totalmente inadecuados",
        "Parcialmente inadecuados",
        "Neutrales",
        "Parcialmente adecuados",
        "Totalmente adecuados",
      ],
      requires: [],
    },
    {
      id: "qns_planeacion_3",
      module: "mod_planeacion",
      text: "¿Qué nivel de análisis financiero y operativo se ha realizado respecto a la transición a IPv6?",
      options: ["Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"],
      requires: [],
    },

    // ---------------- Implementación ----------------
    {
      id: "qns_implementacion_1",
      module: "mod_implementacion",
      text: "¿Cómo evaluaría el funcionamiento general del software y hardware de la organización tras la implementación de IPv6 (desempeño, estabilidad y compatibilidad)?",
      options: ["Muy malo", "Malo", "Regular", "Bueno", "Muy bueno"],
      requires: [],
    },
    {
      id: "qns_implementacion_2",
      module: "mod_implementacion",
      text: "¿Cómo evaluaría la estabilidad y confiabilidad de la red IPv6 después de la transición?",
      options: [
        "Muy inestable",
        "Inestable",
        "Medianamente estable",
        "Estable",
        "Muy estable",
      ],
      requires: [],
    },
    {
      id: "qns_implementacion_3",
      module: "mod_implementacion",
      text: "¿Cómo percibe el funcionamiento del servidor DNS al resolver direcciones IPv6 tras la reconfiguración?",
      options: ["Muy malo", "Malo", "Regular", "Bueno", "Muy bueno"],
      requires: [],
    },

    // ---------------- Capacitación ----------------
    {
      id: "qns_capacitacion_1",
      module: "mod_capacitacion",
      text: "¿Cómo calificaría el nivel de conocimiento del área de TI para diferenciar entre IPv4 e IPv6?",
      options: ["Muy bajo", "Bajo", "Medio", "Alto", "Muy alto"],
      requires: [],
    },
    {
      id: "qns_capacitacion_2",
      module: "mod_capacitacion",
      text: "¿Considera que el área de TI tiene los conocimientos necesarios para afrontar los desafíos de la transición a IPv6?",
      options: [
        "Muy insuficientes",
        "Insuficientes",
        "Moderados",
        "Suficientes",
        "Muy suficientes",
      ],
      requires: [],
    },
    {
      id: "qns_capacitacion_3",
      module: "mod_capacitacion",
      text: "¿El área de TI conoce cómo llevar a cabo una transición de IPv4 a IPv6 en un entorno real?",
      options: [
        "Nada de conocimiento",
        "Poco conocimiento",
        "Conocimiento básico",
        "Conocimiento adecuado",
        "Conocimiento avanzado",
      ],
      requires: [],
    },

    // ---------------- Seguridad ----------------
    {
      id: "qns_seguridad_1",
      module: "mod_seguridad",
      text: "¿En qué medida cree que se han implementado políticas de seguridad adecuadas para proteger la red IPv6?",
      options: [
        "Nada implementadas",
        "Poco implementadas",
        "Parcialmente implementadas",
        "Bien implementadas",
        "Totalmente implementadas",
      ],
      requires: [],
    },
    {
      id: "qns_seguridad_2",
      module: "mod_seguridad",
      text: "¿Cómo evaluaría la planificación y actualización de reglas de firewall para IPv4/IPv6?",
      options: ["Muy baja", "Baja", "Media", "Alta", "Muy alta"],
      requires: [],
    },
    {
      id: "qns_seguridad_3",
      module: "mod_seguridad",
      text: "¿En qué medida cree que podrían surgir vulnerabilidades en los sistemas de seguridad durante la transición a IPv6?",
      options: ["Muy baja", "Baja", "Media", "Alta", "Muy alta"],
      requires: [],
    },
  ];
})(window.App);
