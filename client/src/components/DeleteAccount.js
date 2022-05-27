import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";

import { BiTrash } from "react-icons/bi";

function DeleteAccount(props) {
    const { userId, access } = props;
    let navigate = useNavigate();
    let { postSlug } = useParams();

    // console.log(userObject);
    // const userObject = {
    //     token: access.token,
    //     user_id: access.user_id,
    //     role: access.role,
    // };

    // console.log(userObject);
    // On récupère l'id de l'utilisateur
    // const { userId } = props;

    const [isAuthorized, setIsAuthorized] = useState(false);

    // On récupère les données pour les authorisations
    // const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    // const token2 = user.pass;
    // const user_id = user.id;
    // const user_role = user.role;
    // const role = "admin";
    // console.log(access.token);
    const token = access.token;
    const user_id = access.user_id;
    const user_role = access.role;

    // On configure la requête
    const url = `http://localhost:8080/api/profiles/${userId}`;
    const reqOptions = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    // On vérifi si l'utilisateur est autorisé à supprimer ce compte
    // const authorization = async () => {
    //     if (user_id === userId) {
    //         setIsAuthorized(true);
    //     }
    // };

    // useEffect(() => {
    //     authorization();
    // }, []);

    // Requête pour supprimer le compte
    const delAccount = async (e) => {
        // e.preventDefault();
        console.log("click");
        try {
            let res = await fetch(url, reqOptions);
            let deleteRes = await res.json();
            // console.log("=====> Réponse commentaire envoyé : ");
            // console.log(deleteRes);

            console.log(deleteRes);

            if (res.ok) {
                // window.location.reload();
                if (postSlug === undefined) {
                    window.location.reload();
                }

                navigate("/");
                window.location.reload();
                sessionStorage.removeItem("isAuthenticate");
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
            {user_id === userId || user_role === "admin" ? (
                // <button className="account__delete btn btn__delete" onClick={(e) => delAccount(e)}>
                <button
                    className="account__delete btn btn__delete"
                    onClick={() => {
                        const confirmBox = window.confirm("Voulez vous vraiment supprimer votre compte ?");

                        if (confirmBox === true) {
                            delAccount();
                        }
                    }}
                >
                    <BiTrash />
                </button>
            ) : null}
        </div>
    );
}

export default DeleteAccount;
