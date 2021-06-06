const puppeteer = require("../app/controller/pupetter");
var expect = require("expect.js");

it("Deve buscar resultados quando informado um termo", async function () {
  const report = await puppeteer.searchByTerm(
    "manutenção preditiva",
    "certificacaoiso",
    3
  );

  expect(report).to.be.an("object");

  expect(report.term).to.be.an("string");
  expect(report.target).to.be.an("string");
  expect(report.pagelimit).to.be.an("number");
  expect(report.date).to.be.an("object");

  expect(report.relatedQuestions).to.be.an("object");
  expect(report.ralatedSearch).to.be.an("object");
  expect(report.pages).to.be.an("array");

  report.pages.forEach((page) => {
    expect(page).to.be.an("object");
    expect(page.page).to.be.an("number");
    expect(page.results).to.be.an("array");

    page.results.forEach((result) => {
      expect(result).to.be.an("object");
      expect(result.link).to.be.an("string");
      expect(result.title).to.be.an("string");
      expect(result.description).to.be.an("string");
    });
  });
});

it("Deve buscar resultados para por termos", async function () {
  this.timeout(30000);

  const reports = await puppeteer.searchByTerms(
    ["manutenção preditiva", "Sensores industriais"],
    "dynamox",
    3
  );

  expect(reports).to.be.an("array");

  reports.forEach((report) => {
    report.pages.forEach((page) => {
      expect(page.results).to.be.an("array");
    });
  });
});
