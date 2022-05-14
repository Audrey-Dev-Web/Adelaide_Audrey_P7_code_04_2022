const jwt = require("jsonwebtoken");
require("dotenv").config();

const secret = process.env.SECRET_TOKEN;

module.exports = (req, res, next) => {
    try {
        // ADAPTER LE USER ID

        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, secret);
        const userId = decodedToken.userId;
        const userRole = decodedToken.role;
        req.auth = { userId, userRole };

        // const tokenCookie = req.cookies.access_token;

        // console.log(req.cookies);

        // if (!tokenCookie) {
        //     console.log("=====>> Response cookie");
        //     console.log("pas de cookie");
        //     return res.sendStatus(403);
        // }

        // console.log(tokenCookie);

        // const data = jwt.verify(tokenCookie, secret);
        // req.userId = data.id;
        // req.userRole = data.role;
        // return next();
        if (req.body.userId && req.body.userId !== userId) {
            throw "Utilisateur invalide";
        } else {
            next();
        }
    } catch (err) {
        res.status(401).json({ ERROR: "Requête non autorisée !" });
    }
};
