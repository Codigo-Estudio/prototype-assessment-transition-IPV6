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
      requires: [],
    },
    {
      id: "qns_datos_basicos_2",
      module: "mod_datos_basicos",
      text: "¿Tiene su organización servicios expuestos a Internet que gestiona o contrata (por ejemplo: DNS, servidor de correo, sitio web, APIs)?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
      ],
      requires: [],
    },
    {
      id: "qns_datos_basicos_3",
      module: "mod_datos_basicos",
      text: "¿Dispone su organización de procesos regulares de respaldo (backups) y procedimientos de restauración documentados?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
      ],
      requires: [],
    },
    {
      id: "qns_datos_basicos_4",
      module: "mod_datos_basicos",
      text: "¿Cuenta su organización con personal de TI o un proveedor IT responsable de la infraestructura (interno o contratado)?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
      ],
      requires: [],
    },
    {
      id: "qns_datos_basicos_5",
      module: "mod_datos_basicos",
      text: "¿Existe un inventario básico de activos (equipos de red, servidores, servicios críticos) aunque sea en hoja de cálculo?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
      ],
      requires: [],
    },

    // ---------------- Hardware ----------------
    {
      id: "qns_hardware_1",
      module: "mod_hardware",
      text: "¿Cuenta su empresa con un inventario completo de los activos de hardware y dispositivos de red actualmente en uso?",
      options: [
        { text: "Sí", score: 2 },
        { text: "No", score: 0 },
        { text: "No lo sé", score: 1 },
      ],
      requires: [],
    },
    {
      id: "qns_hardware_2",
      module: "mod_hardware",
      text: "¿Qué tan actualizado y documentado considera que está el inventario actual de hardware?",
      options: [
        { text: "Nada documentado", score: 0 },
        { text: "Poco documentado", score: 1 },
        { text: "Medianamente documentado", score: 2 },
        { text: "Bien documentado", score: 3 },
        { text: "Totalmente actualizado y documentado", score: 4 },
      ],
      requires: [],
    },
    {
      id: "qns_hardware_3",
      module: "mod_hardware",
      text: "¿Qué nivel de dificultad considera que tendrá la actualización del inventario de dispositivos con información sobre compatibilidad IPv6?",
      options: [
        { text: "Muy alta", score: 0 },
        { text: "Alta", score: 1 },
        { text: "Moderada", score: 2 },
        { text: "Baja", score: 3 },
        { text: "Muy baja", score: 4 },
      ],
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
      options: [
        { text: "Muy bajo", score: 0 },
        { text: "Bajo", score: 1 },
        { text: "Medio", score: 2 },
        { text: "Alto", score: 3 },
        { text: "Muy alto", score: 4 },
      ],
      requires: [],
    },
    {
      id: "qns_software_2",
      module: "mod_software",
      text: "¿Qué nivel de conocimiento considera que tiene el área de TI para realizar configuraciones en el software durante la transición a IPv6?",
      options: [
        { text: "Muy bajo", score: 0 },
        { text: "Bajo", score: 1 },
        { text: "Medio", score: 2 },
        { text: "Alto", score: 3 },
        { text: "Muy alto", score: 4 },
      ],
      /* Ejemplo de dependencia: solo mostrar esta pregunta si qns_hardware_1 fue respondida 'Sí' */
      requires: [{ questionId: "qns_hardware_1", answers: ["Sí"] }],
    },
    {
      id: "qns_software_3",
      module: "mod_software",
      text: "¿Cuál es el nivel de experiencia y capacitación del personal de TI en la gestión de tecnologías IPv6?",
      options: [
        { text: "Muy bajo", score: 0 },
        { text: "Bajo", score: 1 },
        { text: "Medio", score: 2 },
        { text: "Alto", score: 3 },
        { text: "Muy alto", score: 4 },
      ],
      requires: [],
    },
    // ---------------- Planeación ----------------
    {
      id: "qns_planeacion_1",
      module: "mod_planeacion",
      text: "¿Cuenta su empresa con presupuesto asignado para la transición a IPv6?",
      options: [
        { text: "Sí, definido", score: 3 },
        { text: "Sí, parcialmente definido", score: 2 },
        { text: "No", score: 0 },
        { text: "No lo sé", score: 1 },
      ],
      /* Example dependency: only show this question if qns_hardware_1 was answered 'Sí' */
      requires: [],
    },
    {
      id: "qns_planeacion_2",
      module: "mod_planeacion",
      text: "¿En qué medida considera que los recursos asignados (personal, tiempo, presupuesto) son adecuados para la transición?",
      options: [
        { text: "Totalmente inadecuados", score: 0 },
        { text: "Parcialmente inadecuados", score: 1 },
        { text: "Neutrales", score: 2 },
        { text: "Parcialmente adecuados", score: 3 },
        { text: "Totalmente adecuados", score: 4 },
      ],
      requires: [],
    },
    {
      id: "qns_planeacion_3",
      module: "mod_planeacion",
      text: "¿Qué nivel de análisis financiero y operativo se ha realizado respecto a la transición a IPv6?",
      options: [
        { text: "Muy bajo", score: 0 },
        { text: "Bajo", score: 1 },
        { text: "Medio", score: 2 },
        { text: "Alto", score: 3 },
        { text: "Muy alto", score: 4 },
      ],
      requires: [],
    },

    // ---------------- Implementación ----------------
    {
      id: "qns_implementacion_1",
      module: "mod_implementacion",
      text: "¿Cómo evaluaría el funcionamiento general del software y hardware de la organización tras la implementación de IPv6 (desempeño, estabilidad y compatibilidad)?",
      options: [
        { text: "Muy malo", score: 0 },
        { text: "Malo", score: 1 },
        { text: "Regular", score: 2 },
        { text: "Bueno", score: 3 },
        { text: "Muy bueno", score: 4 },
      ],
      requires: [],
    },
    {
      id: "qns_implementacion_2",
      module: "mod_implementacion",
      text: "¿Cómo evaluaría la estabilidad y confiabilidad de la red IPv6 después de la transición?",
      options: [
        { text: "Muy inestable", score: 0 },
        { text: "Inestable", score: 1 },
        { text: "Medianamente estable", score: 2 },
        { text: "Estable", score: 3 },
        { text: "Muy estable", score: 4 },
      ],
      requires: [],
    },
    {
      id: "qns_implementacion_3",
      module: "mod_implementacion",
      text: "¿Cómo percibe el funcionamiento del servidor DNS al resolver direcciones IPv6 tras la reconfiguración?",
      options: [
        { text: "Muy malo", score: 0 },
        { text: "Malo", score: 1 },
        { text: "Regular", score: 2 },
        { text: "Bueno", score: 3 },
        { text: "Muy bueno", score: 4 },
      ],
      requires: [],
    },

    // ---------------- Capacitación ----------------
    {
      id: "qns_capacitacion_1",
      module: "mod_capacitacion",
      text: "¿Cómo calificaría el nivel de conocimiento del área de TI para diferenciar entre IPv4 e IPv6?",
      options: [
        { text: "Muy bajo", score: 0 },
        { text: "Bajo", score: 1 },
        { text: "Medio", score: 2 },
        { text: "Alto", score: 3 },
        { text: "Muy alto", score: 4 },
      ],
      requires: [],
    },
    {
      id: "qns_capacitacion_2",
      module: "mod_capacitacion",
      text: "¿Considera que el área de TI tiene los conocimientos necesarios para afrontar los desafíos de la transición a IPv6?",
      options: [
        { text: "Muy insuficientes", score: 0 },
        { text: "Insuficientes", score: 1 },
        { text: "Moderados", score: 2 },
        { text: "Suficientes", score: 3 },
        { text: "Muy suficientes", score: 4 },
      ],
      requires: [],
    },
    {
      id: "qns_capacitacion_3",
      module: "mod_capacitacion",
      text: "¿El área de TI conoce cómo llevar a cabo una transición de IPv4 a IPv6 en un entorno real?",
      options: [
        { text: "Nada de conocimiento", score: 0 },
        { text: "Poco conocimiento", score: 1 },
        { text: "Conocimiento básico", score: 2 },
        { text: "Conocimiento adecuado", score: 3 },
        { text: "Conocimiento avanzado", score: 4 },
      ],
      requires: [],
    },

    // ---------------- Seguridad ----------------
    {
      id: "qns_seguridad_1",
      module: "mod_seguridad",
      text: "¿En qué medida cree que se han implementado políticas de seguridad adecuadas para proteger la red IPv6?",
      options: [
        { text: "Nada implementadas", score: 0 },
        { text: "Poco implementadas", score: 1 },
        { text: "Parcialmente implementadas", score: 2 },
        { text: "Bien implementadas", score: 3 },
        { text: "Totalmente implementadas", score: 4 },
      ],
      requires: [],
    },
    {
      id: "qns_seguridad_2",
      module: "mod_seguridad",
      text: "¿Cómo evaluaría la planificación y actualización de reglas de firewall para IPv4/IPv6?",
      options: [
        { text: "Muy baja", score: 0 },
        { text: "Baja", score: 1 },
        { text: "Media", score: 2 },
        { text: "Alta", score: 3 },
        { text: "Muy alta", score: 4 },
      ],
      requires: [],
    },
    {
      id: "qns_seguridad_3",
      module: "mod_seguridad",
      text: "¿En qué medida cree que podrían surgir vulnerabilidades en los sistemas de seguridad durante la transición a IPv6?",
      options: [
        { text: "Muy baja", score: 0 },
        { text: "Baja", score: 1 },
        { text: "Media", score: 2 },
        { text: "Alta", score: 3 },
        { text: "Muy alta", score: 4 },
      ],
      requires: [],
    },
  ];
})(window.App);
