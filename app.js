const express = require("express");
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const puppeteer = require("./app/controller/pupetter");

app.get("/", function (req, res) {
  res.send("Test Get");
});

app.post("/search", function (req, res) {
  const terms = req.body.terms;
  console.log(terms);
  puppeteer.search(terms);
  res.send("Test Get");
});

app.listen(3000, function () {
  console.log("Mercato iniciado.");
});
