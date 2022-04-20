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

const addNewAdmin = `INSERT INTO users SET ?`;
const searchRole = `SELECT * FROM roles WHERE role = ?`;
const searchUser = `SELECT * FROM users WHERE email = ?`;


exports.signup = (req, res, next) => {
    connection.getConnection(async (err, connection) => { 
        if (err) throw err;

        const searchAdmin = `SELECT * FROM users INNER JOIN roles ON users.role = ?`

        // On cherche s'il y a un compte admin dans la db
        connection.query(searchAdmin, 'admin', (err, found) => {
            if (err) throw err;

            // s'il n'y a pas de comtpe admin on le créé
            if (found.length === 0) {

                const emailCrypted = cryptojs.HmacSHA256(email, secretEmail).toString();

                bcrypt.hash(password, 10)
                .then(hash => {
                    try {
                        connection.query(searchUser, emailCrypted, (err, userFound) => {
                            if (err) throw err;

                            if (userFound.length === 0) {

                                connection.query(searchRole, 'admin', (err, roleFound) => {
                                    if (err) throw err;

                                    if (roleFound.length === 1) {

                                        const roleAdmin = roleFound[0].id;
                                        const newAdmin = new Admin(emailCrypted, hash, roleAdmin);

                                        connection.query(addNewAdmin, newAdmin, (err, result) => {
                                            if (err) throw err;
                                            res.status(201).json({ Message : "Compte admin créé." })
                                        })
                                    }
                                })

                            } else {
                                res.status(400).json({ ERROR: "Ce compte existe déjà." })
                            }

                        });

                    } catch (error) {
                        res.status(400).json({ error })
                    } 
                    

                })
                .catch (error => res.status(401).json({ error }));
            } else {
                console.log("Il y a bien un compte admin " + found[0])
                res.status(200).json(found[0])
            }
        });
    });
}