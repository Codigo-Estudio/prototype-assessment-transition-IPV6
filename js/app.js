/* js/app.js
   Versión: Dashboard + módulo-por-módulo (usa la base que subiste).
   - Mostrar Dashboard tras el modal de bienvenida.
   - Tarjetas por módulo con % calculado por preguntas respondidas (no se cuentan saltadas).
   - Abrir módulo en "chat modal" mostrando solo preguntas pendientes.
   - Al finalizar módulo volver al dashboard; si quedaron pendientes, % reflejará.
   - Exportar PDF desde Dashboard (habilitado solo cuando todos los módulos = 100%).
   - Persistencia en localStorage (Base64) sin cambios en formato.
*/

/* ---------------------------
   Helpers: Base64 + almacenamiento
   --------------------------- */
function saveStateToStorage(stateObj) {
  try {
    const str = JSON.stringify(stateObj);
    localStorage.setItem("surveyState", btoa(str));
  } catch (e) {
    console.error("Error guardando en localStorage", e);
  }
}
function loadStateFromStorage() {
  try {
    const raw = localStorage.getItem("surveyState");
    if (!raw) return null;
    return JSON.parse(atob(raw));
  } catch (e) {
    console.warn("No hay estado previo o error al leerlo", e);
    return null;
  }
}

/* ---------------------------
   ChatBot simple y Observer (reutilizados)
   --------------------------- */
class ChatBot {
  constructor(name) {
    this.name = name;
    this.chatBox = document.getElementById("chatBox");
  }
  static getInstance(name = "AndrésBot") {
    if (!ChatBot.instance) ChatBot.instance = new ChatBot(name);
    return ChatBot.instance;
  }
  sendBotMessage(text) {
    if (!this.chatBox) return;
    const msg = document.createElement("div");
    msg.classList.add("chat-message", "bot");
    msg.innerHTML = `<div class="bubble"><strong>${this.name}:</strong> ${text}</div>`;
    this.chatBox.appendChild(msg);
    this.chatBox.scrollTop = this.chatBox.scrollHeight;
  }
  sendUserMessage(text) {
    if (!this.chatBox) return;
    const msg = document.createElement("div");
    msg.classList.add("chat-message", "user");
    msg.innerHTML = `<div class="bubble">${text}</div>`;
    this.chatBox.appendChild(msg);
    this.chatBox.scrollTop = this.chatBox.scrollHeight;
  }
}
class Observer {
  constructor() {
    this.events = {};
  }
  subscribe(name, fn) {
    this.events[name] = this.events[name] || [];
    this.events[name].push(fn);
  }
  emit(name, data) {
    (this.events[name] || []).forEach((fn) => fn(data));
  }
}

/* ---------------------------
   DOM referencias (coinciden con index.html)
   --------------------------- */
const startModal = document.getElementById("startModal");
const startBtn = document.getElementById("startBtn");
const companyInput = document.getElementById("companyName");
const emailInput = document.getElementById("email");
const acceptCheckbox = document.getElementById("accept");

const dashboard = document.getElementById("dashboard");
const cardsGrid = document.getElementById("cardsGrid");
const exportPdfDashboardBtn = document.getElementById("exportPdfDashboardBtn");

const chatContainer = document.getElementById("chatContainer");
const skipBtn = document.getElementById("skipBtn");
const exportPdfBtn = document.getElementById("exportPdfBtn");
const progressBar = document.getElementById("progressBar");
const optionsContainer = document.getElementById("optionsContainer");
const chatBox = document.getElementById("chatBox");

const moduleInfo = document.getElementById("moduleInfo"); // contenedor (div)
const moduleLabel = document.getElementById("moduleLabel"); // span para título del módulo
const remainingLabel = document.getElementById("remainingLabel"); // span para preguntas restantes

const resultContainer = document.getElementById("resultContainer");

/* ---------------------------
   Módulos (usa exactamente los datos que subiste)
   --------------------------- */
