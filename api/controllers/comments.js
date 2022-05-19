const connection = require("../config/db.user.config");

const Comment = require("../models/Comments");

// Ajouter un commentaire
exports.addComment = (req, res, next) => {
    // Récupérer l'id de l'article

    const article_id = req.params.id;
    const author_id = req.auth.userId;
    const comment_content = req.body.comment;

    console.log(article_id);

    connection.getConnection(async (err, connection) => {
        if (err) throw err;

        const comment = new Comment(author_id, article_id, comment_content);

        // requête SQL pour ajouter un nouveau commentaire
        const addNewcomment = `INSERT INTO comments SET ?`;

        const newComment = {
            author_comment_id: comment.author_id,
            article_id: comment.article_id,
            comment: comment.comment_content,
        };

        // On envoi le commentaire dans la base de données
        await connection.query(addNewcomment, newComment, async (err, commentAdded) => {
            if (err) throw err;

            console.log(commentAdded);

            // On mets à jour le nombre de commentaires de l'article
            const update = `UPDATE articles SET comments = comments+1 WHERE id = ?`;
            await connection.query(update, article_id, async (err, updated) => {
                if (err) throw err;

                res.status(200).json({ message: "Commentaire ajouté" });
            });

            // console.log(founds)
        });
    });
};

// Afficher tous les commentaires de l'article
exports.getAllcomments = (req, res, next) => {
    // Afficher les commentaires de l'article
    const article_id = req.params.id;
    console.log(article_id);

    connection.getConnection(async (err, connection) => {
        if (err) throw err;

        const showComments = `SELECT * FROM comments INNER JOIN users_profiles ON comments.author_comment_id = users_profiles.user_id WHERE article_id = ?`;

        // const showComments = `SELECT * FROM comments WHERE article_id = ?`;

        // const showComments = `SELECT * FROM comments
        //                     JOIN articles ON (comments.article_id = article_id)
        //                     JOIN users_profiles ON (comments.author_comment_id = users_profiles.user_id)`;

        await connection.query(showComments, article_id, async (err, found) => {
            if (err) throw err;

            if (found.length <= 0) {
                return res.status(404).json({ error: "Il n'y a aucun commentaire à afficher" });
            }
            console.log(found);

            let allComments = [];

            // author_firstName: author.first_name,
            // author_lastName: author.last_name,
            // author_avatarUrl: author.avatar,

            found.forEach((comment) => {
                let commentInfo = {
                    id: comment.comment_id.toString(),
                    article_id: comment.article_id.toString(),
                    author_id: comment.author_comment_id.toString(),
                    firstName: comment.first_name,
                    lastName: comment.last_name,
                    avatar: comment.avatar,
                    comment: comment.comment,
                    timestamp: comment.timestamp.toString(),
                };

                allComments.push(commentInfo);
            });
            // console.log(allComments);

            res.status(200).json({ allComments });
        });
    });
};

