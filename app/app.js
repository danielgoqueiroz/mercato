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

app.use("/schedule", schedule);

// Test Api
app.get("/", function (req, res) {
  res.send("Test Get");
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
app.listen(3000, function () {
  scheduleController.start();
  console.log("Mercato iniciado.");
});
