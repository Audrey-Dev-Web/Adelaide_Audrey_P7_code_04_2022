const connection = require("../config/db.user.config");

const Article = require("../models/Articles");
const Share = require("../models/Share");
const path = require("path");
const fs = require("fs");

// Créer un nouvel article
exports.createArticle = (req, res, next) => {
    try {
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
                comments: 0,
                shares: 0,
            };

            connection.query(addNewPost, newArticle, (err, result) => {
                if (err) throw err;

                connection.release();

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
        connection.getConnection(async (err, connection) => {
            if (err) throw err;

            // On cherche tous les articles
            const articles = `SELECT * FROM users_profiles JOIN articles ON users_profiles.user_id = articles.author_id ORDER by timestamp DESC`;
            await connection.query(articles, async (err, found) => {
                connection.release();

                if (err) throw err;

                if (found.length == 0) {
                    return res.status(404).json({ MESSAGE: " Il n'y a aucun article à afficher pour le moment." });
                }

                let articlesFound = [];

                // console.log(found);

                found.forEach((article, index) => {
                    let real_author;

                    if (article.original_author_id !== null) {
                        real_author = article.original_author_id.toString();
                    }

                    let articleFound = {
                        article: {
                            id: article.id.toString(),
                            author: article.author_id.toString(),
                            author_firstName: article.first_name,
                            author_lastName: article.last_name,
                            author_avatar: article.avatar,
                            original_author_id: real_author,
                            title: article.title,
                            is_shared: article.is_shared,
                            shared_id: article.shared_id ? article.shared_id.toString() : null,
                            content: article.content,
                            images: article.images,
                            comments: article.comments,
                            shares: article.shares,
                            post_shared_timestamp: article.post_shared_timestamp,
                            timestamp: article.timestamp.toString(),
                        },
                    };

                    articlesFound.push(articleFound);
                });

                res.status(200).json({ articlesFound });
            });
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Afficher l'article
exports.getOneArticle = (req, res, next) => {
    const article_id = req.params.id;
    const searchOne = `SELECT * FROM users_profiles JOIN articles ON users_profiles.user_id = articles.author_id WHERE articles.id = ?`;

    try {
        connection.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(searchOne, article_id, (err, article) => {
                connection.release();
                if (err) throw err;

                if (article.length == 0) {
                    res.status(404).json({ ERROR: "Cet article n'existe pas" });
                } else {
                    let real_author;
                    let shared_id;
                    if (article.original_author_id == null) {
                        real_author = null;
                    } else {
                        real_author = article[0].original_author_id.toString();
                    }

                    if (article.shared_id == null) {
                        shared_id = null;
                    } else {
                        shared_id = article[0].shared_id.toString();
                    }

                    const articleFound = {
                        id: article[0].id.toString(),
                        is_shared: article[0].is_shared,
                        shared_id: shared_id,
                        original_author_id: real_author,
                        author_firstName: article[0].first_name,
                        author_lastName: article[0].last_name,
                        author_avatar: article[0].avatar,
                        author_id: article[0].user_id.toString(),
                        title: article[0].title,
                        content: article[0].content,
                        timestamp: article[0].timestamp.toString(),
                        img: article[0].images,
                        is_shared: article.is_shared,
                        comments: article[0].comments,
                        shares: article[0].shares,
                    };

                    res.status(200).json({ articleFound });
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Modifier l'article
exports.modifyArticle = (req, res, next) => {
    const article_id = req.params.id;
    const searchOne = `SELECT * FROM articles WHERE articles.id = ?`;

    try {
        connection.getConnection((err, connection) => {
            if (err) throw err;

            connection.query(searchOne, article_id, (err, article) => {
                if (err) throw err;

                if (article.length == 0) {
                    res.status(404).json({ ERROR: "Cet article n'existe pas" });
                } else {
                    const author_id = article[0].author_id.toString();

                    if (author_id !== req.auth.userId) {
                        // Si l'utilisateur n'est pas le propriétaire du compte :
                        res.status(401).json({ ERROR: "Vous n'êtes pas autorisé à effectuer cette action." });
                    } else {
                        const { title, content, images } = req.body;

                        if (title) {
                            console.log("modifier le titre de l'article");

                            const newTitle = title;
                            const newTitleSQL = `UPDATE articles SET title = "${newTitle}" WHERE id = "${article_id}"`;

                            connection.query(newTitleSQL, (err, result) => {
                                if (err) throw err;
                            });
                        }

                        if (content) {
                            const newContent = content;
                            const newContentSQL = `UPDATE articles SET content = "${newContent}" WHERE id = "${article_id}"`;

                            connection.query(newContentSQL, (err, result) => {
                                if (err) throw err;
                            });
                        }

                        let newImgUrl;

                        if (req.file) {
                            console.log("modifier les images");

                            newImgUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
                            const newImgSQL = `UPDATE articles SET images = "${newImgUrl}" WHERE id = ?`;

                            if (article[0].images != null) {
                                const file = article[0].images.split("/")[4];
                                const fileUrl = path.join("images/" + file);

                                // On supprime l'ancienne
                                fs.unlink(fileUrl, () => {
                                    console.log("IMAGE DELETED !");
                                });
                            }

                            connection.query(newImgSQL, article_id, (err, result) => {
                                connection.release();
                                if (err) throw err;
                            });
                        }

                        res.status(200).json({ MESSAGE: "Article modifié avec succès!" });
                    }
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Supprimer l'article
exports.deleteArticle = (req, res, next) => {
    const article_id = req.params.id;

    const userRole = req.auth.userRole;
    const userAuth = req.auth.userId;

    // Connection à la base de données MySQL
    connection.getConnection((err, connection) => {
        if (err) throw err;
        // On recherche l'article
        const searchArticle = `SELECT * FROM articles WHERE id = ?`;
        const deleteArticle = `DELETE FROM articles WHERE id = ?`;

        // On récupère l'article a supprimer
        connection.query(searchArticle, article_id, (err, found) => {
            if (err) throw err;

            if (found.length === 0) {
                return res.status(404).json({ ERROR: "Cet article n'existe pas !" });
            }

            const author_id = found[0].author_id.toString();

            // On vérifis que l'utilisateur connecté soit l'admin ou le créateur de l'article
            if (author_id !== userAuth && userRole !== "admin") {
                return res.status(400).json({ ERROR: "Requête non autorisée !" });
            }

            if (found[0].images) {
                const file = found[0].images.split("/")[4];
                const fileUrl = path.join("images/" + file);

                fs.unlink(fileUrl, () => {
                    connection.query(deleteArticle, article_id, (err, results) => {
                        if (err) throw err;

                        res.status(201).json({ MESSAGE: "Article supprimé" });
                    });
                });
            } else {
                connection.query(deleteArticle, article_id, (err, results) => {
                    connection.release();
                    if (err) throw err;

                    res.status(201).json({ MESSAGE: "Article supprimé" });
                });
            }
        });
    });
};

exports.shareArticle = (req, res, next) => {
    try {
        const post_id = req.params.id;
        const user_id = req.auth.userId;

        // connection à la base de Données
        connection.getConnection(async (err, connection) => {
            if (err) throw err;

            // On verifis que l'article existe
            const searchPost = `SELECT * FROM articles 
            JOIN users_profiles 
            ON articles.author_id = users_profiles.user_id
            WHERE articles.id = ?`;

            await connection.query(searchPost, post_id, async (err, postFound) => {
                if (err) throw err;

                if (postFound.length <= 0) {
                    return res.status(404).json({ ERROR: "Ce post n'existe pas" });
                }

                const searchUsersShared = `SELECT * FROM users_shared WHERE user_id = '${user_id}' AND post_id = ?`;

                if (req.body.share === 1) {
                    // On vérifis que l'utilisateur n'a pas déjà partagé ce post
                    // On cherche donc la présence de l'utilisateur dans users_shared

                    await connection.query(searchUsersShared, post_id, async (err, userFound) => {
                        if (err) throw err;

                        if (userFound.length > 0) {
                            // Supprimer l'utilisateur qu'il y a dans users_shared ou post id est post_id
                            const cancelShare = `DELETE FROM users_shared WHERE user_id = "${user_id}" AND post_id = ?`;
                            // Supprimer l'article partagé qui a is_shared = 1 et le shared_id = post_id
                            const cancelPostSharing = `DELETE FROM articles WHERE is_shared = 1 AND shared_id = ?`;
                            // On update le nombre de partage du post
                            const updateShareCount = `UPDATE articles SET shares = shares-1 WHERE id = ?`;

                            await connection.query(cancelShare, post_id, async (err, canceled) => {
                                if (err) throw err;

                                await connection.query(cancelPostSharing, post_id, async (err, postCanceled) => {
                                    if (err) throw err;

                                    await connection.query(updateShareCount, post_id, async (err, updated) => {
                                        connection.release();
                                        if (err) throw err;

                                        return res.status(201).json({ MESSAGE: "Partage annulé avec succès!" });
                                    });
                                });
                            });
                        } else {
                            // On récupère la data du post
                            const content = {
                                id: postFound[0].id.toString(),
                                is_shared: 1,
                                post_shared_timestamp: postFound[0].timestamp,
                                original_author_id: postFound[0].author_id.toString(),
                                avatar: postFound[0].avatar,
                                author_firstName: postFound[0].first_name,
                                author_lastName: postFound[0].last_name,
                                title: postFound[0].title,
                                post_content: postFound[0].content,
                                images: postFound[0].images,
                            };

                            // On passe le contenu dans Stringify afin de pouvoir l'ajouter dans MySQL
                            const post_content = JSON.stringify(content);

                            // requête SQL pour ajouter un nouvel article
                            const sharePost = `INSERT INTO articles SET ?`;

                            // On créer un nouveau post à partir de celui-ci
                            const post = new Article(content.title, content.post_content, content.images);

                            const post_shared_Data = {
                                author_id: user_id,
                                original_author_id: content.original_author_id,
                                is_shared: 1,
                                shared_id: post_id,
                                post_shared_timestamp: content.post_shared_timestamp,
                                title: post.title,
                                content: post.content,
                                images: post.images,
                                comments: 0,
                                shares: 0,
                            };

                            await connection.query(sharePost, post_shared_Data, async (err, result) => {
                                if (err) throw err;

                                const userObject = {
                                    user_id: user_id,
                                    post_id: post_id,
                                };
                                // On ajoute l'id utilisateur dans usersshared
                                const addUsersShared = `INSERT INTO users_shared SET ?`;
                                await connection.query(addUsersShared, userObject, async (err, userAdded) => {
                                    if (err) throw err;

                                    // On mets à jour le nombre de partage de l'article
                                    const update_shares = `UPDATE articles SET shares = shares+1 WHERE id = ?`;
                                    await connection.query(update_shares, post_id, async (err, updated) => {
                                        connection.release();
                                        if (err) throw err;

                                        res.status(201).json({ MESSAGE: "Post partagé avec succès" });
                                    });
                                });
                            });
                        }
                    });
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
