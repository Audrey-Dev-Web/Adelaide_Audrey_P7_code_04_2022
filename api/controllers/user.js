const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cryptojs = require("crypto-js");

require("dotenv").config();
const secretEmail = process.env.SECRET_EMAIL;

const connection = require("../config/db.user.config");

const User = require("../models/User");

// ----------- SIGNUP
exports.signup = async (req, res, next) => {
    const emailRegex = `(.*)@(.*)\.(.*)`;

    const { email, password } = req.body;
    const role = "user";

    if (!email.match(emailRegex)) {
        res.status(400).json({ ERROR: "Adresse email invalide !" });
    } else {
        // Instance de la class User
        const user = new User(email, password, role);

        // Chiffrement de l'email avant de l'envoyer dans la base de donnée
        const hashedEmail = user.hashedEmail();

        user.hashPassword()
            .then((hash) => {
                // Données à envoyer
                const newUser = {
                    email: hashedEmail,
                    password: hash,
                    role: role,
                };

                connection.getConnection(async (err, connection) => {
                    if (err) throw err;

                    // On stock le SQL pour rechercher dans la base de donnée
                    const searchUser = "SELECT * FROM users WHERE email = ?";

                    // On stock le SQL pour ajouter un nouvel utilisateur
                    const addNewUser = "INSERT INTO users SET ?";

                    // On se connecte à la base de données afin d'effectuer notre recherche sur l'email chiffré
                    await connection.query(searchUser, hashedEmail, async (err, found) => {
                        if (err) throw err;

                        // Si l'email est déjà dans la base de donnée
                        if (found.length != 0) {
                            // On relache la connection
                            connection.release();

                            res.status(409).json({ ERROR: "Cet utilisateur existe déjà" });
                        } else {
                            // On ajoute le nouvel utilisateur dans la base de données
                            await connection.query(addNewUser, newUser, async (err, result) => {
                                connection.release();

                                if (err) throw err;

                                res.status(201).json({ Message: "Nouvel utilisateur créé avec succès." });

                                await connection.query(
                                    `SELECT * FROM users WHERE email = ?`,
                                    hashedEmail,
                                    async (err, found) => {
                                        if (err) throw err;

                                        const user_id = found[0].id.toString();

                                        const emailProfile = cryptojs.AES.encrypt(email, secretEmail).toString();

                                        const newProfil = {
                                            user_id: user_id,
                                            email: emailProfile,
                                            first_name: req.body.firstName,
                                            last_name: req.body.lastName,
                                        };

                                        const user_id_sql = `INSERT INTO users_profiles SET ?`;

                                        await connection.query(user_id_sql, newProfil, async (err, result) => {
                                            if (err) throw err;
                                        });
                                    }
                                );
                            });
                        }
                    });
                });
            })
            .catch((err) => res.status(401).json({ ERROR: "Impossible de créer l'utilisateur." }));
    }
};

// -------- LOGIN
exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const secretEmail = process.env.SECRET_EMAIL;
    const emailCrypto = cryptojs.HmacSHA256(email, secretEmail).toString();

    connection.getConnection(async (err, connection) => {
        if (err) throw err;

        const searchUser = `SELECT * FROM users where email = ?`;

        await connection.query(searchUser, emailCrypto, async (err, found) => {
            connection.release();

            if (err) throw err;

            if (found.length == 0) {
                res.status(404).send({ message: "Cette utilisateur n'existe pas." });
            } else {
                // Réécrire cette partie du login
                const hashedPassword = found[0].password;
                const secret = process.env.SECRET_TOKEN;

                if (await bcrypt.compare(password, hashedPassword)) {
                    // On converti l'id de l'utilisateur en chaine de caractère et on le renvoi pour le frontend
                    const user_id = found[0].id.toString();
                    const user_role = found[0].role;

                    res.status(200).json({
                        userId: user_id,
                        userRole: user_role,
                        token: jwt.sign({ userId: user_id, role: user_role }, secret, { expiresIn: "24h" }),
                    });
                } else {
                    res.status(401).json({ ERROR: "Password incorrect !" });
                }
            }
        });
    });
};
