import React, { useState, useEffect } from "react";

import { BiEditAlt } from "react-icons/bi";

function EditComment(props) {
    // On récupère les données de l'utilisateur avec props
    const { post_id, author_id, comment_id, comment_value } = props;

    // On prépare le state local pour stocker les données à modifier
    const [comment, setComment] = useState(comment_value);
    const [isAuthor, setIsAuthor] = useState(false);

    // Hide and show form
    const [editMod, setEditMod] = useState(false);

    // On récupère les données de connexion de l'utilisateur loggé
    const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    const token = user.pass;
    const user_id = user.id;

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
            console.log("mode edition activée !");
        } else {
            setEditMod(false);
            console.log("mode edition désactivée !");
        }
    };

    // Fonction pour modifier un commentaire
    const modifyComment = async (e) => {
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

    // console.log("=====> Test sur le propriétaire du commentaire");
    // console.log(isAuthor);
    // console.log("=====> Author id");
    // console.log(author_id);
    // console.log("=====> User id");
    // console.log(user_id);

    return (
        <div>
            {!isAuthor ? null : (
                <button className="comments__edit--btn btn" onClick={toggleEdit}>
                    <BiEditAlt />
                    <span className="infobubble">Editer ce commentaire</span>
                </button>
            )}

            <div className="comments__editForm">
                <span className="editMod" style={{ display: editMod ? "block" : "none" }}>
                    <h3>Modifier votre commentaire</h3>
                    <form className="comment_editForm--form" onSubmit={modifyComment}>
                        <label>
                            <textarea
                                type="text"
                                name="content"
                                placeholder="Ajouter un nouveau commentaire"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </label>

                        <div>
                            <input className="comment__send--btn btn" type="submit" value="Envoyer" />
                        </div>
                    </form>
                </span>
            </div>
        </div>
    );
}

export default EditComment;
