const express = require("express");
let app = express.Router();

const scheduleController = require("../controller/scheduleController");
const Configuration = require("../model/Schedule");

//Get Config
app.get("/", async function (req, res) {
  const response = await scheduleController.get();
  res.status(200).send(response);
});

//Update schedule
app.post("/", async function (req, res) {
  const schedule = req.body;
  const response = await scheduleController.update(schedule);
  res.status(200).send(response);
});

module.exports = app;
