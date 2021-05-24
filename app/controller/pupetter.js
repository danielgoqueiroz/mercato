const puppeteer = require("puppeteer");

const SEARCH_SELECTOR =
  "body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input";

async function search(terms) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://www.google.com/");
  await page.type(SEARCH_SELECTOR, terms[0]);
  await page.type(SEARCH_SELECTOR, String.fromCharCode(13));
  await page.screenshot({ path: "resources/teste.png" });
  await browser.close();
}

module.exports = {
  search,
};
