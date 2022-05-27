import React, { useState, useEffect } from "react";

import { BiTrash } from "react-icons/bi";

function DeleteComment(props) {
    // On récupère l'id de l'utilisateur avec props
    const { post_id, author_id, comment_id, access } = props;

    // On ajoute la double validation avant suppression

    // useState pour stocker le boolean si oui ou non l'utilisateur est autorisé à supprimer
    const [isAuthorized, setIsAuthorized] = useState(false);

    // On récupère les données de connexion de l'utilisateur loggé
    // const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    // const token = user.pass;
    // const user_id = user.id;
    // const user_role = user.role;

    const token = access.token;
    const user_id = access.user_id;
    const user_role = access.role;

    // const role = "admin";

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
        // e.preventDefault();
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

    /*

    onClick : 
    <span> Voulez-vous vraiment supprimer ce commentaire ? </span>
        if (!question) {
            setQuestion(false)
        } else {
            setQuestion(true)
        }
    */

    // doubleValidator = () => {
    //     if (!isOk) {
    //         setDelete(false)
    //     } else {}
    // }

    // console.log("=====> Est-ce que l'utilisateur est autorisé à effectuer cette action ?");
    // console.log(isAuthorized);

    return (
        <div>
            {!isAuthorized ? null : (
                // <button className="comments__delete--btn btn" onClick={(e) => deleteComment(e)}>
                <button
                    className="comments__delete--btn btn"
                    onClick={() => {
                        const confirmBox = window.confirm("Voulez vous vraiment supprimer ce commentaire ?");

                        if (confirmBox === true) {
                            deleteComment();
                        }
                    }}
                >
                    <BiTrash />
                    {/* <span className="infobubble">Supprimer</span> */}
                </button>
            )}
        </div>
    );
}

export default DeleteComment;
