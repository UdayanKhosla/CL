(function attachRatioEngine(root, factory) {
  const engine = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = engine;
  } else {
    root.RatioEngine = engine;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createRatioEngine() {
  const questions = [
    {
      title: "Calculate the Current Ratio",
      prompt:
        "Use the Balance Sheet to find the company's ability to meet its current obligations.",
      difficulty: "Easy",
      category: "Liquidity",
      formula: "Current Assets ÷ Current Liabilities",
      numeratorLabel: "Current Assets",
      denominatorLabel: "Current Liabilities",
      numerator: 4000000,
      denominator: 2000000,
      answer: 2,
      unit: ": 1",
      relevant: ["current-assets-total", "current-liabilities-total"],
      hint: "Both required totals are shown directly in the Balance Sheet.",
      interpretation:
        "A current ratio of 2 : 1 indicates that current assets are twice the current liabilities. Liquidity appears comfortable, though the quality of current assets still matters.",
    },
    {
      title: "Calculate the Quick Ratio",
      prompt:
        "Remove the assets that are not readily available for settling current liabilities.",
      difficulty: "Easy",
      category: "Liquidity",
      formula:
        "Quick Assets ÷ Current Liabilities, where Quick Assets = Current Assets − Inventory − Prepaid Expenses",
      numeratorLabel: "Quick Assets",
      denominatorLabel: "Current Liabilities",
      numerator: 2000000,
      denominator: 2000000,
      answer: 1,
      unit: ": 1",
      relevant: [
        "current-assets-total",
        "inventory",
        "prepaid-expenses",
        "current-liabilities-total",
      ],
      hint:
        "Start with Total Current Assets, then deduct Inventories and Prepaid Expenses.",
      interpretation:
        "A quick ratio of 1 : 1 means liquid assets are equal to current liabilities. The company can cover short-term obligations without relying on inventory sales.",
    },
    {
      title: "Calculate the Debt–Equity Ratio",
      prompt:
        "Measure the relationship between long-term borrowed funds and shareholders' funds.",
      difficulty: "Medium",
      category: "Solvency",
      formula: "Long-term Debt ÷ Shareholders' Funds",
      numeratorLabel: "Long-term Debt",
      denominatorLabel: "Shareholders' Funds",
      numerator: 2000000,
      denominator: 4000000,
      answer: 0.5,
      unit: ": 1",
      relevant: ["long-term-borrowings", "equity-total"],
      hint:
        "Use Long-term Borrowings as debt and Total Shareholders' Funds as equity.",
      interpretation:
        "A debt–equity ratio of 0.5 : 1 means the company uses ₹0.50 of long-term debt for every ₹1 of shareholders' funds, indicating relatively lower financial leverage.",
    },
    {
      title: "Calculate the Inventory Turnover Ratio",
      prompt:
        "Find how many times inventory was converted into cost of revenue during the year.",
      difficulty: "Medium",
      category: "Activity",
      formula: "Cost of Revenue from Operations ÷ Average Inventory",
      numeratorLabel: "Cost of Revenue from Operations",
      denominatorLabel: "Average Inventory",
      numerator: 8000000,
      denominator: 2000000,
      answer: 4,
      unit: "times",
      relevant: ["revenue", "gross-profit", "opening-inventory", "inventory"],
      hint:
        "Cost of Revenue = Revenue from Operations − Gross Profit. Average Inventory uses opening and closing inventory.",
      interpretation:
        "An inventory turnover of 4 times means the average inventory was sold or used four times during the year. Interpretation should be compared with past performance and industry norms.",
    },
    {
      title: "Calculate Return on Investment",
      prompt:
        "Measure the return earned from the total long-term funds employed in the business.",
      difficulty: "Hard",
      category: "Profitability",
      formula:
        "Profit before Interest and Tax ÷ Capital Employed × 100",
      numeratorLabel: "Profit before Interest and Tax",
      denominatorLabel: "Capital Employed",
      numerator: 1200000,
      denominator: 6000000,
      answer: 20,
      unit: "%",
      relevant: [
        "profit-before-tax",
        "finance-costs",
        "equity-total",
        "non-current-liabilities-total",
      ],
      hint:
        "PBIT = Profit before Tax + Finance Costs. Capital Employed = Shareholders' Funds + Non-current Liabilities.",
      interpretation:
        "A return on investment of 20% means the business earned ₹20 before interest and tax for every ₹100 of capital employed.",
    },
  ];

  function parseAmount(value) {
    const cleaned = String(value).replace(/[₹,\s]/g, "");
    return cleaned === "" ? NaN : Number(cleaned);
  }

  function nearlyEqual(actual, expected) {
    return Number.isFinite(actual) && Math.abs(actual - expected) <= 0.01;
  }

  function calculateResult(numerator, denominator, unit) {
    if (
      !Number.isFinite(numerator) ||
      !Number.isFinite(denominator) ||
      denominator === 0
    ) {
      return NaN;
    }
    return unit === "%"
      ? (numerator / denominator) * 100
      : numerator / denominator;
  }

  function formatResult(value) {
    if (!Number.isFinite(value)) return "—";
    return Number(value.toFixed(2)).toString();
  }

  function formatIndianAmount(value) {
    if (!Number.isFinite(value)) return "—";
    return `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(value)}`;
  }

  function validateWorking(question, numerator, denominator) {
    const result = calculateResult(numerator, denominator, question.unit);
    return {
      result,
      correct:
        nearlyEqual(numerator, question.numerator) &&
        nearlyEqual(denominator, question.denominator) &&
        nearlyEqual(result, question.answer),
    };
  }

  return {
    questions,
    parseAmount,
    calculateResult,
    formatResult,
    formatIndianAmount,
    validateWorking,
  };
});
