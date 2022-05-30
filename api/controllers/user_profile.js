const connection = require("../config/db.user.config");
const bcrypt = require("bcrypt");

const path = require("path");
const fs = require("fs");

const cryptojs = require("crypto-js");

require("dotenv").config();
const secretEmail = process.env.SECRET_EMAIL;

// Voir tous les profiles
exports.getAllProfile = (req, res, next) => {
    connection.getConnection((err, connection) => {
        if (err) throw err;

        const searchAllProfile = `SELECT * FROM users JOIN users_profiles ON users.id = users_profiles.user_id ORDER by timestamp DESC`;

        connection.query(searchAllProfile, (err, profiles) => {
            connection.release();

            if (err) throw err;

            if (profiles.length == 0) {
                res.status(404).json({ ERROR: "Il n'y a aucun profile a afficher" });
            } else {
                let AllProfile = [];

                profiles.forEach((profile) => {
                    let userProfile = {
                        usersProfile: {
                            id: profile.id.toString(),
                            user_Id: profile.user_id.toString(),
                            inscrit_le: profile.timestamp.toString(),
                            role: profile.role,
                            first_name: profile.first_name,
                            last_name: profile.last_name,
                            birthdate: profile.birthdate,
                            avatar: profile.avatar,
                        },
                    };

                    AllProfile.push(userProfile);
                });

                res.status(200).json(AllProfile);
            }
        });
    });
};

// Afficher un profile
exports.getOneProfile = (req, res, next) => {
    connection.getConnection((err, connection) => {
        if (err) throw err;

        const profile_id = req.params.id;

        console.log("----> FoundProfile");
        console.log(profile_id);

        // const foundProfileSQL = `SELECT * FROM users INNER JOIN users_profiles ON users.id = ?`;
        // const foundProfileSQL = `SELECT * FROM users INNER JOIN users_profiles WHERE users.id = ?`;

        // ================ Tester le code ci-dessus ===================== //

        // const foundProfileSQL = `SELECT * FROM users_profiles JOIN users WHERE user_id = ?`;
        // const foundProfileSQL = `SELECT * FROM users JOIN users_profiles ON users.id = ?`;

        const foundUserSQL = `SELECT * FROM users WHERE id = ?`;
        const foundProfileSQL = `SELECT * FROM users_profiles WHERE user_id = ?`;

        // On cherche l'utilisateur
        connection.query(foundUserSQL, profile_id, (err, found) => {
            if (err) throw err;

            console.log("-------> Résultat de la recherche");
            console.log(found.length);

            if (found.length <= 0) {
                res.status(404).json({ ERROR: "Cet utilisateur n'existe pas !" });
            } else {
                // Objet user, on uniquement
                const user = {
                    id: found[0].id.toString(),
                    role: found[0].role,
                    inscription: found[0].timestamp,
                };

                // On cherche le profile de cet utilisateur
                connection.query(foundProfileSQL, user.id, (err, foundProfile) => {
                    if (err) throw err;

                    if (foundProfile.length == 0) {
                        res.status(404).json({ ERROR: "Ce profile n'existe pas !" });
                    } else {
                        // On vérifis que la req vient du propriétaire
                        if (profile_id === req.auth.userId) {
                            // On decrypt l'email afin qu'il soit visible pour le propriétaire en cas de besoin de modifications du profile
                            var emailAES = foundProfile[0].email;
                            var decryptedEmail = cryptojs.AES.decrypt(emailAES, secretEmail).toString(
                                cryptojs.enc.Utf8
                            );

                            // On récupère les données que l'on veut utiliser
                            const profile = {
                                id: foundProfile[0].id.toString(),
                                user_id: foundProfile[0].user_id.toString(),
                                inscrit_le: user.inscription.toString(),
                                role: user.role,
                                email: decryptedEmail,
                                password: found[0].password,
                                firstName: foundProfile[0].first_name,
                                lastName: foundProfile[0].last_name,
                                birthdate: foundProfile[0].birthdate,
                                avatarUrl: foundProfile[0].avatar,
                            };

                            // On affiche les données avec l'email décrypté dans la réponse
                            res.status(200).json({ profile });
                        } else {
                            // On récupère les données que l'on veut utiliser
                            const profile = {
                                id: foundProfile[0].id.toString(),
                                user_id: foundProfile[0].user_id.toString(),
                                inscrit_le: user.inscription.toString(),
                                role: user.role,
                                firstName: foundProfile[0].first_name,
                                lastName: foundProfile[0].last_name,
                                birthdate: foundProfile[0].birthdate,
                                avatarUrl: foundProfile[0].avatar,
                            };

                            // On affiche les données sans l'email dans la réposne
                            res.status(200).json({ profile });
                        }
                    }
                });
            }
        });
    });
};

