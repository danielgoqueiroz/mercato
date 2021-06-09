const scheduleModule = require("node-schedule");
const DateSchedule = require("../model/Interval");
const pupperteer = require("../controller/pupetterController");
const Db = require("../db/mongo");
const db = new Db();

class ScheduleController {
  constructor() {}

  async init() {
    console.info("Agendamento carregado");
    const schedule = await db.getConfiguration();
    this.job = scheduleModule.scheduleJob(
      `${schedule.second} ${schedule.minute} ${schedule.hour} * * *`,
      async function () {
        await pupperteer.searchByTerms(schedule.terms, schedule.target, 0);
      }
    );
  }

  async get() {
    return await db.getConfiguration();
  }

  async update(schedule) {
    await scheduleModule.cancelJob();
    const saved = await db.saveConfiguration(schedule);
    this.job = scheduleModule.scheduleJob(
      `${saved.second} ${saved.minute} ${saved.hour} * * *`,
      async function () {
        await pupperteer.searchByTerms(saved.terms, saved.target, 0);
      }
    );
  }
}

module.exports = ScheduleController;
