const {
  number,
  calculateValueAdded,
  calculateExpenditure,
  calculateIncome,
  formatAmount,
} = window.NationalIncomeEngine;

const modeButtons = [...document.querySelectorAll("[data-ni-mode]")];
const modePanels = [...document.querySelectorAll("[data-ni-panel]")];
const resultTitle = document.querySelector("#niResultTitle");
const resultValue = document.querySelector("#niResultValue");
const route = document.querySelector("#niRoute");
const formula = document.querySelector("#niFormula");
const calculateButton = document.querySelector("#niCalculate");
const resetButton = document.querySelector("#niReset");
const practicePrompt = document.querySelector("#niPracticePrompt");
const practiceInput = document.querySelector("#niPracticeAnswer");
const practiceCheck = document.querySelector("#niPracticeCheck");
const practiceFeedback = document.querySelector("#niPracticeFeedback");
const practiceNumber = document.querySelector("#niPracticeNumber");
const practiceNext = document.querySelector("#niPracticeNext");

let activeMode = "income";
let practiceIndex = 0;

const defaults = {
  income: {
    compensation: 1250,
    operatingSurplus: 620,
    mixedIncome: 270,
    incomeNfia: 40,
  },
  valueAdded: {
    primaryOutput: 900,
    primaryIC: 300,
    secondaryOutput: 1500,
    secondaryIC: 700,
    tertiaryOutput: 1300,
    tertiaryIC: 400,
    vaDepreciation: 120,
    vaNfia: 40,
    vaNit: 180,
  },
  expenditure: {
    consumption: 1600,
    investment: 520,
    government: 460,
    exports: 300,
    imports: 180,
    expDepreciation: 120,
    expNfia: 40,
    expNit: 180,
  },
};

const practiceQuestions = [
  {
    prompt:
      "Compensation of employees is ₹1,800 crore, operating surplus ₹900 crore, mixed income ₹300 crore and NFIA ₹50 crore. Find National Income.",
    answer: 3050,
    explanation: "1,800 + 900 + 300 + 50 = ₹3,050 crore.",
  },
  {
    prompt:
      "C = ₹2,500 crore, I = ₹700 crore, G = ₹900 crore, X = ₹500 crore, M = ₹300 crore, depreciation = ₹200 crore, NFIA = ₹50 crore and net indirect taxes = ₹350 crore. Find National Income.",
    answer: 3800,
    explanation: "GDPmp = 4,300; National Income = 4,300 − 200 + 50 − 350 = ₹3,800 crore.",
  },
  {
    prompt:
      "Value of output is ₹3,600 crore and intermediate consumption is ₹1,400 crore. Find gross value added.",
    answer: 2200,
    explanation: "3,600 − 1,400 = ₹2,200 crore.",
  },
  {
    prompt:
      "Compensation of employees is ₹1,450 crore, operating surplus ₹680 crore, mixed income ₹320 crore and NFIA is –₹50 crore. Find National Income.",
    answer: 2400,
    explanation: "1,450 + 680 + 320 − 50 = ₹2,400 crore.",
  },
  {
    prompt:
      "C = ₹1,800 crore, I = ₹500 crore, G = ₹400 crore, X = ₹300 crore, M = ₹200 crore, depreciation = ₹100 crore, NFIA = ₹20 crore and net indirect taxes = ₹150 crore. Find National Income.",
    answer: 2570,
    explanation: "GDPmp = 2,800; National Income = 2,800 − 100 + 20 − 150 = ₹2,570 crore.",
  },
];

function inputValue(id) {
  return number(document.querySelector(`#${id}`).value);
}

function setInput(id, value) {
  document.querySelector(`#${id}`).value = value;
}

function renderRoute(steps) {
  route.innerHTML = steps
    .map(
      (step, index) => `
        <div class="ni-route-step">
          <span>${step.label}</span>
          <strong>${step.value}</strong>
        </div>
        ${
          index < steps.length - 1
            ? `<div class="ni-route-adjustment">${steps[index + 1].adjustment}</div>`
            : ""
        }
      `,
    )
    .join("");
}

function calculateValueAddedMode() {
  const values = calculateValueAdded({
    sectors: [
      { name: "Primary", output: inputValue("primaryOutput"), intermediateConsumption: inputValue("primaryIC") },
      { name: "Secondary", output: inputValue("secondaryOutput"), intermediateConsumption: inputValue("secondaryIC") },
      { name: "Tertiary", output: inputValue("tertiaryOutput"), intermediateConsumption: inputValue("tertiaryIC") },
    ],
    depreciation: inputValue("vaDepreciation"),
    nfia: inputValue("vaNfia"),
    netIndirectTaxes: inputValue("vaNit"),
  });
  resultTitle.textContent = "National Income";
  resultValue.textContent = formatAmount(values.NNPfc);
  formula.textContent =
    "GDPmp = Σ(Value of output − Intermediate consumption)";
  renderRoute([
    { label: "Primary GVA", value: formatAmount(values.sectorResults[0].valueAdded) },
    { label: "Secondary GVA", value: formatAmount(values.sectorResults[1].valueAdded), adjustment: "+" },
    { label: "Tertiary GVA", value: formatAmount(values.sectorResults[2].valueAdded), adjustment: "+" },
    { label: "GDP at market price", value: formatAmount(values.GDPmp), adjustment: "=" },
    { label: "National Income", value: formatAmount(values.NNPfc), adjustment: "− Dep. + NFIA − NIT" },
  ]);
}

