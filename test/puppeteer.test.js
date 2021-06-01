const puppeteer = require("../app/controller/pupetter");
var expect = require("expect.js");

describe("Busca por termo", function (done) {
  this.timeout(30000);

  it("Deve buscar resultados quando informado um termo", async function () {
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

describe("Busca termos", function (done) {
  it("Deve buscar resultados para por termos", async function () {
    this.timeout(30000);

    const reports = await puppeteer.searchByTerms(
      ["manutenção preditiva", "Sensores industriais"],
      3
    );

    expect(reports).to.be.an("array");

    reports.forEach((report) => {
      report.forEach((page) => {
        expect(page.results).to.be.an("array");
        expect(page.relatedSearchs).to.be.an("array");
        expect(page.relatedQuestions).to.be.an("array");
        expect(page.advisors).to.be.an("array");
      });
    });

    done();
  });
});
