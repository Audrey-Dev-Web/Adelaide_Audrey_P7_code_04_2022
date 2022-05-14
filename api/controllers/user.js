const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cryptojs = require("crypto-js");

require("dotenv").config();
const secretEmail = process.env.SECRET_EMAIL;

// const mysql = require("mysql");

const connection = require("../config/db.user.config");

const User = require("../models/User");

// Connection to MySQL
// connection.getConnection((err, connection) => {

//     if (err) throw (err)
//     console.log("Connexion à la base de données réussie : " + connection.threadId)
// })

// ----------- SIGNUP
exports.signup = async (req, res, next) => {
    const emailRegex = `(.*)@(.*)\.(.*)`;

    const { email, password } = req.body;
    const role = "user";
    // console.log((email))
    // console.log(password)

    if (!email.match(emailRegex)) {
        res.status(400).json({ ERROR: "Adresse email invalide !" });
    } else {
        // const secretEmail = process.env.SECRET_EMAIL;

        // Instance de la class User
        const user = new User(email, password, role);
        // console.log("-------> user");
        // console.log(user);

        // Chiffrement de l'email avant de l'envoyer dans la base de donnée
        const hashedEmail = user.hashedEmail();
        // console.log("-------> user hashedEmail");
        // console.log(hashedEmail);

        user.hashPassword()
            .then((hash) => {
                // console.log("-------> user hashedPassword response");
                // console.log(hash);

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

                    // SQL INNER JOIN
                    // const joinTable = "SELECT * FROM users JOIN users_profiles ON users.id = users_profiles.user_id";

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
                                        // connection.release();
                                        if (err) throw err;

                                        // console.log("------> FOUND")
                                        // console.log(found[0].id.toString())

                                        const user_id = found[0].id.toString();

                                        console.log("-------> userId");
                                        console.log(user_id);

                                        const emailProfile = cryptojs.AES.encrypt(email, secretEmail).toString();

                                        const newProfil = {
                                            user_id: user_id,
                                            email: emailProfile,
                                            first_name: req.body.firstName,
                                            last_name: req.body.lastName,
                                        };

                                        const user_id_sql = `INSERT INTO users_profiles SET ?`;

                                        await connection.query(user_id_sql, newProfil, async (err, result) => {
                                            // connection.release();
                                            if (err) throw err;

                                            console.log("------ RESULT");
                                            console.log(result);
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
    // const emailCrypto = cryptojs.AES.encrypt(email, secretEmail).toString();

    // ======= code pour decrypter l'email ========
    // var emailCrypted = found[0].email;
    // var bytes = cryptojs.AES.decrypt(emailCrypted, secretEmail);
    // var originalEmail = bytes.toString(cryptojs.enc.Utf8);
    // ======= code pour décrypter l'email

    console.log(emailCrypto);

    // const user = req.body.email;

    connection.getConnection(async (err, connection) => {
        if (err) throw err;

        const searchUser = `SELECT * FROM users where email = ?`;
        // const search_query = mysql.format(searchUser, [emailCrypto]);

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

                    // On renvoi l'id de l'utilisateur et son token à destination du frontend

                    // res.cookie("access_token", token, { httpOnly: true, secure: "bro", })

                    res.status(200).json({
                        userId: user_id,
                        userRole: user_role,
                        token: jwt.sign({ userId: user_id, role: user_role }, secret, { expiresIn: "24h" }),
                    });
                    // const token = jwt.sign({ userId: user_id, role: user_role }, secret, { expiresIn: "24h" });
                    // res.cookie("access_token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" })
                    //     .status(200)
                    //     .json({ message: "Logged in succefully !" });
                    // token: jwt.sign({ userId: userId, role: role }, secret, { expiresIn: "24h" }), ====> Suite mentorat
                } else {
                    res.status(401).json({ ERROR: "Password incorrect !" });
                }
            }
        });
    });
};

// Déconnection
// exports.logout = async (req, res, next) => {
//     return res.clearCookie("access_token").status(200).json({ message: "Successfully logged out !" });
// };
