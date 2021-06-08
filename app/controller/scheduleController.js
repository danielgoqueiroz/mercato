const schedule = require("node-schedule");
const DateSchedule = require("../model/Interval");
const pupperteer = require("../controller/pupetterController");
const Db = require("../db/mongo");

async function job() {
  console.log("Agendamento");
  const db = new Db();
  const conf = await db.getConfiguration();

  schedule.scheduleJob(
    `${conf.second} ${conf.minute} ${conf.hour} * * *`,
    async function () {
      await pupperteer.searchByTerms(conf.terms, conf.target, 0);
    }
  );
}

module.exports = job;
