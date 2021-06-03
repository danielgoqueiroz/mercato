const expect = require("expect.js");
const db = require("../app/db/mongo");

describe("Database", function () {
  it("Deve testart database", async function (done) {
    await db.test();
    expect("teste").to.be.an("string");
    // console.log("teste");
    // const db = new Db();
    // await db.test();
    // console.log("Fim");
    done();
  });
});
