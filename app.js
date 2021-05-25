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

app.post("/search", async function (req, res) {
  const terms = req.body.terms;
  if (terms === undefined || terms === null || terms.length < 1) {
    return res
      .status(403)
      .send({ message: `Valor de termos inválido: ${terms}` });
  }

  await puppeteer.search(terms);
  console.log("End");
  res.send("Test Get");
});

app.listen(3000, function () {
  console.log("Mercato iniciado.");
});
