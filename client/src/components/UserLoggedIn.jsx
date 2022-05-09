import React, { useEffect, useState, Component } from "react";

export default class UserLoggedIn extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userInfo: [],
            DataIsLoaded: false,
        };
    }

    async componentDidMount() {
        // const [profile, setProfile] = useState(null);
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
            console.log(this.state);
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

        return (
            // Ajouter un menu déroulant afin d'afficher la possibilité de modifier le profile
            <div className="userLoggedIn">
                <img className="userLoggedIn__pix" src={userInfo.profile.avatarUrl} alt="Photo de profile" />
                <span className="username">{userInfo.profile.firstName}</span>
            </div>
        );
    }
}

// export default function UserLoggedIn(props) {
//     // console.log(props.userId);

//     constructor(props) {
//         super(props);

//         this.state = {
//             items: [],
//             DataisLoaded: false,
//         };
//     }

//     async componentDidMount() {

//     }

//     // const [profile, setProfile] = useState(null);

//     // const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
//     // const token = user.pass;

//     // const user_id = props.userId;
//     // const url = `http://localhost:8080/api/profiles/${user_id}`;

//     // const requestOptions = {
//     //     method: "GET",
//     //     headers: {
//     //         Authorization: `Bearer ${token}`,
//     //         Accept: "application/json",
//     //         "Content-Type": "application/json",
//     //     },
//     // };

//     // // useEffect(() => {
//     // //     userProfile();
//     // // }, []);

//     // const userProfile = async () => {
//     //     const res = await fetch(url, requestOptions);
//     //     const userData = await res.json();

//     //     console.log(userData);

//     //     setProfile(userData);

//     //     // console.log(profile);
//     // };

//     return (
//         <div className="userLoggedIn">
//             <p hidden>Afficher la photo de profile et le prénom de l'utilisateur connecté ici</p>
//             {/* <img className="userLoggedIn__pix" src={profile.profile.avatarUrl} alt="photo de profile" />
//             <span>{profile.profile.lastName}</span> */}
//         </div>
//     );
// }