const modules = [
  {
    id: "perfil",
    title: "Perfil de la organización",
    questions: [
      {
        text: "¿Tu empresa está al tanto del agotamiento de IPv4?",
        options: [
          "Sí, totalmente informada",
          "Parcialmente, sólo algunos lo saben",
          "No, no está informada",
          "No aplica",
        ],
      },
      {
        text: "¿Cuántos dispositivos en su red usan direcciones IPv4 actualmente?",
        options: ["1–50", "51–200", "201–1000", "Más de 1000"],
      },
      {
        text: "¿Utiliza dispositivos IoT conectados a su red que necesiten direcciones públicas?",
        options: [
          "Sí, muchos dispositivos",
          "Algunos dispositivos",
          "No utilizamos IoT",
          "No aplica",
        ],
      },
      {
        text: "¿Cómo calificaría la preparación general de su empresa para migrar a IPv6?",
        options: [
          "Alta preparación",
          "Preparación media",
          "Baja preparación",
          "Ninguna preparación",
        ],
      },
    ],
  },
  {
    id: "infra",
    title: "Infraestructura y red",
    questions: [
      {
        text: "¿Utiliza actualmente direcciones IPv6 en alguna parte de su red?",
        options: [
          "Sí, en producción",
          "Sí, sólo en pruebas",
          "No, pero hay planes",
          "No usamos IPv6",
        ],
      },
      {
        text: "¿Ha evaluado el equipamiento de red para compatibilidad IPv6?",
        options: [
          "Sí, todo compatible",
          "Parcialmente compatible",
          "No compatible",
          "No se ha evaluado",
        ],
      },
      {
        text: "¿La red inalámbrica de su empresa soporta IPv6 (APs, controladores)?",
        options: [
          "Sí, totalmente",
          "Parcialmente",
          "No soporta",
          "No lo hemos verificado",
        ],
      },
    ],
  },
  {
    id: "plan",
    title: "Planificación y gobernanza",
    questions: [
      {
        text: "¿Tiene un plan estratégico para migrar a IPv6?",
        options: [
          "Plan completo y calendarizado",
          "Plan inicial, por definir fechas",
          "No hay plan todavía",
          "Evaluando la viabilidad",
        ],
      },
      {
        text: "¿Ha definido un cronograma estimado para la transición?",
        options: [
          "Cronograma detallado",
          "Cronograma tentativo",
          "Sin cronograma",
          "Depende de terceros",
        ],
      },
      {
        text: "¿Mantiene documentación de red actualizada incluyendo IPv6?",
        options: [
          "Documentación completa y vigente",
          "Parcialmente documentada",
          "Documentación desactualizada",
          "No hay documentación",
        ],
      },
      {
        text: "¿Existe un responsable interno para liderar la transición IPv6?",
        options: [
          "Sí, responsable designado",
          "Equipo responsable",
          "Responsable por asignar",
          "No existe responsable",
        ],
      },
      {
        text: "¿Se ha planteado ventanas de mantenimiento para migración a IPv6?",
        options: [
          "Sí, calendarizado",
          "Ventanas previstas",
          "No se han definido",
          "Depende de proveedores",
        ],
      },
      {
        text: "¿Conoce los riesgos de no migrar a IPv6 a mediano plazo?",
        options: [
          "Sí, completamente",
          "Algunos riesgos identificados",
          "Pocos o ninguno",
          "No estamos informados",
        ],
      },
    ],
  },
  {
    id: "ops",
    title: "Operaciones y pruebas",
    questions: [
      {
        text: "¿Realiza pruebas de IPv6 en un entorno de laboratorio?",
        options: [
          "Sí, pruebas regulares",
          "Pruebas ocasionales",
          "No, pero está planificado",
          "No realizamos pruebas",
        ],
      },
      {
        text: "¿Ha realizado simulaciones de tráfico IPv6 en su red?",
        options: [
          "Sí, simulaciones realistas",
          "Simulaciones básicas",
          "No se han hecho simulaciones",
          "Planeado próximamente",
        ],
      },
      {
        text: "¿Ha establecido procedimientos de respaldo antes de migrar a IPv6?",
        options: [
          "Sí, procedimientos definidos",
          "Plan de respaldo parcial",
          "No hay procedimientos",
          "Se hará según necesidad",
        ],
      },
      {
        text: "¿Existen pruebas de concepto (PoC) de IPv6 en su organización?",
        options: [
          "PoC en producción controlada",
          "PoC en laboratorio",
          "No hay PoC",
          "PoC en evaluación",
        ],
      },
      {
        text: "¿Sabe cómo verificar la conectividad IPv6 en sus sistemas (herramientas y comandos)?",
        options: [
          "Sí, herramientas y procedimientos",
          "Conocimientos básicos",
          "No, necesitaríamos formación",
          "No aplica",
        ],
      },
      {
        text: "¿Ha medido el porcentaje actual de tráfico IPv6 en su red?",
        options: [
          "Sí, mediciones precisas",
          "Mediciones puntuales",
          "No se ha medido",
          "No aplica",
        ],
      },
    ],
  },
  {
    id: "seg",
    title: "Seguridad",
    questions: [
      {
        text: "¿Tiene políticas de seguridad adaptadas a IPv6?",
        options: [
          "Políticas claras y aplicadas",
          "Políticas en revisión",
          "No existen políticas para IPv6",
          "No sabemos cómo afectan a seguridad",
        ],
      },
      {
        text: "¿Comprende el impacto del IPv6 en la seguridad y controles de red?",
        options: [
          "Sí, impacto analizado",
          "Parcialmente analizado",
          "No se ha considerado",
          "No estoy seguro",
        ],
      },
    ],
  },
  {
    id: "prove",
    title: "Proveedores y nube",
    questions: [
      {
        text: "¿Cuenta con soporte técnico externo/asesoría en IPv6?",
        options: [
          "Sí, contratado permanente",
          "Consultoría puntual",
          "No, pero lo consideramos",
          "No tenemos soporte externo",
        ],
      },
      {
        text: "¿Su proveedor de internet soporta IPv6?",
        options: [
          "Sí, plenamente",
          "Sí, con restricciones",
          "No lo soporta",
          "No lo sé / no lo hemos consultado",
        ],
      },
      {
        text: "¿La infraestructura de nube que usa soporta IPv6 (proveedor, servicios)?",
        options: [
          "Sí, todo soportado",
          "Soporte parcial",
          "No soporta",
          "No lo sé",
        ],
      },
    ],
  },
  {
    id: "talento",
    title: "Capacitación y talento",
    questions: [
      {
        text: "¿Cuenta con personal capacitado en IPv6?",
        options: [
          "Equipo certificado y capacitado",
          "Algunos con conocimientos",
          "No tenemos personal capacitado",
          "Contratamos consultoría externa",
        ],
      },
      {
        text: "¿Conoce las diferencias técnicas clave entre IPv4 e IPv6 para su planificación?",
        options: [
          "Sí, en profundidad",
          "Conocimientos básicos",
          "Sólo lo esencial",
          "No conozco las diferencias",
        ],
      },
      {
        text: "¿Ha consultado fuentes oficiales o guías sobre adopción IPv6?",
        options: [
          "Sí, múltiples fuentes",
          "Una o dos referencias",
          "No hemos consultado",
          "Planeamos consultar",
        ],
      },
      {
        text: "¿Ha planificado capacitaciones para el personal sobre IPv6?",
        options: [
          "Capacitaciones programadas y en curso",
          "Capacitaciones planificadas",
          "No hay plan de formación",
          "Usaremos consultoría externa",
        ],
      },
    ],
  },
  {
    id: "eco",
    title: "Ecosistema y tecnologías futuras",
    questions: [
      {
        text: "¿Ha considerado los beneficios de IPv6 para servicios futuros (IoT, nube, 5G)?",
        options: [
          "Sí, está en la estrategia",
          "Se ha discutido",
          "No se ha considerado",
          "No aplica a nuestro negocio",
        ],
      },
      {
        text: "¿Está informado sobre el rol de IPv6 en nuevas tecnologías (IoT, 5G)?",
        options: [
          "Sí, con claridad",
          "Conocimientos básicos",
          "No, poco claro",
          "No aplica",
        ],
      },
    ],
  },
];

