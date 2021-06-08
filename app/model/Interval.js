class Interval {
  constructor(second, minute, hour) {
    this.second = second !== null ? second : "*";
    this.minute = minute !== null ? minute : "*";
    this.hour = hour !== null ? hour : "*";
  }
}

module.exports = Interval;
