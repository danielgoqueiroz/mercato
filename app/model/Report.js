class Report {
  constructor(term, target, pagelimit) {
    this.term = term;
    this.target = target;
    this.pagelimit = pagelimit;
    this.date = new Date();
    this.relatedQuestions = [];
    this.ralatedSearch = [];
    this.advisors = [];
    this.pages = [];
  }

  addPage(page) {
    this.pages.push(page);
  }
  addRelatedQuestion(question) {
    this.relatedQuestions.push(question);
  }
  addRelatedSearch(search) {
    this.ralatedSearch.push(search);
  }
  addAdvisors(ads) {
    this.advisors.push(ads);
  }
}

module.exports = Report;
