import React, { useState, useEffect } from "react";

function Editprofile(props) {
    // On récupère l'id de l'utilisateur avec props
    const { userId, first_name, last_name, birthDate, emailValue, password, avatar } = props;

    // State pour vérifier que c'est le bon utilisateur qui est connecté
    const [isAuthorized, setIsAuthorized] = useState(false);

    // const convertDate = new Date(birthDate);

    // console.log(birthDate.getDate() + 1);

    const get_date = new Date(birthDate).getDate();
    const get_month = new Date(birthDate).getMonth() + 1; // On ajoute +1 afin de compenser la perte de 1 moi durant la convertion
    const get_year = new Date(birthDate).getFullYear();

    const birth = `${get_year}-${get_month}-${get_date}`;
    console.log(birth);

    // = 1985-12-14
    // const formatYmd = (birthDate) => birthDate.toISOString().slice(0, 10);
    // console.log(convertDate.toISOString().split("T")[0]);

    // console.log(convertDate.toUTCString().split("T")[0]);

    // = 15/12/1985
    // let birthdateFr = convertDate.toLocaleString("fr-FR");
    // console.log(birthdateFr.split(",")[0]);

    // On prépare le state local pour stocker les données à modifier
    const [firstName, setFirstName] = useState(first_name);
    const [lastName, setLastName] = useState(last_name);
    const [birthdate, setBirthdate] = useState(birth);
    const [email, setEmail] = useState(emailValue);
    const [pwd, setpwd] = useState(password);
    const [avatarUrl, setAvatarUrl] = useState(avatar);

    // On récupère les données de connexion de l'utilisateur loggé
    const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    const token = user.pass;
    const user_id = user.id;

    // Création de l'object user

    const userObject = {
        first_name: firstName,
        last_name: lastName,
        birthdate: birthdate,
        email: email,
        password: pwd,
        avatar: avatarUrl,
    };

    // Request options
    const url = `http://localhost:8080/api/profiles/${userId}`;
    const reqOptions = {
        method: "PUT",
        body: JSON.stringify(userObject),
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    const set_authorization = async () => {
        if (userId === user.id) {
            setIsAuthorized(true);
        }
    };

    useEffect(() => {
        set_authorization();
    }, []);

    // Fonction pour modifier le profile de l'utilisateur
    const modifyProfile = async (e) => {
        e.preventDefault();

        try {
            let res = await fetch(url, reqOptions);
            let profileRes = await res.json();

            console.log("=====> Reponse modification de profile");
            console.log(profileRes);

            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    // CREER MAIS PAS ENCORE ADD A LA PAGE PROFILE
    return (
        <div>
            <button className="profile__btn--edit btn">Edit</button>

            <form onSubmit={modifyProfile}>
                {/* <label>
                    <input
                        type="text"
                        name="avatar"
                        value={props.avatar}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                    />
                </label> */}
                <label>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="test"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </label>
                <label>
                    <input
                        type="text"
                        name="last_name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </label>

                <label>
                    {!birthDate ? (
                        <input type="date" name="birthdate" onChange={(e) => setBirthdate(e.target.value)} />
                    ) : (
                        <input
                            type="date"
                            name="birthdate"
                            value={birthdate}
                            onChange={(e) => setBirthdate(e.target.value)}
                        />
                    )}
                </label>

                <label>
                    <input type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </label>
                <label>
                    <input
                        type="password"
                        name="password"
                        placeholder="******"
                        onChange={(e) => setpwd(e.target.value)}
                    />
                </label>

                <input className="btn" type="submit" value="Envoyer" />
            </form>
        </div>
    );
}

export default Editprofile;
