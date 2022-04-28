const express = require("express");

// const helmet = require('helmet');
const path = require('path');
require("dotenv").config();

// =========> IMPORTER LES ROUTES
const adminRoutes = require("./routes/admin");
const userRoutes = require('./routes/user');
const userProfileRoutes = require('./routes/user_profile');
const articlesRoutes = require('./routes/articles');

// =========> Import de config table users
const createTableUsers = require('./config/tables.config/users');
const createTableProfile = require('./config/tables.config/user_profile');
const createTableArticle = require("./config/tables.config/articles");
// ========> Relations tables
const addLikesTable = require("./config/tables.config/likes");
const addDislikesTable = require("./config/tables.config/dislikes");
const addSharesTable = require("./config/tables.config/shares");

const connection = require('./config/db.config');

connection.connect((err) => {
    if (err) throw err;

    try {
        createTableUsers();
        createTableProfile();
        createTableArticle();
        addLikesTable();
        addDislikesTable();
        addSharesTable();
    } catch (error) {
        console.log(error)
    }
});

// // const admin_settings = require('./config/db.config.admin');

// // ==========> CONNEXION A L'UTILISATEUR simple user
// connection.connect((err) => {

//     // VARIABLES DE CONNECTION DB

//     // ---- Root acc
//     // const db_connect_acc = process.env.DB_CONNECT_ACC;
//     // const db_connect_pass = process.env.DB_CONNECT_PASS;

//     // ---- Admin acc
//     // const admin = process.env.DB_ADMIN_ACC;
//     // const admin_pass = process.env.DB_ADMIN_PASSWORD;

//     // ---- User acc
//     const user = process.env.DB_USER;
//     const user_pass = process.env.DB_PASSWORD;


//     if (err) throw err;

//         // CREATE ADMIN ACC IF NOT EXISTS
//         // let createAdminAcc = `CREATE USER IF NOT EXISTS '${admin}'@'localhost' IDENTIFIED BY '${admin_pass}'`;
//         let createUserAcc = `CREATE USER IF NOT EXISTS '${user}'@'localhost' IDENTIFIED BY '${user_pass}'`; // OK
//         // let adminPermissions = `GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, PROCESS, FILE, INDEX, ALTER, CREATE ROUTINE, ALTER ROUTINE, CREATE USER, EXECUTE ON *.* TO '${admin}'@'localhost'`;                       
//         let userPermissions = `GRANT SELECT, INSERT, UPDATE, DELETE, CREATE ON *.* TO '${user}'@'localhost'`; // OK


//         // CREATION DU COMPTE ADMIN
//         // connection.query(createAdminAcc, (err, results, fields) => {
//         //     if (err) throw err;

//         //     // console.log("------------------");
//         //     // console.log("User Admin créé !");
//         // });

//         // CREATION DU COMPTE USER
//         connection.query(createUserAcc, (err, results, fields) => {
//             if (err) throw err;

//             // console.log("------------------");
//             // console.log("User créé !");

//             // AJOUT DE PERMISSION AU COMPTE USER
//             connection.query(userPermissions, (err, results, fields) => {
//                 if (err) throw err;

//                 // console.log("------------------");
//                 // console.log("Permissions attribuées avec succès au Rôle User !");
//             });
//         });


//         // AJOUT DE PERMISSIONS AU COMPTE ADMIN
//         // connection.query(adminPermissions, (err, results, fields) => {
//         //     if (err) throw err;

//         //     // console.log("------------------");
//         //     // console.log("Permissions attribuées avec succès au Rôle Admin !");
//         // });


//     // Changement d'utilisateur afin de pouvoir créer une nouvelle table si elle n'est pas présente
//     connection.changeUser({ user: admin_settings.user, password: admin_settings.password }, function(err) {
//         if (err) throw err;

//         // console.log("------------------");
//         // console.log("Connectée en tant qu'Admin")
            

//         //========== USERS TABLE ===========
//         const createUsersTable = `CREATE TABLE IF NOT EXISTS users(
//             id BINARY(16) PRIMARY KEY UNIQUE DEFAULT UUID(),
//             email VARCHAR(100) NOT NULL UNIQUE,
//             password VARCHAR(100) NOT NULL,
//             role_id VARCHAR(10) NOT NULL,
//             timestamp DATETIME NOT NULL DEFAULT NOW() 
            
//         )`;

//         connection.query(createUsersTable, (err, results, fields) => {
//             if (err) throw err;

//             // console.log("------------------");
//             // console.log("Table ajoutée avec succès !");


//             // ============ USERS_PROFILES ===========
//             const createUsersProfile = `CREATE TABLE IF NOT EXISTS users_profiles(
//                 id BINARY(16) NOT NULL PRIMARY KEY UNIQUE DEFAULT UUID(),
//                 user_id BINARY(16) NOT NULL,
//                 first_name VARCHAR(25),
//                 last_name VARCHAR(25),
//                 birthdate DATE,
//                 avatar VARCHAR(100)
//                 )
//             `;

//             connection.query(createUsersProfile, (err, results, fields) => {
//                 if (err) throw err;
    
//                 // console.log("------------------");
//                 // console.log("Table profile ajoutée avec succès !");
//             });
//         });

//         // =============== ROLES ===============
//         // Création de la table Role
//         // const createRoleTable = `CREATE TABLE IF NOT EXISTS roles(
//         //     id BINARY(16) PRIMARY KEY UNIQUE DEFAULT UUID(),
//         //     role VARCHAR(10) NOT NULL,
//         // )`;

//         // const createRoleAdmin = `INSERT INTO roles SET role = admin`
//         // const createRoleUser = `INSERT INTO roles SET role = user`

//         // connection.query(createRoleTable, (err, results, fields) => {
//         //     if (err) throw err;

//         //     // Ajout du role Admin
//         //     connection.query(createRoleAdmin, (err, results) => {
//         //         if (err) throw err;

//         //         // Ajout du role user
//         //         connection.query(createRoleUser, (err, results) => {
//         //             if (err) throw err;
//         //         });
//         //     });
//         // });
//         // =============== END ROLES ===============

//         // connection.query(createArticlesTable, (err, results) => {
//         //     if (err) throw err;
//         // });
//         // connection.query(createCommentsTable, (err, results) => {
//         //     if (err) throw err;
//         // });

//         // DECONNEXION DE MYSQL
//         connection.end((err) => {
//             if (err) {
//                 return console.log(err.message);
//             }
//             console.log("------------------");
//             console.log("Deconnexion du serveur MySQL réussie.");
//         });
//     });
// });


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
app.use("/api/admin", adminRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/profiles", userProfileRoutes);
app.use("/api/articles", articlesRoutes);
// app.use('/api/posts', postsRoutes);


// expore de app
module.exports = app;
