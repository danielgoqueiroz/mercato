const puppeteer = require("../app/controller/pupetter");
var expect = require("expect.js");

describe("Busca", function (done) {
  this.timeout(5000);

  it("Deve buscar resultados para busca por termos", async function () {
    const result = await puppeteer.searchByTerm("manutenção preditiva");

    expect(result.relatedSearchs).to.be.an("array");
    expect(result.results).to.be.an("array");

    done();
  });
});
