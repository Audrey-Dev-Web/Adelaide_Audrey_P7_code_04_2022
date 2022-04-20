const connection = require('../db.config');

const CreateTableUsers = () => {
    const createUsersTable = `CREATE TABLE IF NOT EXISTS users(
        id BINARY(16) PRIMARY KEY UNIQUE DEFAULT UUID(),
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        role BINARY(16),
        timestamp DATETIME NOT NULL DEFAULT NOW() 
        )`;

    // connection.connect((err) => {
    //     if (err) throw err;

        connection.query(createUsersTable, (err, results) => {
            if (err) throw err;
        });
    // });
}


module.exports = CreateTableUsers;