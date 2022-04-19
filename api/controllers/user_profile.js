const connection = require('../config/db.user.config');

const path = require("path");
const fs = require("fs");

// Voir tous les profiles
exports.getAllProfile = (req, res, next) => {
    connection.getConnection((err, connection) => {
        if (err) throw err;

        const searchAllProfile = `SELECT * FROM users INNER JOIN users_profiles ON users.id = users_profiles.user_id`;

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

        const profileId = req.params.id;

        console.log("----> FoundProfile");
        console.log(profileId);

        // const foundProfileSQL = `SELECT * FROM users INNER JOIN users_profiles ON users.id = ?`;
        // const foundProfileSQL = `SELECT * FROM users INNER JOIN users_profiles WHERE users.id = ?`;

        // ================ Tester le code ci-dessus ===================== //


        const foundProfileSQL = `SELECT * FROM users_profiles WHERE user_id = ?`;
        // const foundProfileSQL = `SELECT * FROM users JOIN users_profiles ON users.id = ?`;

        connection.query(foundProfileSQL, profileId, (err, profile) => {
            if (err) throw err;

            console.log("-------> Résultat de la recherche")
            console.log(profile.length)

            if (profile.length == 0) {
                res.status(404).json({ ERROR: "Ce profile n'existe pas !" });
            } else {

                // console.log("-----> Profiles Trouvé")
                // // console.log(profile[0].id.toString())
                // console.log(profiles)

                        const user_profile = {
                            id: profile[0].id.toString(),
                            user_Id: profile[0].user_id.toString(),
                            // email: profile[0].email,
                            first_name: profile[0].first_name,
                            last_name: profile[0].last_name,
                            birthdate: profile[0].birthdate,
                            avatar: profile[0].avatar,
                        }




                res.status(200).json({ user_profile });
                // res.status(200).json({ userProfile: user });
            }
        });
    });
};

// Modifier un profile
exports.modifyProfile = (req, res, next) => {
    connection.getConnection((err, connection) => {
        if (err) throw err;

        const profileId = req.params.id;
        const searchProfile = `SELECT * FROM users INNER JOIN users_profiles WHERE users.id = ?`;

        connection.query(searchProfile, profileId, (err, profile) => {
            if (err) throw err;


            if (profile.length == 0) {
                res.status(404).json({ ERROR: "Ce profile n'existe pas !" });
            } else {

                let updateProfile;

                console.log("=======> User Profile Data 1")
                console.log(req.body.first_name)
                console.log(req.body.last_name)
                console.log(req.body.birthdate)

                // console.log("========> req.file")
                // console.log(req.file)

                if (req.file) {
                    const avatarUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

                    // SQL UPDATE s'il y a une image a ajouter ou modifier
                    updateProfile = `UPDATE users_profiles SET avatar = '${avatarUrl}' WHERE user_id = ?`;

                } else {

                    // SQL UPDATE s'il n'y a pas d'image a ajouter ou modifier
                    updateProfile = `UPDATE users_profiles SET 
                    first_name = '${req.body.first_name}', 
                    last_name = '${req.body.last_name}', 
                    birthdate = '${req.body.birthdate}' 
                    WHERE user_id = ?`;
                }

                connection.query(updateProfile, profileId, (err, result) => {
                    if (err) throw err;

                    console.log("=====> RESULT UPDATE");
                    console.log(result);

                    res.status(200).json({ MESSAGE: "Profile mis à jour avec succès" });
                });
            }
        });
    });


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