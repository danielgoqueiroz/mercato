const puppeteer = require("puppeteer");
const TAG_AD = "uEierd"
const TAG_RESULT = "g"

const SEARCH_SELECTOR =
  "body > div.L3eUgb > div.o3j99.ikrT4e.om7nvf > form > div:nth-child(1) > div.A8SBwf > div.RNNXgb > div > div.a4bIc > input";

const width = 1024
const height = 2000


async function search(terms) {
  for (let index = 0; index < terms.length; index++) {
    const term = terms[index];
    await searchByTerm(term)
  }
}

async function searchByTerm(term) {
  console.log(term)
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      `--window-size=${ width },${ height }`
    ],
    defaultViewport: {
      width,
      height
    }})
  
  const page = await browser.newPage()
  await page.goto("https://www.google.com/");
  await page.type(SEARCH_SELECTOR, term);
  await page.type(SEARCH_SELECTOR, String.fromCharCode(13));
  await page.waitForNavigation();
  await page.evaluate(() => {
    const doc = document.getElementsByClassName("uEierd")
    if (doc === undefined) {
      return ''
    }
    // const link = doc.getElementsByTagName('span')[2].innerText
    return doc.length
  }).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })

  await page.pdf({ path: `resources/${term}.pdf`, format: 'a4' });

  await browser.close();
  return
}

module.exports = {
  search,
};