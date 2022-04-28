const connection = require("../db.config");

const CommentsTable = () => {
    const commentsTable = `CREATE TABLE IF NOT EXISTS comments(
        id BINARY(16) NOT NULL PRIMARY KEY UNIQUE DEFAULT UUID(),
        author_id BINARY(16) NOT NULL,
        article_id BINARY(16) NOT NULL,
        comment VARCHAR(1000) NOT NULL,
        timestamp DATETIME NOT NULL DEFAULT NOW() 
        )`;

    connection.query(commentsTable, (err, results) => {
        if (err) throw err;
    });
};

module.exports = CommentsTable;
