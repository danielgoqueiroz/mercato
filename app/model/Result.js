class Result {
  constructor(link, title, description, isAd) {
    this.link = link;
    this.title = title;
    this.description = description;
  }

  containsTarget(target) {
    if (`${this.link}`.toLowerCase().includes(target.toLowerCase())) {
      return true;
    }
    if (`${this.title}`.toLowerCase().includes(target.toLowerCase())) {
      return true;
    }
    if (`${this.description}`.toLowerCase().includes(target.toLowerCase())) {
      return true;
    }
    return false;
  }
}

module.exports = Result;
