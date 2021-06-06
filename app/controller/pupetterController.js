const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const mongo = require("../db/mongo");

const TAG_AD = "uEierd";
const TAG_RESULT = "g";
const PAGE_COUNT_LIMIT = 3;
const HEADLESS = true;

const CLASS_RELATED_SEARCH = "k8XOCe";
const CLASS_ADVISORS = "uEierd";

const SEARCH_SELECTOR =
  "body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input";

let Report = require("../model/Report");
const Result = require("../model/Result");
let Page = require("../model/Page");

const { throws } = require("assert");
const { REPL_MODE_STRICT } = require("repl");

/**
 *
 * @param {*} terms Lista de termos de pesquisa
 * @param {*} pages Quantidade de páginas que são feotas a pesquisa. Limite máximo são 30 páginas.
 * @returns
 */
async function searchByTerms(terms, target, pages) {
  if (pages === undefined || pages === null || pages < 0) {
    pages = 1;
  }
  if (pages == 0) {
    pages = 30;
  }

  let results = [{}];

  // Busca por termos
  for (let i = 0; i < terms.length; i++) {
    const term = terms[i];
    console.log(`Procurando termo: ${term}`);
    const result = await searchByTerm(term, target, pages);
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

  const pageDOM = await doInitialSearch(browser, term);

  let pageCount = 1;

  let report = new Report(term, target, pageLimit);

  await extractResults(pageDOM, report, pageCount);

  //save pdf
  await savePdf(pageDOM, term, pageCount);

  //Possui próxima página
  const hasNextButton = await pageDOM.evaluate(() => {
    return document.getElementById("pnnext") !== null;
  });

  const targetResults = report.pages[0].results.filter((res) => {
    const contains = res.containsTarget(target);
    return contains;
  });

  while (targetResults.length == 0 && hasNextButton && pageCount < pageLimit) {
    pageCount++;
    await pageDOM.click("#pnnext");
    await pageDOM.waitForNavigation();
    await extractResults(pageDOM, report, pageCount);
    await savePdf(pageDOM, term, pageCount);
    hasNextButton = await pageDOM.evaluate(() => {
      return document.getElementById("pnnext") !== null;
    });
  }
  report.relatedQuestions = report.relatedQuestions.filter(
    (este, i) => report.relatedQuestions.indexOf(este) === i
  );

  report.ralatedSearch = report.ralatedSearch.filter(
    (este, i) => report.ralatedSearch.indexOf(este) === i
  );
  const db = new mongo();
  const savedReport = await db.saveReport(report);
  if (savedReport.insertedCount > 0) {
    console.log("Report salvo");
  }
  await browser.close();
  return report;
}

/**
 *
 * @param {*} page
 * @param {*} term
 * @param {*} pageCount
 */
async function savePdf(page, term, pageCount) {
  console.log("Salvando PDF");
  const pdfPath = `resources/pdf/${term}_${pageCount}.pdf`;
  if (!fs.existsSync(pdfPath)) {
    await page.pdf({
      path: pdfPath,
      format: "a4",
    });
  }
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

/**
 *
 * @param {*} pageDOM
 * @param {*} pageCount
 * @returns Página extraída
 */
//Extract page contents
async function extractResults(pageDOM, report, pageCount) {
  //Página
  let page = new Page(pageCount);

  //Resultados
  let result = await pageDOM.evaluate(() => {
    let results = [];
    const resultElements = document.getElementsByClassName("g");
    for (let i = 0; i < resultElements.length; i++) {
      const resultElement = resultElements[i];
      const link = resultElement.getElementsByTagName("a")[0].href;
      const title = resultElement.getElementsByTagName("h3")[0].innerText;
      const description =
        resultElement.getElementsByClassName("IsZvec")[0].innerText;
      const result = {
        link: link,
        title: title,
        description: description,
      };
      results.push(result);
    }
    return results;
  });
  result = result.map(function (res) {
    return new Result(res.link, res.title, res.description);
  });

  page.results = result;
  report.addPage(page);

  //Extrai poaple elso ask for
  const questions = await pageDOM.evaluate(() => {
    let itens = [];
    const rQuestionsEl = document.getElementsByClassName(
      "related-question-pair"
    );
    for (let i = 0; i < rQuestionsEl.length; i++) {
      itens.push(rQuestionsEl[i].innerText);
    }
    return itens;
  });
  questions.forEach((element) => {
    report.addRelatedQuestion(element);
  });

  const searchs = await pageDOM.evaluate((sel) => {
    //Sugestões de palavras
    let itens = [];
    const rSearchsEl = document.getElementsByClassName(sel);
    for (let i = 0; i < rSearchsEl.length; i++) {
      itens.push(rSearchsEl[i].innerText);
    }
    return itens;
  }, CLASS_RELATED_SEARCH);
  searchs.forEach((element) => {
    report.addRelatedSearch(element);
  });

  const advisors = await pageDOM.evaluate((sel) => {
    //Resultados de propagandas
    let itens = [];
    const advidorsElements = document.getElementsByClassName(sel);
    for (let i = 0; i < advidorsElements.length; i++) {
      itens.push(advidorsElements[i].innerText);
    }
    return itens;
  }, CLASS_ADVISORS);
  advisors.forEach((element) => {
    report.addAdvisors(element);
  });

  return page;
}

module.exports = {
  searchByTerms,
  searchByTerm,
  extractResults,
};
