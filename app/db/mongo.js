const { MongoClient } = require("mongodb");
var ObjectId = require("mongodb").ObjectId;

const Schedule = require("../model/Schedule");
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
    if (this.client == null) {
      this.client = await this.getClient();
    }
    return await (await this.client).db("Mercato");
  }
  async getReportCollection() {
    const database = await this.getDb();
    return database.collection("reports");
  }

  async getConfigurationCollection() {
    const database = await this.getDb();
    return database.collection("configuration");
  }

  async saveReport(report) {
    return await (await this.getReportCollection()).insertOne(report);
  }

  async getConfiguration() {
    const collection = await this.getConfigurationCollection();
    const schedule = await collection.findOne();
    if (schedule === null) {
      let schedule = new Schedule("brasil");
      schedule.setInterval("1", null, null);
      await collection.save(schedule);
    }
    return schedule;
  }
  async saveConfiguration(confuguration) {
    const configLoaded = await this.getConfiguration();
    const collection = await this.getConfigurationCollection();

    configLoaded.interval = confuguration.interval;
    configLoaded.terms = confuguration.terms;
    configLoaded.target = confuguration.target;
    delete configLoaded._id;

    var objectId = new ObjectId(configLoaded._id);

    await collection.updateOne(objectId, configLoaded, { upsert: true });

    const consfSaved = await this.getConfiguration();
    return consfSaved;
  }

  async close() {
    (await this.client).close();
  }
}

module.exports = DB;