/* ---------------------------
   Estado inicial y estructura de respuestas (igual que antes)
   --------------------------- */
function initEmptyAnswers() {
  return modules.map((m) => Array(m.questions.length).fill(null));
}

const savedState = loadStateFromStorage();
let state = savedState || {
  moduleIndex: 0,
  questionIndex: 0,
  answers: initEmptyAnswers(),
};
let { moduleIndex, questionIndex, answers } = state;

/* ---------------------------
   Progreso / observador (global)
   --------------------------- */
function totalQuestionsCount() {
  return modules.reduce((sum, m) => sum + m.questions.length, 0);
}
const totalQuestions = totalQuestionsCount();
const progressObserver = new Observer();
progressObserver.subscribe("answered", (answeredCount) => {
  const percent = Math.round((answeredCount / totalQuestions) * 100);
  if (progressBar) progressBar.style.width = percent + "%";
  renderDashboard(); // actualizar badges y botón export
});

/* ---------------------------
   Cálculo progreso del módulo y global
   --------------------------- */
function countAnsweredInModule(mi) {
  return answers[mi].filter((a) => a !== null).length;
}
function moduleProgressPercent(mi) {
  const total = modules[mi].questions.length;
  if (total === 0) return 0;
  return Math.round((countAnsweredInModule(mi) / total) * 100);
}
function countAnsweredTotal() {
  return answers.flat().filter((a) => a !== null).length;
}

