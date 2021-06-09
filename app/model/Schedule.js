const Interval = require("./Interval");
class Schedule {
  constructor(target) {
    this.terms = [];
    this.interval = new Interval();
    this.target = target;
  }
  addTerm(term) {
    this.terms.push(term);
  }
  setInterval(secound, minute, hour) {
    this.interval = new Interval(secound, minute, hour);
  }
}

module.exports = Schedule;
