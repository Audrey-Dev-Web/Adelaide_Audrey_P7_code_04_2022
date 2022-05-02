const connection = require('../db.config');

const CreateUsers_shared = () => {
    const createUsers_shared = `CREATE TABLE IF NOT EXISTS users_shared(
        id BINARY(16) NOT NULL PRIMARY KEY UNIQUE DEFAULT UUID(),
        user_id BINARY(16) NOT NULL,
        post_id BINARY(16) NOT NULL
        )`;

    connection.query(createUsers_shared, (err, results) => {
        if (err) throw err;
    });
}

module.exports = CreateUsers_shared;