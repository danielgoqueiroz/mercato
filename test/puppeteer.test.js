const puppeteer = require("../app/controller/pupetter")

test('Realiza requisição', async () => {
    expect(puppeteer.search(["manutenção preditiva"]))
});