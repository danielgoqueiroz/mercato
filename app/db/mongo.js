const { MongoClient } = require("mongodb");
const Configuration = require("../model/Configuration");
const url =
  "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&ssl=false";

class DB {
  constructor() {
    this.client = this.getClient();
  }

  async getClient() {
    return await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  }
  async getDb() {
    return await (await this.client).db("Mercato");
  }
  async getCollection() {
    const database = await this.getDb();
    return database.collection("reports");
  }

  async saveReport(report) {
    return await (await this.getCollection()).insertOne(report);
    this.close();
  }

  async getConfiguration() {
    const db = await this.getDb();
    const collection = await db.collection("configuration");
    const conf = await collection.findOne();
    if (conf === null) {
      let conf = new Configuration("brasil");
      conf.setInterval("1", null, null);
      await collection.save(conf);
    }
    return await collection.findOne();
  }
  async saveConfiguration(confuguration) {
    const configLoaded = this.getConfiguration();
    const db = await this.getDb();
    const collection = await db.collection("configuration");
    const conf = await collection.findOne();

    const confLoaded = await this.getConfiguration();
    if (confLoaded) {
      confLoaded.interval = confuguration.interval;
      confLoaded.terms = confuguration.terms;
      collection.insertOne(confLoaded);
    }

    return await db.getConfiguration();
  }

  async close() {
    (await this.client).close();
  }
}

module.exports = DB;
