const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const TAG_AD = "uEierd";
const TAG_RESULT = "g";
const PAGE_COUNT_LIMIT = 3;
const HEADLESS = true;

const SEARCH_SELECTOR =
  "body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input";

let Report = require("../model/Report");
let Result = require("../model/Result");
let Page = require("../model/Page");

const { throws } = require("assert");

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
  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
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
 * @param {*} pageLimit Quantidade de páginas que são feotas a pesquisa
 * @returns
 */
async function searchByTerm(term, target, pageLimit) {
  const browser = await puppeteer.launch({
    headless: HEADLESS,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await doInitialSearch(browser, term);

  let pageCount = 1;

  let report = new Report(term, target, pageLimit);

  let resultExtracted = await extractResults(page, report, pageCount);

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

  results.results.push(resultExtracted);

  while (resultExtracted.hasNextPage && pageCount < pageLimit) {
    pageCount++;
    await page.click("#pnnext");
    await page.waitForNavigation();
    const newResult = await extractResults(page, pageCount);
    results.results.push(newResult);
    resultExtracted = newResult;

    await savePdf(page, term, pageCount);
  }

  await browser.close();
  return results;
}

/**
 *
 * @param {*} page
 * @param {*} term
 * @param {*} pageCount
 */
async function savePdf(page, term, pageCount) {
  await page.pdf({
    path: `resources/pdf/${term}_${pageCount}.pdf`,
    format: "a4",
  });
}

/**
 *
 * @param {*} browser
 * @param {*} term
 * @returns
 */
//Contruct intial search
async function doInitialSearch(browser, term) {
  const page = await browser.newPage();
  await page.goto("https://www.google.com/");
  await page.type(SEARCH_SELECTOR, term);
  await page.type(SEARCH_SELECTOR, String.fromCharCode(13));
  await page.waitForNavigation();
  return page;
}

const CLASS_RELATED_SEARCH = "k8XOCe";
const CLASS_ADVISORS = "uEierd";
/**
 *
 * @param {*} page
 * @param {*} pageCount
 * @returns
 */
//Extract page contents
async function extractResults(page, report, pageCount) {
  //Extract contents
  const result = await page
    .evaluate(() => {
      const next = document.getElementById("pnnext") !== null;
      const doc = document.getElementsByClassName("g");
      if (doc === undefined) {
        new throws(
          'Não foi identificado a tag "g", referente aos registros de pesquisa.'
        );
      }
      let page = new Page(pageCount);
      //Extrai results
      for (let index = 0; index < doc.length; index++) {
        const resultElement = doc[index];

        const link = resultElement.getElementsByTagName("a")[0].href;
        const title = resultElement.getElementsByTagName("h3")[0].innerText;
        const description =
          resultElement.getElementsByClassName("IsZvec")[0].innerText;
        const isAd = false;

        const result = new Result(link, title, description, isAd);
        page.addResult(result);
      }
      report.addPage(page);

      //Poaple elso ask for
      const rQuestionsEl = document.getElementsByClassName(
        "related-question-pair"
      );
      let relatedQuestions = [];
      for (let i = 0; i < rQuestionsEl.length; i++) {
        const relatedQuestion = rQuestionsEl[i].innerText;
        report.addRelatedQuestion(relatedQuestion);
      }

      //Sugestões de palavras
      const rSearchsEl = document.getElementsByClassName(CLASS_RELATED_SEARCH);
      let relatedSearchs = [];
      for (let i = 0; i < rSearchsEl.length; i++) {
        const relatedSearch = rSearchsEl[i].innerText;
        report.addRelatedSearch(relatedSearch);
      }

      //Resultados de propagandas
      const advidorsElements = document.getElementsByClassName(CLASS_ADVISORS);
      let advisors = [];

      for (let i = 0; i < advidorsElements.length; i++) {
        const advisor = advidorsElements[i];
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
