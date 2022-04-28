class Comment {
    constructor (author_id, article_id, comment_content) {
        this.author_id = author_id;
        this.article_id = article_id;
        this.comment_content = comment_content;
    }
}

module.exports = Comment;