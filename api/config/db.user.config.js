const mysql = require("mysql");

require("dotenv").config();

const db_host = process.env.DB_HOST;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;
const db = process.env.DB_DATABASE;
const db_port = process.env.DB_PORT;

// On utilise CreatePool pour permettre plusieurs connexion simultanées
const connection = mysql.createPool({
    connectionLimit: 200,
    host: db_host,
    user: db_user,
    password: db_password,
    database: db,
    port: db_port,
});

module.exports = connection;