/* ---------------------------
   Dashboard rendering
   --------------------------- */
function createIconSVG(id) {
  // small SVG set; choose icon by id (fallback generic)
  const icons = {
    perfil: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 12a4 4 0 100-8 4 4 0 000 8z" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M20 21v-1a4 4 0 00-4-4H8a4 4 0 00-4 4v1" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    infra: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18M3 12h18M3 17h18" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    plan: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 7h16M6 11h12M9 15h6" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    ops: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 7v5l3 3" stroke="white" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    seg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    prove: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 7h18v10H3z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 7v-2h10v2" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    talento: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 14c3 0 5 1 5 3v1H7v-1c0-2 2-3 5-3z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M12 12a3 3 0 100-6 3 3 0 000 6z" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    eco: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2v20M2 12h20" stroke="white" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };
  return icons[id] || icons["perfil"];
}

function renderDashboard() {
  if (!cardsGrid) return;
  cardsGrid.innerHTML = "";

  modules.forEach((m, mi) => {
    const percent = moduleProgressPercent(mi);
    const card = document.createElement("div");
    card.className = "card";
    card.setAttribute("data-module-index", mi);

    // card content
    card.innerHTML = `
      <div class="card-top">
        <div class="icon">${createIconSVG(m.id)}</div>
        <div>
          <h3>${m.title}</h3>
          <p class="subtitle">${m.questions.length} preguntas</p>
        </div>
      </div>
      <div class="progress-small">
        <div class="progress-track"><div class="progress-fill" style="width:${percent}%"></div></div>
        <div class="percent">${percent}%</div>
      </div>
    `;
    // click -> abrir módulo
    card.addEventListener("click", () => openModuleModal(mi));
    cardsGrid.appendChild(card);
  });

  // export button enable if all 100
  const allComplete = modules.every(
    (m, idx) => moduleProgressPercent(idx) === 100
  );
  if (exportPdfDashboardBtn) exportPdfDashboardBtn.disabled = !allComplete;
  if (exportPdfBtn) exportPdfBtn.disabled = !allComplete;
}

/* ---------------------------
   Helpers: encontrar siguiente pregunta pendiente en un módulo
   (retorna índice o -1 si none)
   --------------------------- */
