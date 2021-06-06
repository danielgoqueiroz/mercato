class Page {
  constructor(page) {
    this.page = page;
    this.results = [];
  }
  addResult(result) {
    this.results.push(result);
  }
  getResults() {
    return this.results;
  }
}

module.exports = Page;
