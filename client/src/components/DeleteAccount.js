import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";

// Gestion des cookies
import { useCookies } from "react-cookie";
import jwt_decode from "jwt-decode";

import { BiTrash } from "react-icons/bi";

function DeleteAccount(props) {
    const { userId, access } = props;
    let navigate = useNavigate();
    let { userSlug } = useParams();

    const [cookies, setCookies, removeCookie] = useCookies(["access"]);
    const [deleteMsg, setDeleteMsg] = useState("");
    const [deleteOK, setDeleteOK] = useState(false);

    const [isAuthorized, setIsAuthorized] = useState(false);

    const token = access;
    const decoded = jwt_decode(token);
    const user_id = decoded.userId;
    const user_role = decoded.role;

    // On configure la requête
    const url = `http://localhost:8080/api/profiles/${userSlug}`;
    const reqOptions = {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    // Requête pour supprimer le compte
    const delAccount = async (e) => {
        // e.preventDefault();
        console.log("click");
        try {
            let res = await fetch(url, reqOptions);
            let deleteRes = await res.json();

            console.log(deleteRes);

            if (res.ok) {
                if (user_id === userSlug) {
                    // afficher une page pendant 5 secondes afin de confirmer à l'utilisateur que son compte est
                    // supprimé à vie
                    setDeleteMsg("Votre compte a été supprimé avec succès!");
                    setDeleteOK(true);
                    removeCookie("access", "", { path: "/" });
                    setTimeout(function () {
                        navigate("/");
                        window.location.reload();
                    }, 3500);
                } else if (user_role === "admin") {
                    // Afficher une page pour l'admin lui confirmant que le compte a bien été supprimé
                    setDeleteMsg("Le compte de cet utilisateur a bien été supprimé");
                    setDeleteOK(true);
                    // navigate("/");
                    // window.location.reload();

                    setTimeout(function () {
                        navigate("/");
                        window.location.reload();
                    }, 3500);
                }
            } else {
                setDeleteOK(false);
                throw new Error("Error");
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            {user_id === userId || user_role === "admin" ? (
                // <button className="account__delete btn btn__delete" onClick={(e) => delAccount(e)}>
                <div>
                    <div>{deleteMsg}</div>
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
                </div>
            ) : null}
        </div>
    );
}

export default DeleteAccount;
