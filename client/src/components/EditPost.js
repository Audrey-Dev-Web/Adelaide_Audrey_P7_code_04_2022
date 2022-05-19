import React, { useState, useEffect } from "react";

function EditPost(props) {
    // On récupère les données utiles
    const { post_id, author_id, post_title, post_content, post_img } = props;

    // On prépare le state local
    const [title, setTitle] = useState(post_title);
    const [content, setContent] = useState(post_content);
    const [image, setImage] = useState(post_img);

    const [editMod, setEditMod] = useState(false);

    // On récupère les données pour les authorisations
    const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    const token = user.pass;
    const user_id = user.id;

    const [isAuthor, setIsAuthor] = useState(false);

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
    const set_author = () => {
        if (user_id === author_id) {
            setIsAuthor(true);
        }
    };

    useEffect(() => {
        set_author();
    }, []);

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

    function handleChange(e) {
        setImage(e.target.files[0]);
    }

    // function handleDelete(e) {
    //     setImage(null);
    // }

    const toggleEdit = () => {
        if (!editMod) {
            setEditMod(true);
            console.log("mode edition activée !");
        } else {
            setEditMod(false);
            console.log("mode edition désactivée !");
        }
    };

    console.log(image);

    return (
        <div>
            {!isAuthor ? null : (
                <button className="postForm__edit btn btn__edit" onClick={toggleEdit}>
                    Editer
                </button>
            )}

            <span className="postForm postForm__editMod editMod" style={{ display: editMod ? "block" : "none" }}>
                <form onSubmit={editPost} className="postForm__edit--form" method="PUT" encType="multipart/form-data">
                    <h2>Modifier cet article</h2>
                    <label>
                        <input
                            className="postForm__edit--title"
                            type="text"
                            name="title"
                            value={title}
                            placeholder="Votre titre ici..."
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </label>

                    <label>
                        <textarea
                            className="postForm__edit--textarea"
                            type="text"
                            name="content"
                            value={content}
                            placeholder="Votre text ici...."
                            onChange={(e) => setContent(e.target.value)}
                        />
                    </label>

                    <img className="postForm__edit--imgPreview" src={image} />
                    {/* <button type="button" onClick={handleDelete}>
                        Delete img
                    </button> */}

                    <div className="postForm__edit--btn">
                        {/* <button className="btn btn__file">Ajouter une image</button> */}
                        {/* <input
                            className="btn hide"
                            type="file"
                            name="image"
                            onChange={(e) => setImage(setImage(e.target.files[0]))}
                        /> */}
                        {/* <input className="btn hide" type="file" name="image" onChange={handleChange} /> */}
                        <input className="btn" type="file" name="image" src={image} onChange={handleChange} />
                        <input className="postForm__edit--send btn" type="submit" value="Envoyer" />
                    </div>
                </form>
            </span>
        </div>
    );
}

export default EditPost;
