import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

import DeleteComment from "./DeleteComment";

import { BiEditAlt } from "react-icons/bi";

function EditComment(props) {
    // On récupère les données de l'utilisateur avec props
    const { post_id, author_id, comment_id, comment_value, access } = props;

    // On prépare le state local pour stocker les données à modifier
    const [comment, setComment] = useState(comment_value);
    const [isAuthor, setIsAuthor] = useState(false);
    const [message, setMessage] = useState(null);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [error, setError] = useState(false);

    // Hide and show form
    const [editMod, setEditMod] = useState(false);

    // On récupère les données de connexion de l'utilisateur loggé
    const token = access;
    const decoded = jwt_decode(token);
    const user_id = decoded.userId;

    // On créer un objet a envoyer pour la modification
    const commentObject = {
        comment: comment,
    };

    const url = `http://localhost:8080/api/articles/${post_id}/comments/${comment_id}`;
    const reqOptions = {
        method: "PUT",
        body: JSON.stringify(commentObject),
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    const set_author = async () => {
        if (user_id === author_id) {
            setIsAuthor(true);
        }
    };

    useEffect(() => {
        set_author();
    }, []);

    const toggleEdit = () => {
        if (!editMod) {
            setEditMod(true);
        } else {
            setEditMod(false);
        }
    };

    // Fonction pour modifier un commentaire
    const modifyComment = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch(url, reqOptions);
            let commentRes = await res.json();

            if (res.ok) {
                setMessage("Commentaire modifié avec succès");
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
    };

    return (
        <div className="comment">
            {!isAuthor ? null : (
                <div className="comment__buttons">
                    <button className="comment__edit--btn btn" onClick={toggleEdit}>
                        <p hidden>Afficher les commentaires</p>
                        <BiEditAlt />
                        <span className="infobubble">Editer ce commentaire</span>
                    </button>
                    <DeleteComment author_id={author_id} post_id={post_id} comment_id={comment_id} access={access} />
                </div>
            )}

            <div className="comment__editForm">
                <span className={editMod ? "showForm editMod" : "hideForm editMod"}>
                    <h3>Modifier votre commentaire</h3>
                    <form className="comment__editForm--form" onSubmit={modifyComment}>
                        <label htmlFor="comment-content" aria-label="Créer un commentaire">
                            <p hidden>Modifier votre commentaire</p>
                            <textarea
                                id="comment-content"
                                className="comment__editForm--content"
                                type="text"
                                name="content"
                                placeholder="Ajouter un nouveau commentaire"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </label>

                        {!error ? null : <div className="errorMsg">{errorMsg}</div>}
                        {!success ? null : <div className="validateMsg">{message}</div>}

                        <div>
                            <input
                                className="comment__send--btn btn"
                                type="submit"
                                value="Envoyer"
                                aria-label="envoyer"
                            />
                        </div>
                    </form>
                </span>
            </div>
        </div>
    );
}

export default EditComment;
