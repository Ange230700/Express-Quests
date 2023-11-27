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
        console.info("Can reach database");
    })
    .catch((error) => {
        console.error(error);
    });

database
    .query("SELECT * FROM `movies`")
    .then((result) => {
        const [movies] = result;
        console.info(result);
        console.info(movies);
    })
    .catch((error) => {
        console.error(error);
    });

database
    .query("SHOW TABLES")
    .then((result) => {
        console.info(result);
    })
    .catch((error) => {
        console.error(error);
    });

module.exports = database;