const {
  activities,
  createDeck,
  summarizeResults,
} = window.CashFlowEngine;

const elements = {
  game: document.querySelector("#cashFlowGame"),
  progressFill: document.querySelector("#cashFlowProgress"),
  questionNumber: document.querySelector("#cashFlowQuestionNumber"),
  questionTotal: document.querySelector("#cashFlowQuestionTotal"),
  score: document.querySelector("#cashFlowScore"),
  streak: document.querySelector("#cashFlowStreak"),
  difficulty: document.querySelector("#cashFlowDifficulty"),
  direction: document.querySelector("#cashFlowDirection"),
  amount: document.querySelector("#cashFlowAmount"),
  prompt: document.querySelector("#cashFlowPrompt"),
  answerButtons: [...document.querySelectorAll("[data-activity-choice]")],
  feedback: document.querySelector("#cashFlowFeedback"),
  feedbackResult: document.querySelector("#cashFlowFeedbackResult"),
  feedbackTitle: document.querySelector("#cashFlowFeedbackTitle"),
  feedbackText: document.querySelector("#cashFlowFeedbackText"),
  nextButton: document.querySelector("#cashFlowNext"),
  questionView: document.querySelector("#cashFlowQuestionView"),
  completionView: document.querySelector("#cashFlowCompletion"),
  finalCorrect: document.querySelector("#cashFlowFinalCorrect"),
  finalMastery: document.querySelector("#cashFlowFinalMastery"),
  finalStreak: document.querySelector("#cashFlowFinalStreak"),
  completionMessage: document.querySelector("#cashFlowCompletionMessage"),
  reviewButton: document.querySelector("#cashFlowReview"),
  restartButton: document.querySelector("#cashFlowRestart"),
  modeLabel: document.querySelector("#cashFlowMode"),
  liveMastery: {
    operating: document.querySelector("#operatingMastery"),
    investing: document.querySelector("#investingMastery"),
    financing: document.querySelector("#financingMastery"),
  },
  liveMasteryValue: {
    operating: document.querySelector("#operatingMasteryValue"),
    investing: document.querySelector("#investingMasteryValue"),
    financing: document.querySelector("#financingMasteryValue"),
  },
  finalMasteryRows: {
    operating: document.querySelector("#finalOperating"),
    investing: document.querySelector("#finalInvesting"),
    financing: document.querySelector("#finalFinancing"),
  },
  celebration: document.querySelector("#cashFlowCelebration"),
};

let deck = [];
let questionIndex = 0;
let results = [];
let streak = 0;
let bestStreak = 0;
let locked = false;
let reviewMode = false;

function currentQuestion() {
  return deck[questionIndex];
}

function updateMastery() {
  const summary = summarizeResults(results);
  Object.keys(activities).forEach((activity) => {
    const bucket = summary[activity];
    elements.liveMastery[activity].style.width = `${bucket.percentage}%`;
    elements.liveMasteryValue[activity].textContent = bucket.attempted
      ? `${bucket.correct}/${bucket.attempted}`
      : "—";
  });
}

function resetAnswerButtons() {
  elements.answerButtons.forEach((button) => {
    button.disabled = false;
    button.classList.remove("correct", "wrong", "dimmed");
  });
}

function renderQuestion() {
  const question = currentQuestion();
  locked = false;
  resetAnswerButtons();
  elements.feedback.hidden = true;
  elements.nextButton.hidden = true;
  elements.questionNumber.textContent = String(questionIndex + 1);
  elements.questionTotal.textContent = String(deck.length);
  elements.score.textContent = String(results.filter((result) => result.correct).length);
  elements.streak.textContent = String(streak);
  elements.difficulty.textContent = question.difficulty;
  elements.direction.textContent = question.flow;
  elements.direction.className =
    question.flow === "Cash inflow" ? "cash-direction inflow" : "cash-direction outflow";
  elements.amount.textContent = question.amount;
  elements.prompt.textContent = question.prompt;
  elements.progressFill.style.width = `${(questionIndex / deck.length) * 100}%`;
  elements.modeLabel.textContent = reviewMode ? "Mistake review" : "50-card sprint";
}

function createCelebration() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  elements.celebration.innerHTML = "";
  const colors = ["#145cf2", "#168368", "#f3b33d", "#ec4e4e"];
  for (let index = 0; index < 18; index += 1) {
    const particle = document.createElement("span");
    particle.style.setProperty("--x", `${Math.round((Math.random() - 0.5) * 240)}px`);
    particle.style.setProperty("--y", `${Math.round(80 + Math.random() * 100)}px`);
    particle.style.setProperty("--r", `${Math.round(Math.random() * 240)}deg`);
    particle.style.background = colors[index % colors.length];
    elements.celebration.appendChild(particle);
  }
  elements.celebration.classList.remove("burst");
  window.requestAnimationFrame(() => elements.celebration.classList.add("burst"));
}

