const connection = require("./config/db.config");

connection.connect((err) => {
    // =========== SQL ===========

    // DB USER ACCOUNT SQL
    // creation du compte DB
    let createUserAcc = `CREATE USER IF NOT EXISTS '${user}'@'localhost' IDENTIFIED BY '${user_pass}'`;
    // Ajout des permissions
    let userPermissions = `GRANT SELECT, INSERT, UPDATE, DELETE, CREATE ON *.* TO '${user}'@'localhost'`;

    // users TABLE SQL
    const createUsersTable = `CREATE TABLE IF NOT EXISTS users(
        id BINARY(16) PRIMARY KEY UNIQUE DEFAULT UUID(),
        email VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL,
        role_id BINARY(16) NOT NULL,
        timestamp DATETIME NOT NULL DEFAULT NOW() 
        )`;

    // users_profiles TABLE SQL
    const createUsersProfile = `CREATE TABLE IF NOT EXISTS users_profiles(
        id BINARY(16) NOT NULL PRIMARY KEY UNIQUE DEFAULT UUID(),
        user_id BINARY(16) NOT NULL,
        first_name VARCHAR(25),
        last_name VARCHAR(25),
        birthdate DATE,
        avatar VARCHAR(100)
        )`;
    // roles TABLE SQL
    const createRoleTable = `CREATE TABLE IF NOT EXISTS roles(
        id BINARY(16) PRIMARY KEY UNIQUE DEFAULT UUID(),
        role VARCHAR(10) NOT NULL,
        )`;

    // CREATION DES TABLES
    connection.query(createUsersTable, (err, results) => {
        if (err) throw err;
    });
    connection.query(createUsersProfile, (err, results) => {
        if (err) throw err;
    });
    connection.query(createRoleTable, (err, results) => {
        if (err) throw err;
    });
});
