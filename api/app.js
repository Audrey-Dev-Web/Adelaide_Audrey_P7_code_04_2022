const express = require("express");
const helmet = require("helmet");
const path = require("path");
require("dotenv").config();

// =========> IMPORTER LES ROUTES
const userRoutes = require("./routes/user");
const userProfileRoutes = require("./routes/user_profile");
const articlesRoutes = require("./routes/articles");
// const commentsRoutes = require('./routes/comments');

// =========> Import de config table users
const createTableUsers = require("./config/tables.config/users");
const createTableProfile = require("./config/tables.config/user_profile");
const createTableArticle = require("./config/tables.config/articles");
const CommentsTable = require("./config/tables.config/comments");
const CreateUsers_shared = require("./config/tables.config/users_shared");
const CreateAdmin = require("./config/create_admin");

const connection = require("./config/db.config");

connection.connect((err) => {
    if (err) throw err;

    try {
        createTableUsers();
        createTableProfile();
        createTableArticle();
        CommentsTable();
        CreateUsers_shared();
        CreateAdmin();
    } catch (error) {
        console.log(error);
    }
});

const app = express();
app.use(express.json());

// ==========> Protection contre divers attaque du web
app.use(helmet());

// =========> AJOUTER LES CORS
app.use((req, res, next) => {
    // Permet de définir les origines autorisées à accéder à la ressource
    res.setHeader("Access-Control-Allow-Origin", "*");
    // Permet de définir les entêtes autorisés pour les origines
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    // Permet de définir les méthodes autorisées pour les origines
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    // Permet d'utiliser les images lorsque helmet est activé
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");

    next();
});

// ========> IMPORTER LE CHEMIN STATIQUE DES IMAGES
app.use("/images", express.static(path.join("images")));

// =======> ASSIGNER LE CHEMIN DES ROUTES
app.use("/api/auth", userRoutes);
app.use("/api/profiles", userProfileRoutes);
app.use("/api/articles", articlesRoutes);

// expore de app
module.exports = app;
