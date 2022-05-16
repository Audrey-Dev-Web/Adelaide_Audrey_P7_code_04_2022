import React, { useEffect, useState, Component } from "react";
import { Link } from "react-router-dom";

export default class UserLoggedIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: [],
            DataIsLoaded: false,
        };
    }

    async componentDidMount() {
        const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
        const token = user.pass;
        const userId = user.id;

        // console.log(userId);

        const url = `http://localhost:8080/api/profiles/${userId}`;

        const reqOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };

        try {
            const res = await fetch(url, reqOptions);
            const userData = await res.json();
            this.setState({ userInfo: userData, DataIsLoaded: true });
            // console.log(this.state);
        } catch (err) {
            console.log(err);
        }
    }

    render() {
        const { DataIsLoaded, userInfo } = this.state;

        if (!DataIsLoaded)
            return (
                <div>
                    <h1> Pleses wait some time.... </h1>{" "}
                </div>
            );

        const firstName = userInfo.profile.firstName;
        const lastName = userInfo.profile.lastName;
        const fullName = `${firstName} ${lastName}`;
        const initiales = fullName.match(/\b\w/g).join("").toUpperCase();
        // console.log(initiales);

        const profileImgUrl = userInfo.profile.avatarUrl;

        return (
            // Ajouter un menu déroulant afin d'afficher la possibilité de modifier le profile
            <div className="userLoggedIn">
                {/* <Link to={"/profile/" + userInfo.profile.user_id}> */}
                {!profileImgUrl ? (
                    <div className="userLoggedIn__pix initiales">
                        <p>{initiales}</p>
                    </div>
                ) : (
                    <img className="userLoggedIn__pix" src={userInfo.profile.avatarUrl} alt="Photo de profile" />
                )}
                {/* <img className="userLoggedIn__pix" src={userInfo.profile.avatarUrl} alt="Photo de profile" /> */}
                <span className="username">{userInfo.profile.firstName}</span>
                {/* </Link> */}
            </div>
        );
    }
}
