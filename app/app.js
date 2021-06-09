const express = require("express");
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const ScheduleController = require("./controller/scheduleController");
const scheduleController = new ScheduleController();
const Configuration = require("./model/Schedule");

const puppeteerController = require("./controller/pupetterController");

// Test Api
app.get("/", function (req, res) {
  res.send("Test Get");
});

//Update schedule
app.post("/schedule", async function (req, res) {
  const schedule = req.body;
  const response = await scheduleController.update(schedule);
  res.status(200).send(response);
});

//Get Config
app.get("/schedule", async function (req, res) {
  const response = await scheduleController.get();
  res.status(200).send(response);
});

// Do search
app.post("/search", async function (req, res) {
  const terms = req.body.terms;
  const target = req.body.target;
  const pages = req.body.pages;
  if (terms === undefined || terms === null || terms.length < 1) {
    return res
      .status(403)
      .send({ message: `Valor de termos inválido: ${terms}` });
  }

  await puppeteerController.searchByTerms(terms, target, pages);
  res.send("Test Get");
});

// Init Server
app.listen(3000, async function () {
  await scheduleController.init();
  console.log("Mercato iniciado.");
});