function selectActivity(selectedActivity) {
  if (locked) return;
  locked = true;

  const question = currentQuestion();
  const correct = selectedActivity === question.activity;
  results.push({
    id: question.id,
    activity: question.activity,
    selectedActivity,
    correct,
  });

  if (correct) {
    streak += 1;
    bestStreak = Math.max(bestStreak, streak);
    if (streak > 0 && streak % 5 === 0) createCelebration();
  } else {
    streak = 0;
  }

  elements.answerButtons.forEach((button) => {
    button.disabled = true;
    const activity = button.dataset.activityChoice;
    if (activity === question.activity) button.classList.add("correct");
    if (activity === selectedActivity && !correct) button.classList.add("wrong");
    if (activity !== question.activity && activity !== selectedActivity) {
      button.classList.add("dimmed");
    }
  });

  const correctLabel = activities[question.activity].label;
  elements.feedback.hidden = false;
  elements.feedback.className = correct
    ? "cashflow-feedback success"
    : "cashflow-feedback error";
  elements.feedbackResult.textContent = correct ? "Correct classification" : "Review the rule";
  elements.feedbackTitle.textContent = correct
    ? `${correctLabel} is right.`
    : `This belongs to ${correctLabel}.`;
  elements.feedbackText.textContent = question.explanation;
  elements.nextButton.hidden = false;
  elements.nextButton.innerHTML =
    questionIndex === deck.length - 1
      ? 'See results <span>→</span>'
      : 'Next card <span>→</span>';
  elements.score.textContent = String(results.filter((result) => result.correct).length);
  elements.streak.textContent = String(streak);
  elements.progressFill.style.width = `${((questionIndex + 1) / deck.length) * 100}%`;
  updateMastery();
}

function resultMessage(summary) {
  if (summary.mastery >= 90) {
    return "Excellent classification. You are reading the purpose of each cash movement, including the exam-twist items.";
  }
  if (summary.mastery >= 75) {
    return "Strong run. Review the category with the lowest mastery, especially the interest and dividend rules.";
  }
  if (summary.mastery >= 55) {
    return "The foundation is there. Use the mistake review to separate long-term assets from capital and borrowing decisions.";
  }
  return "Good first pass. Focus on the three anchors: daily business, long-term assets, and capital or borrowings.";
}

function showCompletion() {
  const summary = summarizeResults(results);
  elements.questionView.hidden = true;
  elements.completionView.hidden = false;
  elements.finalCorrect.textContent = `${summary.correct}/${summary.attempted}`;
  elements.finalMastery.textContent = `${summary.mastery}%`;
  elements.finalStreak.textContent = String(bestStreak);
  elements.completionMessage.textContent = resultMessage(summary);

  Object.keys(activities).forEach((activity) => {
    const row = elements.finalMasteryRows[activity];
    const bucket = summary[activity];
    row.querySelector("strong").textContent = `${bucket.percentage}%`;
    row.querySelector("span").style.width = `${bucket.percentage}%`;
    row.querySelector("small").textContent =
      `${bucket.correct} of ${bucket.attempted} correct`;
  });

  const mistakes = results.filter((result) => !result.correct);
  elements.reviewButton.hidden = mistakes.length === 0 || reviewMode;
  elements.reviewButton.dataset.mistakes = mistakes.map((result) => result.id).join(",");
  if (summary.mastery >= 90) createCelebration();
  elements.game.scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "start",
  });
}

function nextQuestion() {
  if (!locked) return;
  if (questionIndex === deck.length - 1) {
    showCompletion();
    return;
  }
  questionIndex += 1;
  renderQuestion();
}

function startSession(nextDeck, isReview = false) {
  deck = nextDeck;
  questionIndex = 0;
  results = [];
  streak = 0;
  bestStreak = 0;
  locked = false;
  reviewMode = isReview;
  elements.questionView.hidden = false;
  elements.completionView.hidden = true;
  Object.keys(activities).forEach((activity) => {
    elements.liveMastery[activity].style.width = "0%";
    elements.liveMasteryValue[activity].textContent = "—";
  });
  renderQuestion();
}

elements.answerButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectActivity(button.dataset.activityChoice);
  });
});

elements.nextButton.addEventListener("click", nextQuestion);
elements.restartButton.addEventListener("click", () => startSession(createDeck()));
elements.reviewButton.addEventListener("click", () => {
  const mistakeIds = new Set(
    elements.reviewButton.dataset.mistakes.split(",").filter(Boolean),
  );
  const reviewDeck = createDeck().filter((question) => mistakeIds.has(question.id));
  startSession(reviewDeck, true);
});

document.addEventListener("keydown", (event) => {
  if (elements.questionView.hidden) return;
  const keyMap = {
    o: "operating",
    i: "investing",
    f: "financing",
    "1": "operating",
    "2": "investing",
    "3": "financing",
  };
  if (keyMap[event.key.toLowerCase()]) {
    selectActivity(keyMap[event.key.toLowerCase()]);
  }
  if ((event.key === "Enter" || event.key === " ") && locked) {
    event.preventDefault();
    nextQuestion();
  }
});

startSession(createDeck());
