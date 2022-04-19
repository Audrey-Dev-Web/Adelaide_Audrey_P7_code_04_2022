const express = require("express");

// const helmet = require('helmet');
const path = require('path');
require("dotenv").config();

// =========> IMPORTER LES ROUTES
const userRoutes = require('./routes/user');
const userProfileRoutes = require('./routes/user_profile');
// const sauceRoutes = require('./routes/sauce');

// =========> CONNEXION A LA DB
// const mysql = require("mysql");

// =========> PARAMETRE DE CONNEXION

// const connection = mysql.createConnection({
//         host : 'localhost',
//         user: process.env.DB_CONNEC_ACC,
//         password: '',
//         database: 'groupomania',
//         port: 3307
// });



const connection = require('./config/db.config');
const admin_settings = require('./config/db.config.admin');

// ==========> CONNEXION A L'UTILISATEUR simple user
connection.connect((err) => {

    // VARIABLES DE CONNECTION DB

    // ---- Root acc
    // const db_connect_acc = process.env.DB_CONNECT_ACC;
    // const db_connect_pass = process.env.DB_CONNECT_PASS;

    // ---- Admin acc
    const admin = process.env.DB_ADMIN_ACC;
    const admin_pass = process.env.DB_ADMIN_PASSWORD;

    // ---- User acc
    const user = process.env.DB_USER;
    const user_pass = process.env.DB_PASSWORD;


    if (err) throw err;

        // CREATE ADMIN ACC IF NOT EXISTS
        let createAdminAcc = `CREATE USER IF NOT EXISTS '${admin}'@'localhost' IDENTIFIED BY '${admin_pass}'`;
        let createUserAcc = `CREATE USER IF NOT EXISTS '${user}'@'localhost' IDENTIFIED BY '${user_pass}'`;
        let adminPermissions = `GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, PROCESS, FILE, INDEX, ALTER, CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EXECUTE ON *.* TO '${admin}'@'localhost'`;                       
        let userPermissions = `GRANT SELECT, INSERT, UPDATE, DELETE, CREATE ON *.* TO '${user}'@'localhost'`;


        // CREATION DU COMPTE ADMIN
        connection.query(createAdminAcc, (err, results, fields) => {
            if (err) throw err;

            // console.log("------------------");
            // console.log("User Admin créé !");
        });

        // CREATION DU COMPTE USER
        connection.query(createUserAcc, (err, results, fields) => {
            if (err) throw err;

                // console.log("------------------");
                // console.log("User créé !");
        });


        // AJOUT DE PERMISSIONS AU COMPTE ADMIN
        connection.query(adminPermissions, (err, results, fields) => {
            if (err) throw err;

            // console.log("------------------");
            // console.log("Permissions attribuées avec succès au Rôle Admin !");
        });

        // AJOUT DE PERMISSION AU COMPTE USER
        connection.query(userPermissions, (err, results, fields) => {
            if (err) throw err;

            // console.log("------------------");
            // console.log("Permissions attribuées avec succès au Rôle User !");
        });

        // CREATE TABLE IF NOT EXISTS ( user, userProfil, posts )

    // Changement d'utilisateur afin de pouvoir créer une nouvelle table si elle n'est pas présente
    connection.changeUser({ user: admin_settings.user, password: admin_settings.password }, function(err) {
        if (err) throw err;

        // console.log("------------------");
        // console.log("Connectée en tant qu'Admin")

        const createUsersTable = `CREATE TABLE IF NOT EXISTS users(
            id BINARY(16) PRIMARY KEY UNIQUE DEFAULT UUID(),
            email VARCHAR(100) NOT NULL UNIQUE,
            password VARCHAR(100) NOT NULL,
            timestamp DATETIME NOT NULL DEFAULT NOW() 
            
        )`;

        const createUsersProfile = `CREATE TABLE IF NOT EXISTS users_profiles(
            id BINARY(16) NOT NULL PRIMARY KEY UNIQUE DEFAULT UUID(),
            user_id BINARY(16) NOT NULL,
            first_name VARCHAR(25),
            last_name VARCHAR(25),
            birthdate DATE,
            avatar VARCHAR(100)
            )
        `;

        // const createTestuser = "INSERT INTO users SET ?";
        const joinTable = "SELECT * FROM users INNER JOIN users_profiles ON users . id = users_profiles . user_id";
            
        // )`;

        // let createArticlesTable = `CREATE TABLE IF NOT EXISTS articles(
        //     id BINARY(16) PRIMARY KEY,
        //     email VARCHAR(50) NOT NULL,
        //     password VARCHAR(100) NOT NULL,
        //     timestamp DATE NOT NULL DEFAULT CURRENT_TIMESTAMP
            
        // )`;

        /* 

            ==== Créer le role admin ====
            users:
            id : UUID(),
            email : admin@groupomania.com,
            password : le password,
            role : Admin,
            timestamp : NOW()

            
            ==== Créer le role user ====

            users :
            id : UUID(),
            email: req.body.email,
            password: req.body.password,
            role : User,
            timestamps : NOW()


         */
        

        //Création de la nouvelle table
        connection.query(createUsersTable, (err, results, fields) => {
            if (err) throw err;

            // console.log("------------------");
            // console.log("Table ajoutée avec succès !");
        });

        connection.query(createUsersProfile, (err, results, fields) => {
            if (err) throw err;

            // console.log("------------------");
            // console.log("Table profile ajoutée avec succès !");
        });

        // connection.query(joinTable, (err, results, fields) => {
        //     if (err) throw err;

        //     console.log("------------------");
        //     console.log("Jointure des tables effectuées !")
        //     console.log(results)
        // });

        // DECONNEXION DE MYSQL
        connection.end((err) => {
            if (err) {
                return console.log(err.message);
            }
            console.log("------------------");
            console.log("Deconnexion du serveur MySQL réussie.");
        });
    });
});


// ==========> AJOUTER L'ANALYSE DU CORPS DE LA PAGE
const app = express();
app.use(express.json());
    
// ==========> AJOUTER HELMET
// app.use(helmet());

// =========> AJOUTER LES CORS
app.use((req, res, next) => {
    // Permet de définir les origines autorisées à accéder à la ressource
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Permet de définir les entêtes autorisés pour les origines
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    // Permet de définir les méthodes autorisées pour les origines
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    // Permet d'utiliser les images lorsque helmet est activé
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');

    next();
});

// ========> IMPORTER LE CHEMIN STATIQUE DES IMAGES
app.use('/images',express.static(path.join('images')));
// app.use('/images',express.static(path.join('images/avatar')));
// app.use('/images',express.static(path.join('images/posts')));

// =======> ASSIGNER LE CHEMIN DES ROUTES
app.use("/api/auth", userRoutes);
app.use("/api/profiles", userProfileRoutes);
// app.use('/api/posts', postsRoutes);


// expore de app
module.exports = app;
