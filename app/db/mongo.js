const { MongoClient } = require("mongodb");
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
  async close() {
    (await this.client).close();
  }
}

module.exports = DB;
