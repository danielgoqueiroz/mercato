class Report {
  constructor(term, target, pagelimit) {
    this.term = term;
    this.target = target;
    this.pagelimit = pagelimit;
    this.date = new Date();
    this.relatedQuestions = [];
    this.ralatedSearch = [];
    this.advisors = [];
    this.page = [];
  }

  addPage(result) {
    this.results.push(result);
  }
  addRelatedQuestion(question) {
    this.relatedQuestions.push(question);
  }
  addRelatedSearch(search) {
    this.ralatedSearch.push(search);
  }
  addAdvisors(ad) {
    this.advisors.push(ad);
  }
}

module.exports = Report;
