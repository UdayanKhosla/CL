(function attachCashFlowEngine(root, factory) {
  const engine = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = engine;
  } else {
    root.CashFlowEngine = engine;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createCashFlowEngine() {
  const activities = {
    operating: {
      label: "Operating",
      shortRule: "Principal revenue-producing activities",
    },
    investing: {
      label: "Investing",
      shortRule: "Long-term assets and non-cash-equivalent investments",
    },
    financing: {
      label: "Financing",
      shortRule: "Owners' capital and borrowings",
    },
  };

  const questions = [
    {
      id: "O01",
      activity: "operating",
      difficulty: "Core",
      flow: "Cash inflow",
      amount: "₹18,40,000",
      prompt: "Cash received from customers for goods sold during the year.",
      explanation:
        "Customer receipts arise from the company's principal revenue-producing activity.",
    },
    {
      id: "I01",
      activity: "investing",
      difficulty: "Core",
      flow: "Cash outflow",
      amount: "₹12,00,000",
      prompt: "Machinery purchased and paid for immediately.",
      explanation:
        "Machinery is a long-term asset, so its cash purchase is an investing outflow.",
    },
    {
      id: "F01",
      activity: "financing",
      difficulty: "Core",
      flow: "Cash inflow",
      amount: "₹25,00,000",
      prompt: "Equity shares issued for cash.",
      explanation:
        "Issuing shares changes owners' capital and creates a financing inflow.",
    },
    {
      id: "O02",
      activity: "operating",
      difficulty: "Core",
      flow: "Cash outflow",
      amount: "₹9,60,000",
      prompt: "Payment made to suppliers for inventory purchased.",
      explanation:
        "Payments to suppliers for stock used in normal trading are operating outflows.",
    },
    {
      id: "I02",
      activity: "investing",
      difficulty: "Core",
      flow: "Cash inflow",
      amount: "₹4,80,000",
      prompt: "Cash received from the sale of an old machine.",
      explanation:
        "Disposal of a long-term asset produces an investing inflow.",
    },
    {
      id: "F02",
      activity: "financing",
      difficulty: "Core",
      flow: "Cash inflow",
      amount: "₹15,00,000",
      prompt: "Preference shares issued for cash.",
      explanation:
        "A cash issue of preference shares increases owners' capital, so it is financing.",
    },
    {
      id: "O03",
      activity: "operating",
      difficulty: "Core",
      flow: "Cash outflow",
      amount: "₹6,40,000",
      prompt: "Salaries and wages paid to employees.",
      explanation:
        "Employee payments support normal business operations and are operating outflows.",
    },
    {
      id: "I03",
      activity: "investing",
      difficulty: "Core",
      flow: "Cash outflow",
      amount: "₹30,00,000",
      prompt: "Land purchased for a new factory.",
      explanation:
        "Land is a long-term asset; cash paid to acquire it is an investing outflow.",
    },
    {
      id: "F03",
      activity: "financing",
      difficulty: "Core",
      flow: "Cash inflow",
      amount: "₹20,00,000",
      prompt: "Debentures issued to the public for cash.",
      explanation:
        "Debentures create a borrowing and therefore generate a financing inflow.",
    },
    {
      id: "O04",
      activity: "operating",
      difficulty: "Core",
      flow: "Cash outflow",
      amount: "₹3,60,000",
      prompt: "Office rent paid for the year.",
      explanation:
        "Office rent is a routine expense of running the business, so it is operating.",
    },
    {
      id: "I04",
      activity: "investing",
      difficulty: "Core",
      flow: "Cash inflow",
      amount: "₹42,00,000",
      prompt: "A building owned by the company was sold for cash.",
      explanation:
        "Cash from disposal of a long-term asset is an investing inflow.",
    },
    {
      id: "F04",
      activity: "financing",
      difficulty: "Core",
      flow: "Cash inflow",
      amount: "₹18,00,000",
      prompt: "A five-year bank loan was received.",
      explanation:
        "Receiving a long-term borrowing changes the company's financing structure.",
    },
    {
      id: "O05",
      activity: "operating",
      difficulty: "Core",
      flow: "Cash inflow",
      amount: "₹2,40,000",
      prompt: "Commission received from the company's normal agency services.",
      explanation:
        "Commission earned from the main business is an operating receipt.",
    },
    {
      id: "I05",
      activity: "investing",
      difficulty: "Applied",
      flow: "Cash outflow",
      amount: "₹7,20,000",
      prompt: "A patent was purchased for cash.",
      explanation:
        "A patent is an intangible long-term asset, making the payment an investing outflow.",
    },
    {
      id: "F05",
      activity: "financing",
      difficulty: "Applied",
      flow: "Cash inflow",
      amount: "₹8,00,000",
      prompt: "Cash credit was drawn from the bank.",
      explanation:
        "CBSE treats cash credit as a short-term borrowing, so the receipt is financing.",
    },
    {
      id: "O06",
      activity: "operating",
      difficulty: "Core",
      flow: "Cash inflow",
      amount: "₹3,20,000",
      prompt: "Royalty and service-fee revenue was received in cash.",
      explanation:
        "Royalties and fees earned through normal activities are operating inflows.",
    },
    {
      id: "I06",
      activity: "investing",
      difficulty: "Core",
      flow: "Cash outflow",
      amount: "₹10,00,000",
      prompt: "Non-current investments were purchased for cash.",
      explanation:
        "Investments not treated as cash equivalents or trading stock belong to investing.",
    },
    {
      id: "F06",
      activity: "financing",
      difficulty: "Applied",
      flow: "Cash inflow",
      amount: "₹5,00,000",
      prompt: "The company used a new bank-overdraft borrowing.",
      explanation:
        "Under the CBSE syllabus note, bank overdraft is treated as a short-term borrowing.",
    },
    {
      id: "O07",
      activity: "operating",
      difficulty: "Applied",
      flow: "Cash outflow",
      amount: "₹1,80,000",
      prompt: "Insurance premium for the company's normal operations was paid.",
      explanation:
        "Insurance paid in the ordinary course of business is an operating outflow.",
    },
    {
      id: "I07",
      activity: "investing",
      difficulty: "Core",
      flow: "Cash inflow",
      amount: "₹8,40,000",
      prompt: "Non-current investments were sold for cash.",
      explanation:
        "Cash from selling a non-cash-equivalent investment is an investing inflow.",
    },
    {
      id: "F07",
      activity: "financing",
      difficulty: "Applied",
      flow: "Cash outflow",
      amount: "₹6,00,000",
      prompt: "Preference shares were redeemed for cash.",
      explanation:
        "Redemption reduces owners' capital and is therefore a financing outflow.",
    },
    {
      id: "O08",
      activity: "operating",
      difficulty: "Applied",
      flow: "Cash outflow",
      amount: "₹4,20,000",
      prompt: "Income tax on normal business profit was paid.",
      explanation:
        "Income tax is normally operating unless it can be specifically linked to investing or financing.",
    },
    {
      id: "I08",
      activity: "investing",
      difficulty: "Applied",
      flow: "Cash outflow",
      amount: "₹9,00,000",
      prompt: "A loan was advanced to another company by this non-financial company.",
      explanation:
        "For a non-financial company, a loan advanced to a third party is an investing outflow.",
    },
    {
      id: "F08",
      activity: "financing",
      difficulty: "Applied",
      flow: "Cash outflow",
      amount: "₹7,50,000",
      prompt: "The company bought back its own equity shares.",
      explanation:
        "A share buyback reduces owners' capital, so the cash payment is financing.",
    },
    {
      id: "O09",
      activity: "operating",
      difficulty: "Applied",
      flow: "Cash inflow",
      amount: "₹1,20,000",
      prompt: "A refund of income tax on normal business profit was received.",
      explanation:
        "A tax refund follows the classification of the related normal business tax: operating.",
    },
    {
      id: "I09",
      activity: "investing",
      difficulty: "Applied",
      flow: "Cash inflow",
      amount: "₹3,00,000",
      prompt: "Another company repaid a loan previously advanced by this non-financial company.",
      explanation:
        "Repayment of a third-party loan advanced by a non-financial company is investing.",
    },
    {
      id: "F09",
      activity: "financing",
      difficulty: "Core",
      flow: "Cash outflow",
      amount: "₹12,00,000",
      prompt: "Debentures were redeemed on maturity.",
      explanation:
        "Repaying debenture borrowings is a financing outflow.",
    },
    {
      id: "O10",
      activity: "operating",
      difficulty: "Core",
      flow: "Cash inflow",
      amount: "₹11,20,000",
      prompt: "Cash was collected from trade receivables.",
      explanation:
        "Trade receivables arise from revenue operations, so their collection is operating.",
    },
    {
      id: "I10",
      activity: "investing",
      difficulty: "Exam twist",
      flow: "Cash inflow",
      amount: "₹96,000",
      prompt: "Interest was received on debentures held as an investment by a non-financial company.",
      explanation:
        "For a non-financial company, interest received on investments is an investing inflow.",
    },
    {
      id: "F10",
      activity: "financing",
      difficulty: "Core",
      flow: "Cash outflow",
      amount: "₹4,00,000",
      prompt: "A portion of the long-term bank loan was repaid.",
      explanation:
        "Repayment of borrowed principal is a financing outflow.",
    },
    {
      id: "O11",
      activity: "operating",
      difficulty: "Core",
      flow: "Cash outflow",
      amount: "₹7,80,000",
      prompt: "Stock-in-trade was purchased for cash.",
      explanation:
        "Inventory bought for resale is part of the principal trading activity and is operating.",
    },
    {
      id: "I11",
      activity: "investing",
      difficulty: "Exam twist",
      flow: "Cash inflow",
      amount: "₹1,44,000",
      prompt: "Dividend was received on shares held as an investment by a non-financial company.",
      explanation:
        "For a non-financial company, dividend received on an investment is an investing inflow.",
    },
    {
      id: "F11",
      activity: "financing",
      difficulty: "Applied",
      flow: "Cash outflow",
      amount: "₹2,00,000",
      prompt: "Part of the bank cash-credit borrowing was repaid.",
      explanation:
        "Repayment of a short-term borrowing is a financing outflow.",
    },
    {
      id: "O12",
      activity: "operating",
      difficulty: "Core",
      flow: "Cash inflow",
      amount: "₹14,40,000",
      prompt: "Cash was received for services rendered to clients.",
      explanation:
        "Service revenue is part of normal operations, making the receipt operating.",
    },
    {
      id: "I12",
      activity: "investing",
      difficulty: "Exam twist",
      flow: "Cash outflow",
      amount: "₹6,00,000",
      prompt: "Development expenditure that qualified for capitalization was paid in cash.",
      explanation:
        "Capitalized development cost creates a long-term asset and is an investing outflow.",
    },
    {
      id: "F12",
      activity: "financing",
      difficulty: "Exam twist",
      flow: "Cash outflow",
      amount: "₹1,80,000",
      prompt: "Interest was paid on a long-term bank loan by a non-financial company.",
      explanation:
        "For a non-financial company, interest paid on borrowings is classified as financing.",
    },
    {
      id: "O13",
      activity: "operating",
      difficulty: "Applied",
      flow: "Cash outflow",
      amount: "₹5,40,000",
      prompt: "Factory power, fuel and routine production overheads were paid.",
      explanation:
        "Routine manufacturing costs support principal revenue production and are operating.",
    },
    {
      id: "I13",
      activity: "investing",
      difficulty: "Core",
      flow: "Cash outflow",
      amount: "₹4,50,000",
      prompt: "Office furniture was purchased for cash.",
      explanation:
        "Furniture is a long-term asset, so its purchase is an investing outflow.",
    },
    {
      id: "F13",
      activity: "financing",
      difficulty: "Exam twist",
      flow: "Cash outflow",
      amount: "₹2,40,000",
      prompt: "Interest was paid on debentures by a non-financial company.",
      explanation:
        "For a non-financial company, interest paid on debentures is a financing outflow.",
    },
    {
      id: "O14",
      activity: "operating",
      difficulty: "Applied",
      flow: "Cash inflow",
      amount: "₹3,60,000",
      prompt: "An advance was received from a customer against goods to be supplied.",
      explanation:
        "The advance comes from a customer in the normal revenue cycle, so it is operating.",
    },
    {
      id: "I14",
      activity: "investing",
      difficulty: "Applied",
      flow: "Cash outflow",
      amount: "₹9,60,000",
      prompt: "Business software was purchased and recognized as an intangible asset.",
      explanation:
        "Acquisition of an intangible long-term asset is an investing outflow.",
    },
    {
      id: "F14",
      activity: "financing",
      difficulty: "Exam twist",
      flow: "Cash outflow",
      amount: "₹3,20,000",
      prompt: "Equity dividend was paid to shareholders.",
      explanation:
        "Dividend paid is a return to owners and is classified as a financing outflow.",
    },
    {
      id: "O15",
      activity: "operating",
      difficulty: "Exam twist",
      flow: "Cash outflow",
      amount: "₹16,00,000",
      prompt: "A share-broking company purchased shares that it holds for trading.",
      explanation:
        "For a dealer or broker, trading securities are part of principal operations.",
    },
    {
      id: "I15",
      activity: "investing",
      difficulty: "Exam twist",
      flow: "Cash outflow",
      amount: "₹1,50,000",
      prompt: "Capital-gains tax specifically linked to the cash sale of a building was paid.",
      explanation:
        "Tax specifically identifiable with an investing transaction follows that transaction.",
    },
    {
      id: "F15",
      activity: "financing",
      difficulty: "Exam twist",
      flow: "Cash outflow",
      amount: "₹1,20,000",
      prompt: "Preference dividend was paid to shareholders.",
      explanation:
        "Dividend paid is a financing outflow because it is a return on owners' capital.",
    },
    {
      id: "O16",
      activity: "operating",
      difficulty: "Exam twist",
      flow: "Cash inflow",
      amount: "₹8,40,000",
      prompt: "A finance company received interest on loans made in its ordinary business.",
      explanation:
        "For a financial enterprise, interest received through its principal business is operating.",
    },
    {
      id: "I16",
      activity: "investing",
      difficulty: "Exam twist",
      flow: "Cash outflow",
      amount: "₹5,00,000",
      prompt: "The principal instalment was paid on machinery bought through deferred payment.",
      explanation:
        "The principal portion acquires the long-term asset and is investing; interest is financing.",
    },
    {
      id: "F16",
      activity: "financing",
      difficulty: "Exam twist",
      flow: "Cash outflow",
      amount: "₹72,000",
      prompt: "Tax specifically payable on dividend distribution was paid.",
      explanation:
        "NCERT classifies tax on dividend distribution with the related financing cash flow.",
    },
    {
      id: "O17",
      activity: "operating",
      difficulty: "Exam twist",
      flow: "Cash inflow",
      amount: "₹2,80,000",
      prompt: "A finance company received dividend on securities held in its ordinary business.",
      explanation:
        "For a financial enterprise, dividend received through principal activities is operating.",
    },
    {
      id: "I17",
      activity: "investing",
      difficulty: "Applied",
      flow: "Cash outflow",
      amount: "₹11,00,000",
      prompt: "Purchased goodwill of another business was paid for in cash.",
      explanation:
        "Purchased goodwill is an intangible long-term asset, so the payment is investing.",
    },
  ];

  function shuffle(items, random = Math.random) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(random() * (index + 1));
      [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
    }
    return copy;
  }

  function createDeck(random = Math.random) {
    return shuffle(questions, random);
  }

  function categoryCounts(items = questions) {
    return items.reduce(
      (counts, question) => {
        counts[question.activity] += 1;
        return counts;
      },
      { operating: 0, investing: 0, financing: 0 },
    );
  }

  function summarizeResults(results) {
    const summary = {
      operating: { correct: 0, attempted: 0, percentage: 0 },
      investing: { correct: 0, attempted: 0, percentage: 0 },
      financing: { correct: 0, attempted: 0, percentage: 0 },
      correct: 0,
      attempted: results.length,
      mastery: 0,
    };

    results.forEach((result) => {
      const bucket = summary[result.activity];
      bucket.attempted += 1;
      if (result.correct) {
        bucket.correct += 1;
        summary.correct += 1;
      }
    });

    Object.keys(activities).forEach((activity) => {
      const bucket = summary[activity];
      bucket.percentage = bucket.attempted
        ? Math.round((bucket.correct / bucket.attempted) * 100)
        : 0;
    });

    const completedCategories = Object.keys(activities).filter(
      (activity) => summary[activity].attempted > 0,
    );
    summary.mastery = completedCategories.length
      ? Math.round(
          completedCategories.reduce(
            (total, activity) => total + summary[activity].percentage,
            0,
          ) / completedCategories.length,
        )
      : 0;

    return summary;
  }

  return {
    activities,
    questions,
    shuffle,
    createDeck,
    categoryCounts,
    summarizeResults,
  };
});
