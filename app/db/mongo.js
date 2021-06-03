const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

async function test() {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
  }).catch((err) => {
    console.log(err);
  });
  const databasesList = await client.db().admin().listDatabases();
  const db = client.db("mercato");
  const collections = await db.collections();

  // Establish and verify connection
  await client.close();
}

module.exports = { test };
