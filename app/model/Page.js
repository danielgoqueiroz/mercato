class Page {
  constructor(page) {
    this.page = page;
    this.results = [];
  }
  addResult(result) {
    this.results.push(result);
  }
}

module.exports = Result;
