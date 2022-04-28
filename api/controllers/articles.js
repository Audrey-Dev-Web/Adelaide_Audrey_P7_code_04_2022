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
};

exports.likeArticle = (req, res, next) => {
    const article_id = req.params.id;
    const user_id = req.auth.userId;

    connection.getConnection(async (err, connection) => {
        if (err) throw err;

        const searchArticle = `SELECT * FROM articles WHERE id = ?`;

        connection.query(searchArticle, article_id, (err, article) => {
            if (err) throw err;

            if (article.length == 0) {
                return res.status(404).json({ ERROR: "Cet article est introuvable" });
            }

            const userObject = {
                user_id: user_id,
                articles_id: article_id,
            };

            switch (req.body.like) {
                case 0:
                    try {
                        const searchUserLiked = `SELECT * FROM usersliked WHERE user_id = '${user_id}' AND articles_id = ?`;

                        connection.query(searchUserLiked, article_id, (err, userFound) => {
                            if (err) throw err;

                            if (userFound.length == 1) {
                                const deleteUserLiked = `DELETE FROM usersliked WHERE user_id = '${user_id}' AND articles_id = ?`;

                                connection.query(deleteUserLiked, article_id, (err, userLikedDelete) => {
                                    if (err) throw err;

                                    const searchLikesCount = `SELECT * FROM usersliked WHERE articles_id = ?`;

                                    connection.query(searchLikesCount, article_id, (err, founds) => {
                                        if (err) throw err;

                                        if (founds.length <= 0) {
                                            const updateLikes = `UPDATE articles SET likes = '0' WHERE id = ?`;
                                            connection.query(updateLikes, article_id, (err, update) => {
                                                if (err) throw err;
                                                res.status(404).json({ ERROR: "Personne n'a encore like cet article" });
                                            });
                                        } else {
                                            const updateLikes = `UPDATE articles SET likes = '${founds.length}' WHERE id = ?`;
                                            connection.query(updateLikes, article_id, (err, update) => {
                                                if (err) throw err;

                                                res.status(200).json({ MESSAGE: "Like annulé avec succès !" });
                                            });
                                        }
                                    });
                                });
                            }
                        });

                        const searchUserDisliked = `SELECT * FROM usersdisliked WHERE user_id = '${user_id}' AND articles_id = ?`;

                        connection.query(searchUserDisliked, article_id, (err, userFound) => {
                            if (err) throw err;

                            if (userFound.length == 1) {
                                const deleteUserDisliked = `DELETE FROM usersdisliked WHERE user_id = '${user_id}' AND articles_id = ?`;

                                connection.query(deleteUserDisliked, article_id, (err, userDislikedDelete) => {
                                    if (err) throw err;

                                    const searchDislikesCount = `SELECT * FROM usersdisliked WHERE articles_id = ?`;

                                    connection.query(searchDislikesCount, article_id, (err, found) => {
                                        if (err) throw err;

                                        if (found.length <= 0) {
                                            const updateDislikes = `UPDATE articles SET dislikes = '0' WHERE id = ?`;
                                            connection.query(updateDislikes, article_id, (err, updated) => {
                                                if (err) throw err;
                                                res.status(404).json({
                                                    ERROR: "Personne n'a encore dislike cet article",
                                                });
                                            });
                                        } else {
                                            const updateLikes = `UPDATE articles SET dislikes = '${found.length}' WHERE id = ?`;
                                            connection.query(updateLikes, article_id, (err, updated) => {
                                                if (err) throw err;

                                                res.status(200).json({ MESSAGE: "Like annulé avec succès !" });
                                            });
                                        }
                                    });
                                });
                            }
                        });
                    } catch (error) {
                        res.status(500).json({ error });
                    }

                    break;

                case 1:
                    const searchIfDisliked = `SELECT * FROM usersdisliked WHERE articles_id = ?`;
                    connection.query(searchIfDisliked, article_id, (err, found) => {
                        if (err) throw err;

                        let disliked = false;

                        found.forEach((userDisliked) => {
                            if (userDisliked.user_id.toString() === user_id) {
                                disliked = true;
                            } else {
                                disliked = false;
                            }
                        });

                        if (disliked) {
                            const deleteDisliked = `DELETE FROM usersdisliked WHERE user_id = '${user_id}' AND articles_id = ?`;
                            connection.query(deleteDisliked, article_id, (err, userDelete) => {
                                if (err) throw err;

                                console.log("l'utilisateur a été supprimé !");

                                const dislikesCount = `SELECT * FROM usersdisliked WHERE articles_id = ?`;
                                connection.query(dislikesCount, article_id, (err, count) => {
                                    if (err) throw err;

                                    console.log(count.length);

                                    const updateDislikes = `UPDATE articles SET dislikes = ${count.length} WHERE id = ?`;
                                    connection.query(updateDislikes, article_id, (err, updated) => {
                                        if (err) throw err;

                                        console.log(updated);
                                    });
                                });
                            });
                        }
                    });

                    // On cherche si l'utilisateur est déjà présent dans usersliked
                    const searchUsersLiked = `SELECT * FROM usersliked WHERE user_id = '${user_id}' AND articles_id = ?`;
                    connection.query(searchUsersLiked, article_id, (err, userFound) => {
                        if (err) throw err;

                        if (userFound.length <= 0) {
                            const addUserLiked = `INSERT INTO usersliked SET ?`;
                            connection.query(addUserLiked, userObject, (err, results) => {
                                if (err) throw err;

                                console.log(results);

                                const searchLikesCount = `SELECT * FROM usersliked WHERE articles_id = ?`;
                                connection.query(searchLikesCount, article_id, (err, found) => {
                                    if (err) throw err;

                                    console.log("found");

                                    if (found.length >= 0) {
                                        // On met à jour le nombre de likes
                                        const addLikesCount = `UPDATE articles SET likes = '${found.length}' WHERE id = ?`;
                                        connection.query(addLikesCount, article_id, (err, results) => {
                                            if (err) throw err;
                                            console.log(results);

                                            res.status(200).json({
                                                MESSAGE: "L'utilisateur a aimé l'article : " + article_id,
                                            });
                                        });
                                    }
                                });
                            });
                        } else {
                            res.status(400).json({ ERROR: "Cet utilisateur a déjà donnée son avis positif" });
                        }
                    });

                    break;

                case -1:
                    const searchIfLiked = `SELECT * FROM usersliked WHERE user_id = '${user_id}' AND articles_id = ?`;
                    connection.query(searchIfLiked, article_id, (err, userFound) => {
                        if (err) throw err;

                        if (userFound.length > 0) {
                            const deleteLiked = `DELETE FROM usersliked WHERE user_id = '${user_id}' AND articles_id = ?`;
                            connection.query(deleteLiked, article_id, (err, userDelete) => {
                                if (err) throw err;

                                console.log("l'utilisateur a été supprimé !");

                                const likesCount = `SELECT * FROM usersliked WHERE articles_id = ?`;
                                connection.query(likesCount, article_id, (err, count) => {
                                    if (err) throw err;

                                    console.log(count.length);

                                    const updateLikes = `UPDATE articles SET likes = '${count.length}' WHERE id = ?`;
                                    connection.query(updateLikes, article_id, (err, updated) => {
                                        if (err) throw err;

                                        console.log(updated);
                                    });
                                });
                            });
                        }
                    });

                    // On cherche si l'utilisateur est déjà présent dans usersdisliked
                    const searchUsersDisliked = `SELECT * FROM usersdisliked WHERE user_id = '${user_id}' AND articles_id = ?`;
                    connection.query(searchUsersDisliked, article_id, (err, userFound) => {
                        if (err) throw err;

                        if (userFound.length <= 0) {
                            const addUserDisliked = `INSERT INTO usersdisliked SET ?`;
                            connection.query(addUserDisliked, userObject, (err, results) => {
                                if (err) throw err;

                                console.log(results);

                                const searchDislikesCount = `SELECT * FROM usersdisliked WHERE articles_id = ?`;
                                connection.query(searchDislikesCount, article_id, (err, found) => {
                                    if (err) throw err;

                                    console.log("found");

                                    if (found.length >= 0) {
                                        // On met à jour le nombre de likes
                                        const addDislikesCount = `UPDATE articles SET dislikes = '${found.length}' WHERE id = ?`;
                                        connection.query(addDislikesCount, article_id, (err, results) => {
                                            if (err) throw err;
                                            console.log(results);

                                            res.status(200).json({
                                                MESSAGE: "L'utilisateur n'aime pas l'article : " + article_id,
                                            });
                                        });
                                    }
                                });
                            });
                        } else {
                            res.status(400).json({ ERROR: "Cet utilisateur a déjà donnée son avis positif" });
                        }
                    });

                    break;
            }
        });
    });
};