const connection = require('../db.config');

const CreateTableUsers = () => {
    const createUsersTable = `CREATE TABLE IF NOT EXISTS users(
        id BINARY(16) PRIMARY KEY UNIQUE DEFAULT UUID(),
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(10) NOT NULL,
        timestamp DATETIME NOT NULL DEFAULT NOW() 
        )`;

        connection.query(createUsersTable, (err, results) => {
            if (err) throw err;
        });
}


module.exports = CreateTableUsers;