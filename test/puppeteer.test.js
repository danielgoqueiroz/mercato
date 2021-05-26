const puppeteer = require("../app/controller/pupetter");

test("Realiza requisição", async () => {
  const result = await puppeteer.searchByTerm("manutenção preditiva");
  expect(result.relatedSearchs).not.toBeNull();
  expect(result.results).not.toBeNull();
},30000);
