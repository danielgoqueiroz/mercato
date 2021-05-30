const puppeteer = require("../app/controller/pupetter");
var expect = require("expect.js");

describe("Busca", function (done) {
  this.timeout(30000);

  it("Deve buscar resultados para busca por termos", async function () {
    const reports = await puppeteer.searchByTerm("manutenção preditiva");

    expect(reports).to.be.an("array");

    reports.forEach((report) => {
      expect(report.results).to.be.an("array");
      expect(report.relatedSearchs).to.be.an("array");
      expect(report.relatedQuestions).to.be.an("array");
      expect(report.advisors).to.be.an("array");
    });

    done;
  });
});
