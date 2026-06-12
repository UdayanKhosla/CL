const {
  questions,
  parseAmount,
  calculateResult,
  formatResult,
  formatIndianAmount,
  validateWorking,
} = window.RatioEngine;

const elements = {
  roundNumber: document.querySelector("#roundNumber"),
  scoreValue: document.querySelector("#scoreValue"),
  progress: [...document.querySelectorAll(".round-progress span")],
  difficulty: document.querySelector("#difficultyLabel"),
  category: document.querySelector("#ratioCategory"),
  title: document.querySelector("#challengeTitle"),
  prompt: document.querySelector("#questionPrompt"),
  formulaButton: document.querySelector("#formulaButton"),
  formulaPanel: document.querySelector("#formulaPanel"),
  formulaText: document.querySelector("#formulaText"),
  numeratorLabel: document.querySelector("#numeratorLabel"),
  denominatorLabel: document.querySelector("#denominatorLabel"),
  numeratorInput: document.querySelector("#numeratorInput"),
  denominatorInput: document.querySelector("#denominatorInput"),
  calculatedValue: document.querySelector("#calculatedValue"),
  answerUnit: document.querySelector("#answerUnit"),
  checkButton: document.querySelector("#checkButton"),
  hintButton: document.querySelector("#hintButton"),
  feedback: document.querySelector("#feedbackPanel"),
  feedbackTitle: document.querySelector("#feedbackTitle"),
  feedbackText: document.querySelector("#feedbackText"),
  interpretationPanel: document.querySelector("#interpretationPanel"),
  interpretationText: document.querySelector("#interpretationText"),
  nextButton: document.querySelector("#nextButton"),
  questionView: document.querySelector("#questionView"),
  completionView: document.querySelector("#completionView"),
  finalScore: document.querySelector("#finalScore"),
  completionMessage: document.querySelector("#completionMessage"),
  restartButton: document.querySelector("#restartButton"),
  tabs: [...document.querySelectorAll(".statement-tabs button")],
  views: [...document.querySelectorAll(".statement-view")],
  statementRows: [...document.querySelectorAll(".statement-row")],
  clearPinsButton: document.querySelector("#clearPinsButton"),
  pinCount: document.querySelector("#pinCount"),
};

let questionIndex = 0;
let score = 0;
let availablePoints = 100;
let hintUsed = false;
let solved = false;

function scrollToGame() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelector(".ratio-game").scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "start",
  });
}

function currentCalculation() {
  const numerator = parseAmount(elements.numeratorInput.value);
  const denominator = parseAmount(elements.denominatorInput.value);
  const question = questions[questionIndex];

  const result = calculateResult(numerator, denominator, question.unit);
  return { numerator, denominator, result };
}

function updateCalculatedValue() {
  const { result } = currentCalculation();
  elements.calculatedValue.textContent = formatResult(result);
}

function clearRowStates() {
  elements.statementRows.forEach((row) => {
    row.classList.remove("pinned", "relevant-figure");
    row.setAttribute("aria-pressed", "false");
  });
  elements.pinCount.textContent = "0";
}

function showStatementView(viewId) {
  elements.tabs.forEach((tab) => {
    const selected = tab.getAttribute("aria-controls") === viewId;
    tab.classList.toggle("active", selected);
    tab.setAttribute("aria-selected", String(selected));
  });
  elements.views.forEach((view) => {
    const selected = view.id === viewId;
    view.classList.toggle("active", selected);
    view.hidden = !selected;
  });
}

function renderQuestion() {
  const question = questions[questionIndex];
  availablePoints = 100;
  hintUsed = false;
  solved = false;

  elements.roundNumber.textContent = String(questionIndex + 1);
  elements.scoreValue.textContent = String(score);
  elements.difficulty.textContent = question.difficulty;
  elements.category.textContent = question.category;
  elements.title.textContent = question.title;
  elements.prompt.textContent = question.prompt;
  elements.formulaText.textContent = question.formula;
  elements.numeratorLabel.textContent = question.numeratorLabel;
  elements.denominatorLabel.textContent = question.denominatorLabel;
  elements.answerUnit.textContent = question.unit;
  elements.numeratorInput.value = "";
  elements.denominatorInput.value = "";
  elements.calculatedValue.textContent = "—";
  elements.formulaPanel.hidden = true;
  elements.formulaButton.textContent = "Show formula";
  elements.feedback.hidden = true;
  elements.feedback.className = "ratio-feedback";
  elements.interpretationPanel.hidden = true;
  elements.nextButton.hidden = true;
  elements.checkButton.disabled = false;
  elements.hintButton.disabled = false;
  clearRowStates();
  showStatementView("balancePanel");

  elements.progress.forEach((step, index) => {
    step.classList.toggle("complete", index < questionIndex);
    step.classList.toggle("active", index === questionIndex);
  });
}

function revealRelevantFigures() {
  const relevant = new Set(questions[questionIndex].relevant);
  elements.statementRows.forEach((row) => {
    row.classList.toggle("relevant-figure", relevant.has(row.dataset.key));
  });
}

