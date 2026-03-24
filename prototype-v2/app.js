const screenLinks = document.querySelectorAll(".screen-link");
const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll("[data-go]");

const fragmentDefs = {
  petal: {
    id: "petal",
    label: "花瓣边",
    role: "先站出来",
    x: 55,
    y: 44,
    swatch: "#ea6aa5",
    cropX: "56%",
    cropY: "46%",
    ringClass: "ring-pink",
  },
  leaf: {
    id: "leaf",
    label: "叶脉下",
    role: "轻轻托住",
    x: 42,
    y: 61,
    swatch: "#3bc68f",
    cropX: "38%",
    cropY: "62%",
    ringClass: "ring-green",
  },
  core: {
    id: "core",
    label: "花心亮黄",
    role: "闪一下",
    x: 63,
    y: 49,
    swatch: "#f7c95b",
    cropX: "63%",
    cropY: "48%",
    ringClass: "ring-gold",
  },
  shadow: {
    id: "shadow",
    label: "阴影冷色",
    role: "压一压",
    x: 66,
    y: 68,
    swatch: "#6a7391",
    cropX: "65%",
    cropY: "68%",
    ringClass: "ring-shadow",
  },
  light: {
    id: "light",
    label: "白光边",
    role: "提一口气",
    x: 70,
    y: 58,
    swatch: "#f1efe7",
    cropX: "72%",
    cropY: "58%",
    ringClass: "ring-light",
  },
};

const state = {
  selectedIds: [],
  activeId: null,
};

const fragmentLayer = document.querySelector("[data-fragment-layer]");
const fragmentStrip = document.querySelector("[data-fragment-strip]");
const fragmentCount = document.querySelector("[data-fragment-count]");
const aiSuggestion = document.querySelector("[data-ai-suggestion]");
const aiText = document.querySelector("[data-ai-text]");
const xianseButton = document.querySelector("[data-enter-xianse]");
const standingField = document.querySelector("[data-standing-field]");
const foreshadowRibbon = document.querySelector("[data-foreshadow-ribbon]");

function activateScreen(target) {
  screens.forEach((screen) => {
    screen.classList.toggle("active", screen.dataset.screen === target);
  });

  screenLinks.forEach((link) => {
    link.classList.toggle("active", link.dataset.target === target);
  });

  if (target === "xianse") {
    renderXianse();
  }
}

function addFragment(id) {
  if (state.selectedIds.includes(id)) {
    state.activeId = id;
    renderFrozen();
    return;
  }

  if (state.selectedIds.length >= 5) {
    return;
  }

  state.selectedIds.push(id);
  state.activeId = id;
  renderFrozen();
}

function removeFragment(id) {
  state.selectedIds = state.selectedIds.filter((item) => item !== id);
  if (state.activeId === id) {
    state.activeId = state.selectedIds[state.selectedIds.length - 1] || null;
  }
  renderFrozen();
}

function renderFrozen() {
  fragmentLayer.innerHTML = "";
  fragmentStrip.innerHTML = "";
  fragmentCount.textContent = `${state.selectedIds.length} / 5`;
  fragmentStrip.classList.toggle("is-empty", state.selectedIds.length === 0);

  state.selectedIds.forEach((id) => {
    const fragment = fragmentDefs[id];

    const target = document.createElement("button");
    target.className = `frozen-target ${fragment.ringClass}`;
    target.style.left = `${fragment.x}%`;
    target.style.top = `${fragment.y}%`;
    target.dataset.fragmentId = id;
    if (id === state.activeId) {
      target.classList.add("active");
    }
    fragmentLayer.appendChild(target);

    const card = document.createElement("div");
    card.className = "fragment-card";
    card.dataset.fragmentId = id;
    card.innerHTML = `
      <div class="fragment-card-head">
        <span class="fragment-label">${fragment.label}</span>
        <button class="fragment-remove ${id === state.activeId ? "" : "is-hidden"}" data-remove-fragment aria-label="移除片段">×</button>
      </div>
      <div class="fragment-preview photo-flower" style="--crop-x:${fragment.cropX}; --crop-y:${fragment.cropY};"></div>
      <div class="fragment-swatch" style="--swatch:${fragment.swatch};"></div>
    `;
    if (id === state.activeId) {
      card.classList.add("active");
    }
    fragmentStrip.appendChild(card);
  });

  const suggestionShouldShow = state.selectedIds.length >= 1 && !state.selectedIds.includes("core");
  aiSuggestion.hidden = !suggestionShouldShow;
  if (suggestionShouldShow) {
    aiText.textContent = "也把亮黄带上";
  }

  const ready = state.selectedIds.length >= 1;
  xianseButton.classList.toggle("disabled", !ready);
  xianseButton.classList.toggle("is-hidden", !ready);

  if (state.activeId) {
    requestAnimationFrame(() => {
      const activeCard = fragmentStrip.querySelector(`[data-fragment-id="${state.activeId}"]`);
      activeCard?.scrollIntoView({
        behavior: "smooth",
        inline: "nearest",
        block: "nearest",
      });
    });
  }
}