function calculateExpenditureMode() {
  const values = calculateExpenditure({
    privateConsumption: inputValue("consumption"),
    grossInvestment: inputValue("investment"),
    governmentExpenditure: inputValue("government"),
    exports: inputValue("exports"),
    imports: inputValue("imports"),
    depreciation: inputValue("expDepreciation"),
    nfia: inputValue("expNfia"),
    netIndirectTaxes: inputValue("expNit"),
  });
  resultTitle.textContent = "National Income";
  resultValue.textContent = formatAmount(values.NNPfc);
  formula.textContent = "GDPmp = C + I + G + (X − M)";
  renderRoute([
    { label: "Consumption", value: formatAmount(inputValue("consumption")) },
    { label: "Investment", value: formatAmount(inputValue("investment")), adjustment: "+" },
    { label: "Government", value: formatAmount(inputValue("government")), adjustment: "+" },
    { label: "Net exports", value: formatAmount(values.netExports), adjustment: "+" },
    { label: "GDP at market price", value: formatAmount(values.GDPmp), adjustment: "=" },
    { label: "National Income", value: formatAmount(values.NNPfc), adjustment: "− Dep. + NFIA − NIT" },
  ]);
}

function calculateIncomeMode() {
  const values = calculateIncome({
    compensation: inputValue("compensation"),
    operatingSurplus: inputValue("operatingSurplus"),
    mixedIncome: inputValue("mixedIncome"),
    nfia: inputValue("incomeNfia"),
  });
  resultTitle.textContent = "National Income";
  resultValue.textContent = formatAmount(values.NNPfc);
  formula.textContent =
    "National Income = Compensation + Operating surplus + Mixed income + NFIA";
  renderRoute([
    { label: "Compensation", value: formatAmount(inputValue("compensation")) },
    { label: "Operating surplus", value: formatAmount(inputValue("operatingSurplus")), adjustment: "+" },
    { label: "Mixed income", value: formatAmount(inputValue("mixedIncome")), adjustment: "+" },
    { label: "Domestic income", value: formatAmount(values.NDPfc), adjustment: "=" },
    { label: "National Income", value: formatAmount(values.NNPfc), adjustment: "+ NFIA" },
  ]);
}

function calculate() {
  const calculators = {
    valueAdded: calculateValueAddedMode,
    expenditure: calculateExpenditureMode,
    income: calculateIncomeMode,
  };
  calculators[activeMode]();
}

function setMode(mode) {
  activeMode = mode;
  modeButtons.forEach((button) => {
    const active = button.dataset.niMode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  modePanels.forEach((panel) => {
    const active = panel.dataset.niPanel === mode;
    panel.hidden = !active;
  });
  calculate();
}

function resetMode() {
  Object.entries(defaults[activeMode]).forEach(([id, value]) => {
    const element = document.querySelector(`#${id}`);
    if (element) element.value = value;
  });
  calculate();
}

function renderPractice() {
  const question = practiceQuestions[practiceIndex];
  practiceNumber.textContent = `${practiceIndex + 1}/5`;
  practicePrompt.textContent = question.prompt;
  practiceInput.value = "";
  practiceFeedback.hidden = true;
  practiceNext.hidden = true;
}

function checkPractice() {
  const question = practiceQuestions[practiceIndex];
  const correct = Math.abs(number(practiceInput.value) - question.answer) <= 0.01;
  practiceFeedback.hidden = false;
  practiceFeedback.className = correct ? "ni-practice-feedback success" : "ni-practice-feedback error";
  practiceFeedback.textContent = correct
    ? `Correct. ${question.explanation}`
    : `Check the route. ${question.explanation}`;
  practiceNext.hidden = false;
}

modeButtons.forEach((button) => {
  button.addEventListener("click", () => setMode(button.dataset.niMode));
});

document.querySelectorAll(".ni-form input, .ni-form select").forEach((control) => {
  control.addEventListener("input", calculate);
});

calculateButton.addEventListener("click", calculate);
resetButton.addEventListener("click", resetMode);
practiceCheck.addEventListener("click", checkPractice);
practiceNext.addEventListener("click", () => {
  practiceIndex = (practiceIndex + 1) % practiceQuestions.length;
  renderPractice();
});

setMode("income");
renderPractice();
