const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
  revealObserver.observe(element);
});

const experienceObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("experience-visible");
      experienceObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

document.querySelectorAll(".experience-row").forEach((row) => {
  experienceObserver.observe(row);
});

const menuButton = document.querySelector(".menu-button");
const nav = document.querySelector(".main-nav");

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const typingQuote = document.querySelector(".typing-quote");
const quoteAttribution = document.querySelector(".hero-quote cite");
const portfolioTitle = document.querySelector(".portfolio-title");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (typingQuote && !reduceMotion) {
  const quoteText = typingQuote.dataset.text;
  typingQuote.textContent = "";

  let characterIndex = 0;
  const typeNextCharacter = () => {
    typingQuote.textContent += quoteText[characterIndex];
    characterIndex += 1;

    if (characterIndex < quoteText.length) {
      window.setTimeout(typeNextCharacter, quoteText[characterIndex - 1] === "," ? 170 : 42);
      return;
    }

    typingQuote.classList.add("typing-complete");
    window.setTimeout(() => {
      quoteAttribution.classList.add("typing-followup-visible");
      portfolioTitle.classList.add("typing-followup-visible");
    }, 320);
  };

  window.setTimeout(typeNextCharacter, 450);
} else {
  quoteAttribution?.classList.add("typing-followup-visible");
  portfolioTitle?.classList.add("typing-followup-visible");
}

const mapCanvas = document.querySelector(".map-canvas");
const mapSvg = document.querySelector(".map-connections");
const mapNodes = new Map(
  [...document.querySelectorAll("[data-map-id]")].map((node) => [node.dataset.mapId, node])
);
const mapEdges = [
  ["propulsion", "hybrids"],
  ["propulsion", "lre"],
  ["propulsion", "thrusters"],
  ["propulsion", "vtvl"],
  ["propulsion", "turbomachinery"],
  ["hybrids", "vtvl"],
  ["hybrids", "regression"],
  ["hybrids", "liquefying"],
  ["hybrids", "conventional"],
  ["hybrids", "injectors"],
  ["hybrids", "cooling"],
  ["hybrids", "pressure-ladder"],
  ["hybrids", "test-procedures"],
  ["hybrids", "valve-sequence"],
  ["liquefying", "pw"],
  ["liquefying", "regression"],
  ["conventional", "regression"],
  ["conventional", "hdpe"],
  ["conventional", "pp"],
  ["conventional", "pmma"],
  ["conventional", "abs"],
  ["lre", "injectors"],
  ["lre", "pressure-ladder"],
  ["lre", "thrusters"],
  ["lre", "test-procedures"],
  ["lre", "valve-sequence"],
  ["lre", "cooling"],
  ["lre", "igniter"],
  ["lre", "turbomachinery"],
  ["injectors", "swirl"],
  ["injectors", "coaxial"],
  ["injectors", "showerhead"],
  ["injectors", "cfd"],
  ["cfd", "rans"],
  ["cfd", "les"],
  ["cooling", "regen"],
  ["cooling", "film"],
  ["turbomachinery", "pump"],
  ["turbomachinery", "cooling"],
  ["pump", "cooling"],
  ["turbomachinery", "manufacturing"],
  ["vtvl", "pressure-ladder"],
  ["vtvl", "valve-sequence"],
  ["vtvl", "test-procedures"]
];
const svgNamespace = "http://www.w3.org/2000/svg";

