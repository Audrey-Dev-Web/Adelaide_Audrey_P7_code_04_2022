import React, { useState } from "react";

import { BiCommentAdd } from "react-icons/bi";

function CommentForm(props) {
    const [comment, setComment] = useState(null);
    const [message, setMessage] = useState(null);

    const { post_id, access } = props;

    // console.log(post_id);

    // const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    // const token = user.pass;

    const token = access;
    const user_id = access.user_id;
    const user_role = access.role;

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

            if (res.ok) {
                setMessage("Commentaire ajouté avec succès");
            }
            console.log("=====> Réponse commentaire envoyé : ");
            console.log(commentRes);

            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="commentForm">
            {/* <h2 className="commentForm__title">Ajouter un commentaire</h2> */}
            <form onSubmit={sendComment} className="commentForm__form">
                <label>
                    <textarea
                        className="commentForm__form--textarea"
                        type="text"
                        name="content"
                        placeholder="Ajouter un nouveau commentaire"
                        onChange={(e) => setComment(e.target.value)}
                    />
                </label>

                <div>
                    {/* <BiCommentAdd />
                    <input className="commentForm__form--btn btn" type="submit" value="Envoyer" /> */}
                    <button className="commentForm__form--btn btn" type="submit">
                        <BiCommentAdd />
                    </button>
                </div>
            </form>
            {message}
        </div>
    );
}

export default CommentForm;