// Afficher un commentaire
exports.getOneComment = (req, res, next) => {
    try {
        // Afficher un commentaire en particulier
        console.log(req.params.id);
        console.log(req.params.comment_id);

        const article_id = req.params.id;
        const comment_id = req.params.comment_id;

        connection.getConnection((err, connection) => {
            if (err) throw err;

            // On récupère le commentaire souhaité
            const searchComment = `SELECT * FROM comments WHERE comment_id = '${comment_id}' AND article_id = ?`;
            connection.query(searchComment, article_id, (err, found) => {
                if (err) throw err;

                // console.log("=====> Author comment id")
                // console.log(found[0].author_comment_id.toString());

                if (found.length <= 0) {
                    return res.status(404).json({ ERROR: "Le commentaire que vous recherchez n'existe pas" });
                }

                // On récupère les informations de l'auteur du commentaire
                const author_comment = found[0].author_comment_id.toString();
                const searchAuthor = `SELECT first_name, last_name FROM users_profiles WHERE user_id = ?`;
                connection.query(searchAuthor, author_comment, (err, authorFound) => {
                    if (err) throw err;

                    if (authorFound.length <= 0) {
                        return res.status(404).json({ ERROR: "Utilisateur inexistant" });
                    }

                    let commentObject = {
                        id: found[0].comment_id.toString(),
                        article_id: found[0].article_id.toString(),
                        author_id: found[0].author_comment_id.toString(), // Récupérer le author_comment_id
                        firstName: authorFound[0].first_name, // récupérer le first_name
                        lastName: authorFound[0].last_name, // Récupérer le last_name
                        comment: found[0].comment,
                        timestamp: found[0].timestamp.toString(),
                    };

                    console.log(found);
                    res.status(200).json({ commentObject });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// modifier un commentaire
exports.modifyComment = (req, res, next) => {
    // Seul l'auteur du commentaire peut le modifier

    try {
        // On stock l'id de l'article
        const article_id = req.params.id;
        // On stock l'id du commentaire
        const comment_id = req.params.comment_id;
        // On récupère l'utilisateur connecté
        const userAuth = req.auth.userId;
        // On stock le role de l'utilisateur connecté
        const userRole = req.auth.userRole;

        // On récupère l'auteur du commentaire
        connection.getConnection(async (err, connection) => {
            if (err) throw err;

            const searchAuthor = `SELECT * FROM comments WHERE comment_id = ?`;
            await connection.query(searchAuthor, comment_id, async (err, authorFound) => {
                if (err) throw err;

                if (authorFound <= 0) {
                    return res.status(404).json({ ERROR: "Auteur inexistant" });
                }

                const author = authorFound[0].author_comment_id.toString();

                if (author !== userAuth) {
                    return res.status(401).json({ ERROR: "Requête non autorisée" });
                }

                if (!req.body.comment) {
                    return res.status(402).json({ ERROR: "Aucune modification effectuée!" });
                }
                // `UPDATE users_profiles SET first_name = '${req.body.first_name}', last_name = '${req.body.last_name}', birthdate = '${req.body.birthdate}' WHERE user_id = ?`;
                const update_comment = `UPDATE comments SET comment= "${req.body.comment}" WHERE comment_id = ?`;
                await connection.query(update_comment, comment_id, async (err, comment_updated) => {
                    if (err) throw err;

                    res.status(201).json({ MESSAGE: "Commentaire modifié avec succès !" });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// Supprimer un commentaire
exports.deleteComment = (req, res, next) => {
    // L'auteur du commentaire et l'admin sont les seules à pouvoir supprimer un commentaire

    try {
        // On stock l'id de l'article
        const article_id = req.params.id;
        // On stock l'id du commentaire
        const comment_id = req.params.comment_id;
        // On récupère l'utilisateur connecté
        const userAuth = req.auth.userId;
        // On stock le role de l'utilisateur connecté
        const userRole = req.auth.userRole;

        // Connexion à MySQL
        connection.getConnection(async (err, connection) => {
            if (err) throw err;

            // On vérifis que l'utilisateur ou le role soit autorisé à effectué la suppression
            const searchAuthor = `SELECT * FROM comments WHERE comment_id = ?`;
            await connection.query(searchAuthor, comment_id, async (err, found) => {
                if (err) throw err;

                console.log(found);

                if (found <= 0) {
                    return res.status(404).json({ ERROR: "Commentaire inexistant" });
                }

                const author = found[0].author_comment_id.toString();
                // On vérifis sir l'utilisateur est un admin
                const adminCheck = userRole.includes("admin");

                if (author !== userAuth) {
                    if (!adminCheck) {
                        return res.status(401).json({ ERROR: "Requête non autorisée" });
                    }
                }

                // On supprime le commentaire
                const del_comment = `DELETE FROM comments WHERE comment_id = ?`;
                await connection.query(del_comment, comment_id, async (err, comment_deleted) => {
                    if (err) throw err;

                    // On mets à jour le nombre de commentaires de l'article
                    const update = `UPDATE articles SET comments = comments-1 WHERE id = ? AND comments > 0`;
                    await connection.query(update, article_id, async (err, updated) => {
                        if (err) throw err;

                        // On vérifis que le nombre de commentaire ne soit pas en dessou de 0
                        // const searchArticle = `SELECT `

                        res.status(200).json({ MESSAGE: "Commentaire supprimé" });
                    });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
