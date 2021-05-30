const puppeteer = require("puppeteer");
const TAG_AD = "uEierd";
const TAG_RESULT = "g";
const PAGE_COUNT_LIMIT = 3;

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

//Search
async function searchByTerm(term) {
  const headless = false;

  const browser = await puppeteer.launch({
    headless: headless,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    // args: [`--window-size=${width},${height}`],
    // defaultViewport: {
    //   width,
    //   height,
    // },
  });

  const page = await doInitialSearch(browser, term);

  let pageCount = 1;

  let results = [];

  let resultExtracted = await extractResults(page, pageCount);
  results.push(resultExtracted);

  while (resultExtracted.hasNextPage && pageCount < PAGE_COUNT_LIMIT) {
    pageCount++;
    await page.click("#pnnext");
    await page.waitForNavigation();
    const newResult = await extractResults(page, pageCount);
    results.push(newResult);
    resultExtracted = newResult;
  }

  // if (headless) {
  //   console.log("Salvando PDF");
  //   await page.pdf({
  //     path: `resources/${term}_${pageCount}.pdf`,
  //     format: "a4",
  //   });
  // }

  await browser.close();
  return results;
}

//Contruct intial search
async function doInitialSearch(browser, term) {
  const page = await browser.newPage();
  await page.goto("https://www.google.com/");
  await page.type(SEARCH_SELECTOR, term);
  await page.type(SEARCH_SELECTOR, String.fromCharCode(13));
  await page.waitForNavigation();
  return page;
}

//Extract page contents
async function extractResults(page, pageCount) {
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
      const next = document.getElementById("pnnext") !== null;

      //Poaple elso ask for
      const relatedQuestionsElements = document.getElementsByClassName(
        "related-question-pair"
      );
      let relatedQuestions = [];
      for (let index = 0; index < relatedQuestionsElements.length; index++) {
        const relatedQuestion = relatedQuestionsElements[index];
        relatedQuestions.push(relatedQuestion.innerText);
      }

      //Sugestões de palavras
      const relatedSearchsElements = document.getElementsByClassName("k8XOCe");
      let relatedSearchs = [];
      for (let index = 0; index < relatedSearchsElements.length; index++) {
        const relatedSearch = relatedSearchsElements[index];
        relatedSearchs.push(relatedSearch.innerText);
      }

      //Resultados de propagandas
      const advidorsElements = document.getElementsByClassName("uEierd");
      let advisors = [];
      for (let index = 0; index < advidorsElements.length; index++) {
        const advisor = advidorsElements[index];
        advisors.push(advisor.innerText);
      }

      const res = {
        results: results,
        relatedSearchs: relatedSearchs,
        relatedQuestions: relatedQuestions,
        advisors: advisors,
        hasNextPage: next,
      };
      return res;
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
  result.page = pageCount;
  return result;
}

module.exports = {
  search,
  searchByTerm,
  extractResults,
};
