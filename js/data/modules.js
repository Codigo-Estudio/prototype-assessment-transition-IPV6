(function (App) {
  "use strict";
  /**
   * Lista de modulos del dashboard
   * @type {Array<{ id: string, title: string, nivel: number}> }
   */
  App.modules = [
    { id: "mod_perfilamiento", title: "Perfilamiento Inicial", nivel: 1 },
    { id: "mod_hardware", title: "Hardware y Dispositivos", nivel: 2 },
    { id: "mod_software", title: "Software y Sistemas", nivel: 3 },
    { id: "mod_nube", title: "Nube y Proveedores Externos", nivel: 4 },
    { id: "mod_personal", title: "Personal y Capacitación", nivel: 5 },
    { id: "mod_seguridad", title: "Seguridad y Riesgos", nivel: 6 },
    {
      id: "mod_planificacion",
      title: "Planificación, Recursos y Estrategia",
      nivel: 7,
    },
    {
      id: "mod_conectividad",
      title: "Conectividad Externa y Cumplimiento",
      nivel: 8,
    },
  ];
})(window.App);