function findNextPendingIndex(moduleIdx, startFrom = 0) {
  const arr = answers[moduleIdx];
  for (let i = startFrom; i < arr.length; i++) {
    if (arr[i] === null) return i;
  }
  return -1;
}

/* ---------------------------
   Abrir módulo -> mostrar chatContainer con preguntas pendientes
   --------------------------- */
let activeModule = null; // índice del módulo abierto actualmente en modal
let activeQuestionIndex = -1; // índice de la pregunta pendiente dentro del módulo

function openModuleModal(moduleIdx) {
  activeModule = moduleIdx;
  // buscar siguiente pendiente desde 0
  const next = findNextPendingIndex(moduleIdx, 0);
  if (next === -1) {
    // nada pendiente en el módulo
    alert(`El módulo "${modules[moduleIdx].title}" ya está completo.`);
    renderDashboard();
    return;
  }
  activeQuestionIndex = next;

  // show chat container (modal)
  if (dashboard) dashboard.classList.add("hidden");
  if (chatContainer) chatContainer.classList.remove("hidden");
  if (skipBtn) skipBtn.disabled = false;

  // limpiar chatBox y saludar
  if (chatBox) chatBox.innerHTML = "";
  const bot = ChatBot.getInstance("AndrésBot");
  bot.sendBotMessage(
    `Entrando a "${modules[moduleIdx].title}". Voy a mostrarte las preguntas pendientes.`
  );

  updateModuleInfoForActive();
  renderActiveQuestion();
}

/* ---------------------------
   Actualizar moduleInfo cuando se está en modal de módulo
   --------------------------- */
function updateModuleInfoForActive() {
  if (!moduleInfo || activeModule === null) return;
  const m = modules[activeModule];
  const remaining = answers[activeModule].filter((a) => a === null).length;
  moduleLabel.textContent = m.title;
  remainingLabel.textContent = `Preguntas restantes: ${remaining}`;
  moduleInfo.style.display = "flex";
}

/* ---------------------------
   Render pregunta activa (solo pendientes)
   --------------------------- */
/* ---------------------------
   Render pregunta activa (solo pendientes)
   --------------------------- */
function renderActiveQuestion() {
  if (activeModule === null) return;
  const bot = ChatBot.getInstance();
  const m = modules[activeModule];

  // Determinar cuál pregunta pendiente mostrar
  let idxToShow = activeQuestionIndex;

  if (idxToShow === -1) {
    // Módulo recién abierto: buscar la primera pendiente desde el inicio
    idxToShow = findNextPendingIndex(activeModule, 0);
  } else {
    // Si la "actual" ya fue respondida (no-null), mostrar la siguiente pendiente después de ella
    if (answers[activeModule][idxToShow] !== null) {
      idxToShow = findNextPendingIndex(activeModule, idxToShow + 1);
    } else {
      // Si la actual sigue siendo null (pendiente), la mostramos (por ejemplo, después de abrir módulo o tras saltar)
      // -> idxToShow ya es correcto (no se cambia).
    }
  }

  // Si no hay pendientes en todo el módulo, cerramos y volvemos al dashboard
  if (idxToShow === -1) {
    bot.sendBotMessage(
      `Has completado el módulo "${m.title}". Volviendo al panel...`
    );
    state = { moduleIndex, questionIndex, answers };
    saveStateToStorage(state);
    setTimeout(() => {
      closeModuleModalAndRefresh();
    }, 700);
    return;
  }

  // asegurar que activeQuestionIndex apunta a lo que vamos a mostrar
  activeQuestionIndex = idxToShow;

  // Obtener la pregunta y mostrarla
  const q = m.questions[activeQuestionIndex];
  bot.sendBotMessage(`${activeQuestionIndex + 1}. ${q.text}`);

  // Render de opciones
  if (!optionsContainer) return;
  optionsContainer.innerHTML = "";
  q.options.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.type = "button";
    btn.textContent = opt;
    btn.addEventListener("click", () => onActiveOptionSelected(opt, btn));
    optionsContainer.appendChild(btn);
  });

  // Actualizar info del módulo (pendientes, etc.)
  updateModuleInfoForActive();
}

