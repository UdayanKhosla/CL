const NS = "http://www.w3.org/2000/svg";

const scenarios = {
  income: {
    curve: "demand",
    direction: 1,
    shortLabel: "Demand shifts right",
    badge: "Demand change",
    price: "Rises",
    quantity: "Rises",
    assumption:
      "Assumption: the good is normal and supply remains unchanged.",
    cause:
      "An increase in consumer income raises demand for a normal good.",
    tip:
      "Mention that the income effect shown here assumes a normal good. For an inferior good, demand would move in the opposite direction.",
  },
  substitute: {
    curve: "demand",
    direction: 1,
    shortLabel: "Demand shifts right",
    badge: "Demand change",
    price: "Rises",
    quantity: "Rises",
    assumption:
      "Assumption: the two goods are substitutes and supply remains unchanged.",
    cause:
      "When the price of a substitute rises, consumers switch toward this good, increasing its demand.",
    tip:
      "Name the relationship between the goods, state the rightward demand shift, and conclude with both equilibrium effects.",
  },
  complement: {
    curve: "demand",
    direction: 1,
    shortLabel: "Demand shifts right",
    badge: "Demand change",
    price: "Rises",
    quantity: "Rises",
    assumption:
      "Assumption: the goods are complements and supply remains unchanged.",
    cause:
      "A fall in the price of a complementary good makes joint consumption cheaper, increasing demand for this good.",
    tip:
      "Do not describe this as movement along demand: the good’s own price has not caused the change.",
  },
  technology: {
    curve: "supply",
    direction: 1,
    shortLabel: "Supply shifts right",
    badge: "Supply change",
    price: "Falls",
    quantity: "Rises",
    assumption:
      "Assumption: better technology lowers production cost and demand remains unchanged.",
    cause:
      "Improved technology raises productivity and lowers unit cost, increasing supply at each price.",
    tip:
      "Link technology to lower cost or higher productivity before stating the rightward supply shift.",
  },
  "input-cost": {
    curve: "supply",
    direction: -1,
    shortLabel: "Supply shifts left",
    badge: "Supply change",
    price: "Rises",
    quantity: "Falls",
    assumption:
      "Assumption: higher input costs reduce supply while demand remains unchanged.",
    cause:
      "A rise in input costs makes production more expensive, reducing supply at each price.",
    tip:
      "The final effects move in opposite directions: equilibrium price rises while equilibrium quantity falls.",
  },
  tax: {
    curve: "supply",
    direction: -1,
    shortLabel: "Supply shifts left",
    badge: "Supply change",
    price: "Rises",
    quantity: "Falls",
    assumption:
      "Simplified CBSE model: a per-unit tax raises sellers’ cost and demand remains unchanged.",
    cause:
      "A per-unit tax increases the cost of supplying the good, reducing supply at each market price.",
    tip:
      "For this introductory graph, treat the tax as an increase in cost and show a leftward supply shift.",
  },
  subsidy: {
    curve: "supply",
    direction: 1,
    shortLabel: "Supply shifts right",
    badge: "Supply change",
    price: "Falls",
    quantity: "Rises",
    assumption:
      "Simplified CBSE model: a per-unit subsidy lowers sellers’ cost and demand remains unchanged.",
    cause:
      "A per-unit subsidy lowers the effective cost of supplying the good, increasing supply at each market price.",
    tip:
      "Connect the subsidy to lower cost, then state that price falls and equilibrium quantity rises.",
  },
};

const elements = {
  eventSelect: document.querySelector("#eventSelect"),
  resetButton: document.querySelector("#resetButton"),
  copyAnswerButton: document.querySelector("#copyAnswerButton"),
  dragInstruction: document.querySelector("#dragInstruction"),
  dragAmount: document.querySelector("#dragAmount"),
  assumptionText: document.querySelector("#assumptionText"),
  shiftedLegend: document.querySelector("#shiftedLegend"),
  liveLabel: document.querySelector("#liveLabel"),
  curveBadge: document.querySelector("#curveBadge"),
  curveOutcome: document.querySelector("#curveOutcome"),
  priceOutcome: document.querySelector("#priceOutcome"),
  quantityOutcome: document.querySelector("#quantityOutcome"),
  priceIcon: document.querySelector("#priceIcon"),
  quantityIcon: document.querySelector("#quantityIcon"),
  oldValues: document.querySelector("#oldValues"),
  newValues: document.querySelector("#newValues"),
  boardAnswer: document.querySelector("#boardAnswer"),
  answerTip: document.querySelector("#answerTip"),
  graphDescription: document.querySelector("#graphDescription"),
  originalDemandPath: document.querySelector("#originalDemandPath"),
  originalSupplyPath: document.querySelector("#originalSupplyPath"),
  shiftedCurveHit: document.querySelector("#shiftedCurveHit"),
  shiftedCurvePath: document.querySelector("#shiftedCurvePath"),
  oldGuides: document.querySelector("#oldGuides"),
  newGuides: document.querySelector("#newGuides"),
  curveLabels: document.querySelector("#curveLabels"),
  oldPoint: document.querySelector("#oldPoint"),
  newPoint: document.querySelector("#newPoint"),
  grid: document.querySelector(".grid"),
  graphWrap: document.querySelector(".graph-wrap"),
  toast: document.querySelector("#toast"),
};

