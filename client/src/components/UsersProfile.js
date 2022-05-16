/*
Cette page sert à chercher et afficher tous les utilisateurs inscrits
*/

import React, { useState, useEffect } from "react";

function UsersProfile() {
    const [users, setUsers] = useState([]);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    const token = user.pass;

    const url = `http://localhost:8080/api/profiles`;
    const reqOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    const fetchUsers = () => {
        fetch(url, reqOptions)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((data) => {
                console.log(data);

                setUsers(data);
                setDataIsLoaded(true);
            });
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    console.log(users);

    if (!dataIsLoaded) {
        return (
            <div>
                <h1> Pleases wait some time.... </h1>
            </div>
        );
    }

    const usersList = users.slice(0, 5).map((user) => {
        return (
            <li className="usersList__user" key={user.usersProfile.user_Id}>
                {!user.usersProfile.avatar ? (
                    <div className="usersList__user--avatar initiales">
                        <p>
                            {`${user.usersProfile.first_name} ${user.usersProfile.last_name}
                                                `
                                .match(/\b\w/g)
                                .join("")
                                .toUpperCase()}
                        </p>
                    </div>
                ) : (
                    <img className="usersList__user--avatar" src={user.usersProfile.avatar} />
                )}
                <div className="usersList__user--name">
                    <p>
                        <span className="user__firstName">{user.usersProfile.first_name} </span>
                        <span className="user__lastName">{user.usersProfile.last_name}</span>
                    </p>
                </div>

                <div className="usersList__user--signupDate">{user.usersProfile.inscrit_le}</div>
            </li>
        );
    });

    return (
        <ul className="usersList">
            <h3>Nouveaux utilisateurs</h3>
            {usersList}
        </ul>
    );
    // return (
    //     <div>
    //         UsersProfile coding en cours
    //         <div>{usersList}</div>
    //     </div>
    // );
}

export default UsersProfile;
