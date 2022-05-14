import React, { useState, useEffect } from "react";

export default function Comments(props) {
    const [comments, setComments] = useState(null);

    const getPostComments = async (props) => {
        // Rechercher les Commentaires
        const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
        const token = user.pass;

        const urlComments = `http://localhost:8080/api/articles/${props}/comments`;
        const reqOptions = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        };

        const resComments = await fetch(urlComments, reqOptions);
        const postsComments = await resComments.json();

        // if (!resComments.ok) {
        //     console.log("Pas de commentaire a afficher");
        // }

        setComments(postsComments);

        // console.log("", comments);
    };

    useEffect(() => {
        getPostComments(props);
    }, []);

    return (
        <div>
            {props.post_id}
            {/* <br />
            Ici afficher les commentaires quand on clique sur le bouton ou il y a le nombre de commentaires */}
        </div>
    );
}
