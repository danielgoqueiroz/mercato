const schedule = require("node-schedule");
const DateSchedule = require("../model/Date");
const pupperteer = require("../controller/pupetterController");

async function job() {
  console.log("Agendamento");

  date = new DateSchedule(null, "*/5", null);
  console.log(date);
  schedule.scheduleJob(
    `${date.second} ${date.minute} ${date.hour} * * *`,
    async function () {
      const terms = [
        "Sensor sem fio de vibração",
        "Sensor sem fio de temperatura",
      ];
      await pupperteer.searchByTerms(terms, "dynamox", 0);
    }
  );
}

module.exports = job;
