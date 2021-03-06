import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

import { BiTrash } from "react-icons/bi";

function DeleteComment(props) {
    // On récupère l'id de l'utilisateur avec props
    const { post_id, author_id, comment_id, access } = props;

    // useState pour stocker le boolean si oui ou non l'utilisateur est autorisé à supprimer
    const [isAuthorized, setIsAuthorized] = useState(false);

    const [errorMsg, setErrorMsg] = useState(null);
    const [error, setError] = useState(false);

    const token = access;
    const decoded = jwt_decode(token);
    const user_id = decoded.userId;
    const user_role = decoded.role;

    // On prépare la requête delete
    const url = `http://localhost:8080/api/articles/${post_id}/comments/${comment_id}`;
    const reqOptions = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    // On vérifi si l'utilisateur est autorisé à supprimer le commentaire
    const authorization = async () => {
        if (user_id === author_id || user_role === "admin") {
            setIsAuthorized(true);
        }
    };

    useEffect(() => {
        authorization();
    }, []);

    const deleteComment = async (e) => {
        try {
            let res = await fetch(url, reqOptions);
            let commentRes = await res.json();

            if (res.ok) {
                window.location.reload();
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
        <div>
            {!error ? null : <div className="errorMsg">{errorMsg}</div>}
            {!isAuthorized ? null : (
                <button
                    className="comments__delete--btn btn"
                    onClick={() => {
                        const confirmBox = window.confirm("Voulez vous vraiment supprimer ce commentaire ?");

                        if (confirmBox === true) {
                            deleteComment();
                        }
                    }}
                >
                    <p hidden>Supprimer le commentaire</p>
                    <BiTrash />
                </button>
            )}
        </div>
    );
}

export default DeleteComment;
