const connection = require("../db.config");

const articlesTable = () => {
    const createArticleTable = `CREATE TABLE IF NOT EXISTS articles(
        id BINARY(16) NOT NULL PRIMARY KEY UNIQUE DEFAULT UUID(),
        author_id BINARY(16) NOT NULL,
        is_shared BOOLEAN NOT NULL DEFAULT FALSE,
        original_author_id BINARY(16),
        shared_id BINARY(16),
        post_shared_timestamp DATETIME,
        title VARCHAR(300) NOT NULL,
        content VARCHAR(5000), 
        images VARCHAR(100),
        comments INT,
        shares INT,
        timestamp DATETIME NOT NULL DEFAULT NOW()
        )`;

    connection.query(createArticleTable, (err, results) => {
        if (err) throw err;
    });
};

module.exports = articlesTable;
