const express = require("express");
let app = express.Router();

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
    res.send("Busca realizada");
  });

  module.exports = app;