const connection = require('../db.config');
require("dotenv").config();

const CreateRoles = () => {
    const createRoleTable = `CREATE TABLE IF NOT EXISTS roles(
        id BINARY(16) NOT NULL PRIMARY KEY UNIQUE DEFAULT UUID(),
        role VARCHAR(10) NOT NULL UNIQUE
        )`;

    connection.query(createRoleTable, (err, results) => {
        if (err) throw err;

        const searchRoles = `SELECT * FROM roles WHERE role = ?`
        const createRoles = `INSERT INTO roles SET role = ?`

        // On verifis s'il y a déjà un role user
        connection.query(searchRoles, 'user', (err, found) => {
            if (err) throw err;

            if (found.length == 0) {
                // creation du role user
                connection.query(createRoles, 'user', (err, results) => {
                    if (err) throw err;
                });
            }
        });

        // On verifis s'il y a déjà un role admin
        connection.query(searchRoles, 'admin', (err, found) => {
            if (err) throw err;

            if (found.length == 0) {
                // creation du role admin
                connection.query(createRoles, 'admin', (err, results) => {
                    if (err) throw err;
                });
            }

        });
    });
}

module.exports = CreateRoles