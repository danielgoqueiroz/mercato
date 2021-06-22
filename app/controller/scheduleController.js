const { CronTime, CronJob } = require('cron');
const DateSchedule = require("../model/Interval");
const pupperteer = require("../controller/pupetterController");
const Db = require("../db/mongo");
const db = new Db();

let job = {};

const start = async function () {
  // console.log("Realizando agendamento");
  // const schedule = await db.getConfiguration();
  // console.log(JSON.stringify(schedule));
  //   const time = `${schedule.interval.second} ${schedule.interval.minute} ${schedule.interval.hour} * * *`;
  //   console.info(JSON.stringify(time));
  //   job = new CronJob(time, async function() {
  //       console.log("Chamando métod agendado");
  //       await pupperteer.searchByTerms(schedule.terms, schedule.target, 0);
  //   }, null, true, 'America/Los_Angeles');
  //   job.start();
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
  // console.info("Cancelando agendamento.");
  // const time = `${schedule.interval.second} ${schedule.interval.minute} ${schedule.interval.hour} * * *`;
  // const cronTime = new CronTime(time);
  // job.setTime(cronTime);
  // job.start();
  // console.info("Salvando novo agendamento.");
  // const saved = await db.saveConfiguration(schedule);
  // return await db.getConfiguration();
};

module.exports = { start, get, update };
