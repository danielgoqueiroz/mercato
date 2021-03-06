var expect = require("expect.js");
const Db = require("../app/db/mongo");
const Schedule = require("../app/model/Schedule");

it("Deve salavar uma nova configuração", async function () {
  const conf = new Schedule("dynamox");
  conf.addTerm("Manutençao preditiva");
  conf.setInterval("10", null, null);

  const db = new Db();
  const confLoaded = await db.saveConfiguration(conf);
  expect(confLoaded.terms).to.be.ok();
  expect(confLoaded.interval).to.be.an("object");
  await db.close;
});

it("Deve carregar configuração", async function () {
  const db = new Db();
  const confLoaded = await db.getConfiguration();
  expect(confLoaded.terms).to.be.ok();
  expect(confLoaded.interval).to.be.an("object");
  await db.close;
});
