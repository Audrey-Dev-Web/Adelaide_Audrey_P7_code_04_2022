import React, { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";

import { BiSend, BiImageAdd } from "react-icons/bi";

function EditPost(props) {
    // On récupère les données utiles
    const { post_id, author_id, post_title, post_content, post_img, access } = props;

    const [title, setTitle] = useState(post_title);
    const [content, setContent] = useState(post_content);
    const [image, setImage] = useState(post_img);
    const [fileDataURL, setFileDataURL] = useState(null);

    const [message, setMessage] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);

    const token = access;
    const decoded = jwt_decode(token);
    const user_id = decoded.userId;

    // On créer le formData
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    // On configure la requête
    const url = `http://localhost:8080/api/articles/${post_id}`;
    const reqOptions = {
        method: "PUT",
        body: formData,
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    // Fonction pour modifier un commentaire
    const editPost = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch(url, reqOptions);
            let editRes = await res.json();

            if (res.ok) {
                setMessage("Article modifié avec succès");
                setSuccess(true);
                setTimeout(function () {
                    setMessage(null);
                    setSuccess(false);
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
    };

    // Fonction pour récupérer l'image qui vient d'être ajouté
    function handleImgChange(e) {
        setImage(e.target.files[0]);

        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            const { result } = e.target;
            setFileDataURL(result);
        };
        reader.readAsDataURL(file);
    }

    return (
        <div className="postForm">
            <span className="postForm__editMod editMod">
                <form onSubmit={editPost} className="postForm__edit--form" method="PUT" encType="multipart/form-data">
                    <h2>Modifier cet article</h2>
                    <label htmlFor="edit-title" aria-label="modifier le titre">
                        <p hidden>Modifier le titre</p>
                        <input
                            id="edit-title"
                            className="postForm__input--title"
                            type="text"
                            name="title"
                            value={title}
                            placeholder="Titre"
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </label>

                    <label htmlFor="edit-content" aria-label="Modifier le contenu">
                        <textarea
                            id="edit-content"
                            className="postForm__input--content"
                            type="text"
                            name="content"
                            value={content}
                            placeholder="Teste (Optionnal)"
                            onChange={(e) => setContent(e.target.value)}
                            required
                        />
                    </label>

                    {!fileDataURL ? (
                        <div>
                            <p className="previewTxt">Image preview</p>
                            {!image ? null : <img className="postForm__imgPreview" src={image} />}
                        </div>
                    ) : (
                        <div>
                            <p className="previewTxt">Image preview</p>
                            <img className="postForm__imgPreview" src={fileDataURL} />
                        </div>
                    )}

                    <div className="postForm__inputBtn">
                        <label htmlFor="changeImg" className="btn" aria-label="Ajouter une image">
                            <p hidden>Ajouter une image</p>
                            <BiImageAdd className="imgIcon" />
                        </label>

                        <input
                            className="postForm__inputImg btn"
                            type="file"
                            id="changeImg"
                            name="image"
                            onChange={handleImgChange}
                            aria-label="Modifier ou ajouter une image"
                        />
                        {!error ? null : <div className="errorMsg">{errorMsg}</div>}
                        {!success ? null : <div className="validateMsg">{message}</div>}

                        <label htmlFor="sendEdit" className="btn" aria-label="Ajouter une image">
                            <p hidden>Ajouter une image</p>
                            <BiSend className="sendPost" />
                        </label>
                        <input
                            id="sendEdit"
                            className="postForm__send btn"
                            type="submit"
                            value="Envoyer"
                            aria-label="envoyer les modifications"
                        />
                    </div>
                </form>
            </span>
        </div>
    );
}

export default EditPost;
