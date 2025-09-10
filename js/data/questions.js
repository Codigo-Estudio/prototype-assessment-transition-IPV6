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
    // ---------------- Perfilamiento Inicial ----------------
    {
      id: "qns_mod_perfilamiento_1",
      module: "mod_perfilamiento",
      text: "¿Cuál es el tamaño de la empresa (Por cantidad de Empleados)?",
      options: [
        { text: "Micro (1-10)", score: null },
        { text: "Pequeña (11-50)", score: null },
        { text: "Mediana (51-200)", score: null },
        { text: "Grande (>200)", score: null },
      ],
    },
    {
      id: "qns_mod_perfilamiento_2",
      module: "mod_perfilamiento",
      text: "¿Cuál es la cantidad de sedes de la empresa?",
      options: [
        { text: "1-2", score: null },
        { text: "3-20", score: null },
        { text: "21-99", score: null },
        { text: ">100", score: null },
      ],
    },
    {
      id: "qns_mod_perfilamiento_3",
      module: "mod_perfilamiento",
      text: "¿Cuál es la cantidad estimada de dispositivos finales (Incluyendo invitados, cámaras de seguridad, Telefonía IP, Servidores, etc...) que se conectan a la red de la empresa?",
      options: [
        { text: "1-99", score: null },
        { text: "100-999", score: null },
        { text: "1000-9999", score: null },
        { text: ">10000", score: null },
      ],
    },
    {
      id: "qns_mod_perfilamiento_4",
      module: "mod_perfilamiento",
      text: "¿Cuenta con Infraestructura de TI (Servidores, Bases de Datos, Aplicaciones, Contenedores, etc...) en Cloud?",
      options: [
        { text: "Sí", score: null },
        { text: "No", score: null },
        { text: "Híbrida", score: null },
      ],
    },
    {
      id: "qns_mod_perfilamiento_5",
      module: "mod_perfilamiento",
      text: "¿Cuenta con servicios o aplicaciones expuestos en Internet (VPN, Sitios Web, API, etc...)?",
      options: [
        { text: "Sí", score: null },
        { text: "No", score: null },
      ],
    },
    // ---------------- Hardware y Dispositivos ----------------
    {
      id: "qns_mod_hardware_1",
      module: "mod_hardware",
      text: "¿Su organización dispone de equipos de red gestionables (routers/ switches/ firewalls) bajo su control o por proveedor gestionado?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
      ],
    },
    {
      id: "qns_mod_hardware_2",
      module: "mod_hardware",
      text: "¿Cuenta su empresa con un inventario completo de los activos de hardware y dispositivos de red actualmente en uso?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
        { text: "No lo sé", score: 0.5 },
      ],
    },
    {
      id: "qns_mod_hardware_3",
      module: "mod_hardware",
      text: "¿En qué medida sus proveedores de hardware ofrecen soluciones compatibles con IPv6?",
      options: [
        { text: "Muy pocas", score: 0 },
        { text: "Escasas", score: 0.3 },
        { text: "Moderadas", score: 0.6 },
        { text: "Varias", score: 0.8 },
        { text: "Muy completas", score: 1 },
      ],
    } /*
    {
      id: "qns_mod_hardware_4",
      module: "mod_hardware",
      text: "¿Su empresa realiza pruebas de compatibilidad IPv6 antes de comprar nuevos dispositivos?",
      options: [
        { text: "Nunca", score: 0 },
        { text: "Rara vez", score: 0 },
        { text: "A veces", score: 0 },
        { text: "Frecuentemente", score: 0 },
        { text: "Siempre", score: 0 },
      ],
    },
    {
      id: "qns_mod_hardware_5",
      module: "mod_hardware",
      text: "¿Qué nivel de preparación tienen los Firewall perimetrales de la organización para soportar IPv6?",
      options: [
        { text: "Nada preparados", score: 0 },
        { text: "Poco preparados", score: 0 },
        { text: "Moderadamente preparados", score: 0 },
        { text: "Bien preparados", score: 0 },
        { text: "Muy bien preparados", score: 0 },
      ],
    },
    {
      id: "qns_mod_hardware_6",
      module: "mod_hardware",
      text: "¿Qué nivel de preparación tienen los routers de la organización para soportar IPv6?",
      options: [
        { text: "Nada preparados", score: 0 },
        { text: "Poco preparados", score: 0 },
        { text: "Moderadamente preparados", score: 0 },
        { text: "Bien preparados", score: 0 },
        { text: "Muy bien preparados", score: 0 },
      ],
    },
    {
      id: "qns_mod_hardware_7",
      module: "mod_hardware",
      text: "¿Qué nivel de preparación tienen los switches de la organización para soportar IPv6?",
      options: [
        { text: "Nada preparados", score: 0 },
        { text: "Poco preparados", score: 0 },
        { text: "Moderadamente preparados", score: 0 },
        { text: "Bien preparados", score: 0 },
        { text: "Muy bien preparados", score: 0 },
      ],
    },
    {
      id: "qns_mod_hardware_8",
      module: "mod_hardware",
      text: "¿Qué nivel de preparación tienen los Access Point (Wifi) de la organización para soportar IPv6?",
      options: [
        { text: "Nada preparados", score: 0 },
        { text: "Poco preparados", score: 0 },
        { text: "Moderadamente preparados", score: 0 },
        { text: "Bien preparados", score: 0 },
        { text: "Muy bien preparados", score: 0 },
      ],
    },
    {
      id: "qns_mod_hardware_9",
      module: "mod_hardware",
      text: "¿Cuenta su empresa con dispositivos IoT (cámaras de vigilancia, Teléfonos IP, Impresoras, Sensores, etc) conectados a la red?",
      options: [
        { text: "Sí", score: 0 },
        { text: "No", score: 0 },
      ],
    },
    {
      id: "qns_mod_hardware_10",
      module: "mod_hardware",
      text: "¿Qué nivel de preparación tienen los dispositivos IoT de la organización para soportar IPv6?",
      options: [
        { text: "Nada preparados", score: 0 },
        { text: "Poco preparados", score: 0 },
        { text: "Moderadamente preparados", score: 0 },
        { text: "Bien preparados", score: 0 },
        { text: "Muy bien preparados", score: 0 },
      ],
    },
    {
      id: "qns_mod_hardware_11",
      module: "mod_hardware",
      text: "¿Qué medidas de contingencia tiene su empresa frente a dispositivos incompatibles con IPv6?",
      options: [
        { text: "Ninguna", score: 0 },
        { text: "Pocas", score: 0 },
        { text: "Moderadas", score: 0 },
        { text: "Varias", score: 0 },
        { text: "Completas y planificadas", score: 0 },
      ],
    },
    {
      id: "qns_mod_hardware_12",
      module: "mod_hardware",
      text: "¿Qué porcentaje aproximado de su hardware considera que deberá ser reemplazado para soportar IPv6?",
      options: [
        { text: "Ninguno", score: 0 },
        { text: "Menos del 25%", score: 0 },
        { text: "Del 25% al 50%", score: 0 },
        { text: "Del 50% al 75%", score: 0 },
        { text: "Más del 75%", score: 0 },
      ],
    },
    {
      id: "qns_mod_hardware_13",
      module: "mod_hardware",
      text: "¿Qué nivel de soporte técnico interno tiene su empresa para la transición de hardware hacia IPv6?",
      options: [
        { text: "Nulo", score: 0 },
        { text: "Bajo", score: 0 },
        { text: "Moderado", score: 0 },
        { text: "Alto", score: 0 },
        { text: "Muy alto", score: 0 },
      ],
    },*/,
    // ---------------- Software y Sistemas ----------------
    {
      id: "qns_mod_software_1",
      module: "mod_software",
      text: "¿Tiene su organización servicios expuestos a Internet que gestiona o contrata (por ejemplo: DNS, servidor de correo, sitio web, APIs)?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
      ],
    },
    {
      id: "qns_mod_software_2",
      module: "mod_software",
      text: "¿Dispone su organización de procesos regulares de respaldo (backups) y procedimientos de restauración documentados?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
      ],
    },
    {
      id: "qns_mod_software_3",
      module: "mod_software",
      text: "¿Cuenta su organización con personal de TI o un proveedor IT responsable de la infraestructura (interno o contratado)?",
      options: [
        { text: "Sí", score: 1 },
        { text: "No", score: 0 },
      ],
    } /*
    {
      id: "qns_mod_software_4",
      module: "mod_software",
      text: "¿Está al tanto de la compatibilidad de los sistemas operativos para las estaciones de trabajo de los usuarios en su empresa con IPv6?",
      options: [
        { text: "Sí", score: 0 },
        { text: "No", score: 0 },
        { text: "No lo sé", score: 0 },
      ],
    },
    {
      id: "qns_mod_software_5",
      module: "mod_software",
      text: "¿Su empresa utiliza máquinas virtuales en su infraestructura?",
      options: [
        { text: "Sí", score: 0 },
        { text: "No", score: 0 },
        { text: "No lo sé", score: 0 },
      ],
    },
    {
      id: "qns_mod_software_6",
      module: "mod_software",
      text: "¿La versión actual de los sistemas operativos de los servidores soporta IPv6?",
      options: [
        { text: "Nada compatible", score: 0 },
        { text: "Poco compatible", score: 0 },
        { text: "Medianamente compatible", score: 0 },
        { text: "Compatible", score: 0 },
        { text: "Totalmente compatible", score: 0 },
      ],
    },
    {
      id: "qns_mod_software_7",
      module: "mod_software",
      text: "¿Cuál considera que es el nivel de avance en la implementación de IPv6 en el entorno de software de su organización?",
      options: [
        { text: "Muy bajo", score: 0 },
        { text: "Bajo", score: 0 },
        { text: "Medio", score: 0 },
        { text: "Alto", score: 0 },
        { text: "Muy alto", score: 0 },
      ],
    },
    {
      id: "qns_mod_software_8",
      module: "mod_software",
      text: "¿Qué tan preparada está el área de TI para documentar los aplicativos propios con el fin de afrontar la transición a IPv6?",
      options: [
        { text: "No tenemos aplicativos propios", score: 0 },
        { text: "Nada preparada", score: 0 },
        { text: "Poco preparada", score: 0 },
        { text: "Medianamente preparada", score: 0 },
        { text: "Bien preparada", score: 0 },
        { text: "Muy bien preparada", score: 0 },
      ],
    },
    {
      id: "qns_mod_software_9",
      module: "mod_software",
      text: "¿Cómo calificaría la compatibilidad de los sistemas de correo electrónico y FTP frente a la coexistencia IPv4/IPv6?",
      options: [
        { text: "Muy baja", score: 0 },
        { text: "Baja", score: 0 },
        { text: "Media", score: 0 },
        { text: "Alta", score: 0 },
        { text: "Muy alta", score: 0 },
      ],
    },
    {
      id: "qns_mod_software_10",
      module: "mod_software",
      text: "¿Qué tan preparados están los repositorios que alojan servicios FTP y Web frente a una transición a IPv6?",
      options: [
        { text: "Nada preparados", score: 0 },
        { text: "Poco preparados", score: 0 },
        { text: "Medianamente preparados", score: 0 },
        { text: "Bien preparados", score: 0 },
        { text: "Muy bien preparados", score: 0 },
      ],
    },
    {
      id: "qns_mod_software_11",
      module: "mod_software",
      text: "¿Qué nivel de ajustes se ha realizado en el file server para garantizar su funcionamiento en IPv6?",
      options: [
        { text: "Muy bajo", score: 0 },
        { text: "Bajo", score: 0 },
        { text: "Medio", score: 0 },
        { text: "Alto", score: 0 },
        { text: "Muy alto", score: 0 },
      ],
    },*/,
    // ---------------- Nube y Proveedores Externos ----------------
    {
      id: "qns_mod_nube_1",
      module: "mod_nube",
      text: "¿En qué medida los servicios de la organización se encuentran alojados en entornos cloud?",
      options: [
        { text: "Muy bajo", score: 0 },
        { text: "Bajo", score: 0.3 },
        { text: "Medio", score: 0.6 },
        { text: "Alto", score: 0.8 },
        { text: "Muy alto", score: 1 },
      ],
    },
    {
      id: "qns_mod_nube_2",
      module: "mod_nube",
      text: "¿Qué nivel de conocimiento tiene la organización sobre los planes de su proveedor cloud respecto a IPv6?",
      options: [
        { text: "Ninguno", score: 0 },
        { text: "Bajo", score: 0.3 },
        { text: "Medio", score: 0.6 },
        { text: "Alto", score: 0.8 },
        { text: "Muy alto", score: 1 },
      ],
    },
    {
      id: "qns_mod_nube_3",
      module: "mod_nube",
      text: "¿En qué medida ha evaluado la compatibilidad de sus proveedores de servicios externos con IPv6?",
      options: [
        { text: "Nada evaluada", score: 0 },
        { text: "Poco evaluada", score: 0.3 },
        { text: "Parcialmente evaluada", score: 0.6 },
        { text: "Bien evaluada", score: 0.8 },
        { text: "Totalmente evaluada", score: 1 },
      ],
    } /*
    {
      id: "qns_mod_nube_4",
      module: "mod_nube",
      text: "En su proveedor de nube, ¿los balanceadores de carga o gateways de API tienen la opción de IPv6 habilitada?",
      options: [
        { text: "Sí, está activo", score: 0 },
        { text: "Está disponible pero no activo", score: 0 },
        { text: "No está disponible", score: 0 },
        { text: "No sé", score: 0 },
      ],
    },
    {
      id: "qns_mod_nube_5",
      module: "mod_nube",
      text: "En su proveedor de nube, ¿Las redes virtuales (VPC/VNet) donde residen sus aplicaciones tienen rangos de direcciones IPv6 asignados?",
      options: [
        { text: "Sí", score: 0 },
        { text: "No", score: 0 },
        { text: "No sé", score: 0 },
      ],
    },*/,
    // ---------------- Personal y Capacitación ----------------
    {
      id: "qns_mod_personal_1",
      module: "mod_personal",
      text: "¿Cuál es el nivel de experiencia y capacitación del personal de TI en la gestión de tecnologías IPv6?",
      options: [
        { text: "Muy bajo", score: 0 },
        { text: "Bajo", score: 0.3 },
        { text: "Medio", score: 0.6 },
        { text: "Alto", score: 0.8 },
        { text: "Muy alto", score: 1 },
      ],
    },
    {
      id: "qns_mod_personal_2",
      module: "mod_personal",
      text: "¿El área de TI conoce los aspectos técnicos (protocolos, estándares, mantenimiento, etc.) involucrados en IPv6?",
      options: [
        { text: "Muy bajo nivel", score: 0 },
        { text: "Bajo nivel", score: 0.3 },
        { text: "Nivel intermedio", score: 0.6 },
        { text: "Buen nivel", score: 0.8 },
        { text: "Nivel experto", score: 1 },
      ],
    },
    {
      id: "qns_mod_personal_3",
      module: "mod_personal",
      text: "¿Qué tan esencial considera la inversión en programas de capacitación en IPv6 para el crecimiento de la empresa?",
      options: [
        { text: "Nada esencial", score: 0 },
        { text: "Poco esencial", score: 0.3 },
        { text: "Medianamente esencial", score: 0.6 },
        { text: "Muy esencial", score: 0.8 },
        { text: "Totalmente esencial", score: 1 },
      ],
    } /*
    {
      id: "qns_mod_personal_4",
      module: "mod_personal",
      text: "¿El área de TI sabe identificar cuál de las siguientes NO es una técnica común de transición de IPv4 a IPv6?",
      options: [
        { text: "Dual Stack", score: 0 },
        { text: "Tunneling", score: 0 },
        { text: "NAT64", score: 0 },
        { text: "DHCP", score: 0 },
      ],
    },
    {
      id: "qns_mod_personal_5",
      module: "mod_personal",
      text: "¿Hay una persona o equipo formalmente responsable de liderar la iniciativa de IPv6?",
      options: [
        { text: "Sí", score: 0 },
        { text: "No", score: 0 },
      ],
    },
    {
      id: "qns_mod_personal_6",
      module: "mod_personal",
      text: "¿El equipo técnico ha recibido al menos una capacitación básica sobre los fundamentos de IPv6?",
      options: [
        { text: "Sí", score: 0 },
        { text: "No", score: 0 },
      ],
    },*/,
    // ---------------- Seguridad y Riesgos ----------------
    {
      id: "qns_mod_seguridad_1",
      module: "mod_seguridad",
      text: "¿Qué nivel de conciencia existe en su empresa sobre los riesgos de seguridad asociados a IPv6?",
      options: [
        { text: "Muy bajo", score: 0 },
        { text: "Bajo", score: 0.3 },
        { text: "Medio", score: 0.6 },
        { text: "Alto", score: 0.8 },
        { text: "Muy alto", score: 1 },
      ],
    },
    {
      id: "qns_mod_seguridad_2",
      module: "mod_seguridad",
      text: "¿Cómo evaluaría la planificación y actualización de reglas de firewall para IPv4/IPv6?",
      options: [
        { text: "Muy baja", score: 0 },
        { text: "Baja", score: 0.3 },
        { text: "Media", score: 0.6 },
        { text: "Alta", score: 0.8 },
        { text: "Muy alta", score: 1 },
      ],
    },
    {
      id: "qns_mod_seguridad_3",
      module: "mod_seguridad",
      text: "¿En qué medida cree que podrían surgir vulnerabilidades en los sistemas de seguridad durante la transición a IPv6?",
      options: [
        { text: "Muy baja", score: 0 },
        { text: "Baja", score: 0.3 },
        { text: "Media", score: 0.6 },
        { text: "Alta", score: 0.8 },
        { text: "Muy alta", score: 1 },
      ],
    } /*
    {
      id: "qns_mod_seguridad_4",
      module: "mod_seguridad",
      text: "¿Qué nivel de monitoreo en tiempo real tiene su organización para detectar incidentes de seguridad en IPv6?",
      options: [
        { text: "Nulo", score: 0 },
        { text: "Bajo", score: 0 },
        { text: "Medio", score: 0 },
        { text: "Alto", score: 0 },
        { text: "Muy alto", score: 0 },
      ],
    },
    {
      id: "qns_mod_seguridad_5",
      module: "mod_seguridad",
      text: "¿Qué tan preparado está el equipo de TI para responder a incidentes de seguridad específicos de IPv6 (ej. RA spoofing, ND poisoning)?",
      options: [
        { text: "Nada preparado", score: 0 },
        { text: "Poco preparado", score: 0 },
        { text: "Medianamente preparado", score: 0 },
        { text: "Bien preparado", score: 0 },
        { text: "Muy preparado", score: 0 },
      ],
    },
    {
      id: "qns_mod_seguridad_6",
      module: "mod_seguridad",
      text: "¿Qué nivel de definición tiene el plan de contingencia en caso de interrupciones inesperadas durante la transición?",
      options: [
        { text: "Nada definido", score: 0 },
        { text: "Poco definido", score: 0 },
        { text: "Parcialmente definido", score: 0 },
        { text: "Bien definido", score: 0 },
        { text: "Totalmente definido", score: 0 },
      ],
    },
    {
      id: "qns_mod_seguridad_7",
      module: "mod_seguridad",
      text: "¿Cómo calificaría la planificación y ejecución de simulacros de contingencia frente a posibles problemas en la transición a IPv6?",
      options: [
        { text: "Muy baja", score: 0 },
        { text: "Baja", score: 0 },
        { text: "Media", score: 0 },
        { text: "Alta", score: 0 },
        { text: "Muy alta", score: 0 },
      ],
    },
    {
      id: "qns_mod_seguridad_8",
      module: "mod_seguridad",
      text: "¿Cómo calificaría la capacidad de su organización para gestionar direcciones y seguridad en IPv6?",
      options: [
        { text: "Muy mala", score: 0 },
        { text: "Mala", score: 0 },
        { text: "Regular", score: 0 },
        { text: "Buena", score: 0 },
        { text: "Muy buena", score: 0 },
      ],
    },
    {
      id: "qns_mod_seguridad_9",
      module: "mod_seguridad",
      text: "¿Tiene un firewall propio o solo el módem del ISP?",
      options: [
        { text: "Solo el módem del ISP", score: 0 },
        { text: "Sí, gestionado internamente", score: 0 },
        { text: "Sí, gestionado por un tercero", score: 0 },
      ],
    },
    {
      id: "qns_mod_seguridad_10",
      module: "mod_seguridad",
      text: "Si tiene un firewall propio, ¿existen políticas de seguridad para IPv6 que sean equivalentes a las de IPv4?",
      options: [
        { text: "Sí, son equivalentes", score: 0 },
        { text: "Parcialmente", score: 0 },
        { text: "No existen", score: 0 },
        { text: "No sé", score: 0 },
      ],
    },
    {
      id: "qns_mod_seguridad_11",
      module: "mod_seguridad",
      text: "¿Su política de firewall permite el paso de mensajes ICMPv6 esenciales (como Packet Too Big y Neighbor Discovery)?",
      options: [
        { text: "Sí", score: 0 },
        { text: "No", score: 0 },
        { text: "No sé", score: 0 },
      ],
    },*/,
    // ---------------- Planificación, Recursos y Estrategia ----------------
    {
      id: "qns_mod_planificacion_1",
      module: "mod_planificacion",
      text: "¿Qué nivel de inversión financiera está dispuesta su empresa a realizar para la implementación de IPv6 (equipos y capacitación)?",
      options: [
        { text: "Mínima", score: 0 },
        { text: "Baja", score: 0.3 },
        { text: "Media", score: 0.6 },
        { text: "Alta", score: 0.8 },
        { text: "Muy alta", score: 1 },
      ],
    },
    {
      id: "qns_mod_planificacion_2",
      module: "mod_planificacion",
      text: "¿Cuenta su empresa con presupuesto asignado para la transición a IPv6?",
      options: [
        { text: "Sí, definido", score: 1 },
        { text: "Sí, parcialmente definido", score: 0.8 },
        { text: "No", score: 0 },
        { text: "No lo sé", score: 0.5 },
      ],
    },
    {
      id: "qns_mod_planificacion_3",
      module: "mod_planificacion",
      text: "¿En qué nivel ha identificado los sistemas críticos que deben migrarse primero durante la transición?",
      options: [
        { text: "Muy bajo", score: 0 },
        { text: "Bajo", score: 0.3 },
        { text: "Medio", score: 0.6 },
        { text: "Alto", score: 0.8 },
        { text: "Muy alto", score: 1 },
      ],
    } /*
    {
      id: "qns_mod_planificacion_4",
      module: "mod_planificacion",
      text: "¿En qué medida ha considerado cómo la transición afectará a los servicios de correo electrónico y DNS?",
      options: [
        { text: "Nada considerado", score: 0 },
        { text: "Poco considerado", score: 0 },
        { text: "Parcialmente considerado", score: 0 },
        { text: "Bien considerado", score: 0 },
        { text: "Totalmente considerado", score: 0 },
      ],
    },
    {
      id: "qns_mod_planificacion_5",
      module: "mod_planificacion",
      text: "¿Qué nivel de seguridad tiene de que el cronograma y fecha límite definidos para la transición a IPv6 son realistas?",
      options: [
        { text: "Muy bajo", score: 0 },
        { text: "Bajo", score: 0 },
        { text: "Medio", score: 0 },
        { text: "Alto", score: 0 },
        { text: "Muy alto", score: 0 },
      ],
    },
    {
      id: "qns_mod_planificacion_6",
      module: "mod_planificacion",
      text: "¿Qué nivel de planificación existe para la administración y monitoreo continuo de la red IPv6 después de la transición?",
      options: [
        { text: "Muy bajo", score: 0 },
        { text: "Bajo", score: 0 },
        { text: "Medio", score: 0 },
        { text: "Alto", score: 0 },
        { text: "Muy alto", score: 0 },
      ],
    },
    {
      id: "qns_mod_planificacion_7",
      module: "mod_planificacion",
      text: "¿Qué tan integrada está la estrategia de transición a IPv6 con otras iniciativas tecnológicas de la organización?",
      options: [
        { text: "Nada integrada", score: 0 },
        { text: "Poco integrada", score: 0 },
        { text: "Parcialmente integrada", score: 0 },
        { text: "Bien integrada", score: 0 },
        { text: "Totalmente integrada", score: 0 },
      ],
    },
    {
      id: "qns_mod_planificacion_8",
      module: "mod_planificacion",
      text: "¿Qué tan preparado está su plan para mantener y actualizar la infraestructura IPv6 en el futuro?",
      options: [
        { text: "Nada preparado", score: 0 },
        { text: "Poco preparado", score: 0 },
        { text: "Parcialmente preparado", score: 0 },
        { text: "Bien preparado", score: 0 },
        { text: "Totalmente preparado", score: 0 },
      ],
    },
    {
      id: "qns_mod_planificacion_9",
      module: "mod_planificacion",
      text: "¿Cuenta su empresa con recursos para adquirir un pool de direcciones IPv6 (~12 millones)?",
      options: [
        { text: "No están contemplados en esta vigencia", score: 0 },
        { text: "Parcialmente contemplados", score: 0 },
        { text: "En evaluación", score: 0 },
        { text: "Probablemente contemplados", score: 0 },
        { text: "Sí, están contemplados", score: 0 },
      ],
    },
    {
      id: "qns_mod_planificacion_10",
      module: "mod_planificacion",
      text: "¿En qué medida se han documentado y comunicado los cambios relacionados con la implementación de IPv6 en la organización?",
      options: [
        { text: "Nada documentados", score: 0 },
        { text: "Poco documentados", score: 0 },
        { text: "Parcialmente documentados", score: 0 },
        { text: "Bien documentados", score: 0 },
        { text: "Totalmente documentados", score: 0 },
      ],
    },
    {
      id: "qns_mod_planificacion_11",
      module: "mod_planificacion",
      text: "¿Se ha definido un plan para un piloto de 2 semanas (ej. activar IPv6 en la web o en una VLAN de prueba)?",
      options: [
        { text: "Sí, está definido", score: 0 },
        { text: "Está en planes", score: 0 },
        { text: "No", score: 0 },
      ],
    },*/,
    // ---------------- Conectividad Externa y Cumplimiento ----------------
    {
      id: "qns_mod_conectividad_1",
      module: "mod_conectividad",
      text: "¿Su empresa cumple con normativas/ regulaciones aplicables relacionadas con IPv6 (ej. ISO 27001, NIST, GDPR, etc.)?",
      options: [
        { text: "Sí, todas", score: 1 },
        { text: "Sí, parcialmente", score: 0.8 },
        { text: "No", score: 0 },
        { text: "No lo sé", score: 0.5 },
      ],
    },
    {
      id: "qns_mod_conectividad_2",
      module: "mod_conectividad",
      text: "¿Su proveedor de internet (ISP) le ha ofrecido conectividad IPv6 nativa?",
      options: [
        { text: "Sí, ya la usamos", score: 1 },
        { text: "Sí, la ofrecen, pero no la hemos implementado", score: 0.8 },
        { text: "No estoy seguro", score: 0.5 },
        { text: "No la ofrecen", score: 0 },
      ],
    },
    {
      id: "qns_mod_conectividad_3",
      module: "mod_conectividad",
      text: "¿Su organización tiene un Número de Sistema Autónomo (ASN) y utiliza BGP para su conectividad?",
      options: [
        { text: "Sí, y ya anunciamos prefijos IPv6", score: 1 },
        { text: "Sí, pero solo para IPv4", score: 0.5 },
        { text: "No", score: 0 },
      ],
    } /*
    {
      id: "qns_mod_conectividad_4",
      module: "mod_conectividad",
      text: "¿Su dominio web principal tiene registros AAAA en el DNS público?",
      options: [
        { text: "Sí", score: 0 },
        { text: "No", score: 0 },
        { text: "No sé", score: 0 },
      ],
    },
    {
      id: "qns_mod_conectividad_5",
      module: "mod_conectividad",
      text: "¿Ha verificado si su servicio de correo electrónico (MX) está preparado para recibir correos desde redes IPv6?",
      options: [
        { text: "Sí", score: 0 },
        { text: "No", score: 0 },
        { text: "No sé", score: 0 },
      ],
    },*/,
  ];
})(window.App);
