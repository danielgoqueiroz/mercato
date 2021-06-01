const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const TAG_AD = "uEierd";
const TAG_RESULT = "g";
const PAGE_COUNT_LIMIT = 3;
const HEADLESS = true;

const SEARCH_SELECTOR =
  "body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input";

/**
 *
 * @param {*} terms Lista de termos de pesquisa
 * @param {*} pages Quantidade de páginas que são feotas a pesquisa. Limite máximo são 30 páginas.
 * @returns
 */
async function searchByTerms(terms, pages) {
  if (pages === undefined || pages === null || pages < 0) {
    pages = 1;
  }
  if (pages == 0) {
    pages = 30;
  }

  let results = [];

  // Busca por termos
  for (let index = 0; index < terms.length; index++) {
    const term = terms[index];
    console.log(`Procurando termo: ${term}`);
    const result = await searchByTerm(term, pages);
    results.push(result);

    const date = new Date();
    const dateFormated =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    const jsonPath = path.resolve(
      `resources/json/${dateFormated}_${term}.json`
    );
    fs.writeFileSync(jsonPath, JSON.stringify(result), function (err) {
      if (err) {
        console.error(err);
      }
      console.info(`Resultados salvos em ${jsonPath}`);
    });
  }

  return results;
}

/**
 * @param {*} term Termo de pesquia
 * @param {*} pagesCountLimit Quantidade de páginas que são feotas a pesquisa
 * @returns
 */
async function searchByTerm(term, pagesCountLimit) {
  const browser = await puppeteer.launch({
    headless: HEADLESS,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await doInitialSearch(browser, term);

  let pageCount = 1;

  let results = [];

  let resultExtracted = await extractResults(page, pageCount);

  console.log(pageCount);

  await savePdf(page, term, pageCount);

  if (HEADLESS) {
    console.log("Salvando PDF");
    const pdfPath = `resources/pdf/${term}_${pageCount}.pdf`;

    if (!fs.existsSync(pdfPath)) {
      await page.pdf({
        path: pdfPath,
        format: "a4",
      });
    }
  }

  results.push(resultExtracted);

  while (resultExtracted.hasNextPage && pageCount < pagesCountLimit) {
    pageCount++;
    await page.click("#pnnext");
    await page.waitForNavigation();
    const newResult = await extractResults(page, pageCount);
    results.push(newResult);
    resultExtracted = newResult;

    await savePdf(page, term, pageCount);
  }

  await browser.close();
  return results;
}

async function savePdf(page, term, pageCount) {
  await page.pdf({
    path: `resources/pdf/${term}_${pageCount}.pdf`,
    format: "a4",
  });
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
  searchByTerms,
  searchByTerm,
  extractResults,
};
