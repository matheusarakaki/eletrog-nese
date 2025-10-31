// Modo horizontal
document.addEventListener("DOMContentLoaded", () =>
  const timeline = document.querySelector(".timeline");
  const events = document.querySelectorAll(".event");
  const decades = document.querySelectorAll(".decade");

  // Aplica layout horizontal sem mexer no CSS
  timeline.style.display = "flex";
  timeline.style.flexDirection = "row";
  timeline.style.alignItems = "flex-start";
  timeline.style.justifyContent = "flex-start";
  timeline.style.overflowX = "auto";
  timeline.style.overflowY = "hidden";
  timeline.style.whiteSpace = "nowrap";
  timeline.style.padding = "40px 0";

  // Remove a linha vertical central
  timeline.style.position = "relative";
  timeline.querySelectorAll("::before").forEach
  ? null : null; // ignora o pseudo-elemento

  // Estilo inline para cada bloco de evento
  events.forEach(ev => {
    ev.style.width = "280px";
    ev.style.margin = "0 20px";
    ev.style.display = "inline-block";
    ev.style.verticalAlign = "top";
    ev.style.cursor = "pointer";

    // Inicialmente esconde o texto detalhado
    const p = ev.querySelector("p");
    if (p) {
      p.style.maxHeight = "0";
      p.style.overflow = "hidden";
      p.style.transition = "max-height 0.5s ease";
    }
