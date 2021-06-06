const express = require("express");
const app = express();

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

const puppeteerController = require("./controller/pupetter");

// Test Api
app.get("/", function (req, res) {
  res.send("Test Get");
});

// Get Config
// app.get('/config' function (req, res) {

// });
// Set Config (Post)

// Do search
app.post("/search", async function (req, res) {
  const terms = req.body.terms;
  if (terms === undefined || terms === null || terms.length < 1) {
    return res
      .status(403)
      .send({ message: `Valor de termos inválido: ${terms}` });
  }

  await puppeteerController.search(terms);
  res.send("Test Get");
});

// Init Server
app.listen(3000, function () {
  console.log("Mercato iniciado.");
});