function showHint() {
  if (!hintUsed) {
    availablePoints = Math.max(availablePoints - 15, 50);
    hintUsed = true;
  }
  elements.formulaPanel.hidden = false;
  elements.formulaButton.textContent = "Formula shown";
  elements.feedback.hidden = false;
  elements.feedback.className = "ratio-feedback hint";
  elements.feedbackTitle.textContent = "Hint";
  elements.feedbackText.textContent = questions[questionIndex].hint;
  elements.interpretationPanel.hidden = true;
  revealRelevantFigures();
}

function checkWorking() {
  if (solved) return;
  const question = questions[questionIndex];
  const { numerator, denominator, result } = currentCalculation();

  if (!Number.isFinite(result)) {
    elements.feedback.hidden = false;
    elements.feedback.className = "ratio-feedback error";
    elements.feedbackTitle.textContent = "Complete both parts of the working";
    elements.feedbackText.textContent =
      "Enter the complete rupee amounts for the numerator and denominator.";
    return;
  }

  const { correct } = validateWorking(question, numerator, denominator);

  if (!correct) {
    availablePoints = Math.max(availablePoints - 10, 50);
    elements.feedback.hidden = false;
    elements.feedback.className = "ratio-feedback error";
    elements.feedbackTitle.textContent = "Not quite";
    elements.feedbackText.textContent =
      `Your calculation gives ${formatResult(result)} ${question.unit}. Recheck which figures belong in each part of the formula.`;
    elements.interpretationPanel.hidden = true;
    return;
  }

  solved = true;
  score += availablePoints;
  elements.scoreValue.textContent = String(score);
  elements.feedback.hidden = false;
  elements.feedback.className = "ratio-feedback success";
  elements.feedbackTitle.textContent = "Correct working";
  elements.feedbackText.textContent =
    `${formatIndianAmount(question.numerator)} ÷ ${formatIndianAmount(question.denominator)}${question.unit === "%" ? " × 100" : ""} = ${formatResult(question.answer)} ${question.unit}`;
  elements.interpretationText.textContent = question.interpretation;
  elements.interpretationPanel.hidden = false;
  elements.nextButton.hidden = false;
  elements.nextButton.innerHTML =
    questionIndex === questions.length - 1
      ? 'See results <span>→</span>'
      : 'Next ratio <span>→</span>';
  elements.checkButton.disabled = true;
  elements.hintButton.disabled = true;
  elements.progress[questionIndex].classList.remove("active");
  elements.progress[questionIndex].classList.add("complete");
}

function showCompletion() {
  elements.questionView.hidden = true;
  elements.completionView.hidden = false;
  elements.finalScore.textContent = String(score);

  if (score >= 460) {
    elements.completionMessage.textContent =
      "Excellent selection and working. You handled liquidity, solvency, activity and profitability ratios with very little support.";
  } else if (score >= 380) {
    elements.completionMessage.textContent =
      "Strong work. Review the hints you used, then replay once to make the figure selection automatic.";
  } else {
    elements.completionMessage.textContent =
      "Good first run. Replay the challenge and focus on building each numerator and denominator before calculating.";
  }

  scrollToGame();
}

function nextQuestion() {
  if (questionIndex === questions.length - 1) {
    showCompletion();
    return;
  }
  questionIndex += 1;
  renderQuestion();
  scrollToGame();
}

function restart() {
  questionIndex = 0;
  score = 0;
  elements.questionView.hidden = false;
  elements.completionView.hidden = true;
  renderQuestion();
}

elements.numeratorInput.addEventListener("input", updateCalculatedValue);
elements.denominatorInput.addEventListener("input", updateCalculatedValue);
elements.checkButton.addEventListener("click", checkWorking);
elements.hintButton.addEventListener("click", showHint);
elements.formulaButton.addEventListener("click", () => {
  elements.formulaPanel.hidden = !elements.formulaPanel.hidden;
  elements.formulaButton.textContent = elements.formulaPanel.hidden
    ? "Show formula"
    : "Hide formula";
});
elements.nextButton.addEventListener("click", nextQuestion);
elements.restartButton.addEventListener("click", restart);

elements.tabs.forEach((tab) => {
  tab.addEventListener("click", () => showStatementView(tab.getAttribute("aria-controls")));
});

elements.statementRows.forEach((row) => {
  row.tabIndex = 0;
  row.setAttribute("role", "button");
  row.setAttribute("aria-pressed", "false");
  row.addEventListener("click", () => {
    row.classList.toggle("pinned");
    row.setAttribute("aria-pressed", String(row.classList.contains("pinned")));
    elements.pinCount.textContent = String(
      elements.statementRows.filter((item) => item.classList.contains("pinned")).length,
    );
  });
  row.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    row.click();
  });
});

elements.clearPinsButton.addEventListener("click", () => {
  elements.statementRows.forEach((row) => {
    row.classList.remove("pinned");
    row.setAttribute("aria-pressed", "false");
  });
  elements.pinCount.textContent = "0";
});

renderQuestion();
