class Interval {
  constructor(second, minute, hour) {
    this.second = second !== null && second !== undefined ? second : "*";
    this.minute = minute !== null && minute !== undefined ? minute : "*";
    this.hour = hour !== null && hour !== undefined ? hour : "*";
  }
}

module.exports = Interval;
