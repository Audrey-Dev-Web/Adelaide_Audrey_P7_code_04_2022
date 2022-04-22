const connection = require('../config/db.user.config');

const path = require("path");
const fs = require("fs");

const cryptojs = require('crypto-js');

require("dotenv").config()
const secretEmail = process.env.SECRET_EMAIL;

// Voir tous les profiles
exports.getAllProfile = (req, res, next) => {
    connection.getConnection((err, connection) => {
        if (err) throw err;

        const searchAllProfile = `SELECT * FROM users JOIN users_profiles ON users.id = users_profiles.user_id`;

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
                            inscrit_le : profile.timestamp.toString(),
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

            console.log("-------> Résultat de la recherche")
            console.log(found.length)

            if (found.length == 0) {
                res.status(404).json({ ERROR: "Cet utilisateur n'existe pas !" });

            } else {

                // Objet user, on uniquement
                const user = {
                    id: found[0].id.toString(),
                    role: found[0].role,
                    inscription: found[0].timestamp
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
                        var decryptedEmail = cryptojs.AES.decrypt(emailAES, secretEmail).toString(cryptojs.enc.Utf8);
                        // var originalEmail = bytes.toString(cryptojs.enc.Utf8);

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
        res.status(401).json({ ERROR : "Vous n'êtes pas autorisé à effectuer cette action." })
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

                    /* 

                        ======= TO-DO =======

                        *] - Au niveau du frontend :

                        - Un bouton " Editer mon profil" afin de permettre à l'utilisateur de changer ses donnée
                        En arrivant sur la page de modification avec le formulaire il doit être capable de modifier
                        toutes les données ci-dessous.


                        *] - A coder niveau API:

                        - Modification de l'email
                        - Modification du password
                        - Modification de first_name
                        - Modification de last_name
                        - Modification de birthdate
                        - Modification de l'avatar


                        */

                       res.status(200).json({ MESSAGE: `Vous êtes autorisé à effectuer cette action.` });

                    });
                });

                // connection.query(searchProfile, profile_id, (err, profile) => {
                //     if (err) throw err;

                //     console.log(profile)

                //     if (profile.UserId !== req.auth.userId) {
                //         res.status(401).json({ ERROR : "Vous n'êtes pas autorisé à effectuer cette action" })
                //     } else {

                //         if (profile.length == 0) {
                //             res.status(404).json({ ERROR: "Ce profile n'existe pas !" });
                //         } else {

                //             let updateProfile;

                //             if (req.file) {

                //                 // On, récupère le chemin de l'ancienne image
                //                 const file = profile[0].avatar.split("/")[4];
                //                 const fileUrl = path.join("images/" + file);

                //                 // On supprime l'ancienne
                //                 fs.unlink(fileUrl, () => {
                //                     console.log("IMAGE DELETED !")
                //                 });

                //                 // On indique le chemin de la nouvelle image
                //                 const avatarUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
                //                 // SQL UPDATE s'il y a une image a ajouter ou modifier
                //                 updateProfile = `UPDATE users_profiles SET avatar = '${avatarUrl}' WHERE user_id = ?`;

                //             } else {

                //                 // SQL UPDATE s'il n'y a pas d'image a ajouter ou modifier
                //                 updateProfile = `UPDATE users_profiles SET
                //                 first_name = '${req.body.first_name}',
                //                 last_name = '${req.body.last_name}',
                //                 birthdate = '${req.body.birthdate}'
                //                 WHERE user_id = ?`;
                //             }

                //             connection.query(updateProfile, profile_id, (err, result) => {
                //                 if (err) throw err;

                //                 // console.log("=====> RESULT UPDATE");
                //                 // console.log(result);

                //                 res.status(200).json({ MESSAGE: "Profile mis à jour avec succès" });
                //             });
                //         }

                //     }

                // });
            });
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

// Supprimer son propre compte
exports.deleteAccount = (req, res, next) => {
    connection.getConnection((err, connection) => {
        if (err) throw err;

        const profileId = req.params.id;

        const searchUser = `SELECT * FROM users_profiles WHERE user_id = ?`;
        const deleteAccount = `DELETE FROM users_profiles WHERE user_id = ?`;
        const deleteLoginAcc = `DELETE FROM users WHERE id = ?`;

        // On cherche le profile associé au compte Utilisateur
        connection.query(searchUser, profileId, (err, found) => {
            if(err) throw err;
            if (found.length == 0) {
                res.status(404).json({ ERROR: "Cet utilisateur n'existe pas !" })
            }

            // On supprime la photo de profile associée
            if (found[0].avatar !== null) {

                console.log("Il y a un avatar !")

                const file = found[0].avatar.split("/")[4];
                const fileUrl = path.join("images/" + file);

                fs.unlink(fileUrl, () => {
                    console.log("image supprimée avec succès")
                });

            } 

            // On supprime le profile
            connection.query(deleteAccount, profileId, (err, found) => {
                if(err) throw err;

                console.log("Profile supprimé avec succès")

                // On supprime le compte de connexion
                connection.query(deleteLoginAcc, profileId, (err, profile) => {
                    if(err) throw err;

                    console.log("compte utilisateur supprimé avec succès !")
                    // connection.release();

                    res.status(200).json({ MESSAGE : "Compte supprimé avec succès !" })
                })

            })

            // res.status(200).json({ Message : found })

            // On récupère l'image de profile qui va avec
            // const file = userProfile
            // console.log(userProfile)
            // On supprime le tout
        });
    });
}