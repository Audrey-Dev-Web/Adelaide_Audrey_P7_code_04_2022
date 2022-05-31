import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";

import UserAvatar from "./UserAvatar";

import { BiSend, BiPlus, BiImageAdd } from "react-icons/bi";

function PostForm(props) {
    const { access } = props;
    // ===========> CREATE NEW POST
    const [postTitle, setPostTitle] = useState(null);
    const [postContent, setPostContent] = useState(null);
    const [postImg, setPostImg] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);
    const [message, setMessage] = useState(null);
    const [createMod, setCreateMod] = useState(false);

    // const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    // const token = user.pass;
    // const user_id = user.id;

    const token = access;
    // const decoded = jwt_decode(token);
    // const user_id = decoded.userId;
    // const user_role = decoded.role;

    const postObject = {
        title: postTitle,
        content: postContent,
        image: postImg,
    };

    const formData = new FormData();
    formData.append("title", postTitle);
    formData.append("content", postContent);
    formData.append("image", postImg);
    // console.log(postImg);

    // requêtes pour créer un nouvel article
    const sendNewPost = async (e) => {
        e.preventDefault();

        if (!postTitle && !postContent && !postImg) {
            setMessage("Vous avez ajouter au moins un titre avec du texte ou une image");
        } else if (!postTitle && postContent && !postImg) {
            setMessage("Vous avez ajouter au moins un titre");
        } else if (!postTitle && !postContent && postImg) {
            setMessage("Vous avez ajouter au moins un titre");
        } else if (!postTitle && postContent && postImg) {
            setMessage("Vous avez ajouter un titre a votre article");
        } else {
            try {
                let res = await fetch("http://localhost:8080/api/articles/", {
                    method: "POST",
                    body: formData,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();
                console.log("======> Verifier l'envoi du post");
                console.log(data);

                window.location.reload();
            } catch (err) {
                console.log(err);
            }
        }
    };

    function handleChange(event) {
        setPostImg(event.target.files[0]);

        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            // The file's text will be printed here
            const { result } = event.target;
            console.log(event.target.result);
            setFileDataURL(result);
        };
        reader.readAsDataURL(file);
    }

    function toggleCreateMod(e) {
        setCreateMod(!createMod);
    }

    return (
        <div className="newPost">
            {/* <h1>Créer un article</h1> */}
            <h2 className="newPost__title">Créer un nouvel article</h2>
            <form onSubmit={sendNewPost} className="newPost__add" method="POST" encType="multipart/form-data">
                <label htmlFor="post-title" aria-label="titre">
                    <p hidden>Titre</p>
                    <input
                        id="post-title"
                        className="newPost__add--title"
                        type="text"
                        name="title"
                        placeholder="Titre"
                        onChange={(e) => setPostTitle(e.target.value)}
                        required
                    />
                </label>

                <label htmlFor="post-content" aria-label="votre message">
                    <p hidden>Text</p>
                    <textarea
                        id="post-content"
                        className="newPost__add--content"
                        type="text"
                        name="content"
                        placeholder="Text (optional)"
                        onChange={(e) => setPostContent(e.target.value)}
                    />
                </label>

                {!postImg ? null : <img width="300" src={fileDataURL} />}
                <div className="newPost__btn">
                    <label htmlFor="addImg" className="btn" aria-label="Ajouter une image">
                        <p hidden>Ajouter une image</p>
                        <BiImageAdd className="imgIcon" />
                    </label>
                    <input className="newPost__img btn" type="file" id="addImg" name="image" onChange={handleChange} />

                    {message}
                    <label htmlFor="sendBtn" className="newPost__add--send btn" aria-label="Envoyer">
                        <p hidden>Envoyer l'article</p>
                        <BiSend />
                    </label>
                    <input
                        id="sendBtn"
                        aria-label="Envoyer"
                        className="newPost__add--send btn"
                        type="submit"
                        value="Envoyer"
                        style={{ display: "none" }}
                    />
                </div>
            </form>
        </div>
    );
}

export default PostForm;
