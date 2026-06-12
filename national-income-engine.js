(function attachNationalIncomeEngine(root, factory) {
  const engine = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = engine;
  } else {
    root.NationalIncomeEngine = engine;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function createNationalIncomeEngine() {
  function number(value) {
    const parsed = Number(String(value).replace(/[₹,\s]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function round(value) {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }

  function fromGDPmp(gdpmp, depreciation, nfia, netIndirectTaxes) {
    return {
      GDPmp: round(gdpmp),
      GDPfc: round(gdpmp - netIndirectTaxes),
      NDPmp: round(gdpmp - depreciation),
      NDPfc: round(gdpmp - depreciation - netIndirectTaxes),
      GNPmp: round(gdpmp + nfia),
      GNPfc: round(gdpmp + nfia - netIndirectTaxes),
      NNPmp: round(gdpmp + nfia - depreciation),
      NNPfc: round(gdpmp + nfia - depreciation - netIndirectTaxes),
    };
  }

  function calculateValueAdded({ sectors, depreciation, nfia, netIndirectTaxes }) {
    const sectorResults = sectors.map((sector) => ({
      name: sector.name,
      valueAdded: round(number(sector.output) - number(sector.intermediateConsumption)),
    }));
    const gdpmp = round(
      sectorResults.reduce((total, sector) => total + sector.valueAdded, 0),
    );
    const aggregates = fromGDPmp(
      gdpmp,
      number(depreciation),
      number(nfia),
      number(netIndirectTaxes),
    );
    return { sectorResults, ...aggregates };
  }

  function calculateExpenditure({
    privateConsumption,
    grossInvestment,
    governmentExpenditure,
    exports,
    imports,
    depreciation,
    nfia,
    netIndirectTaxes,
  }) {
    const netExports = round(number(exports) - number(imports));
    const gdpmp = round(
      number(privateConsumption) +
        number(grossInvestment) +
        number(governmentExpenditure) +
        netExports,
    );
    return {
      netExports,
      ...fromGDPmp(
        gdpmp,
        number(depreciation),
        number(nfia),
        number(netIndirectTaxes),
      ),
    };
  }

  function calculateIncome({
    compensation,
    operatingSurplus,
    mixedIncome,
    nfia,
  }) {
    const ndpfc = round(
      number(compensation) + number(operatingSurplus) + number(mixedIncome),
    );
    return {
      NDPfc: ndpfc,
      NNPfc: round(ndpfc + number(nfia)),
    };
  }

  function formatAmount(value) {
    return `₹${new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 2,
    }).format(round(number(value)))} crore`;
  }

  return {
    number,
    calculateValueAdded,
    calculateExpenditure,
    calculateIncome,
    formatAmount,
  };
});
