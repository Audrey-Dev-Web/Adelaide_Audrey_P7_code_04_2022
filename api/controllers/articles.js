const connection = require('../config/db.user.config');

const Article = require("../models/Articles");
const path = require("path");
const fs = require("fs");

// Créer un nouvel article
exports.createArticle = (req, res, next) => {
    // const articleObject = JSON.parse(req.body);
    try {
        // // const author_id = req.body.id;
        // const { title, content } = req.body;
        // let imageUrl = "";
        // const img = [imageUrl];

        // const article = new Article( title, content, img);

        // if (req.file) {
        //     imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        // }

        // console.log("======> Article title")
        // console.log(title)
        // console.log("======> Article content")
        // console.log(content)
        // // SQL pour ajouter un nouvel article
        // const addNewPost = `INSERT INTO articles SET ?`;
        // console.log("=====> REQ BODY")
        // console.log(req.auth.userId)
        // console.log("=====> END")

        // const newArticle = {
        //     author_id: req.auth.userId,
        //     title: req.body.title,
        //     content: req.body.content,
        //     images: img,
        //     likes: 0,
        //     dislikes: 0,
        //     shares: 0
        // };

        // console.log("=====> CONTENU de article")
        // console.log(newArticle)
        // console.log("=====> ENDED article")

        connection.getConnection((err, connection) => {
            if (err) throw err;

            const author_id = req.auth.userId;
            const { title, content } = req.body;
            let images;

            if (req.file) {
                images = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
            }

            const article = new Article(title, content, images);

            // requête SQL pour ajouter un nouvel article
            const addNewPost = `INSERT INTO articles SET ?`;

            const newArticle = {
                author_id: author_id,
                title: article.title,
                content: article.content,
                images: article.images,
                likes: 0,
                dislikes: 0,
                shares: 0,
            };

            // console.log(newArticle)

            connection.query(addNewPost, newArticle, (err, result) => {
                // connection.release();

                if (err) throw err;

                res.status(201).json({ MESSAGE: "Nouvel article ajouté avec succès !" });
            });
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Afficher tous les articles
exports.getAllArticles = (req, res, next) => {

    try {
    connection.getConnection((err, connection) => {
        if (err) throw err;

        const showAllArticles = `SELECT * FROM users_profiles INNER JOIN articles ON users_profiles.user_id = articles.author_id`;

        connection.query(showAllArticles, (err, found) => {
            connection.release();

            if (err) throw err;

            if (found.length == 0){
                res.status(200).json({ MESSAGE : " Il n'y a aucun article à afficher pour le moment." })
            }

            let articlesFound = [];

            found.forEach((article, index) => {
                let articleFound = {
                    article: {
                        id : article.id.toString(),
                        author : article.author_id.toString(),
                        author_firstName: article.first_name,
                        author_lastName: article.last_name,
                        title : article.title,
                        content : article.content,
                        images: article.images,
                        likes : article.likes,
                        dislikes : article.dislikes,
                        shares: article.shares
                    }
                }

                articlesFound.push(articleFound);
            });

            // console.log(found)

            res.status(200).json({ articlesFound })
        })


    })
} catch (error) {
    res.status(500).json({ error })
}

};

// Afficher l'article
exports.getOneArticle = (req, res, next) => {

    const article_id = req.params.id;
    const searchOne = `SELECT * FROM users_profiles JOIN articles ON users_profiles.user_id = articles.author_id WHERE articles.id = ?`

    try{

        connection.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(searchOne, article_id, (err, article) => {
                connection.release();

                if (err) throw err;

                if (article.length == 0) {
                    res.status(404).json({ ERROR : "Cet article n'existe pas" })
                } else {


                    const articleFound = {
                        id: article[0].id.toString(),
                        author_firstName: article[0].first_name,
                        author_lastName: article[0].last_name,
                        author_avatar: article[0].avatar,

                        title: article[0].title,
                        content: article[0].content,
                        img: article[0].images,

                        likes: article[0].likes,
                        dislikes: article[0].dislikes,
                        shares: article[0].shares
                    }

                    res.status(200).json({ articleFound })
                    // res.status(200).json({ article })
                    console.log(articleFound)
                }
            })
        })

    } catch(error){
        res.status(500).json({ error })
    }

};

// Modifier l'article
exports.modifyArticle = (req, res, next) => {


        const article_id = req.params.id;
        const searchOne = `SELECT * FROM articles WHERE articles.id = ?`

        try{

            connection.getConnection((err, connection) => {
                if (err) throw err;

                connection.query(searchOne, article_id, (err, article) => {
                    connection.release();

                    if (err) throw err;

                    if (article.length == 0) {
                        res.status(404).json({ ERROR : "Cet article n'existe pas" })
                    } else {

                        const author_id = article[0].author_id.toString();

                        if (author_id !== req.auth.userId) {
                            // Si l'utilisateur n'est pas le propriétaire du compte :
                            res.status(401).json({ ERROR : "Vous n'êtes pas autorisé à effectuer cette action." })
                        } else {

                            // const articleFound = {
                            //     id: article[0].id.toString(),
                            //     title: article[0].title,
                            //     content: article[0].content,
                            //     img: article[0].images,
                            // }
    
                            const { title, content } = req.body;
                            const images = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;

                            if (title){
                                console.log("modifier le titre de l'article")

                                const newTitle = title
                                const newTitleSQL = `UPDATE articles SET title = '${newTitle}' WHERE id = ?`

                                connection.query(newTitleSQL, article_id, (err, result) => {

                                    if (err) throw err;
                                })
                            }
    
                            if (content){
                                console.log("modifier le contenu de l'article")

                                const newContent = content
                                const newContentSQL = `UPDATE articles SET content = "${newContent}" WHERE id = ?`

                                connection.query(newContentSQL, article_id, (err, result) => {

                                    if (err) throw err;
                                })
                            }
    

                            let newImgUrl;

                            if (req.file) {
                                console.log("modifier les images");

                                newImgUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
                                const newImgSQL = `UPDATE articles SET images = '${newImgUrl}' WHERE id = ?`;

                                if (article[0].images) {
                                    const file = article[0].images.split("/")[4];
                                    const fileUrl = path.join("images/" + file);

                                    // On supprime l'ancienne
                                    fs.unlink(fileUrl, () => {
                                        console.log("IMAGE DELETED !");
                                    });
                                }

                                connection.query(newImgSQL, article_id, (err, result) => {
                                    if (err) throw err;

                                    console.log("Nouvelle image d'article ajoutée");
                                });
                                console.log("======> Nouvelle image article");
                                console.log(newImgUrl);
                            }
    
                            res.status(200).json({ MESSAGE : "Article modifié avec succès!" })
                        }

                    }
                })
            })

        } catch(error){
            res.status(500).json({ error })
        }

};

// Supprimer l'article
exports.deleteArticle = (req, res, next) => {
    const article_id = req.params.id;

    const userRole = req.auth.userRole;
    const userAuth = req.auth.userId;

    // Connection à la base de données MySQL
    connection.getConnection((err, connection) => {

        // On recherche l'article 
        const searchArticle = `SELECT * FROM articles WHERE id = ?`;
        const deleteArticle = `DELETE FROM articles WHERE id = ?`;

        // On récupère l'article a supprimer
        connection.query(searchArticle, article_id, (err, article) => {
            if (err) throw err;

            if (article.length === 0) {
                return res.status(404).json({ ERROR : "Cet article n'existe pas !" })
            } 

            const author_id = article[0].author_id.toString();
            
            // On vérifis que l'utilisateur connecté soit l'admin ou le créateur de l'article
            if (author_id !== userAuth && userRole !== 'admin'){
                return res.status(400).json({ ERROR : "Requête non autorisée !" })
            } 

            if (article[0].images) {
                const file = article[0].images.split("/")[4];
                const fileUrl = path.join("images/" + file);

               fs.unlink(fileUrl, () => {
                    // console.log("image supprimée avec succès")

                    connection.query(deleteArticle, article_id, (err, results) => {
                        if (err) throw err;

                        res.status(201).json({ MESSAGE : "Article supprimé" })
                    });

                });
            }


        });

        console.log(req.auth)

    });


    // On vérifis si c'est le propriétaire du compte
    // if (profile_id !== req.auth.userId ) {

    //     res.status(401).json({ ERROR : "Vous n'êtes pas autorisé à effectuer cette action." })

    // } else {


        // connection.getConnection((err, connection) => {
        //     if (err) throw err;

        //     // const profileId = req.params.id;

        //     const searchUser = `SELECT * FROM users_profiles WHERE user_id = ?`;
        //     const deleteAccount = `DELETE FROM users_profiles WHERE user_id = ?`;
        //     const deleteLoginAcc = `DELETE FROM users WHERE id = ?`;

        //     // On cherche le profile associé au compte Utilisateur
        //     connection.query(searchUser, profile_id, (err, found) => {
        //         if(err) throw err;
        //         if (found.length == 0) {
        //             res.status(404).json({ ERROR: "Cet utilisateur n'existe pas !" })
        //         }

        //         // On supprime la photo de profile associée
        //         if (found[0].avatar !== null) {

        //             console.log("Il y a un avatar !")

        //             const file = found[0].avatar.split("/")[4];
        //             const fileUrl = path.join("images/" + file);

        //             fs.unlink(fileUrl, () => {
        //                 console.log("image supprimée avec succès")
        //             });

        //         } 

        //         // On supprime le profile
        //         connection.query(deleteAccount, profile_id, (err, found) => {
        //             if(err) throw err;

        //             console.log("Profile supprimé avec succès")

        //             // On supprime le compte de connexion
        //             connection.query(deleteLoginAcc, profile_id, (err, profile) => {
        //                 if(err) throw err;

        //                 console.log("compte utilisateur supprimé avec succès !")
        //                 // connection.release();

        //                 res.status(200).json({ MESSAGE : "Compte supprimé avec succès !" })
        //             })

        //         })
        //     });
        // });
    // }
};