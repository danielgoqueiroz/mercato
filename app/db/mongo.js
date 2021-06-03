const { MongoClient } = require("mongodb");

async function test(client) {
  try {
    await client.connect();
    const databasesList = await client.db().admin().listDatabases();

    const db = client.db("mercato");
    const collections = await db.collections();
    console.log(collections);
    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}

const client = new MongoClient(
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false"
);

test(client);
