const express = require("express");
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
const Configuration = require("./model/Schedule");
const scheduleController = require("./controller/scheduleController");
const puppeteerController = require("./controller/pupetterController");

const schedule = require("./router/schedule");
const search = require("./router/search");

app.use("/schedule", schedule);
app.use("/search", search);

// Test Api
app.get("/", function (req, res) {
  res.send("Test Get");
});




// Init Server
app.listen(3000,  function () {
  console.log("Mercato iniciado.");
  scheduleController.start();
});
