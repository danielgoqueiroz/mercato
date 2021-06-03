class Report {
  constructor(term, target, pagelimit) {
    this.term = term;
    this.target = target;
    this.pagelimit = pagelimit;
    this.date = new Date();
    this.relatedQuestions = new Set();
    this.ralatedSearch = new Set();
    this.advisors = [];
    this.pages = [];
  }

  addPage(page) {
    this.pages.push(page);
  }
  addRelatedQuestion(question) {
    this.relatedQuestions.add(question);
  }
  addRelatedSearch(search) {
    this.ralatedSearch.add(search);
  }
  addAdvisors(ads) {
    this.advisors.push(ads);
  }
}

module.exports = Report;
