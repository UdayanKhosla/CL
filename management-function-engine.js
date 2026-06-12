(function attachManagementFunctionEngine(root, factory) {
  const engine = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = engine;
  } else {
    root.ManagementFunctionEngine = engine;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createManagementFunctionEngine() {
  const functions = [
    {
      id: "planning",
      number: "01",
      name: "Planning",
      chapter: "NCERT Chapter 4",
      source: "https://ncert.nic.in/textbook/pdf/lebs104.pdf",
      meaning:
        "Deciding in advance what to do and how to do it. It sets objectives and selects the best course of action for achieving them.",
      features: [
        "Focuses on achieving objectives",
        "Primary function of management",
        "Pervasive at every level",
        "Continuous and futuristic",
        "Involves decision-making",
        "An intellectual exercise",
      ],
      importance: [
        "Provides direction",
        "Reduces the risk of uncertainty",
        "Reduces overlapping and wasteful work",
        "Promotes innovative ideas",
        "Facilitates decision-making",
        "Sets standards for controlling",
      ],
      processTitle: "Planning process",
      process: [
        "Setting objectives",
        "Developing premises",
        "Identifying alternative courses of action",
        "Evaluating alternative courses",
        "Selecting an alternative",
        "Implementing the plan",
        "Follow-up action",
      ],
    },
    {
      id: "organizing",
      number: "02",
      name: "Organizing",
      chapter: "NCERT Chapter 5",
      source: "https://ncert.nic.in/textbook/pdf/lebs105.pdf",
      meaning:
        "Identifying and grouping the work to be performed, assigning duties and establishing authority and reporting relationships.",
      features: [
        "Translates plans into action",
        "Identifies and divides work",
        "Groups related activities",
        "Assigns duties and responsibility",
        "Defines authority relationships",
      ],
      importance: [
        "Benefits of specialization",
        "Clarity in working relationships",
        "Optimum use of resources",
        "Adaptation to change",
        "Effective administration",
        "Development of personnel",
        "Expansion and growth",
      ],
      processTitle: "Organizing process",
      process: [
        "Identification and division of work",
        "Departmentalization",
        "Assignment of duties",
        "Establishing reporting relationships",
      ],
    },
    {
      id: "staffing",
      number: "03",
      name: "Staffing",
      chapter: "NCERT Chapter 6",
      source: "https://ncert.nic.in/textbook/pdf/lebs106.pdf",
      meaning:
        "Finding the right people for the right jobs. It fills and keeps filled the positions created by the organizational structure.",
      features: [
        "People-centered function",
        "Fills and keeps positions filled",
        "Continuous managerial responsibility",
        "Covers acquisition and development",
        "Supported by specialized HR work",
      ],
      importance: [
        "Obtains competent personnel",
        "Improves organizational performance",
        "Supports continuous growth and survival",
        "Ensures optimum use of human resources",
        "Improves job satisfaction and morale",
      ],
      processTitle: "Staffing process",
      process: [
        "Estimating manpower requirements",
        "Recruitment",
        "Selection",
        "Placement and orientation",
        "Training and development",
        "Performance appraisal",
        "Promotion and career planning",
        "Compensation",
      ],
    },
    {
      id: "directing",
      number: "04",
      name: "Directing",
      chapter: "NCERT Chapter 7",
      source: "https://ncert.nic.in/textbook/pdf/lebs107.pdf",
      meaning:
        "Instructing, guiding, counseling, motivating and leading people so that they contribute effectively to organizational objectives.",
      features: [
        "Initiates action",
        "Takes place at every management level",
        "A continuous process",
        "Flows from top to bottom",
      ],
      importance: [
        "Initiates action",
        "Integrates employees' efforts",
        "Motivates people",
        "Facilitates change",
        "Brings stability and balance",
      ],
      processTitle: "Elements of directing",
      process: [
        "Supervision",
        "Motivation",
        "Leadership",
        "Communication",
      ],
    },
    {
      id: "controlling",
      number: "05",
      name: "Controlling",
      chapter: "NCERT Chapter 8",
      source: "https://ncert.nic.in/textbook/pdf/lebs108.pdf",
      meaning:
        "Ensuring that activities conform to plans by measuring performance, comparing it with standards and correcting deviations.",
      features: [
        "Goal-oriented",
        "Pervasive at every level",
        "A continuous process",
        "Closely linked with planning",
        "Uses feedback for correction",
      ],
      importance: [
        "Accomplishes organizational goals",
        "Judges the accuracy of standards",
        "Uses resources efficiently",
        "Improves employee motivation",
        "Ensures order and discipline",
        "Facilitates coordination",
      ],
      processTitle: "Controlling process",
      process: [
        "Setting performance standards",
        "Measurement of actual performance",
        "Comparing actual performance with standards",
        "Analyzing deviations",
        "Taking corrective action",
      ],
    },
  ];

  const checks = [
    {
      prompt: "A manager sets a sales target and compares possible routes to reach it.",
      answer: "planning",
      explanation: "Objectives and alternative courses of action belong to Planning.",
    },
    {
      prompt: "Similar jobs are grouped into production, finance and marketing departments.",
      answer: "organizing",
      explanation: "Departmentalization is a step in the Organizing process.",
    },
    {
      prompt: "The enterprise estimates how many employees it needs before recruitment begins.",
      answer: "staffing",
      explanation: "Estimating manpower requirements starts the Staffing process.",
    },
    {
      prompt: "A supervisor guides workers and keeps them motivated during a difficult task.",
      answer: "directing",
      explanation: "Supervision and motivation are elements of Directing.",
    },
    {
      prompt: "Actual output is compared with the monthly production standard.",
      answer: "controlling",
      explanation: "Comparison with standards is part of Controlling.",
    },
    {
      prompt: "A manager assigns duties and clarifies who reports to whom.",
      answer: "organizing",
      explanation: "Assignment of duties and reporting relationships are Organizing steps.",
    },
    {
      prompt: "An employee is selected, placed in a role and introduced to the workplace.",
      answer: "staffing",
      explanation: "Selection, placement and orientation are Staffing activities.",
    },
    {
      prompt: "A deviation is found and the manager changes the production method.",
      answer: "controlling",
      explanation: "Corrective action completes the Controlling process.",
    },
  ];

  function getFunction(id) {
    return functions.find((item) => item.id === id) || functions[0];
  }

  function checkAnswer(questionIndex, selectedId) {
    const question = checks[questionIndex % checks.length];
    return {
      correct: question.answer === selectedId,
      answer: question.answer,
      explanation: question.explanation,
    };
  }

  return { functions, checks, getFunction, checkAnswer };
});
