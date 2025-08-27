// Delegación: añade/remueve .pressed en elementos "pressable"
// Usa pointer events y soporta teclado (Enter / Space)
(function () {
  "use strict";
  const PRESSED_CLASS = "pressed";
  const SELECTOR = "[data-pressable], .pressable";

  function isPressable(el) {
    return el && el.closest && el.closest(SELECTOR);
  }

  function addPressed(el) {
    const target = el.closest ? el.closest(SELECTOR) : null;
    if (target) target.classList.add(PRESSED_CLASS);
  }
  function removePressed(el) {
    const target = el.closest ? el.closest(SELECTOR) : null;
    if (target) target.classList.remove(PRESSED_CLASS);
  }

  // Pointer events (covers touch + mouse)
  document.addEventListener(
    "pointerdown",
    (e) => {
      const t = e.target.closest && e.target.closest(SELECTOR);
      if (!t) return;
      // only primary button
      if (e.button && e.button !== 0) return;
      t.classList.add(PRESSED_CLASS);
    },
    { passive: true }
  );

  ["pointerup", "pointercancel", "pointerleave"].forEach((ev) =>
    document.addEventListener(
      ev,
      (e) => {
        const t = e.target.closest && e.target.closest(SELECTOR);
        if (!t) return;
        t.classList.remove(PRESSED_CLASS);
      },
      { passive: true }
    )
  );

  // Keyboard accessibility: Space / Enter
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key === " " || e.key === "Enter") {
        const t = e.target.closest && e.target.closest(SELECTOR);
        if (t) t.classList.add(PRESSED_CLASS);
      }
    },
    true
  );
  document.addEventListener(
    "keyup",
    (e) => {
      if (e.key === " " || e.key === "Enter") {
        const t = e.target.closest && e.target.closest(SELECTOR);
        if (t) t.classList.remove(PRESSED_CLASS);
      }
    },
    true
  );

  // Safety: remove pressed on page hide / blur
  window.addEventListener("pagehide", () => {
    document
      .querySelectorAll(`.${PRESSED_CLASS}`)
      .forEach((n) => n.classList.remove(PRESSED_CLASS));
  });
})();
