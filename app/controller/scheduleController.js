const scheduleModule = require("node-schedule");
const DateSchedule = require("../model/Interval");
const pupperteer = require("../controller/pupetterController");
const Db = require("../db/mongo");
const db = new Db();

const init = async function () {
  console.info("Agendamento carregado");
  const schedule = await db.getConfiguration();
  this.job = scheduleModule.scheduleJob(
    `${schedule.second} ${schedule.minute} ${schedule.hour} * * *`,
    async function () {
      await pupperteer.searchByTerms(schedule.terms, schedule.target, 0);
    }
  );
};

const get = async function () {
  return await db.getConfiguration();
};

const update = async function (schedule) {
  console.info("Cancelando agendamento.");
  await scheduleModule.cancelJob();
  console.info("Salvando novo agendamento.");
  const saved = await db.saveConfiguration(schedule);
  console.info(`Agendamento ${saved}.`);

  this.job = scheduleModule.scheduleJob(
    `${saved.second} ${saved.minute} ${saved.hour} * * *`,
    async function () {
      await pupperteer.searchByTerms(saved.terms, saved.target, 0);
    }
  );
  return await db.getConfiguration();
};

module.exports = { init, get, update };
