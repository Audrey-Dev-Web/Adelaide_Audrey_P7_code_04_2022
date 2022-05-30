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
                likes: 0,
                dislikes: 0,
                shares: 0,
            };

            connection.query(addNewPost, newArticle, (err, result) => {
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

                console.log(found);

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
                            likes: article.likes,
                            dislikes: article.dislikes,
                            shares: article.shares,
                            post_shared_timestamp: article.post_shared_timestamp,
                            timestamp: article.timestamp.toString(),
                        },
                    };

                    articlesFound.push(articleFound);
                });

                // console.log(found)

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
                    console.log("=====> article");
                    console.log(article);

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
                        likes: article[0].likes,
                        dislikes: article[0].dislikes,
                        shares: article[0].shares,
                    };

                    res.status(200).json({ articleFound });

                    console.log(articleFound);
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
                connection.release();

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
                            // const newTitleSQL = `UPDATE articles SET ? WHERE id = '${article_id}'`;
                            const newTitleSQL = `UPDATE articles SET title = "${newTitle}" WHERE id = "${article_id}"`;

                            connection.query(newTitleSQL, (err, result) => {
                                if (err) throw err;
                            });
                        }

                        if (content) {
                            console.log("modifier le contenu de l'article");

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
                                // console.log(article[0].images);
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
        // On recherche l'article
        const searchArticle = `SELECT * FROM articles WHERE id = ?`;
        const deleteArticle = `DELETE FROM articles WHERE id = ?`;

        // On récupère l'article a supprimer
        connection.query(searchArticle, article_id, (err, found) => {
            if (err) throw err;

            console.log(found);

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
                    if (err) throw err;

                    res.status(201).json({ MESSAGE: "Article supprimé" });
                });
            }
        });

        // console.log(req.auth);
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

                switch (req.body.share) {
                    case 0:
                        await connection.query(searchUsersShared, post_id, async (err, userFound) => {
                            if (err) throw err;

                            if (userFound.length <= 0) {
                                return res.status(401).json({ ERROR: "Vous n'avez pas encore partagé ce post" });
                            }

                            const delete_post_shared = `DELETE FROM posts_shared WHERE user_id = '${user_id}' AND post_id = ?`;

                            await connection.query(delete_post_shared, post_id, async (err, deleted) => {
                                if (err) throw err;

                                console.log("delete post shared a fonctionné avec succès");

                                const delete_user_shared = `DELETE FROM users_shared WHERE user_id = '${user_id}' AND post_id = ?`;
                                await connection.query(delete_user_shared, post_id, async (err, deleted) => {
                                    if (err) throw err;

                                    console.log("delete user shared a fonctionné avec succès");

                                    const update_shares = `UPDATE articles SET shares = shares-1 WHERE id = ?`;

                                    await connection.query(update_shares, post_id, async (err, updated) => {
                                        if (err) throw err;

                                        res.status(200).json({ MESSAGE: "Partage annulé avec succès !" });
                                    });
                                });
                            });
                        });

                        break;

                    case 1:
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
                                            if (err) throw err;

                                            return res.status(201).json({ MESSAGE: "Partage annulé avec succès!" });
                                        });
                                    });
                                });
                            } else {
                                // On récupère la data du post
                                console.log("=====> Post Found");
                                console.log(postFound);

                                // const title = "Shared";
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
                                    likes: 0,
                                    dislikes: 0,
                                    shares: 0,
                                };

                                console.log("=====> POST DATA");
                                console.log(post_shared_Data);

                                await connection.query(sharePost, post_shared_Data, async (err, result) => {
                                    // connection.release();
                                    if (err) throw err;

                                    const userObject = {
                                        user_id: user_id,
                                        post_id: post_id,
                                    };
                                    // On ajoute l'id utilisateur dans usersshared
                                    const addUsersShared = `INSERT INTO users_shared SET ?`;
                                    await connection.query(addUsersShared, userObject, async (err, userAdded) => {
                                        if (err) throw err;

                                        // const update = `UPDATE articles SET comments = comments-1 WHERE id = ? AND comments > 0`;
                                        // On mets à jour le nombre de partage de l'article
                                        const update_shares = `UPDATE articles SET shares = shares+1 WHERE id = ?`;
                                        await connection.query(update_shares, post_id, async (err, updated) => {
                                            if (err) throw err;

                                            console.log("=====> Update Réussi !");
                                            console.log(updated);

                                            res.status(201).json({ MESSAGE: "Post partagé avec succès" });
                                        });
                                    });
                                });
                            }
                        });

                        break;
                }
            });
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
