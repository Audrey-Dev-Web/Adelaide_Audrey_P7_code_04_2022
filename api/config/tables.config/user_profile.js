const connection = require("../db.config");

const CreateTableProfile = () => {
    const createProfileTable = `CREATE TABLE IF NOT EXISTS users_profiles(
        id BINARY(16) NOT NULL PRIMARY KEY UNIQUE DEFAULT UUID(),
        user_id BINARY(16) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        first_name VARCHAR(25),
        last_name VARCHAR(25),
        birthdate DATE,
        avatar VARCHAR(100)
        )`;

    connection.query(createProfileTable, (err, results) => {
        if (err) throw err;
    });
};

module.exports = CreateTableProfile;