// Modifier un profile
exports.modifyProfile = (req, res, next) => {
    const profile_id = req.params.id;
    // On vérifis si c'est le propriétaire du compte
    if (profile_id !== req.auth.userId) {
        // Si l'utilisateur n'est pas le propriétaire du compte :
        res.status(401).json({ ERROR: "Vous n'êtes pas autorisé à effectuer cette action." });
    } else {
        try {
            // Si l'utilisateur est le propriétaire du compte :
            connection.getConnection((err, connection) => {
                if (err) throw err;

                const profile_id = req.params.id;
                // const searchProfile = `SELECT * FROM users INNER JOIN users_profiles WHERE users.id = ?`;

                // ============= ETAPES DE MODIFICATION

                //1 - On veut chercher le profile qui correspond a l'id selectionné par l'utilisateur
                const searchUser = `SELECT * FROM users WHERE id = ?`;
                const searchProfile = `SELECT * FROM users_profiles WHERE user_id = ?`;

                connection.query(searchUser, profile_id, (err, foundUser) => {
                    if (err) throw err;
                    // Si l'id n'existe pas
                    if (foundUser.length == 0) {
                        res.status(404).json({ ERROR: "Cet utilisateur n'existe pas." });
                    }

                    // S'il existe on continue
                    connection.query(searchProfile, profile_id, (err, foundProfile) => {
                        if (err) throw err;
                        if (foundProfile.length == 0) {
                            res.status(404).json({ ERROR: "Ce profile n'existe pas." });
                        }

                        const updateProfile = `UPDATE users_profiles SET first_name = '${req.body.first_name}', last_name = '${req.body.last_name}', birthdate = '${req.body.birthdate}' WHERE user_id = ?`;

                        // const avatarUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

                        // const toUpdate = {
                        //     ...req.body,
                        //     avatar: avatarUrl
                        // }

                        var emailAES = foundProfile[0].email;
                        var decryptedEmail = cryptojs.AES.decrypt(emailAES, secretEmail).toString(cryptojs.enc.Utf8);

                        let newEmail;
                        let newPassword;

                        // Modifier les données de connexion
                        if (req.body.email) {
                            const email = req.body.email;
                            const emailUser = cryptojs.HmacSHA256(email, secretEmail).toString();
                            const emailProfile = cryptojs.AES.encrypt(email, secretEmail).toString();

                            const newEmailSearch = `SELECT * FROM users WHERE email = ?`;
                            const updateTest = `UPDATE users SET email = '${emailUser}' WHERE id = ?`;
                            const updateTest2 = `UPDATE users_profiles SET email = '${emailProfile}' WHERE user_id = ?`;

                            // Modification de l'email
                            connection.query(newEmailSearch, emailUser, (err, emailFound) => {
                                if (err) throw err;

                                if (emailFound.length === 0) {
                                    console.error("Cette adresse email existe déjà");
                                    connection.query(updateTest, profile_id, (err, result) => {
                                        if (err) throw err;

                                        connection.query(updateTest2, profile_id, (err, result) => {
                                            if (err) throw err;

                                            console.log("La modification de l'email fonctionne");
                                            // console.log(result)
                                        });
                                    });
                                }
                            });
                        }

                        // Modification du password
                        if (req.body.password) {
                            const password = req.body.password;

                            bcrypt
                                .hash(password, 10)
                                .then((hash) => {
                                    const updatePassword = `UPDATE users SET password = '${hash}' WHERE id = ?`;

                                    connection.query(updatePassword, profile_id, (err, result) => {
                                        if (err) throw err;

                                        console.log("Password modifié !");
                                    });
                                })
                                .catch((err) => res.status(500).json({ err }));

                            console.log("modifier le mot de pass");
                            // Changer le password en utilisant bcrypt
                        }

                        if (req.body.first_name) {
                            const newfirst_name = req.body.first_name;

                            const update = `UPDATE users_profiles SET first_name = '${newfirst_name}' WHERE user_id = ?`;

                            connection.query(update, profile_id, (err, result) => {
                                if (err) throw err;

                                console.log("Nom modifié");
                            });
                        }

                        if (req.body.last_name) {
                            const newlast_name = req.body.last_name;

                            const update = `UPDATE users_profiles SET last_name = '${newlast_name}' WHERE user_id = ?`;

                            connection.query(update, profile_id, (err, result) => {
                                if (err) throw err;

                                console.log("Prénom modifié");
                            });
                        }

                        if (req.body.birthdate) {
                            const newBirthdate = req.body.birthdate;

                            const update = `UPDATE users_profiles SET birthdate = '${newBirthdate}' WHERE user_id = ?`;

                            connection.query(update, profile_id, (err, result) => {
                                if (err) throw err;

                                console.log("Date de naissance modifiée !");
                            });
                        }

                        let newAvatarUrl;
                        if (req.file) {
                            newAvatarUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
                            const update = `UPDATE users_profiles SET avatar = '${newAvatarUrl}' WHERE user_id = ?`;

                            if (foundProfile[0].avatar) {
                                const file = foundProfile[0].avatar.split("/")[4];
                                const fileUrl = path.join("images/" + file);

                                // On supprime l'ancienne
                                fs.unlink(fileUrl, () => {
                                    console.log("IMAGE DELETED !");
                                });
                            }

                            connection.query(update, profile_id, (err, result) => {
                                if (err) throw err;

                                console.log("Nouvelle image de profile ajoutée");
                            });
                            console.log("======> Nouvelle photo de profile");
                            console.log(newAvatarUrl);
                        }

                        // const profileToUpdate = {
                        //     id: foundProfile[0].id.toString(),
                        //     user_id: foundProfile[0].user_id.toString(),
                        //     email: decryptedEmail,
                        //     password: foundUser[0].password,
                        //     first_name: req.body.first_name,
                        //     last_name: req.body.last_name,
                        //     birthdate: req.body.birthdate,
                        //     avatar: newAvatarUrl,
                        // };

                        // console.log("=====> profileToUpdate");
                        // console.log(profileToUpdate);

                        res.status(200).json({ MESSAGE: `Profile modifié avec succès !` });
                    });
                });
            });
        } catch (error) {
            res.status(500).json(error);
        }
    }
};