/* ---------------------------
   Manejo selección en modal de módulo
   --------------------------- */
function onActiveOptionSelected(optionText, btnElement) {
  // prevenir doble click
  Array.from(optionsContainer.children).forEach((b) => (b.disabled = true));
  btnElement.classList.add("selected");

  // guardar respuesta en la estructura anidada
  answers[activeModule][activeQuestionIndex] = optionText;

  // guardar estado global
  state = { moduleIndex, questionIndex, answers };
  saveStateToStorage(state);

  const bot = ChatBot.getInstance();
  bot.sendUserMessage(optionText);

  // emitir progreso global
  progressObserver.emit("answered", countAnsweredTotal());

  // buscar siguiente pendiente y mostrarla
  setTimeout(() => {
    renderActiveQuestion();
  }, 480);
}

/* ---------------------------
   Saltar pregunta dentro del módulo (no marcarla)
   --------------------------- */
// Saltar pregunta dentro del módulo (no marcarla)
if (skipBtn)
  skipBtn.addEventListener("click", () => {
    const bot = ChatBot.getInstance();
    bot.sendUserMessage("[Pregunta saltada]");

    const curr = activeQuestionIndex;

    // Verificar si hay otra pendiente distinta de la actual
    const nextForward = findNextPendingIndex(activeModule, curr + 1);
    let nextBackward = -1;
    for (let i = 0; i < curr; i++) {
      if (answers[activeModule][i] === null) {
        nextBackward = i;
        break;
      }
    }

    // Si no hay más pendientes (ni adelante ni atrás), volver al dashboard
    if (nextForward === -1 && nextBackward === -1) {
      bot.sendBotMessage(
        `No hay más preguntas pendientes en este módulo. Volviendo al panel...`
      );
      state = { moduleIndex, questionIndex, answers };
      saveStateToStorage(state);
      setTimeout(closeModuleModalAndRefresh, 600);
      return;
    }

    // Si hay pendientes adelante, avanzar a la siguiente pendiente
    if (nextForward !== -1) {
      activeQuestionIndex = nextForward;
      updateModuleInfoForActive();
      renderActiveQuestion();
      return;
    }

    // Si no hay pendientes adelante pero sí atrás, solo mostrar al reingresar
    if (nextForward === -1 && nextBackward !== -1) {
      bot.sendBotMessage(
        `Has llegado al final de las preguntas actuales. Volviendo al panel...`
      );
      state = { moduleIndex, questionIndex, answers };
      saveStateToStorage(state);
      setTimeout(closeModuleModalAndRefresh, 600);
    }
  });

/* ---------------------------
   Cerrar modal del módulo y volver al dashboard
   --------------------------- */
function closeModuleModalAndRefresh() {
  activeModule = null;
  activeQuestionIndex = -1;
  if (chatContainer) chatContainer.classList.add("hidden");
  if (dashboard) dashboard.classList.remove("hidden");
  if (skipBtn) skipBtn.disabled = true;
  if (chatBox) chatBox.innerHTML = "";
  // actualizar dashboard badges y export button
  renderDashboard();
}

/* ---------------------------
   Mostrar panel de resultado al finalizar TODO (opcional)
   --------------------------- */
function showResultPanel() {
  if (chatContainer) chatContainer.classList.add("hidden");
  if (resultContainer) resultContainer.classList.remove("hidden");
}

/* ---------------------------
   Generación de PDF (agrupado por módulo) - reutilizable
   --------------------------- */
