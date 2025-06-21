"use strict";

// src/storage.ts
var import_fs = require("fs");
var Storage = class {
  path;
  db = {};
  constructor(path) {
    this.path = path;
  }
  async load() {
    try {
      const data = await import_fs.promises.readFile(this.path, "utf-8");
      this.db = JSON.parse(data);
    } catch {
      this.db = {};
      await this.save();
    }
  }
  async save() {
    await import_fs.promises.writeFile(this.path, JSON.stringify(this.db, null, 2));
  }
  getTable(name) {
    return this.db[name] || [];
  }
  setTable(name, rows) {
    this.db[name] = rows;
    return this.save();
  }
  hasTable(name) {
    return Object.hasOwn(this.db, name);
  }
  createTable(name) {
    if (!this.hasTable(name)) {
      this.db[name] = [];
      return this.save();
    }
  }
};

// src/engine.ts
var FastQL = class {
  storage;
  constructor(path) {
    this.storage = new Storage(path);
    this.init();
  }
  async init() {
    await this.storage.load();
  }
  async run(query) {
    const tokens = query.trim().split(/\s+/);
    const command = tokens[0].toUpperCase();
    if (command === "CREATE" && tokens[1].toUpperCase() === "TABLE") {
      const tableName = tokens[2];
      this.storage.createTable(tableName);
      return `Table ${tableName} created`;
    }
    if (command === "INSERT") {
      const tableName = tokens[2];
      const valuesMatch = query.match(/\((.+)\)/);
      if (!valuesMatch) throw new Error("Invalid INSERT syntax");
      const values = valuesMatch[1].split(",").map((v) => v.trim().replace(/['"]/g, ""));
      const table = this.storage.getTable(tableName);
      table.push(Object.fromEntries(values.map((v, i) => [`col${i}`, v])));
      await this.storage.setTable(tableName, table);
      return "Inserted";
    }
    if (command === "SELECT") {
      const tableName = tokens[3];
      const table = this.storage.getTable(tableName);
      return table;
    }
    throw new Error("Unsupported query");
  }
};

// src/index.ts
var db = new FastQL("fastql.db");
(async () => {
  await db.run(`CREATE TABLE users (id INT, name TEXT);`);
  await db.run(`INSERT INTO users VALUES (1, 'Bartek');`);
  const results = await db.run(`SELECT * FROM users WHERE name = 'Bartek';`);
  console.log(results);
})();
