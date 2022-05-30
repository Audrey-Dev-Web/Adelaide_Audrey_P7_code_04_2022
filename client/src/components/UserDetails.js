import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

function UserDetails(props) {
    const { access, userId } = props;
    const [userData, setUserData] = useState([]);

    const token = access;
    const decoded = jwt_decode(token);
    const user_id = decoded.user_id;
    const user_role = decoded.role;

    // requete pour chercher les informations de l'utilisateur celon l'id de la page home
    const url = `http://localhost:8080/api/profiles/${userId}`;
    const reqOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    useEffect(() => {
        fetch(url, reqOptions)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((data) => {
                setUserData(data.profile);
            });
    });

    return (
        <div>
            {props.firstName}
            {props.lastName}
            {props.avatar}
        </div>
    );
}

export default UserDetails;
