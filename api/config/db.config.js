const mysql = require("mysql");

require("dotenv").config();

const db_host = process.env.DB_HOST;
const db_user = process.env.DB_CONNEC_ACC;
const db_password = process.env.DB_CONNEC_PASS;
const db = process.env.DB_DATABASE;
const db_port = process.env.DB_PORT;

const connection = mysql.createConnection({
    host : db_host,
    user: db_user,
    password: '',
    database: db,
    port: db_port
});

module.exports = connection;