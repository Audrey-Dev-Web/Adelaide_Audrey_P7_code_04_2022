import React, { useState, useEffect } from "react";

function Comments(props) {
    const { post_id } = props;
    const [msg, setMsg] = useState("");
    const [comments, setComments] = useState([]);
    const [dataIsLoaded, setDataIsLoaded] = useState(false);

    // Token de l'utilisateur
    const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    const token = user.pass;
    const user_id = user.id;

    // Request Options
    const url = `http://localhost:8080/api/articles/${post_id}/comments`;
    const reqOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    const fetchComments = () => {
        fetch(url, reqOptions)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((data) => {
                // console.log(data);
                if (!data) {
                    setMsg("Aucun commentaire");
                    // console.log(msg);
                }
                setComments(data);
                setDataIsLoaded(true);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    useEffect(() => {
        fetchComments();
    }, [post_id]);

    if (!dataIsLoaded)
        return (
            <div>
                <h1> {msg} </h1>
            </div>
        );

    console.log(comments);

    return <div>Affichage des commentaires ICI !</div>;
}

export default Comments;