const updateMapConnections = () => {
  if (!mapCanvas || !mapSvg || window.innerWidth <= 900) return;

  const canvasBounds = mapCanvas.getBoundingClientRect();
  mapSvg.setAttribute("viewBox", `0 0 ${canvasBounds.width} ${canvasBounds.height}`);
  mapSvg.replaceChildren();

  mapEdges.forEach(([fromId, toId]) => {
    const fromNode = mapNodes.get(fromId);
    const toNode = mapNodes.get(toId);

    if (!fromNode || !toNode) return;

    const from = fromNode.getBoundingClientRect();
    const to = toNode.getBoundingClientRect();
    const line = document.createElementNS(svgNamespace, "line");

    line.setAttribute("x1", from.left + from.width / 2 - canvasBounds.left);
    line.setAttribute("y1", from.top + from.height / 2 - canvasBounds.top);
    line.setAttribute("x2", to.left + to.width / 2 - canvasBounds.left);
    line.setAttribute("y2", to.top + to.height / 2 - canvasBounds.top);
    mapSvg.appendChild(line);
  });
};

if (mapCanvas && mapSvg) {
  updateMapConnections();
  window.addEventListener("resize", updateMapConnections);

  mapNodes.forEach((node) => {
    const startNodeDrag = (event, moveEventName, endEventName, cancelEventName) => {
      if (window.innerWidth <= 900) return;

      event.preventDefault();

      const canvasBounds = mapCanvas.getBoundingClientRect();
      const nodeBounds = node.getBoundingClientRect();
      const offsetX = event.clientX - nodeBounds.left - nodeBounds.width / 2;
      const offsetY = event.clientY - nodeBounds.top - nodeBounds.height / 2;

      if ("pointerId" in event) node.setPointerCapture?.(event.pointerId);

      const dragNode = (moveEvent) => {
        const halfWidth = node.offsetWidth / 2;
        const halfHeight = node.offsetHeight / 2;
        const left = Math.min(
          canvasBounds.width - halfWidth,
          Math.max(halfWidth, moveEvent.clientX - canvasBounds.left - offsetX)
        );
        const top = Math.min(
          canvasBounds.height - halfHeight,
          Math.max(halfHeight, moveEvent.clientY - canvasBounds.top - offsetY)
        );

        node.style.left = `${left}px`;
        node.style.top = `${top}px`;
        updateMapConnections();
      };

      const stopDragging = () => {
        document.removeEventListener(moveEventName, dragNode);
        document.removeEventListener(endEventName, stopDragging);
        if (cancelEventName) document.removeEventListener(cancelEventName, stopDragging);
      };

      document.addEventListener(moveEventName, dragNode);
      document.addEventListener(endEventName, stopDragging);
      if (cancelEventName) document.addEventListener(cancelEventName, stopDragging);
    };

    if (window.PointerEvent) {
      node.addEventListener("pointerdown", (event) => {
        startNodeDrag(event, "pointermove", "pointerup", "pointercancel");
      });
    } else {
      node.addEventListener("mousedown", (event) => {
        startNodeDrag(event, "mousemove", "mouseup");
      });
    }
  });
}

const thoughtAnnotation = document.querySelector(".thought-annotation");

