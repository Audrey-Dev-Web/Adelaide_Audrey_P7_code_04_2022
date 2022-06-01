const connection = require("./db.user.config");

const bcrypt = require("bcrypt");
const cryptojs = require("crypto-js");

require("dotenv").config();
const secretEmail = process.env.SECRET_EMAIL;

const createAdmin = () => {
    const email = "admin@groupomania.fr";
    const password = "admin";
    const role = "admin";

    // Création du compte admin de l'application
    const searchAdmin = `SELECT * FROM users WHERE role = ?`;
    const searchUser = `SELECT * FROM users WHERE email = ?`;
    const createAdmin = `INSERT INTO users SET ?`;
    const addAdminProfil = `INSERT INTO users_profiles SET ?`;

    connection.getConnection(async (err, connection) => {
        if (err) throw err;

        // On cherche s'il y a un compte admin dans la db
        connection.query(searchAdmin, "admin", (err, found) => {
            if (err) throw err;

            if (found.length === 0) {
                const emailCrypted = cryptojs.HmacSHA256(email, secretEmail).toString();

                bcrypt
                    .hash(password, 10)
                    .then((hash) => {
                        // On cherche si l'email existe déjà
                        connection.query(searchUser, emailCrypted, (err, userFound) => {
                            if (err) throw err;

                            if (userFound.length === 0) {
                                const adminObject = { email: emailCrypted, password: hash, role: role };

                                // On créé le compte administrateur
                                connection.query(createAdmin, adminObject, (err, result, user) => {
                                    if (err) throw err;

                                    // On recherche ce compte afin de créer son profile
                                    connection.query(searchUser, emailCrypted, (err, userFound) => {
                                        if (err) throw err;

                                        if (userFound.length != 0) {
                                            const user_id = userFound[0].id.toString();

                                            const emailProfile = cryptojs.AES.encrypt(email, secretEmail).toString();

                                            const newProfil = {
                                                user_id: user_id,
                                                email: emailProfile,
                                            };

                                            // On créé le profile admin
                                            connection.query(addAdminProfil, newProfil, async (err, result) => {
                                                if (err) throw err;
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    })
                    .catch((error) => console.log(error));
            }
        });
    });
};

module.exports = createAdmin;
