const puppeteer = require("../app/controller/pupetter");
var expect = require("expect.js");

describe("Busca por termo", function (done) {
  this.timeout(30000);

  it("Deve buscar resultados quando informado um termo", async function () {
    const report = await puppeteer.searchByTerm(
      "manutenção preditiva",
      "dynamox",
      3
    );

    expect(report).to.be.an("object");
    expect(report.term).to.be("string");
    expect(report.target).to.be("string");
    expect(report.pageLimit).to.be("number");
    expect(report.date).to.be("date");
    expect(report.relatedQuestions).to.be("array");
    expect(report.raltedSearch).to.be("array");
    expect(report.results).to.be("array");

    report.results.forEach((result) => {
      expect(result).to.be.an("object");
      expect(res.isAd).to.be.an("boolean");
      expect(res.links).to.be.an("array");

      res.links.forEach((link) => {
        expect(link).to.be.an("object");
        expect(link.link).to.be.an("string");
        expect(link.title).to.be.an("string");
        expect(link.description).to.be.an("string");
      });
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
