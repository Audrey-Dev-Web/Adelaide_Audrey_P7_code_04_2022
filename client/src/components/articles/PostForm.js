import React, { useState } from "react";
import { BiSend, BiImageAdd } from "react-icons/bi";

function PostForm(props) {
    const { access } = props;
    // ===========> CREATE NEW POST
    const [postTitle, setPostTitle] = useState(null);
    const [postContent, setPostContent] = useState(null);
    const [postImg, setPostImg] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);

    const [message, setMessage] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const token = access;

    const formData = new FormData();
    formData.append("title", postTitle);
    formData.append("content", postContent);
    formData.append("image", postImg);

    // requêtes pour créer un nouvel article
    const sendNewPost = async (e) => {
        e.preventDefault();

        if (!postTitle && !postContent && !postImg) {
            setErrorMsg("Vous avez ajouter au moins un titre avec du texte ou une image");
            setError(true);
            setTimeout(function () {
                setErrorMsg(null);
                setError(false);
            }, 3000);
        } else if (!postTitle && postContent && !postImg) {
            setErrorMsg("Vous avez ajouter au moins un titre");
            setError(true);
            setTimeout(function () {
                setErrorMsg(null);
                setError(false);
            }, 3000);
        } else if (!postTitle && !postContent && postImg) {
            setErrorMsg("Vous avez ajouter au moins un titre");
            setError(true);
            setTimeout(function () {
                setErrorMsg(null);
                setError(false);
            }, 3000);
        } else if (!postTitle && postContent && postImg) {
            setErrorMsg("Vous avez ajouter un titre a votre article");
            setError(true);
            setTimeout(function () {
                setErrorMsg(null);
                setError(false);
            }, 3000);
        } else if (postTitle && !postContent && !postImg) {
            setErrorMsg("Vous devez ajouter un contenu d'article ou une image");
            setError(true);
            setTimeout(function () {
                setErrorMsg(null);
                setError(false);
            }, 3000);
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

                if (res.ok) {
                    setMessage("Nouveau post ajouté avec succès !");
                    setSuccess(true);
                    setError(false);

                    setTimeout(function () {
                        setMessage(null);
                        setSuccess(false);
                        setError(false);
                        window.location.reload();
                    }, 3000);
                } else {
                    throw new Error("Error");
                }
            } catch (err) {
                setErrorMsg(err);
                setError(true);
                setTimeout(function () {
                    setErrorMsg(null);
                    setError(false);
                }, 3000);
            }
        }
    };

    // Permet de récupérer l'image qui a été upload
    function handleChange(event) {
        setPostImg(event.target.files[0]);

        var file = event.target.files[0];
        var reader = new FileReader();
        reader.onload = function (event) {
            const { result } = event.target;
            setFileDataURL(result);
        };
        reader.readAsDataURL(file);
    }

    return (
        <div className="newPost">
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
                {!error ? null : <div className="errorMsg">{errorMsg}</div>}
                {!success ? null : <div className="validateMsg">{message}</div>}
            </form>
        </div>
    );
}

export default PostForm;
