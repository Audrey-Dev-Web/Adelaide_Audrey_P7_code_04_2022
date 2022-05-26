import React, { useState, useEffect } from "react";

import { BiSend, BiImageAdd } from "react-icons/bi";

function EditPost(props) {
    // On récupère les données utiles
    const { post_id, author_id, post_title, post_content, post_img } = props;

    // On prépare le state local
    const [title, setTitle] = useState(post_title);
    const [content, setContent] = useState(post_content);
    const [image, setImage] = useState(post_img);
    const [fileDataURL, setFileDataURL] = useState(null);

    // const [editMod, setEditMod] = useState(false);

    // On récupère les données pour les authorisations
    const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    const token = user.pass;
    const user_id = user.id;

    // const [isAuthor, setIsAuthor] = useState(false);

    // console.log(props);

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

    // On vérifis si l'utilisateur est l'auteur du post
    // const set_author = () => {
    //     if (user_id === author_id) {
    //         setIsAuthor(true);
    //     }
    // };

    // useEffect(() => {
    //     set_author();
    // }, []);

    // console.log("Est-ce que l'utilisateur est l'auteur du post ? ", isAuthor, author_id);
    // console.log(user_id);

    // Fonction pour modifier un commentaire
    const editPost = async (e) => {
        e.preventDefault();
        try {
            let res = await fetch(url, reqOptions);
            let editRes = await res.json();

            console.log("=====> Réponse commentaire envoyé : ");
            console.log(editRes);

            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    function handleImgChange(e) {
        setImage(e.target.files[0]);

        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            // The file's text will be printed here
            const { result } = e.target;
            // console.log(e.target.result);
            setFileDataURL(result);
        };
        reader.readAsDataURL(file);
    }

    return (
        <div className="postForm">
            <span className="postForm__editMod editMod">
                <form onSubmit={editPost} className="postForm__edit--form" method="PUT" encType="multipart/form-data">
                    <h2>Modifier cet article</h2>
                    <label>
                        <input
                            className="postForm__input--title"
                            type="text"
                            name="title"
                            value={title}
                            placeholder="Titre"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>

                    <label>
                        <textarea
                            className="postForm__input--content"
                            type="text"
                            name="content"
                            value={content}
                            placeholder="Teste (Optionnal)"
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </label>

                    {/* Ici, si le post n'a pas d'image on affiche rien, s'il en a une on l'affiche, si une image 
                    a été uploadé on l'affiche à la place de l'image actuelle de l'article */}
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
                        <label htmlFor="changeImg" className="btn">
                            <BiImageAdd className="imgIcon" />
                        </label>

                        <input
                            className="postForm__inputImg btn"
                            type="file"
                            id="changeImg"
                            name="image"
                            // src={image}
                            onChange={handleImgChange}
                        />
                        <input className="postForm__send btn" type="submit" value="Envoyer" />
                    </div>
                </form>
            </span>
        </div>
    );
}

export default EditPost;
