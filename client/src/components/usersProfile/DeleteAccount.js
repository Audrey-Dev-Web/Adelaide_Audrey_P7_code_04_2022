import React, { useState } from "react";
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
    const [errorMgs, setErrorMsg] = useState(null);

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
        try {
            let res = await fetch(url, reqOptions);
            let deleteRes = await res.json();

            console.log(deleteRes);

            if (res.ok) {
                if (user_id === userSlug) {
                    setDeleteMsg("Votre compte a été supprimé avec succès!");
                    setDeleteOK(true);
                    removeCookie("access", "", { path: "/" });
                    setTimeout(function () {
                        navigate("/");
                        window.location.reload();
                    }, 3000);
                } else if (user_role === "admin") {
                    // Afficher une page pour l'admin lui confirmant que le compte a bien été supprimé
                    setDeleteMsg("Le compte de cet utilisateur a bien été supprimé");
                    setDeleteOK(true);

                    setTimeout(function () {
                        navigate("/");
                        window.location.reload();
                    }, 3500);
                }
                navigate("/");
                window.location.reload();
            } else {
                setDeleteOK(false);
                throw new Error("Error");
            }
        } catch (err) {
            setErrorMsg(err);
        }
    };

    return (
        <div>
            <p>{deleteOK ? deleteMsg : errorMgs}</p>
            {user_id === userId || user_role === "admin" ? (
                <div>
                    <button
                        className="account__delete btn btn__delete"
                        onClick={() => {
                            const confirmBox = window.confirm("Voulez vous vraiment supprimer votre compte ?");

                            if (confirmBox === true) {
                                delAccount();
                            }
                        }}
                    >
                        <p hidden>Supprimer ce compte</p>
                        <BiTrash />
                    </button>
                </div>
            ) : null}
        </div>
    );
}

export default DeleteAccount;
