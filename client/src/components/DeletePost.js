import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";

import { BiTrash } from "react-icons/bi";

function DeletePost(props) {
    let navigate = useNavigate();
    let { postSlug } = useParams();
    const { access } = props;

    // On récupère l'id du post à supprimer
    const { post_id, author_id } = props;

    const [isAuthorized, setIsAuthorized] = useState(false);

    // On récupère les données pour les authorisations
    // const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    // const token = user.pass;
    // const user_id = user.id;
    // const user_role = user.role;
    // const role = "admin";

    const token = access.token;
    const user_id = access.user_id;
    const user_role = access.role;

    // On configure la requête
    const url = `http://localhost:8080/api/articles/${post_id}`;
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

    const del = async (e) => {
        // e.preventDefault();

        console.log("click");
        try {
            let res = await fetch(url, reqOptions);
            let deleteRes = await res.json();

            if (res.ok) {
                // window.location.reload();
                if (postSlug === undefined) {
                    window.location.reload();
                }

                navigate("/");
            } else {
                throw new Error("Error");
            }

            // window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            {!isAuthorized ? null : (
                // <button className="post__delete btn btn__delete" onClick={(e) => del(e)}>
                <button
                    className="post__delete btn btn__delete"
                    onClick={() => {
                        const confirmBox = window.confirm("Voulez vous vraiment supprimer ce post ?");

                        if (confirmBox === true) {
                            del();
                        }
                    }}
                >
                    <BiTrash />
                </button>
            )}
        </div>
    );
}

export default DeletePost;
