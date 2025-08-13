// js/data/modules.js
// Lista de módulos de la encuesta con metadatos para el dashboard.
// Responsable único: datos de módulos.
// No tiene lógica, solo configuración para uso global.

window.App = window.App || {};

(function (App) {
  "use strict";

  /**
   * Lista de módulos disponibles en el sistema.
   * @type {Array<{ id: string, title: string, icon: string }>}
   */
  App.modules = [
    {
      id: "perfil",
      title: "Perfil de la organización",
      icon: "icons/perfil.svg",
    },
    {
      id: "infraestructura",
      title: "Infraestructura y red",
      icon: "icons/infraestructura.svg",
    },
    {
      id: "planificacion",
      title: "Planificación y gobernanza",
      icon: "icons/planificacion.svg",
    },
    {
      id: "operaciones",
      title: "Operaciones y pruebas",
      icon: "icons/operaciones.svg",
    },
    {
      id: "seguridad",
      title: "Seguridad",
      icon: "icons/seguridad.svg",
    },
    {
      id: "proveedores",
      title: "Proveedores y nube",
      icon: "icons/proveedores.svg",
    },
    {
      id: "capacitacion",
      title: "Capacitación y talento",
      icon: "icons/capacitacion.svg",
    },
    {
      id: "ecosistema",
      title: "Ecosistema y tecnologías futuras",
      icon: "icons/ecosistema.svg",
    },
  ];
})(window.App);
