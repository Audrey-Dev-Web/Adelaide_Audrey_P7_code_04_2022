/*
ADMIN.JS
Page pour la création automatique du 1er compte admin
*/

const bcrypt = require("bcrypt");
const cryptojs = require('crypto-js');

require("dotenv").config()
const secretEmail = process.env.SECRET_EMAIL;

const connection = require('../config/db.user.config');

// On import le model user
const Admin = require("../models/Admin");

const email = "admin.test@groupomania.fr";
const password = "@dm1nP@55w0rd!!"
const role = 'admin';

const searchAdmin =`SELECT * FROM users WHERE role = ?`
const searchUser = `SELECT * FROM users WHERE email = ?`;
const addNewAdmin = `INSERT INTO users SET ?`;
const addAdminProfil = `INSERT INTO users_profiles SET user_id = ?`


exports.signup = (req, res, next) => {
    connection.getConnection(async (err, connection) => { 
        if (err) throw err;

        // On cherche s'il y a un compte admin dans la db
        connection.query(searchAdmin, 'admin', (err, found) => {
            if (err) throw err;

            if (found.length === 0){

                const emailCrypted = cryptojs.HmacSHA256(email, secretEmail).toString();

                bcrypt.hash(password, 10)
                .then(hash => {

                    // On cherche si l'email existe déjà
                    connection.query(searchUser, emailCrypted, (err, userFound) => {
                        if (err) throw err;

                        if (userFound.length === 0) {
                            const newAdmin = new Admin(emailCrypted, hash, role);

                            // On créé le compte administrateur
                            connection.query(addNewAdmin, newAdmin, (err, result, user) => {
                                if (err) throw err;
                                
                                connection.query(searchUser, emailCrypted, (err, userFound) => {
                                    if (err) throw err;

                                    if (userFound.length != 0) {
                                        const user_id = userFound[0].id.toString();

                                        connection.query(addAdminProfil, user_id, async (err, result) => {
                                            if (err) throw err;
                                        
                                            res.status(201).json({ Message: "Compte admin créé." });
                                        });
                                    }
                                })
                            });
                        } else {
                            res.status(400).json({ ERROR: "Cette adresse email est déjà utilisée" })
                        }
                    });

                })
                .catch (error => res.status(401).json({ error }));
            } else {
                res.status(400).json({ ERROR: "Nous avons déjà un compte admin" })
            }
        })
    });
}