if (thoughtAnnotation) {
  let annotationWasDragged = false;

  const setAnnotationCollapsed = () => {
    const annotationTail = thoughtAnnotation.querySelector(".thought-annotation-tail");
    const anchorBeforeToggle = annotationTail.getBoundingClientRect();
    const collapsed = thoughtAnnotation.classList.toggle("is-collapsed");
    const anchorAfterToggle = annotationTail.getBoundingClientRect();
    const annotationBounds = thoughtAnnotation.getBoundingClientRect();

    thoughtAnnotation.style.left = `${annotationBounds.left + window.scrollX + anchorBeforeToggle.left - anchorAfterToggle.left}px`;
    thoughtAnnotation.style.top = `${annotationBounds.top + window.scrollY + anchorBeforeToggle.top - anchorAfterToggle.top}px`;
    annotationToggle.textContent = collapsed ? "+" : "−";
    annotationToggle.setAttribute("aria-expanded", String(!collapsed));
    annotationToggle.setAttribute("aria-label", collapsed ? "Expand annotation" : "Collapse annotation");
  };

  const startAnnotationDrag = (event, moveEventName, endEventName, cancelEventName) => {
    if (event.target.closest(".thought-annotation-toggle")) return;

    event.preventDefault();

    const annotationBounds = thoughtAnnotation.getBoundingClientRect();
    const offsetX = event.clientX - annotationBounds.left;
    const offsetY = event.clientY - annotationBounds.top;
    const startX = event.clientX;
    const startY = event.clientY;

    annotationWasDragged = false;

    if ("pointerId" in event) thoughtAnnotation.setPointerCapture?.(event.pointerId);
    thoughtAnnotation.style.left = `${annotationBounds.left + window.scrollX}px`;
    thoughtAnnotation.style.top = `${annotationBounds.top + window.scrollY}px`;

    const dragAnnotation = (moveEvent) => {
      if (Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY) > 4) {
        annotationWasDragged = true;
      }

      thoughtAnnotation.style.left = `${moveEvent.pageX - offsetX}px`;
      thoughtAnnotation.style.top = `${moveEvent.pageY - offsetY}px`;
    };

    const stopDragging = () => {
      document.removeEventListener(moveEventName, dragAnnotation);
      document.removeEventListener(endEventName, stopDragging);
      if (cancelEventName) document.removeEventListener(cancelEventName, stopDragging);
    };

    document.addEventListener(moveEventName, dragAnnotation);
    document.addEventListener(endEventName, stopDragging);
    if (cancelEventName) document.addEventListener(cancelEventName, stopDragging);
  };

  if (window.PointerEvent) {
    thoughtAnnotation.addEventListener("pointerdown", (event) => {
      startAnnotationDrag(event, "pointermove", "pointerup", "pointercancel");
    });
  } else {
    thoughtAnnotation.addEventListener("mousedown", (event) => {
      startAnnotationDrag(event, "mousemove", "mouseup");
    });
  }

  const annotationToggle = thoughtAnnotation.querySelector(".thought-annotation-toggle");

  thoughtAnnotation.addEventListener("click", () => {
    if (annotationWasDragged) {
      annotationWasDragged = false;
      return;
    }

    setAnnotationCollapsed();
  });

  annotationToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    setAnnotationCollapsed();
  });
}

const musicCard = document.querySelector(".music-card");
const musicToggle = document.querySelector(".music-toggle");
const musicAudio = document.querySelector(".site-music");
const musicTitle = document.querySelector(".music-title");
const musicVolumeSlider = document.querySelector(".music-volume-slider");

if (musicCard && musicToggle && musicAudio) {
  const savedVolume = Number(window.localStorage.getItem("site_music_volume"));
  const initialVolume = Number.isFinite(savedVolume) && savedVolume >= 0 && savedVolume <= 1 ? savedVolume : 0.6;
  musicAudio.volume = initialVolume;
  if (musicVolumeSlider) musicVolumeSlider.value = String(Math.round(initialVolume * 100));

  const setMusicPlaying = (playing) => {
    musicCard.classList.toggle("is-playing", playing);
    musicToggle.setAttribute("aria-pressed", String(playing));
    musicToggle.setAttribute("aria-label", playing ? "Pause music" : "Play music");
  };

  musicToggle.addEventListener("click", async () => {
    if (musicAudio.paused) {
      try {
        await musicAudio.play();
        setMusicPlaying(true);
      } catch {
        musicTitle.textContent = "Missing file: assets/site_music.mp3";
        setMusicPlaying(false);
      }
      return;
    }

    musicAudio.pause();
    setMusicPlaying(false);
  });
  musicAudio.addEventListener("ended", () => {
    setMusicPlaying(false);
  });
  musicAudio.addEventListener("pause", () => {
    if (!musicAudio.ended) setMusicPlaying(false);
  });
  musicAudio.addEventListener("play", () => setMusicPlaying(true));

  musicVolumeSlider?.addEventListener("input", () => {
    const volume = Math.max(0, Math.min(100, Number(musicVolumeSlider.value))) / 100;
    musicAudio.volume = volume;
    window.localStorage.setItem("site_music_volume", String(volume));
  });
}
