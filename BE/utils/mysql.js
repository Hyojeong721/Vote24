const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "ssafy",
  password: "ssafy",
  database: "ssafy24",
  writeforConnection: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = { pool };
