const {
  functions: managementFunctions,
  checks,
  getFunction,
  checkAnswer,
} = window.ManagementFunctionEngine;

const flow = document.querySelector("#managementFlow");
const flowButtons = [...document.querySelectorAll("[data-management-function]")];
const detailNumber = document.querySelector("#managementNumber");
const detailName = document.querySelector("#managementName");
const detailMeaning = document.querySelector("#managementMeaning");
const detailChapter = document.querySelector("#managementChapter");
const featuresList = document.querySelector("#managementFeatures");
const importanceList = document.querySelector("#managementImportance");
const processTitle = document.querySelector("#managementProcessTitle");
const processList = document.querySelector("#managementProcess");
const checkNumber = document.querySelector("#managementCheckNumber");
const checkPrompt = document.querySelector("#managementCheckPrompt");
const checkChoices = [...document.querySelectorAll("[data-management-choice]")];
const checkButton = document.querySelector("#managementCheck");
const nextButton = document.querySelector("#managementNext");
const feedback = document.querySelector("#managementFeedback");

let activeId = "planning";
let questionIndex = 0;
let selectedAnswer = "";

function renderList(element, items, ordered = false) {
  element.innerHTML = items
    .map(
      (item, index) =>
        `<li>${ordered ? `<span>${String(index + 1).padStart(2, "0")}</span>` : ""}<strong>${item}</strong></li>`,
    )
    .join("");
}

function renderFunction(id) {
  const item = getFunction(id);
  activeId = item.id;
  const activeIndex = managementFunctions.findIndex((entry) => entry.id === item.id);
  flow.dataset.activeIndex = String(activeIndex);

  flowButtons.forEach((button) => {
    const active = button.dataset.managementFunction === item.id;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  });

  detailNumber.textContent = item.number;
  detailName.textContent = item.name;
  detailMeaning.textContent = item.meaning;
  detailChapter.textContent = item.chapter;
  detailChapter.href = item.source;
  processTitle.textContent = item.processTitle;
  renderList(featuresList, item.features);
  renderList(importanceList, item.importance);
  renderList(processList, item.process, true);
}

function renderCheck() {
  const question = checks[questionIndex];
  checkNumber.textContent = `${questionIndex + 1}/${checks.length}`;
  checkPrompt.textContent = question.prompt;
  selectedAnswer = "";
  feedback.hidden = true;
  nextButton.hidden = true;
  checkButton.hidden = false;
  checkButton.disabled = true;
  checkChoices.forEach((choice) => {
    choice.classList.remove("selected", "correct", "incorrect");
    choice.disabled = false;
  });
}

function selectAnswer(id) {
  selectedAnswer = id;
  checkButton.disabled = false;
  checkChoices.forEach((choice) => {
    choice.classList.toggle("selected", choice.dataset.managementChoice === id);
  });
}

function gradeCheck() {
  if (!selectedAnswer) return;
  const result = checkAnswer(questionIndex, selectedAnswer);
  feedback.hidden = false;
  feedback.className = result.correct
    ? "management-feedback success"
    : "management-feedback error";
  feedback.textContent = result.correct
    ? `Correct. ${result.explanation}`
    : `Not quite. ${result.explanation}`;

  checkChoices.forEach((choice) => {
    const id = choice.dataset.managementChoice;
    choice.disabled = true;
    choice.classList.toggle("correct", id === result.answer);
    choice.classList.toggle(
      "incorrect",
      id === selectedAnswer && selectedAnswer !== result.answer,
    );
  });
  checkButton.hidden = true;
  nextButton.hidden = false;
  renderFunction(result.answer);
}

flowButtons.forEach((button, index) => {
  button.addEventListener("click", () => renderFunction(button.dataset.managementFunction));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (index + direction + flowButtons.length) % flowButtons.length;
    flowButtons[nextIndex].focus();
    renderFunction(flowButtons[nextIndex].dataset.managementFunction);
  });
});

checkChoices.forEach((choice) => {
  choice.addEventListener("click", () => selectAnswer(choice.dataset.managementChoice));
});

checkButton.addEventListener("click", gradeCheck);
nextButton.addEventListener("click", () => {
  questionIndex = (questionIndex + 1) % checks.length;
  renderCheck();
});

renderFunction(activeId);
renderCheck();
