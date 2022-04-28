const connection = require('../db.config');

const SharesRelationTable = () => {
    const addSharesTable = `CREATE TABLE IF NOT EXISTS usersshared(
        id BINARY(16) NOT NULL PRIMARY KEY UNIQUE DEFAULT UUID(),
        user_id BINARY(16) NOT NULL,
        articles_id BINARY(16) NOT NULL
        )`;

        connection.query(addSharesTable, (err, results) => {
            if (err) throw err;
        });
}


module.exports = SharesRelationTable;