const jwt = require("jsonwebtoken");
require("dotenv").config()

const secret = process.env.SECRET_TOKEN;

module.exports = (req, res, next) => {

    try {

        // ADAPTER LE USER ID
        
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken.userId;
        const userRole = decodedToken.role;
        req.auth = { userId };

        // console.log("=======> Contenu de auth.js userRole")
        // console.log(userRole)
        // console.log("------ Contenu de auth.js userId")
        // console.log(userId)

        if (req.body.userId && req.body.userId !== userId) {
            throw "Utilisateur invalide";
        } else {
            next();
        }

    } catch (err) {
        res.status(401).json({ ERROR : "Requête non authentifiée !" });
    }

};