const plot = {
  left: 72,
  right: 662,
  top: 30,
  bottom: 420,
  maxQ: 10,
  maxP: 10,
};

const base = {
  demandIntercept: 9,
  demandSlope: -0.8,
  supplyIntercept: 1,
  supplySlope: 0.75,
};

let displayedIntensity = 58;
let animationFrame;
let dragState = null;
let toastTimer;

function svgElement(tag, attributes = {}, text = "") {
  const element = document.createElementNS(NS, tag);
  Object.entries(attributes).forEach(([key, value]) =>
    element.setAttribute(key, value),
  );
  if (text) element.textContent = text;
  return element;
}

function drawGrid() {
  for (let index = 1; index <= 5; index += 1) {
    const x = plot.left + ((plot.right - plot.left) / 6) * index;
    const y = plot.top + ((plot.bottom - plot.top) / 6) * index;
    elements.grid.append(svgElement("line", { x1: x, y1: plot.top, x2: x, y2: plot.bottom }));
    elements.grid.append(svgElement("line", { x1: plot.left, y1: y, x2: plot.right, y2: y }));
  }
}

function mapX(quantity) {
  return plot.left + (quantity / plot.maxQ) * (plot.right - plot.left);
}

function mapY(price) {
  return plot.bottom - (price / plot.maxP) * (plot.bottom - plot.top);
}

function priceAt(quantity, intercept, slope) {
  return intercept + slope * quantity;
}

function curvePath(intercept, slope) {
  const points = [];
  for (let quantity = 0; quantity <= plot.maxQ; quantity += 0.1) {
    points.push(
      `${points.length ? "L" : "M"} ${mapX(quantity).toFixed(2)} ${mapY(
        priceAt(quantity, intercept, slope),
      ).toFixed(2)}`,
    );
  }
  return points.join(" ");
}

function equilibrium(demandIntercept, supplyIntercept) {
  const quantity =
    (demandIntercept - supplyIntercept) /
    (base.supplySlope - base.demandSlope);
  const price = supplyIntercept + base.supplySlope * quantity;
  return { quantity, price };
}

function setGroupContent(group, nodes) {
  group.replaceChildren(...nodes);
}

function guideNodes(point, prefix) {
  const x = mapX(point.quantity);
  const y = mapY(point.price);
  return [
    svgElement("line", {
      x1: plot.left,
      y1: y,
      x2: x,
      y2: y,
    }),
    svgElement("line", {
      x1: x,
      y1: y,
      x2: x,
      y2: plot.bottom,
    }),
    svgElement(
      "text",
      { x: plot.left - 14, y: y + 4, "text-anchor": "end" },
      `P${prefix}`,
    ),
    svgElement(
      "text",
      { x, y: plot.bottom + 22, "text-anchor": "middle" },
      `Q${prefix}`,
    ),
  ];
}

function pointNodes(point, prefix) {
  const x = mapX(point.quantity);
  const y = mapY(point.price);
  return [
    svgElement("circle", { cx: x, cy: y, r: 7 }),
    svgElement("text", { x: x + 10, y: y - 10 }, `E${prefix}`),
  ];
}

