require("dotenv").config();

const mysql = require("mysql2/promise");

const database = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

database
    .getConnection()
    .then(() => {
        console.info("Success of database connection");
    })
    .catch((error) => {
        console.error(error);
    });

module.exports = database;