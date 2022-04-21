const cryptojs = require('crypto-js');
const bcrypt = require("bcrypt");

require("dotenv").config()
const secretEmail = process.env.SECRET_EMAIL;

class User {
    constructor (email, password, role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }
    // METHODES pour chiffrer et déchiffrer l'email
    hashedEmail() {
        const emailCrypted = cryptojs.HmacSHA256(this.email, secretEmail).toString();

        console.log("-------> this ")
        console.log(this)

        return emailCrypted;
    }

    // METHODE pour hash le password
    hashPassword = async () => {
        try {
            const hashedPassword = await bcrypt.hash(this.password, 10);

            console.log("-----> HashedPassword")
            console.log(hashedPassword)

            return hashedPassword;
        } catch (err) {
            console.log(err)
        }
    }

}

module.exports = User;