const expect = require("expect.js");
const Db = require("../app/db/mongo.js");
const puppeteer = require("../app/controller/pupetterController");

it("Deve retornar registros", async function () {
  const db = new Db();
  const collection = await db.getCollection();
  const one = await collection.findOne({});
  expect(one).not.to.be.equal(null);
});

it("Deve salvar registro re reports no banco", async function () {
  this.timeout(30000);

  const report = await puppeteer.searchByTerm(
    "manutenção preditiva",
    "dynamox",
    2
  );

  expect(report).not.to.be.equal(null);
  expect(report).to.be.an("object");
  expect(report.term).to.be("manutenção preditiva");
  expect(report.target).to.be("dynamox");
  expect(report.pagelimit).to.be(2);

  const db = new Db();
  const collection = await db.getCollection();
  const reportSaved = await db.saveReport(report);
  expect(reportSaved.result.ok).to.be.equal(1);

  db.close();
});
