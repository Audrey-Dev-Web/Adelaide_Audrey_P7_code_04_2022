const connection = require('../db.config');

const articlesTable = () => {
    const createArticleTable = `CREATE TABLE IF NOT EXISTS articles(
        id BINARY(16) NOT NULL PRIMARY KEY UNIQUE DEFAULT UUID(),
        author_id BINARY(16) NOT NULL,
        title VARCHAR(300) NOT NULL,
        content VARCHAR(5000), 
        images VARCHAR(100),
        comments INT,
        likes INT,
        dislikes INT,
        shares INT,
        timestamp DATETIME NOT NULL DEFAULT NOW()
        )`;

    connection.query(createArticleTable, (err, results) => {
        if (err) throw err;
    });
}

module.exports = articlesTable;