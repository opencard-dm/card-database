const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run("drop table if exists cards");
  db.run(`create table cards(
      id TEXT PRIMARY KEY
    , name TEXT
    , detail JSON
    , exported_at DATETIME
    , created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    , updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

db.close();