function curveLabelNodes(scenario, shiftedDemandIntercept, shiftedSupplyIntercept) {
  const demandY = mapY(priceAt(8.5, base.demandIntercept, base.demandSlope));
  const supplyY = mapY(priceAt(8.7, base.supplyIntercept, base.supplySlope));
  const originalDemand = svgElement(
    "text",
    { x: mapX(8.55), y: demandY, fill: "#145cf2" },
    "D₁",
  );
  const originalSupply = svgElement(
    "text",
    { x: mapX(8.8), y: supplyY, fill: "#168368" },
    "S₁",
  );

  if (scenario.curve === "demand") {
    const q = 8.5;
    const y = mapY(priceAt(q, shiftedDemandIntercept, base.demandSlope));
    return [
      originalDemand,
      originalSupply,
      svgElement("text", { x: mapX(q) + 8, y, fill: "#ec4e4e" }, "D₂"),
    ];
  }

  const q = scenario.direction > 0 ? 8.1 : 7.2;
  const y = mapY(priceAt(q, shiftedSupplyIntercept, base.supplySlope));
  return [
    originalDemand,
    originalSupply,
    svgElement("text", { x: mapX(q) + 8, y, fill: "#ec4e4e" }, "S₂"),
  ];
}

function intensityWord(value) {
  if (value < 8) return "No shift";
  if (value < 34) return "Small";
  if (value < 68) return "Moderate";
  return "Large";
}

function formatValues(point) {
  return `P ${Math.round(point.price)} · Q ${Math.round(point.quantity)}`;
}

function buildAnswer(scenario, shifted) {
  const curveName = scenario.curve === "demand" ? "demand" : "supply";
  const curveSymbol = scenario.curve === "demand" ? "D₁ to D₂" : "S₁ to S₂";
  const direction = scenario.direction > 0 ? "right" : "left";

  if (shifted < 0.08) {
    return `${scenario.cause} Drag the red ${curveName} curve to create a visible shift and compare the original and new equilibrium.`;
  }

  return `${scenario.cause} Therefore, the ${curveName} curve shifts ${direction} from ${curveSymbol}. At the new intersection, equilibrium price ${scenario.price.toLowerCase()} and equilibrium quantity ${scenario.quantity.toLowerCase()}.`;
}

function render(intensity) {
  const scenario = scenarios[elements.eventSelect.value];
  const shifted = (intensity / 100) * 2.5;
  let demandIntercept = base.demandIntercept;
  let supplyIntercept = base.supplyIntercept;

  if (scenario.curve === "demand") {
    demandIntercept += shifted * scenario.direction;
  } else {
    supplyIntercept -= shifted * scenario.direction;
  }

  const oldEquilibrium = equilibrium(
    base.demandIntercept,
    base.supplyIntercept,
  );
  const newEquilibrium = equilibrium(demandIntercept, supplyIntercept);

  elements.originalDemandPath.setAttribute(
    "d",
    curvePath(base.demandIntercept, base.demandSlope),
  );
  elements.originalSupplyPath.setAttribute(
    "d",
    curvePath(base.supplyIntercept, base.supplySlope),
  );
  elements.shiftedCurvePath.setAttribute(
    "d",
    scenario.curve === "demand"
      ? curvePath(demandIntercept, base.demandSlope)
      : curvePath(supplyIntercept, base.supplySlope),
  );
  elements.shiftedCurveHit.setAttribute(
    "d",
    scenario.curve === "demand"
      ? curvePath(demandIntercept, base.demandSlope)
      : curvePath(supplyIntercept, base.supplySlope),
  );

  setGroupContent(elements.oldGuides, guideNodes(oldEquilibrium, "₁"));
  setGroupContent(elements.newGuides, guideNodes(newEquilibrium, "₂"));
  setGroupContent(elements.oldPoint, pointNodes(oldEquilibrium, "₁"));
  setGroupContent(elements.newPoint, pointNodes(newEquilibrium, "₂"));
  setGroupContent(
    elements.curveLabels,
    curveLabelNodes(scenario, demandIntercept, supplyIntercept),
  );

  const isEffectivelyZero = intensity < 3;
  const curveResult = isEffectivelyZero
    ? "No visible shift"
    : scenario.shortLabel;
  const priceResult = isEffectivelyZero ? "Unchanged" : scenario.price;
  const quantityResult = isEffectivelyZero ? "Unchanged" : scenario.quantity;

  const curveSymbol = scenario.curve === "demand" ? "D₂" : "S₂";
  const direction = scenario.direction > 0 ? "right" : "left";
  elements.dragInstruction.textContent = `Drag ${curveSymbol} on the graph`;
  elements.dragAmount.textContent = `${intensityWord(intensity)} shift`;
  elements.shiftedCurveHit.setAttribute(
    "aria-label",
    `Shift ${curveSymbol} ${direction}`,
  );
  elements.shiftedCurveHit.setAttribute(
    "aria-valuenow",
    String(Math.round(intensity)),
  );
  elements.shiftedCurveHit.setAttribute(
    "aria-valuetext",
    `${intensityWord(intensity)} shift ${direction}`,
  );
  elements.assumptionText.textContent = scenario.assumption;
  elements.liveLabel.textContent = curveResult;
  elements.curveBadge.textContent = scenario.badge;
  elements.curveOutcome.textContent = curveResult;
  elements.priceOutcome.textContent = priceResult;
  elements.quantityOutcome.textContent = quantityResult;
  elements.priceIcon.textContent = isEffectivelyZero
    ? "→"
    : scenario.price === "Rises"
      ? "↑"
      : "↓";
  elements.quantityIcon.textContent = isEffectivelyZero
    ? "→"
    : scenario.quantity === "Rises"
      ? "↑"
      : "↓";
  elements.oldValues.textContent = formatValues(oldEquilibrium);
  elements.newValues.textContent = formatValues(newEquilibrium);
  elements.boardAnswer.textContent = buildAnswer(scenario, shifted);
  elements.answerTip.textContent = scenario.tip;
  elements.shiftedLegend.innerHTML =
    scenario.curve === "demand"
      ? '<i class="line shifted-curve"></i>D₂ New demand'
      : '<i class="line shifted-curve"></i>S₂ New supply';
  elements.graphDescription.textContent = `${scenario.shortLabel}. Equilibrium price ${scenario.price.toLowerCase()} and equilibrium quantity ${scenario.quantity.toLowerCase()}.`;
}

