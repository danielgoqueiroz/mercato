const CronJob = require('cron').CronJob;

const DateSchedule = require("../model/Interval");
const pupperteer = require("../controller/pupetterController");
const Db = require("../db/mongo");
const db = new Db();

let job = {};

const start = async function () {
  console.log("Realizando agendamento")
  const schedule = await db.getConfiguration();
    const rules = `${schedule.interval.second} ${schedule.interval.minute} ${schedule.interval.hour} * * *`;
    console.info(JSON.stringify(rules));
    var job = new CronJob(rules, async function() {
        console.log("Chamando métod agendado");
        await pupperteer.searchByTerms(schedule.terms, schedule.target, 0);
    }, null, true, 'America/Los_Angeles').start();
};

const get = async function () {
  const conf = await db.getConfiguration();
  const sch = {
    job: this.job,
    conf: conf,
  };
  return sch;
};

const update = async function (schedule) {
  console.info("Cancelando agendamento.");
  await scheduleModule.cancelJob();
  console.info("Salvando novo agendamento.");
  const saved = await db.saveConfiguration(schedule);
  console.info(`Agendamento ${JSON.stringify(saved)}.`);
  job = scheduleModule.scheduleJob(
    `${saved.second} ${saved.minute} ${saved.hour} * * *`,
    async function () {
      await pupperteer.searchByTerms(saved.terms, saved.target, 0);
    }
  );
  return await db.getConfiguration();
};

module.exports = { start, get, update };
