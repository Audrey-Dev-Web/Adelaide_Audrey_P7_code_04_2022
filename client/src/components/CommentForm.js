import React, { useState } from "react";

function CommentForm(props) {
    const [comment, setComment] = useState(null);

    const { post_id } = props;

    // console.log(post_id);

    const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    const token = user.pass;

    const commentObject = {
        comment: comment,
    };

    const url = `http://localhost:8080/api/articles/${post_id}/comments`;
    const reqOptions = {
        method: "POST",
        body: JSON.stringify(commentObject),
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    // Fonction pour ajouter un commentaire
    const sendComment = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch(url, reqOptions);
            let commentRes = await res.json();

            console.log("=====> Réponse commentaire envoyé : ");
            console.log(commentRes);

            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="comments__send">
            <h1>Ajouter un commentaire</h1>
            <form onSubmit={sendComment}>
                <label>
                    <textarea
                        type="text"
                        name="content"
                        placeholder="Ajouter un nouveau commentaire"
                        onChange={(e) => setComment(e.target.value)}
                    />
                </label>

                <div>
                    <input className="comment__send--btn btn" type="submit" value="Envoyer" />
                </div>
            </form>
        </div>
    );
}

export default CommentForm;
