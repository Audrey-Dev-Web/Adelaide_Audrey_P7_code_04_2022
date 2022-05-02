const connection = require('../db.config');

const CreatePosts_shared = () => {
    const createPost_shared = `CREATE TABLE IF NOT EXISTS posts_shared(
        id BINARY(16) NOT NULL PRIMARY KEY UNIQUE DEFAULT UUID(),
        user_id BINARY(16) NOT NULL,
        post_id BINARY(16) NOT NULL,
        post_content VARCHAR(1000),
        timestamp DATETIME NOT NULL DEFAULT NOW()
        )`;

    connection.query(createPost_shared, (err, results) => {
        if (err) throw err;
    });
}

module.exports = CreatePosts_shared;