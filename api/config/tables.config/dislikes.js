const connection = require('../db.config');

const DislikesRelationTable = () => {
    const addDislikeTable = `CREATE TABLE IF NOT EXISTS usersdisliked(
        id BINARY(16) NOT NULL PRIMARY KEY UNIQUE DEFAULT UUID(),
        user_id BINARY(16) NOT NULL,
        articles_id BINARY(16) NOT NULL
        )`;

        connection.query(addDislikeTable, (err, results) => {
            if (err) throw err;
        });
}


module.exports = DislikesRelationTable;