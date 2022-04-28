const connection = require('../db.config');

const LikesRelationTable = () => {
    const addLikeTable = `CREATE TABLE IF NOT EXISTS usersliked(
        id BINARY(16) NOT NULL PRIMARY KEY UNIQUE DEFAULT UUID(),
        user_id BINARY(16) NOT NULL,
        articles_id BINARY(16) NOT NULL
        )`;

        connection.query(addLikeTable, (err, results) => {
            if (err) throw err;
        });
}


module.exports = LikesRelationTable;