function animateTo(target) {
  cancelAnimationFrame(animationFrame);
  const start = displayedIntensity;
  const difference = target - start;
  const startTime = performance.now();
  const duration = 170;

  function step(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    displayedIntensity = start + difference * eased;
    render(displayedIntensity);
    if (progress < 1) {
      animationFrame = requestAnimationFrame(step);
    } else {
      displayedIntensity = target;
      render(displayedIntensity);
    }
  }

  animationFrame = requestAnimationFrame(step);
}

function showToast(message) {
  clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("visible");
  toastTimer = setTimeout(() => elements.toast.classList.remove("visible"), 1800);
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function finishDrag(event) {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  dragState = null;
  elements.graphWrap.classList.remove("drag-active");
}

elements.shiftedCurveHit.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  cancelAnimationFrame(animationFrame);
  dragState = {
    pointerId: event.pointerId,
    startX: event.clientX,
    startIntensity: displayedIntensity,
  };
  elements.shiftedCurveHit.setPointerCapture(event.pointerId);
  elements.graphWrap.classList.add("drag-active");
  event.preventDefault();
});

elements.shiftedCurveHit.addEventListener("pointermove", (event) => {
  if (!dragState || event.pointerId !== dragState.pointerId) return;
  const scenario = scenarios[elements.eventSelect.value];
  const graphWidth = elements.graphWrap.getBoundingClientRect().width;
  const dragRange = Math.max(graphWidth * 0.28, 120);
  const delta = event.clientX - dragState.startX;
  displayedIntensity = clamp(
    dragState.startIntensity + (delta / dragRange) * 100 * scenario.direction,
    0,
    100,
  );
  render(displayedIntensity);
});

elements.shiftedCurveHit.addEventListener("pointerup", finishDrag);
elements.shiftedCurveHit.addEventListener("pointercancel", finishDrag);

elements.shiftedCurveHit.addEventListener("keydown", (event) => {
  const scenario = scenarios[elements.eventSelect.value];
  let target = displayedIntensity;

  if (event.key === "ArrowRight") target += 5 * scenario.direction;
  if (event.key === "ArrowLeft") target -= 5 * scenario.direction;
  if (event.key === "Home") target = 0;
  if (event.key === "End") target = 100;
  if (target === displayedIntensity) return;

  event.preventDefault();
  displayedIntensity = clamp(target, 0, 100);
  render(displayedIntensity);
});

elements.eventSelect.addEventListener("change", () => {
  displayedIntensity = 58;
  render(displayedIntensity);
});

elements.resetButton.addEventListener("click", () => {
  elements.eventSelect.value = "income";
  animateTo(58);
});

elements.copyAnswerButton.addEventListener("click", async () => {
  const answer = elements.boardAnswer.textContent.trim();
  try {
    await navigator.clipboard.writeText(answer);
    showToast("Answer copied");
  } catch {
    showToast("Select the answer to copy");
  }
});

drawGrid();
render(displayedIntensity);