function generatePDFReport() {
  if (!window.jspdf) {
    alert("Biblioteca jsPDF no disponible.");
    return;
  }
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const company = (() => {
    try {
      return atob(localStorage.getItem("companyName") || "");
    } catch (e) {
      return "";
    }
  })();
  const email = (() => {
    try {
      return atob(localStorage.getItem("email") || "");
    } catch (e) {
      return "";
    }
  })();

  doc.setFontSize(14);
  doc.text(`Reporte de Encuesta IPv6 - Empresa: ${company}`, 20, 20);
  doc.setFontSize(11);
  doc.text(`Correo: ${email}`, 20, 28);
  doc.text("Respuestas:", 20, 36);
  let y = 46;

  modules.forEach((m, mi) => {
    doc.setFontSize(12);
    doc.text(`${m.title}`, 20, y);
    y += 8;
    m.questions.forEach((q, qi) => {
      const resp = answers[mi][qi] !== null ? answers[mi][qi] : "Pendiente";
      doc.setFontSize(10);
      const line = `${mi + 1}.${qi + 1} ${q.text}`;
      const wrapped = doc.splitTextToSize(line, 170);
      doc.text(wrapped, 20, y);
      y += wrapped.length * 6;
      doc.text(`   → ${resp}`, 24, y);
      y += 8;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    });
    y += 6;
    if (y > 270) {
      doc.addPage();
      y = 20;
    }
  });

  const filename = `reporte_encuesta_${
    company ? company.replace(/\s+/g, "_") : "sin_nombre"
  }.pdf`;
  doc.save(filename);
  const bot = ChatBot.getInstance();
  bot.sendBotMessage(
    "Reporte generado y descargado. ¡Gracias por completar la encuesta!"
  );
}

/* conectar botones de export */
if (exportPdfDashboardBtn)
  exportPdfDashboardBtn.addEventListener("click", generatePDFReport);
if (exportPdfBtn) exportPdfBtn.addEventListener("click", generatePDFReport);

/* ---------------------------
   Inicio: control del modal de bienvenida
   - ahora inicia el Dashboard (no abre el chat directamente)
   --------------------------- */
function checkStartEnable() {
  if (!startBtn) return;
  startBtn.disabled = !(
    companyInput.value &&
    emailInput.value &&
    acceptCheckbox.checked
  );
}
if (companyInput) companyInput.addEventListener("input", checkStartEnable);
if (emailInput) emailInput.addEventListener("input", checkStartEnable);
if (acceptCheckbox) acceptCheckbox.addEventListener("change", checkStartEnable);

if (startBtn)
  startBtn.addEventListener("click", () => {
    if (companyInput)
      localStorage.setItem("companyName", btoa(companyInput.value || ""));
    if (emailInput) localStorage.setItem("email", btoa(emailInput.value || ""));

    // hide modal, show dashboard
    if (startModal) startModal.style.display = "none";
    if (dashboard) dashboard.classList.remove("hidden");

    const bot = ChatBot.getInstance("AndrésBot");
    bot.sendBotMessage(
      "¡Hola! Bienvenido — usa el panel para seleccionar un módulo y continuar."
    );

    // ensure UI reflects saved progress
    progressObserver.emit("answered", countAnsweredTotal());
  });

/* ---------------------------
   Control de inactividad 10 minutos (igual comportamiento)
   --------------------------- */
let inactivityTimer;
function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  inactivityTimer = setTimeout(() => {
    alert("Sesión cerrada por inactividad. Se guardó tu progreso.");
    state = { moduleIndex, questionIndex, answers };
    saveStateToStorage(state);
    location.reload();
  }, 600000); // 10 minutos
}
window.onload = () => {
  resetInactivityTimer();
  // render initial dashboard (if modal closed already)
  renderDashboard();
};
document.onmousemove = resetInactivityTimer;
document.onkeydown = resetInactivityTimer;

/* ---------------------------
   Validación básica de email
   --------------------------- */
if (emailInput)
  emailInput.addEventListener("blur", () => {
    if (
      emailInput.value &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)
    ) {
      alert("Correo electrónico no válido.");
      emailInput.value = "";
    }
  });

/* ---------------------------
   Nota: Este script mantiene la persistencia exacta (localStorage 'surveyState')
   y reutiliza tu estructura de módulos y respuestas.
   --------------------------- */
