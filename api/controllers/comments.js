const connection = require('../config/db.user.config');

const Comment = require("../models/Comments")

// Ajouter un commentaire
exports.addComment = (req, res, next) => {
// Récupérer l'id de l'article

    const article_id = req.params.id
    const author_id = req.auth.userId
    const comment_content = req.body.comment

    console.log(article_id)

    connection.getConnection(async (err, connection) => {
        if (err) throw err;

        const comment = new Comment(author_id, article_id, comment_content);

        // requête SQL pour ajouter un nouvel article
        const addNewcomment = `INSERT INTO comments SET ?`;

        const newComment = {
            author_id: comment.author_id,
            article_id: comment.article_id,
            comment: comment.comment_content,
        };

        connection.query(addNewcomment, newComment, (err, commentAdded) => {
            if (err) throw err;

            console.log(commentAdded)
            res.status(200).json({ message: "Commentaire ajouté" })
        })
    })
}

// Afficher tous les commentaires de l'article
exports.getAllcomments = (req, res, next) => {
// Afficher les commentaires de l'article
const article_id = req.params.id
console.log(article_id)

connection.getConnection(async(err, connection) => {
    if (err) throw err;

    const showComments = `SELECT * FROM comments
                            JOIN articles ON (comments.article_id = articles.id)
                            JOIN users_profiles ON (comments.author_comment_id = users_profiles.user_id)`

    connection.query(showComments, (err, comments) => {
        if (err) throw err;

        console.log(comments)

        let allComments = [];

        comments.forEach(comment => {
            let commentInfo = {
                id: comment.comment_id.toString(),
                article_id: comment.article_id.toString(),
                author_id: comment.author_comment_id.toString(),
                firstName: comment.first_name,
                lastName: comment.last_name,
                comment: comment.comment,
                timestamp: comment.timestamp.toString()
            }

            allComments.push(commentInfo);
        })
        
        res.status(200).json({ allComments })
    })

})

}

// Afficher un commentaire
exports.getOneComment = (req, res, next) => {
    // Afficher un commentaire en particulier
    console.log(req.params.id);
    console.log(req.params.comment_id);

    const article_id = req.params.id;
    const comment_id = req.params.comment_id;

    connection.getConnection((err, connection) => {
        if (err) throw err;

        const searchComment = `SELECT * FROM comments WHERE comment_id = '${comment_id}' AND article_id = ?`;

        connection.query(searchComment, article_id, (err, found) => {
            if (err) throw err;

            console.log(found[0]);

            if (found.length <= 0) {
                return res.status(404).json({ ERROR: "Le commentaire que vous recherchez n'existe pas" });
            }

            let commentInfo = {
                id: found[0].comment_id.toString(),
                article_id: found[0].article_id.toString(),
                author_id: found[0].author_comment_id.toString(),
                firstName: found[0].first_name,
                lastName: found[0].last_name,
                comment: found[0].comment,
                timestamp: found[0].timestamp.toString(),
            };

            console.log(found);
            res.status(200).json({ commentInfo });
        });
    });
};

// modifier un commentaire
exports.modifyComment = (req, res, next) => {
// Seul l'auteur du commentaire peut le modifier
res.status(200).json({ message: "Modifier un commentaire" })
}

// Supprimer un commentaire
exports.deleteComment = (req, res, next) => {
// L'auteur du commentaire et l'admin sont les seules à pouvoir supprimer un commentaire
res.status(200).json({ message: "Supprimer un commentaire" })
}