// Supprimer son propre compte
exports.deleteAccount = (req, res, next) => {
    const profile_id = req.params.id;
    const userRole = req.auth.userRole;
    const userAuth = req.auth.userId;
    // On vérifis si c'est le propriétaire du compte
    if (profile_id !== userAuth && userRole !== "admin") {
        res.status(401).json({ ERROR: "Vous n'êtes pas autorisé à effectuer cette action." });
    } else {
        connection.getConnection((err, connection) => {
            if (err) throw err;

            // const profileId = req.params.id;

            const searchUser = `SELECT * FROM users_profiles WHERE user_id = ?`;
            const deleteAccount = `DELETE FROM users_profiles WHERE user_id = ?`;
            const deleteLoginAcc = `DELETE FROM users WHERE id = ?`;

            // On cherche le profile associé au compte Utilisateur
            connection.query(searchUser, profile_id, (err, found) => {
                if (err) throw err;
                if (found.length == 0) {
                    res.status(404).json({ ERROR: "Cet utilisateur n'existe pas !" });
                }

                // On supprime la photo de profile associée
                if (found[0].avatar !== null) {
                    console.log("Il y a un avatar !");

                    const file = found[0].avatar.split("/")[4];
                    const fileUrl = path.join("images/" + file);

                    fs.unlink(fileUrl, () => {
                        console.log("image supprimée avec succès");
                    });
                }

                // On supprime le profile
                connection.query(deleteAccount, profile_id, (err, found) => {
                    if (err) throw err;

                    console.log("Profile supprimé avec succès");

                    // On supprime le compte de connexion
                    connection.query(deleteLoginAcc, profile_id, (err, profile) => {
                        if (err) throw err;

                        console.log("compte utilisateur supprimé avec succès !");
                        // connection.release();

                        res.status(200).json({ MESSAGE: "Compte supprimé avec succès !" });
                    });
                });
            });
        });
    }
};