function renderXianse() {
  const ids = state.selectedIds.length >= 1 ? state.selectedIds : ["petal", "leaf", "core"];
  const roles = [
    { x: 50, y: 32, w: "194px", scale: 1, alpha: 1, blur: "0px", className: "main" },
    { x: 34, y: 58, w: "154px", scale: 0.9, alpha: 0.7, blur: "2.2px", className: "support" },
    { x: 69, y: 52, w: "120px", scale: 0.84, alpha: 0.8, blur: "1.2px", className: "accent" },
    { x: 54, y: 72, w: "176px", scale: 0.82, alpha: 0.46, blur: "5px", className: "base" },
    { x: 75, y: 70, w: "108px", scale: 0.76, alpha: 0.54, blur: "3.8px", className: "lift" },
  ];

  standingField.innerHTML = "";
  foreshadowRibbon.innerHTML = "";

  ids.forEach((id, index) => {
    const fragment = fragmentDefs[id];
    const role = roles[index] || roles[roles.length - 1];

    const node = document.createElement("button");
    node.className = `standing-fragment ${role.className}`;
    if (index === 0) {
      node.classList.add("active");
    }
    node.style.left = `${role.x}%`;
    node.style.top = `${role.y}%`;
    node.style.setProperty("--w", role.w);
    node.style.setProperty("--scale", role.scale);
    node.style.setProperty("--alpha", role.alpha);
    node.style.setProperty("--blur", role.blur);
    node.innerHTML = `
      <div class="standing-preview photo-flower" style="--crop-x:${fragment.cropX}; --crop-y:${fragment.cropY};"></div>
      <div class="standing-swatch" style="--swatch:${fragment.swatch};"></div>
    `;
    standingField.appendChild(node);

    const ribbon = document.createElement("span");
    ribbon.className = "foreshadow-chip";
    ribbon.style.setProperty("--swatch", fragment.swatch);
    foreshadowRibbon.appendChild(ribbon);
  });
}

screenLinks.forEach((link) => {
  link.addEventListener("click", () => activateScreen(link.dataset.target));
});

navButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = button.dataset.go;
    if (target) {
      activateScreen(target);
    }
  });
});

document.querySelectorAll(".hotspot").forEach((button) => {
  button.addEventListener("click", () => addFragment(button.dataset.fragmentId));
});

fragmentLayer.addEventListener("click", (event) => {
  const target = event.target.closest("[data-fragment-id]");
  if (!target) {
    return;
  }
  state.activeId = target.dataset.fragmentId;
  renderFrozen();
});

fragmentStrip.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-fragment]");
  if (removeButton) {
    const card = event.target.closest("[data-fragment-id]");
    if (card) {
      removeFragment(card.dataset.fragmentId);
    }
    return;
  }

  const card = event.target.closest("[data-fragment-id]");
  if (!card) {
    return;
  }
  state.activeId = card.dataset.fragmentId;
  renderFrozen();
});

document.querySelector("[data-ai-accept]").addEventListener("click", () => addFragment("core"));

let dragStartX = 0;
let dragScrollLeft = 0;
let dragging = false;
let stripMoved = false;

fragmentStrip.addEventListener("pointerdown", (event) => {
  if (state.selectedIds.length <= 1 || event.target.closest("[data-remove-fragment]")) {
    return;
  }
  dragStartX = event.clientX;
  dragScrollLeft = fragmentStrip.scrollLeft;
  dragging = true;
  stripMoved = false;
});

fragmentStrip.addEventListener("pointermove", (event) => {
  if (!dragging) {
    return;
  }
  const delta = event.clientX - dragStartX;
  if (!stripMoved && Math.abs(delta) > 5) {
    stripMoved = true;
    fragmentStrip.classList.add("is-dragging");
    fragmentStrip.setPointerCapture(event.pointerId);
  }
  if (!stripMoved) {
    return;
  }
  fragmentStrip.scrollLeft = dragScrollLeft - delta;
});

function stopStripDrag(event) {
  if (!dragging) {
    return;
  }
  dragging = false;
  fragmentStrip.classList.remove("is-dragging");
  if (stripMoved && event) {
    try {
      fragmentStrip.releasePointerCapture(event.pointerId);
    } catch (error) {
      // Ignore when pointer capture is already cleared.
    }
  }
  stripMoved = false;
}

fragmentStrip.addEventListener("pointerup", stopStripDrag);
fragmentStrip.addEventListener("pointercancel", stopStripDrag);
fragmentStrip.addEventListener("pointerleave", stopStripDrag);

renderFrozen();
renderXianse();
