var expect = require("expect.js");
const ScheduleController = require("../app/controller/scheduleController");
const Interval = require("../app/model/Interval");
const Schedule = require("../app/model/Schedule");

it.only("Deve agendar processo", async function () {
  const scheduleController = new ScheduleController();
  const scheduleLoaded = await scheduleController.get();
  expect(scheduleLoaded).not.to.be(null);

  const scheduleNew = new Schedule(`teste ${new Date()}`);
  scheduleNew.terms = ["Termo de teste"];
  scheduleNew.interval = new Interval(`${new Date().getSeconds()}`, null, null);

  const scheduleUpdated = await scheduleController.update(scheduleNew);

  expect(scheduleNew).to.be.equal(scheduleUpdated);
});
