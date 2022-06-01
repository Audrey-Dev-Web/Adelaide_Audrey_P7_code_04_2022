import React, { useState } from "react";

import { BiCommentAdd } from "react-icons/bi";

function CommentForm(props) {
    const [comment, setComment] = useState(null);
    const [message, setMessage] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const { post_id, access } = props;

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

        if (!comment) {
            setErrorMsg("Aucun texte a envoyer");
            setError(true);
            setTimeout(function () {
                setErrorMsg(null);
                setError(false);
            }, 3000);
        } else {
            try {
                let res = await fetch(url, reqOptions);
                let commentRes = await res.json();

                if (res.ok) {
                    setMessage("Commentaire ajouté avec succès");
                    setSuccess(true);
                    setTimeout(function () {
                        setMessage(null);
                        setSuccess(false);
                        window.location.reload();
                    }, 3000);
                } else {
                    throw new Error("Error");
                }
            } catch (err) {
                setErrorMsg(err);
                setError(true);
                setTimeout(function () {
                    setErrorMsg(null);
                    setError(false);
                }, 3000);
            }
        }
    };

    return (
        <div className="commentForm">
            <form onSubmit={sendComment} className="commentForm__form">
                <label htmlFor="comment">
                    <h3>Ajouter un commentaire</h3>
                    <textarea
                        id="comment"
                        className="commentForm__form--textarea"
                        type="text"
                        name="content"
                        placeholder="Ajouter un nouveau commentaire"
                        onChange={(e) => setComment(e.target.value)}
                    />
                </label>

                {!error ? null : <div className="errorMsg">{errorMsg}</div>}
                {!success ? null : <div className="validateMsg">{message}</div>}

                <div>
                    <button className="commentForm__form--btn btn" type="submit">
                        <p hidden>Envoyer votre commentaire</p>
                        <BiCommentAdd />
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CommentForm;
