// js/data/questions.js
// Contiene todas las preguntas de la encuesta, clasificadas por módulo.
// Responsable único: datos de preguntas.
// No tiene lógica, solo definición de datos para uso en otros módulos.

window.App = window.App || {};

(function (App) {
  "use strict";

  /**
   * Lista de preguntas de la encuesta
   * @type {Array<{ id: string, module: string, text: string, options: { id: string, text: string, score: number | null }[] }> }
   */

  App.questions = [
    // ---------------- Perfilamiento Inicial ----------------
    {
      id: "qns_mod_perfilamiento_1",
      module: "mod_perfilamiento",
      text: "¿Cuál es el tamaño de la empresa (Por cantidad de Empleados)?",
      options: [
        { id: "opt_perfil_1_a", text: "Micro (1-10)", score: null },
        { id: "opt_perfil_1_b", text: "Pequeña (11-50)", score: null },
        { id: "opt_perfil_1_c", text: "Mediana (51-200)", score: null },
        { id: "opt_perfil_1_d", text: "Grande (>200)", score: null },
      ],
    },
    {
      id: "qns_mod_perfilamiento_2",
      module: "mod_perfilamiento",
      text: "¿Cuál es la cantidad de sedes de la empresa?",
      options: [
        { id: "opt_perfil_2_a", text: "1-2", score: null },
        { id: "opt_perfil_2_b", text: "3-20", score: null },
        { id: "opt_perfil_2_c", text: "21-99", score: null },
        { id: "opt_perfil_2_d", text: ">100", score: null },
      ],
    },
    {
      id: "qns_mod_perfilamiento_3",
      module: "mod_perfilamiento",
      text: "¿Cuál es la cantidad estimada de dispositivos finales (Incluyendo invitados, cámaras de seguridad, Telefonía IP, Servidores, etc...) que se conectan a la red de la empresa?",
      options: [
        { id: "opt_perfil_3_a", text: "1-99", score: null },
        { id: "opt_perfil_3_b", text: "100-999", score: null },
        { id: "opt_perfil_3_c", text: "1000-9999", score: null },
        { id: "opt_perfil_3_d", text: ">10000", score: null },
      ],
    },
    {
      id: "qns_mod_perfilamiento_4",
      module: "mod_perfilamiento",
      text: "¿Cuenta con Infraestructura de TI (Servidores, Bases de Datos, Aplicaciones, Contenedores, etc...) en Cloud?",
      options: [
        { id: "opt_perfil_4_a", text: "Sí", score: null },
        { id: "opt_perfil_4_b", text: "No", score: null },
        { id: "opt_perfil_4_c", text: "Híbrida", score: null },
      ],
    },
    {
      id: "qns_mod_perfilamiento_5",
      module: "mod_perfilamiento",
      text: "¿Cuenta con servicios o aplicaciones expuestos en Internet (VPN, Sitios Web, API, etc...)?",
      options: [
        { id: "opt_perfil_5_a", text: "Sí", score: null },
        { id: "opt_perfil_5_b", text: "No", score: null },
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
        { id: "opt_mod_hardware_2_a", text: "Sí", score: 1 },
        { id: "opt_mod_hardware_2_b", text: "No", score: 0 },
        { id: "opt_mod_hardware_2_c", text: "No lo sé", score: 0.5 },
      ],
    },
    {
      id: "qns_mod_hardware_3",
      module: "mod_hardware",
      text: "¿En qué medida sus proveedores de hardware ofrecen soluciones compatibles con IPv6?",
      options: [
        { id: "opt_mod_hardware_3_a", text: "Muy pocas", score: 0 },
        { id: "opt_mod_hardware_3_b", text: "Escasas", score: 0.3 },
        { id: "opt_mod_hardware_3_c", text: "Moderadas", score: 0.6 },
        { id: "opt_mod_hardware_3_d", text: "Varias", score: 0.8 },
        { id: "opt_mod_hardware_3_e", text: "Muy completas", score: 1 },
      ],
    },
    {
      id: "qns_mod_hardware_4",
      module: "mod_hardware",
      text: "¿Su empresa realiza pruebas de compatibilidad IPv6 antes de comprar nuevos dispositivos?",
      options: [
        { id: "opt_mod_hardware_4_a", text: "Nunca", score: 0 },
        { id: "opt_mod_hardware_4_b", text: "Rara vez", score: 0.3 },
        { id: "opt_mod_hardware_4_c", text: "A veces", score: 0.6 },
        { id: "opt_mod_hardware_4_d", text: "Frecuentemente", score: 0.8 },
        { id: "opt_mod_hardware_4_e", text: "Siempre", score: 1 },
      ],
    },
    {
      id: "qns_mod_hardware_5",
      module: "mod_hardware",
      text: "¿Qué nivel de preparación tienen los Firewall perimetrales de la organización para soportar IPv6?",
      options: [
        { id: "opt_mod_hardware_5_a", text: "Nada preparados", score: 0 },
        { id: "opt_mod_hardware_5_b", text: "Poco preparados", score: 0.3 },
        {
          id: "opt_mod_hardware_5_c",
          text: "Moderadamente preparados",
          score: 0.6,
        },
        { id: "opt_mod_hardware_5_d", text: "Bien preparados", score: 0.8 },
        { id: "opt_mod_hardware_5_e", text: "Muy bien preparados", score: 1 },
      ],
    },
    {
      id: "qns_mod_hardware_6",
      module: "mod_hardware",
      text: "¿Qué nivel de preparación tienen los routers de la organización para soportar IPv6?",
      options: [
        { id: "opt_mod_hardware_6_a", text: "Nada preparados", score: 0 },
        { id: "opt_mod_hardware_6_b", text: "Poco preparados", score: 0.3 },
        {
          id: "opt_mod_hardware_6_c",
          text: "Moderadamente preparados",
          score: 0.6,
        },
        { id: "opt_mod_hardware_6_d", text: "Bien preparados", score: 0.8 },
        { id: "opt_mod_hardware_6_e", text: "Muy bien preparados", score: 1 },
      ],
    },
    {
      id: "qns_mod_hardware_7",
      module: "mod_hardware",
      text: "¿Qué nivel de preparación tienen los switches de la organización para soportar IPv6?",
      options: [
        { id: "opt_mod_hardware_7_a", text: "Nada preparados", score: 0 },
        { id: "opt_mod_hardware_7_b", text: "Poco preparados", score: 0.3 },
        {
          id: "opt_mod_hardware_7_c",
          text: "Moderadamente preparados",
          score: 0.6,
        },
        { id: "opt_mod_hardware_7_d", text: "Bien preparados", score: 0.8 },
        { id: "opt_mod_hardware_7_e", text: "Muy bien preparados", score: 1 },
      ],
    },
    {
      id: "qns_mod_hardware_8",
      module: "mod_hardware",
      text: "¿Qué nivel de preparación tienen los Access Point (Wifi) de la organización para soportar IPv6?",
      options: [
        { id: "opt_mod_hardware_8_a", text: "Nada preparados", score: 0 },
        { id: "opt_mod_hardware_8_b", text: "Poco preparados", score: 0.3 },
        {
          id: "opt_mod_hardware_8_c",
          text: "Moderadamente preparados",
          score: 0.6,
        },
        { id: "opt_mod_hardware_8_d", text: "Bien preparados", score: 0.8 },
        { id: "opt_mod_hardware_8_e", text: "Muy bien preparados", score: 1 },
      ],
    },
    {
      id: "qns_mod_hardware_9",
      module: "mod_hardware",
      text: "¿Cuenta su empresa con dispositivos IoT (cámaras de vigilancia, Teléfonos IP, Impresoras, Sensores, etc) conectados a la red?",
      options: [
        { id: "opt_mod_hardware_9_a", text: "Sí", score: 1 },
        { id: "opt_mod_hardware_9_b", text: "No", score: 0 },
      ],
    },
    {
      id: "qns_mod_hardware_10",
      module: "mod_hardware",
      text: "¿Qué nivel de preparación tienen los dispositivos IoT de la organización para soportar IPv6?",
      options: [
        { id: "opt_mod_hardware_10_a", text: "Nada preparados", score: 0 },
        { id: "opt_mod_hardware_10_b", text: "Poco preparados", score: 0.3 },
        {
          id: "opt_mod_hardware_10_c",
          text: "Moderadamente preparados",
          score: 0.6,
        },
        { id: "opt_mod_hardware_10_d", text: "Bien preparados", score: 0.8 },
        { id: "opt_mod_hardware_10_e", text: "Muy bien preparados", score: 1 },
      ],
    },
    {
      id: "qns_mod_hardware_11",
      module: "mod_hardware",
      text: "¿Qué medidas de contingencia tiene su empresa frente a dispositivos incompatibles con IPv6?",
      options: [
        { id: "opt_mod_hardware_11_a", text: "Ninguna", score: 0 },
        { id: "opt_mod_hardware_11_b", text: "Pocas", score: 0.3 },
        { id: "opt_mod_hardware_11_c", text: "Moderadas", score: 0.6 },
        { id: "opt_mod_hardware_11_d", text: "Varias", score: 0.8 },
        {
          id: "opt_mod_hardware_11_e",
          text: "Completas y planificadas",
          score: 1,
        },
      ],
    },
    {
      id: "qns_mod_hardware_12",
      module: "mod_hardware",
      text: "¿Qué porcentaje aproximado de su hardware considera que deberá ser reemplazado para soportar IPv6?",
      options: [
        { id: "opt_mod_hardware_12_a", text: "Ninguno", score: 0 },
        { id: "opt_mod_hardware_12_b", text: "Menos del 25%", score: 0.3 },
        { id: "opt_mod_hardware_12_c", text: "Del 25% al 50%", score: 0.6 },
        { id: "opt_mod_hardware_12_d", text: "Del 50% al 75%", score: 0.8 },
        { id: "opt_mod_hardware_12_e", text: "Más del 75%", score: 1 },
      ],
    },
    {
      id: "qns_mod_hardware_13",
      module: "mod_hardware",
      text: "¿Qué nivel de soporte técnico interno tiene su empresa para la transición de hardware hacia IPv6?",
      options: [
        { id: "opt_mod_hardware_13_a", text: "Nulo", score: 0 },
        { id: "opt_mod_hardware_13_b", text: "Bajo", score: 0.3 },
        { id: "opt_mod_hardware_13_c", text: "Moderado", score: 0.6 },
        { id: "opt_mod_hardware_13_d", text: "Alto", score: 0.8 },
        { id: "opt_mod_hardware_13_e", text: "Muy alto", score: 1 },
      ],
    },
    // ---------------- Software y Sistemas ----------------
    {
      id: "qns_mod_software_1",
      module: "mod_software",
      text: "¿Tiene su organización servicios expuestos a Internet que gestiona o contrata (por ejemplo: DNS, servidor de correo, sitio web, APIs)?",
      options: [
        { id: "opt_mod_software_1_a", text: "Sí", score: 1 },
        { id: "opt_mod_software_1_b", text: "No", score: 0 },
      ],
    },
    {
      id: "qns_mod_software_2",
      module: "mod_software",
      text: "¿Dispone su organización de procesos regulares de respaldo (backups) y procedimientos de restauración documentados?",
      options: [
        { id: "opt_mod_software_2_a", text: "Sí", score: 1 },
        { id: "opt_mod_software_2_b", text: "No", score: 0 },
      ],
    },
    {
      id: "qns_mod_software_3",
      module: "mod_software",
      text: "¿Cuenta su organización con personal de TI o un proveedor IT responsable de la infraestructura (interno o contratado)?",
      options: [
        { id: "opt_mod_software_3_a", text: "Sí", score: 1 },
        { id: "opt_mod_software_3_b", text: "No", score: 0 },
      ],
    },
    {
      id: "qns_mod_software_4",
      module: "mod_software",
      text: "¿Está al tanto de la compatibilidad de los sistemas operativos para las estaciones de trabajo de los usuarios en su empresa con IPv6?",
      options: [
        { id: "opt_mod_software_4_a", text: "Sí", score: 1 },
        { id: "opt_mod_software_4_b", text: "No", score: 0 },
        { id: "opt_mod_software_4_c", text: "No lo sé", score: 0.5 },
      ],
    },
    {
      id: "qns_mod_software_5",
      module: "mod_software",
      text: "¿Su empresa utiliza máquinas virtuales en su infraestructura?",
      options: [
        { id: "opt_mod_software_5_a", text: "Sí", score: 1 },
        { id: "opt_mod_software_5_b", text: "No", score: 0 },
        { id: "opt_mod_software_5_c", text: "No lo sé", score: 0.5 },
      ],
    },
    {
      id: "qns_mod_software_6",
      module: "mod_software",
      text: "¿La versión actual de los sistemas operativos de los servidores soporta IPv6?",
      options: [
        { id: "opt_mod_software_6_a", text: "Nada compatible", score: 0 },
        { id: "opt_mod_software_6_b", text: "Poco compatible", score: 0.3 },
        {
          id: "opt_mod_software_6_c",
          text: "Medianamente compatible",
          score: 0.6,
        },
        { id: "opt_mod_software_6_d", text: "Compatible", score: 0.8 },
        { id: "opt_mod_software_6_e", text: "Totalmente compatible", score: 1 },
      ],
    },
    {
      id: "qns_mod_software_7",
      module: "mod_software",
      text: "¿Cuál considera que es el nivel de avance en la implementación de IPv6 en el entorno de software de su organización?",
      options: [
        { id: "opt_mod_software_7_a", text: "Muy bajo", score: 0 },
        { id: "opt_mod_software_7_b", text: "Bajo", score: 0.3 },
        { id: "opt_mod_software_7_c", text: "Medio", score: 0.6 },
        { id: "opt_mod_software_7_d", text: "Alto", score: 0.8 },
        { id: "opt_mod_software_7_e", text: "Muy alto", score: 1 },
      ],
    },
    {
      id: "qns_mod_software_8",
      module: "mod_software",
      text: "¿Qué tan preparada está el área de TI para documentar los aplicativos propios con el fin de afrontar la transición a IPv6?",
      options: [
        {
          id: "opt_mod_software_8_a",
          text: "No tenemos aplicativos propios",
          score: 0,
        },
        { id: "opt_mod_software_8_b", text: "Nada preparada", score: 0.2 },
        { id: "opt_mod_software_8_c", text: "Poco preparada", score: 0.4 },
        {
          id: "opt_mod_software_8_d",
          text: "Medianamente preparada",
          score: 0.6,
        },
        { id: "opt_mod_software_8_e", text: "Bien preparada", score: 0.8 },
        { id: "opt_mod_software_8_f", text: "Muy bien preparada", score: 1 },
      ],
    },
    {
      id: "qns_mod_software_9",
      module: "mod_software",
      text: "¿Cómo calificaría la compatibilidad de los sistemas de correo electrónico y FTP frente a la coexistencia IPv4/IPv6?",
      options: [
        { id: "opt_mod_software_9_a", text: "Muy baja", score: 0 },
        { id: "opt_mod_software_9_b", text: "Baja", score: 0.3 },
        { id: "opt_mod_software_9_c", text: "Media", score: 0.6 },
        { id: "opt_mod_software_9_d", text: "Alta", score: 0.8 },
        { id: "opt_mod_software_9_e", text: "Muy alta", score: 1 },
      ],
    },
    {
      id: "qns_mod_software_10",
      module: "mod_software",
      text: "¿Qué tan preparados están los repositorios que alojan servicios FTP y Web frente a una transición a IPv6?",
      options: [
        { id: "opt_mod_software_10_a", text: "Nada preparados", score: 0 },
        { id: "opt_mod_software_10_b", text: "Poco preparados", score: 0.3 },
        {
          id: "opt_mod_software_10_c",
          text: "Medianamente preparados",
          score: 0.6,
        },
        { id: "opt_mod_software_10_d", text: "Bien preparados", score: 0.8 },
        { id: "opt_mod_software_10_e", text: "Muy bien preparados", score: 1 },
      ],
    },
    {
      id: "qns_mod_software_11",
      module: "mod_software",
      text: "¿Qué nivel de ajustes se ha realizado en el file server para garantizar su funcionamiento en IPv6?",
      options: [
        { id: "opt_mod_software_11_a", text: "Muy bajo", score: 0 },
        { id: "opt_mod_software_11_b", text: "Bajo", score: 0.3 },
        { id: "opt_mod_software_11_c", text: "Medio", score: 0.6 },
        { id: "opt_mod_software_11_d", text: "Alto", score: 0.8 },
        { id: "opt_mod_software_11_e", text: "Muy alto", score: 1 },
      ],
    },
    // ---------------- Nube y Proveedores Externos ----------------
    {
      id: "qns_mod_nube_1",
      module: "mod_nube",
      text: "¿En qué medida los servicios de la organización se encuentran alojados en entornos cloud?",
      options: [
        { id: "opt_mod_nube_1_a", text: "Muy bajo", score: 0 },
        { id: "opt_mod_nube_1_b", text: "Bajo", score: 0.3 },
        { id: "opt_mod_nube_1_c", text: "Medio", score: 0.6 },
        { id: "opt_mod_nube_1_d", text: "Alto", score: 0.8 },
        { id: "opt_mod_nube_1_e", text: "Muy alto", score: 1 },
      ],
    },
    {
      id: "qns_mod_nube_2",
      module: "mod_nube",
      text: "¿Qué nivel de conocimiento tiene la organización sobre los planes de su proveedor cloud respecto a IPv6?",
      options: [
        { id: "opt_mod_nube_2_a", text: "Ninguno", score: 0 },
        { id: "opt_mod_nube_2_b", text: "Bajo", score: 0.3 },
        { id: "opt_mod_nube_2_c", text: "Medio", score: 0.6 },
        { id: "opt_mod_nube_2_d", text: "Alto", score: 0.8 },
        { id: "opt_mod_nube_2_e", text: "Muy alto", score: 1 },
      ],
    },
    {
      id: "qns_mod_nube_3",
      module: "mod_nube",
      text: "¿En qué medida ha evaluado la compatibilidad de sus proveedores de servicios externos con IPv6?",
      options: [
        { id: "opt_mod_nube_3_a", text: "Nada evaluada", score: 0 },
        { id: "opt_mod_nube_3_b", text: "Poco evaluada", score: 0.3 },
        { id: "opt_mod_nube_3_c", text: "Parcialmente evaluada", score: 0.6 },
        { id: "opt_mod_nube_3_d", text: "Bien evaluada", score: 0.8 },
        { id: "opt_mod_nube_3_e", text: "Totalmente evaluada", score: 1 },
      ],
    },
    {
      id: "qns_mod_nube_4",
      module: "mod_nube",
      text: "En su proveedor de nube, ¿los balanceadores de carga o gateways de API tienen la opción de IPv6 habilitada?",
      options: [
        { id: "opt_mod_nube_4_a", text: "Sí, está activo", score: 1 },
        {
          id: "opt_mod_nube_4_b",
          text: "Está disponible pero no activo",
          score: 0.7,
        },
        { id: "opt_mod_nube_4_c", text: "No está disponible", score: 0 },
        { id: "opt_mod_nube_4_d", text: "No sé", score: 0.5 },
      ],
    },
    {
      id: "qns_mod_nube_5",
      module: "mod_nube",
      text: "En su proveedor de nube, ¿Las redes virtuales (VPC/VNet) donde residen sus aplicaciones tienen rangos de direcciones IPv6 asignados?",
      options: [
        { id: "opt_mod_nube_5_a", text: "Sí", score: 1 },
        { id: "opt_mod_nube_5_b", text: "No", score: 0 },
        { id: "opt_mod_nube_5_c", text: "No sé", score: 0.5 },
      ],
    },
    // ---------------- Personal y Capacitación ----------------
    {
      id: "qns_mod_personal_1",
      module: "mod_personal",
      text: "¿Cuál es el nivel de experiencia y capacitación del personal de TI en la gestión de tecnologías IPv6?",
      options: [
        { id: "opt_mod_personal_1_a", text: "Muy bajo", score: 0 },
        { id: "opt_mod_personal_1_b", text: "Bajo", score: 0.3 },
        { id: "opt_mod_personal_1_c", text: "Medio", score: 0.6 },
        { id: "opt_mod_personal_1_d", text: "Alto", score: 0.8 },
        { id: "opt_mod_personal_1_e", text: "Muy alto", score: 1 },
      ],
    },
    {
      id: "qns_mod_personal_2",
      module: "mod_personal",
      text: "¿El área de TI conoce los aspectos técnicos (protocolos, estándares, mantenimiento, etc.) involucrados en IPv6?",
      options: [
        { id: "opt_mod_personal_2_a", text: "Muy bajo nivel", score: 0 },
        { id: "opt_mod_personal_2_b", text: "Bajo nivel", score: 0.3 },
        { id: "opt_mod_personal_2_c", text: "Nivel intermedio", score: 0.6 },
        { id: "opt_mod_personal_2_d", text: "Buen nivel", score: 0.8 },
        { id: "opt_mod_personal_2_e", text: "Nivel experto", score: 1 },
      ],
    },
    {
      id: "qns_mod_personal_3",
      module: "mod_personal",
      text: "¿Qué tan esencial considera la inversión en programas de capacitación en IPv6 para el crecimiento de la empresa?",
      options: [
        { id: "opt_mod_personal_3_a", text: "Nada esencial", score: 0 },
        { id: "opt_mod_personal_3_b", text: "Poco esencial", score: 0.3 },
        {
          id: "opt_mod_personal_3_c",
          text: "Medianamente esencial",
          score: 0.6,
        },
        { id: "opt_mod_personal_3_d", text: "Muy esencial", score: 0.8 },
        { id: "opt_mod_personal_3_e", text: "Totalmente esencial", score: 1 },
      ],
    },
    {
      id: "qns_mod_personal_4",
      module: "mod_personal",
      text: "¿El área de TI sabe identificar cuál de las siguientes NO es una técnica común de transición de IPv4 a IPv6?",
      options: [
        { id: "opt_mod_personal_4_a", text: "Dual Stack", score: 0 },
        { id: "opt_mod_personal_4_b", text: "Tunneling", score: 0 },
        { id: "opt_mod_personal_4_c", text: "NAT64", score: 0 },
        { id: "opt_mod_personal_4_d", text: "DHCP", score: 1 },
      ],
    },
    {
      id: "qns_mod_personal_5",
      module: "mod_personal",
      text: "¿Hay una persona o equipo formalmente responsable de liderar la iniciativa de IPv6?",
      options: [
        { id: "opt_mod_personal_5_a", text: "Sí", score: 1 },
        { id: "opt_mod_personal_5_b", text: "No", score: 0 },
      ],
    },
    {
      id: "qns_mod_personal_6",
      module: "mod_personal",
      text: "¿El equipo técnico ha recibido al menos una capacitación básica sobre los fundamentos de IPv6?",
      options: [
        { id: "opt_mod_personal_6_a", text: "Sí", score: 1 },
        { id: "opt_mod_personal_6_b", text: "No", score: 0 },
      ],
    },
    // ---------------- Seguridad y Riesgos ----------------
    {
      id: "qns_mod_seguridad_1",
      module: "mod_seguridad",
      text: "¿Qué nivel de conciencia existe en su empresa sobre los riesgos de seguridad asociados a IPv6?",
      options: [
        { id: "opt_mod_seguridad_1_a", text: "Muy bajo", score: 0 },
        { id: "opt_mod_seguridad_1_b", text: "Bajo", score: 0.3 },
        { id: "opt_mod_seguridad_1_c", text: "Medio", score: 0.6 },
        { id: "opt_mod_seguridad_1_d", text: "Alto", score: 0.8 },
        { id: "opt_mod_seguridad_1_e", text: "Muy alto", score: 1 },
      ],
    },
    {
      id: "qns_mod_seguridad_2",
      module: "mod_seguridad",
      text: "¿Cómo evaluaría la planificación y actualización de reglas de firewall para IPv4/IPv6?",
      options: [
        { id: "opt_mod_seguridad_2_a", text: "Muy baja", score: 0 },
        { id: "opt_mod_seguridad_2_b", text: "Baja", score: 0.3 },
        { id: "opt_mod_seguridad_2_c", text: "Media", score: 0.6 },
        { id: "opt_mod_seguridad_2_d", text: "Alta", score: 0.8 },
        { id: "opt_mod_seguridad_2_e", text: "Muy alta", score: 1 },
      ],
    },
    {
      id: "qns_mod_seguridad_3",
      module: "mod_seguridad",
      text: "¿En qué medida cree que podrían surgir vulnerabilidades en los sistemas de seguridad durante la transición a IPv6?",
      options: [
        { id: "opt_mod_seguridad_3_a", text: "Muy baja", score: 0 },
        { id: "opt_mod_seguridad_3_b", text: "Baja", score: 0.3 },
        { id: "opt_mod_seguridad_3_c", text: "Media", score: 0.6 },
        { id: "opt_mod_seguridad_3_d", text: "Alta", score: 0.8 },
        { id: "opt_mod_seguridad_3_e", text: "Muy alta", score: 1 },
      ],
    },
    {
      id: "qns_mod_seguridad_4",
      module: "mod_seguridad",
      text: "¿Qué nivel de monitoreo en tiempo real tiene su organización para detectar incidentes de seguridad en IPv6?",
      options: [
        { id: "opt_mod_seguridad_4_a", text: "Nulo", score: 0 },
        { id: "opt_mod_seguridad_4_b", text: "Bajo", score: 0.3 },
        { id: "opt_mod_seguridad_4_c", text: "Medio", score: 0.6 },
        { id: "opt_mod_seguridad_4_d", text: "Alto", score: 0.8 },
        { id: "opt_mod_seguridad_4_e", text: "Muy alto", score: 1 },
      ],
    },
    {
      id: "qns_mod_seguridad_5",
      module: "mod_seguridad",
      text: "¿Qué tan preparado está el equipo de TI para responder a incidentes de seguridad específicos de IPv6 (ej. RA spoofing, ND poisoning)?",
      options: [
        { id: "opt_mod_seguridad_5_a", text: "Nada preparado", score: 0 },
        { id: "opt_mod_seguridad_5_b", text: "Poco preparado", score: 0.3 },
        {
          id: "opt_mod_seguridad_5_c",
          text: "Medianamente preparado",
          score: 0.6,
        },
        { id: "opt_mod_seguridad_5_d", text: "Bien preparado", score: 0.8 },
        { id: "opt_mod_seguridad_5_e", text: "Muy preparado", score: 1 },
      ],
    },
    {
      id: "qns_mod_seguridad_6",
      module: "mod_seguridad",
      text: "¿Qué nivel de definición tiene el plan de contingencia en caso de interrupciones inesperadas durante la transición?",
      options: [
        { id: "opt_mod_seguridad_6_a", text: "Nada definido", score: 0 },
        { id: "opt_mod_seguridad_6_b", text: "Poco definido", score: 0.3 },
        {
          id: "opt_mod_seguridad_6_c",
          text: "Parcialmente definido",
          score: 0.6,
        },
        { id: "opt_mod_seguridad_6_d", text: "Bien definido", score: 0.8 },
        { id: "opt_mod_seguridad_6_e", text: "Totalmente definido", score: 1 },
      ],
    },
    {
      id: "qns_mod_seguridad_7",
      module: "mod_seguridad",
      text: "¿Cómo calificaría la planificación y ejecución de simulacros de contingencia frente a posibles problemas en la transición a IPv6?",
      options: [
        { id: "opt_mod_seguridad_7_a", text: "Muy baja", score: 0 },
        { id: "opt_mod_seguridad_7_b", text: "Baja", score: 0.3 },
        { id: "opt_mod_seguridad_7_c", text: "Media", score: 0.6 },
        { id: "opt_mod_seguridad_7_d", text: "Alta", score: 0.8 },
        { id: "opt_mod_seguridad_7_e", text: "Muy alta", score: 1 },
      ],
    },
    {
      id: "qns_mod_seguridad_8",
      module: "mod_seguridad",
      text: "¿Cómo calificaría la capacidad de su organización para gestionar direcciones y seguridad en IPv6?",
      options: [
        { id: "opt_mod_seguridad_8_a", text: "Muy mala", score: 0 },
        { id: "opt_mod_seguridad_8_b", text: "Mala", score: 0.3 },
        { id: "opt_mod_seguridad_8_c", text: "Regular", score: 0.6 },
        { id: "opt_mod_seguridad_8_d", text: "Buena", score: 0.8 },
        { id: "opt_mod_seguridad_8_e", text: "Muy buena", score: 1 },
      ],
    },
    {
      id: "qns_mod_seguridad_9",
      module: "mod_seguridad",
      text: "¿Tiene un firewall propio o solo el módem del ISP?",
      options: [
        {
          id: "opt_mod_seguridad_9_a",
          text: "Solo el módem del ISP",
          score: 0,
        },
        {
          id: "opt_mod_seguridad_9_b",
          text: "Sí, gestionado internamente",
          score: 1,
        },
        {
          id: "opt_mod_seguridad_9_c",
          text: "Sí, gestionado por un tercero",
          score: 1,
        },
      ],
    },
    {
      id: "qns_mod_seguridad_10",
      module: "mod_seguridad",
      text: "Si tiene un firewall propio, ¿existen políticas de seguridad para IPv6 que sean equivalentes a las de IPv4?",
      options: [
        {
          id: "opt_mod_seguridad_10_a",
          text: "Sí, son equivalentes",
          score: 1,
        },
        { id: "opt_mod_seguridad_10_b", text: "Parcialmente", score: 0.7 },
        { id: "opt_mod_seguridad_10_c", text: "No existen", score: 0 },
        { id: "opt_mod_seguridad_10_d", text: "No sé", score: 0.5 },
      ],
    },
    {
      id: "qns_mod_seguridad_11",
      module: "mod_seguridad",
      text: "¿Su política de firewall permite el paso de mensajes ICMPv6 esenciales (como Packet Too Big y Neighbor Discovery)?",
      options: [
        { id: "opt_mod_seguridad_11_a", text: "Sí", score: 1 },
        { id: "opt_mod_seguridad_11_b", text: "No", score: 0 },
        { id: "opt_mod_seguridad_11_c", text: "No sé", score: 0.5 },
      ],
    },
    // ---------------- Planificación, Recursos y Estrategia ----------------
    {
      id: "qns_mod_planificacion_1",
      module: "mod_planificacion",
      text: "¿Qué nivel de inversión financiera está dispuesta su empresa a realizar para la implementación de IPv6 (equipos y capacitación)?",
      options: [
        { id: "opt_mod_planificacion_1_a", text: "Mínima", score: 0 },
        { id: "opt_mod_planificacion_1_b", text: "Baja", score: 0.3 },
        { id: "opt_mod_planificacion_1_c", text: "Media", score: 0.6 },
        { id: "opt_mod_planificacion_1_d", text: "Alta", score: 0.8 },
        { id: "opt_mod_planificacion_1_e", text: "Muy alta", score: 1 },
      ],
    },
    {
      id: "qns_mod_planificacion_2",
      module: "mod_planificacion",
      text: "¿Cuenta su empresa con presupuesto asignado para la transición a IPv6?",
      options: [
        { id: "opt_mod_planificacion_2_a", text: "Sí, definido", score: 1 },
        {
          id: "opt_mod_planificacion_2_b",
          text: "Sí, parcialmente definido",
          score: 0.7,
        },
        { id: "opt_mod_planificacion_2_c", text: "No", score: 0 },
        { id: "opt_mod_planificacion_2_d", text: "No lo sé", score: 0.5 },
      ],
    },
    {
      id: "qns_mod_planificacion_3",
      module: "mod_planificacion",
      text: "¿En qué nivel ha identificado los sistemas críticos que deben migrarse primero durante la transición?",
      options: [
        { id: "opt_mod_planificacion_3_a", text: "Muy bajo", score: 0 },
        { id: "opt_mod_planificacion_3_b", text: "Bajo", score: 0.3 },
        { id: "opt_mod_planificacion_3_c", text: "Medio", score: 0.6 },
        { id: "opt_mod_planificacion_3_d", text: "Alto", score: 0.8 },
        { id: "opt_mod_planificacion_3_e", text: "Muy alto", score: 1 },
      ],
    },
    {
      id: "qns_mod_planificacion_4",
      module: "mod_planificacion",
      text: "¿En qué medida ha considerado cómo la transición afectará a los servicios de correo electrónico y DNS?",
      options: [
        { id: "opt_mod_planificacion_4_a", text: "Nada considerado", score: 0 },
        {
          id: "opt_mod_planificacion_4_b",
          text: "Poco considerado",
          score: 0.3,
        },
        {
          id: "opt_mod_planificacion_4_c",
          text: "Parcialmente considerado",
          score: 0.6,
        },
        {
          id: "opt_mod_planificacion_4_d",
          text: "Bien considerado",
          score: 0.8,
        },
        {
          id: "opt_mod_planificacion_4_e",
          text: "Totalmente considerado",
          score: 1,
        },
      ],
    },
    {
      id: "qns_mod_planificacion_5",
      module: "mod_planificacion",
      text: "¿Qué nivel de seguridad tiene de que el cronograma y fecha límite definidos para la transición a IPv6 son realistas?",
      options: [
        { id: "opt_mod_planificacion_5_a", text: "Muy bajo", score: 0 },
        { id: "opt_mod_planificacion_5_b", text: "Bajo", score: 0.3 },
        { id: "opt_mod_planificacion_5_c", text: "Medio", score: 0.6 },
        { id: "opt_mod_planificacion_5_d", text: "Alto", score: 0.8 },
        { id: "opt_mod_planificacion_5_e", text: "Muy alto", score: 1 },
      ],
    },
    {
      id: "qns_mod_planificacion_6",
      module: "mod_planificacion",
      text: "¿Qué nivel de planificación existe para la administración y monitoreo continuo de la red IPv6 después de la transición?",
      options: [
        { id: "opt_mod_planificacion_6_a", text: "Muy bajo", score: 0 },
        { id: "opt_mod_planificacion_6_b", text: "Bajo", score: 0.3 },
        { id: "opt_mod_planificacion_6_c", text: "Medio", score: 0.6 },
        { id: "opt_mod_planificacion_6_d", text: "Alto", score: 0.8 },
        { id: "opt_mod_planificacion_6_e", text: "Muy alto", score: 1 },
      ],
    },
    {
      id: "qns_mod_planificacion_7",
      module: "mod_planificacion",
      text: "¿Qué tan integrada está la estrategia de transición a IPv6 con otras iniciativas tecnológicas de la organización?",
      options: [
        { id: "opt_mod_planificacion_7_a", text: "Nada integrada", score: 0 },
        { id: "opt_mod_planificacion_7_b", text: "Poco integrada", score: 0.3 },
        {
          id: "opt_mod_planificacion_7_c",
          text: "Parcialmente integrada",
          score: 0.6,
        },
        { id: "opt_mod_planificacion_7_d", text: "Bien integrada", score: 0.8 },
        {
          id: "opt_mod_planificacion_7_e",
          text: "Totalmente integrada",
          score: 1,
        },
      ],
    },
    {
      id: "qns_mod_planificacion_8",
      module: "mod_planificacion",
      text: "¿Qué tan preparado está su plan para mantener y actualizar la infraestructura IPv6 en el futuro?",
      options: [
        { id: "opt_mod_planificacion_8_a", text: "Nada preparado", score: 0 },
        { id: "opt_mod_planificacion_8_b", text: "Poco preparado", score: 0.3 },
        {
          id: "opt_mod_planificacion_8_c",
          text: "Parcialmente preparado",
          score: 0.6,
        },
        { id: "opt_mod_planificacion_8_d", text: "Bien preparado", score: 0.8 },
        {
          id: "opt_mod_planificacion_8_e",
          text: "Totalmente preparado",
          score: 1,
        },
      ],
    },
    {
      id: "qns_mod_planificacion_9",
      module: "mod_planificacion",
      text: "¿Cuenta su empresa con recursos para adquirir un pool de direcciones IPv6 (~12 millones)?",
      options: [
        {
          id: "opt_mod_planificacion_9_a",
          text: "No están contemplados en esta vigencia",
          score: 0,
        },
        {
          id: "opt_mod_planificacion_9_b",
          text: "Parcialmente contemplados",
          score: 0.8,
        },
        { id: "opt_mod_planificacion_9_c", text: "En evaluación", score: 0.5 },
        {
          id: "opt_mod_planificacion_9_d",
          text: "Probablemente contemplados",
          score: 0.6,
        },
        {
          id: "opt_mod_planificacion_9_e",
          text: "Sí, están contemplados",
          score: 1,
        },
      ],
    },
    {
      id: "qns_mod_planificacion_10",
      module: "mod_planificacion",
      text: "¿En qué medida se han documentado y comunicado los cambios relacionados con la implementación de IPv6 en la organización?",
      options: [
        {
          id: "opt_mod_planificacion_10_a",
          text: "Nada documentados",
          score: 0,
        },
        {
          id: "opt_mod_planificacion_10_b",
          text: "Poco documentados",
          score: 0.3,
        },
        {
          id: "opt_mod_planificacion_10_c",
          text: "Parcialmente documentados",
          score: 0.6,
        },
        {
          id: "opt_mod_planificacion_10_d",
          text: "Bien documentados",
          score: 0.8,
        },
        {
          id: "opt_mod_planificacion_10_e",
          text: "Totalmente documentados",
          score: 1,
        },
      ],
    },
    {
      id: "qns_mod_planificacion_11",
      module: "mod_planificacion",
      text: "¿Se ha definido un plan para un piloto de 2 semanas (ej. activar IPv6 en la web o en una VLAN de prueba)?",
      options: [
        {
          id: "opt_mod_planificacion_11_a",
          text: "Sí, está definido",
          score: 1,
        },
        {
          id: "opt_mod_planificacion_11_b",
          text: "Está en planes",
          score: 0.5,
        },
        { id: "opt_mod_planificacion_11_c", text: "No", score: 0 },
      ],
    },
    // ---------------- Conectividad Externa y Cumplimiento ----------------
    {
      id: "qns_mod_conectividad_1",
      module: "mod_conectividad",
      text: "¿Su empresa cumple con normativas/ regulaciones aplicables relacionadas con IPv6 (ej. ISO 27001, NIST, GDPR, etc.)?",
      options: [
        { id: "opt_mod_conectividad_1_a", text: "Sí, todas", score: 1 },
        {
          id: "opt_mod_conectividad_1_b",
          text: "Sí, parcialmente",
          score: 0.7,
        },
        { id: "opt_mod_conectividad_1_c", text: "No", score: 0 },
        { id: "opt_mod_conectividad_1_d", text: "No lo sé", score: 0.5 },
      ],
    },
    {
      id: "qns_mod_conectividad_2",
      module: "mod_conectividad",
      text: "¿Su proveedor de internet (ISP) le ha ofrecido conectividad IPv6 nativa?",
      options: [
        { id: "opt_mod_conectividad_2_a", text: "Sí, ya la usamos", score: 1 },
        {
          id: "opt_mod_conectividad_2_b",
          text: "Sí, la ofrecen, pero no la hemos implementado",
          score: 0.8,
        },
        { id: "opt_mod_conectividad_2_c", text: "No estoy seguro", score: 0.5 },
        { id: "opt_mod_conectividad_2_d", text: "No la ofrecen", score: 0 },
      ],
    },
    {
      id: "qns_mod_conectividad_3",
      module: "mod_conectividad",
      text: "¿Su organización tiene un Número de Sistema Autónomo (ASN) y utiliza BGP para su conectividad?",
      options: [
        {
          id: "opt_mod_conectividad_3_a",
          text: "Sí, y ya anunciamos prefijos IPv6",
          score: 1,
        },
        {
          id: "opt_mod_conectividad_3_b",
          text: "Sí, pero solo para IPv4",
          score: 0.5,
        },
        { id: "opt_mod_conectividad_3_c", text: "No", score: 0 },
      ],
    },
    {
      id: "qns_mod_conectividad_4",
      module: "mod_conectividad",
      text: "¿Su dominio web principal tiene registros AAAA en el DNS público?",
      options: [
        { id: "opt_mod_conectividad_4_a", text: "Sí", score: 1 },
        { id: "opt_mod_conectividad_4_b", text: "No", score: 0 },
        { id: "opt_mod_conectividad_4_c", text: "No sé", score: 0.5 },
      ],
    },
    {
      id: "qns_mod_conectividad_5",
      module: "mod_conectividad",
      text: "¿Ha verificado si su servicio de correo electrónico (MX) está preparado para recibir correos desde redes IPv6?",
      options: [
        { id: "opt_mod_conectividad_5_a", text: "Sí", score: 1 },
        { id: "opt_mod_conectividad_5_b", text: "No", score: 0 },
        { id: "opt_mod_conectividad_5_c", text: "No sé", score: 0.5 },
      ],
    },
  ];
})(window.App);
