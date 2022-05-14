import React from "react";

export default function UserDetails(props) {
    // requete pour chercher les informations de l'utilisateur celon l'id de la page home

    return (
        <div>
            {props.firstName}
            {props.lastName}
            {props.avatar}
        </div>
    );
}
