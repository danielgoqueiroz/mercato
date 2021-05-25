const puppeteer = require("puppeteer");
const TAG_AD = "uEierd";
const TAG_RESULT = "g";

const SEARCH_SELECTOR =
  "body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input";

const width = 1024;
const height = 2000;

async function search(terms) {
  let results = [];

  for (let index = 0; index < terms.length; index++) {
    const term = terms[index];
    console.log(`Iniciando ${term}`);
    const result = await searchByTerm(term);
    results.push(result);
  }

  return results;
}

async function doInitialSearch(browser, term) {
  const page = await browser.newPage();
  await page.goto("https://www.google.com/");
  await page.type(SEARCH_SELECTOR, term);
  await page.type(SEARCH_SELECTOR, String.fromCharCode(13));
  await page.waitForSelector("#rso");
  return page;
}

async function searchByTerm(term) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [`--window-size=${width},${height}`],
    defaultViewport: {
      width,
      height,
    },
  });

  let pageCount = 1;

  const page = await doInitialSearch(browser, term);

  const result = await extractResults(page);
  console.log(result);
  result.searchTerm = term;
  result.dateSeach = new Date();
  result.page = pageCount;

  await page.pdf({ path: `resources/${term}_${pageCount}.pdf`, format: "a4" });

  // const hasNext = await page.evaluate((sel) => {
  //   const el = document.getElementById(sel);
  //   return el !== null;
  // }, "pnnext");
  // if (hasNext) {
  //   await page.click("#pnnext");
  //   await page.waitForNavigation();
  // }

  // while (hasNextPage) {
  //   await extractResults(page);
  //   hasNextPage = await hasNext(page);
  // }
  await browser.close();
  return result;
}

async function extractResults(page) {
  const result = await page
    .evaluate(() => {
      const doc = document.getElementsByClassName("g");
      if (doc === undefined) {
        return;
      }
      let results = [];
      for (let index = 0; index < doc.length; index++) {
        const resultElement = doc[index];
        const site = resultElement.getElementsByTagName("a")[0].href;
        if (site != "") {
          results.push(site);
        }
      }
      // const link = doc.getElementsByTagName('span')[2].innerText
      //Sugestões de palavras
      const relatedSearchsElements = document.getElementsByClassName("k8XOCe");
      let relatedSearchs = [];
      for (let index = 0; index < relatedSearchsElements.length; index++) {
        const relatedSearch = relatedSearchsElements[index];
        relatedSearchs.push(relatedSearch.innerText);
      }

      const res = {
        results: results,
        relatedSearchs: relatedSearchs,
      };
      return res;
    })
    .catch((err) => {
      console.log(err);
      return;
    });
  return result;
}

module.exports = {
  search,
  searchByTerm,
  extractResults,
};
