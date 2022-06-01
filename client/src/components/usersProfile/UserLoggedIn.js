import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

import UserData from "../usersProfile/UserData";

// Permet de récupérer et d'afficher la photo de profile et le nom de l'utilisateur dans la bar de navigation
function UserLoggedIn(props) {
    const { access } = props;
    const [user, setUser] = useState([]);
    const decoded = jwt_decode(access);
    const user_id = decoded.userId;

    const url = `http://localhost:8080/api/profiles/${user_id}`;

    const reqOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${access}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    useEffect(() => {
        async function fetchData() {
            const res = await fetch(url, reqOptions);
            const userData = await res.json();

            setUser({ userInfo: userData, DataIsLoaded: true });
        }

        fetchData();
    }, []);

    if (!user.DataIsLoaded)
        return (
            <div>
                <h1> En cours de chargement... </h1>
            </div>
        );

    return (
        <div className="userLoggedIn">
            <UserData realAuthor_id={user.userInfo.profile.user_id} access={access} />
        </div>
    );
}

export default UserLoggedIn;
