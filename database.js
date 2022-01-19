const sqlite3 = require('sqlite3');

const DB_FILE = "inventory.sqlite";

// Database Initilization
let db = new sqlite3.Database(DB_FILE, err => {
    if(err) {
        console.error(err.message);
        throw err;
    } else {
        console.log("Databased opened successfully.");
        db.run(`CREATE TABLE IF NOT EXISTS item (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            desc TEXT NOT NULL,
            unit_price REAL NOT NULL,
            qty INTEGER NOT NULL)`);
    }
});

module.exports = db;