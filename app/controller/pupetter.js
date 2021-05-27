const puppeteer = require("puppeteer");
const TAG_AD = "uEierd";
const TAG_RESULT = "g";

const SEARCH_SELECTOR =
  "body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input";

const width = 1024;
const height = 2000;

// Search terms
async function search(terms) {
  let results = [];

  for (let index = 0; index < terms.length; index++) {
    const term = terms[index];
    console.log(`Procurando termo: ${term}`);
    const result = await searchByTerm(term);
    results.push(result);
  }

  return results;
}

async function hasNext(page) {
  const hasNext = await page.evaluate(() => {
    const hasNext = document.getElementById("pnnext");
    return hasNext;
  });
  return hasNext;
}

//Search
async function searchByTerm(term) {
  const headless = false;

  const browser = await puppeteer.launch({
    headless: headless,
    args: [`--window-size=${width},${height}`],
    defaultViewport: {
      width,
      height,
    },
  });

  const page = await doInitialSearch(browser, term);

  const r = await page.evaluate(() => {
    const next = document.getElementsByClassName("d6cvqb").innerText;
    const next2 = document.getElementsByClassName("rISBZc");

    return { 1: next, 2: next2 };
  });

  let pageCount = 0;

  const resultExtracted = await extractResults(page);

  const result = {};
  result.searchTerm = term;
  result.dateSeach = new Date();
  result.relatedSearchs = resultExtracted.relatedSearchs;
  result.results = [];
  result.results.push({ page: pageCount, results: resultExtracted.results });

  let hasNextPage = await hasNext(page);

  let results = [result];

  while (hasNextPage) {
    await page.click("#pnnext");
    await page.waitForNavigation();
    let result = {};
    result = await extractResults(page);
    results.push(result);
    hasNextPage = hasNext(page);
  }

  if (headless) {
    console.log("Salvando PDF");
    await page.pdf({
      path: `resources/${term}_${pageCount}.pdf`,
      format: "a4",
    });
  }

  console.log(result);
  await browser.close();
  return result;
}

//Contruct intial search
async function doInitialSearch(browser, term) {
  const page = await browser.newPage();
  await page.goto("https://www.google.com/");
  await page.type(SEARCH_SELECTOR, term);
  await page.type(SEARCH_SELECTOR, String.fromCharCode(13));
  await page.waitForSelector("#rso");
  return page;
}

//Extract page contents
async function extractResults(page) {
  const result = await page
    .evaluate(() => {
      const doc = document.getElementsByClassName("g");
      if (doc === undefined) {
        return;
      }
      let results = [];

      //Itera nos resultados
      for (let index = 0; index < doc.length; index++) {
        const resultElement = doc[index];
        const site = resultElement.getElementsByTagName("a")[0].href;
        if (site != "") {
          results.push(site);
        }
      }

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
