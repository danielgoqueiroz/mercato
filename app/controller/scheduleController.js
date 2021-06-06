const schedule = require("node-schedule");
const DateSchedule = require("../model/Date");
const pupperteer = require("../controller/pupetterController");

async function job() {
  console.log("Agendamento");

  date = new DateSchedule(null, "30", null);
  console.log(date);
  schedule.scheduleJob(
    `${date.second} ${date.minute} ${date.hour} * * *`,
    async function () {
      const terms = [
        "Sensor sem fio de vibração",
        "Sensor sem fio de temperatura",
      ];
      await puppeteerController.search(terms);
    }
  );
}

module.exports = job;
