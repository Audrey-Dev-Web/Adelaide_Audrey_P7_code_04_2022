import React, { useEffect, useState } from "react";

function PostForm() {
    // ===========> CREATE NEW POST

    const [postTitle, setPostTitle] = useState(null);
    const [postContent, setPostContent] = useState(null);
    const [postImg, setPostImg] = useState(null);
    const [fileDataURL, setFileDataURL] = useState(null);
    const [message, setMessage] = useState(null);

    const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    const token = user.pass;

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

    return (
        <div>
            <form onSubmit={sendNewPost} className="newPost__add" method="POST" encType="multipart/form-data">
                <label>
                    <input
                        className="newPost__add--title"
                        type="text"
                        name="title"
                        placeholder="Votre titre ici..."
                        onChange={(e) => setPostTitle(e.target.value)}
                    />
                </label>

                <label>
                    <textarea
                        className="newPost__add--content"
                        type="text"
                        name="content"
                        placeholder="Votre text ici...."
                        onChange={(e) => setPostContent(e.target.value)}
                    />
                </label>

                {!postImg ? null : <img width="300" src={fileDataURL} />}
                <div className="newPost__btn">
                    {/* <label htmlFor="image"> */}
                    <input className="btn" type="file" id="image" name="image" onChange={handleChange} />
                    {/* </label> */}
                    {/* <input className="btn" type="file" name="image" onChange={(e) => setPostImg(e.target.value)} /> */}
                    {message}
                    <input className="newPost__add--send btn" type="submit" value="Envoyer" />
                </div>
            </form>
        </div>
    );
}

export default PostForm;
