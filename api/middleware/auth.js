const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SECRET_TOKEN;

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken.userId;
        const userRole = decodedToken.role;
        req.auth = { userId, userRole };

        if (req.body.userId && req.body.userId !== userId) {
            throw "Utilisateur invalide";
        } else {
            next();
        }
    } catch (err) {
        res.status(401).json({ ERROR: "Requête non autorisée !" });
    }
};
