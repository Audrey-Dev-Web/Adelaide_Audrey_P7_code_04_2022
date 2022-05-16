import React, { useState } from "react";

function PostForm() {
    // ===========> CREATE NEW POST

    const [postTitle, setPostTitle] = useState(null);
    const [postContent, setPostContent] = useState(null);
    const [postImg, setPostImg] = useState(null);

    const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    const token = user.pass;

    const postObject = {
        title: postTitle,
        content: postContent,
        image: postImg,
    };

    // console.log(postImg);

    // requêtes pour créer un nouvel article
    const sendNewPost = async (e) => {
        e.preventDefault();

        try {
            let res = await fetch("http://localhost:8080/api/articles/", {
                method: "POST",
                body: JSON.stringify(postObject),
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();
            console.log("======> Verifier l'envoi du post");
            console.log(data);

            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <form className="newPost__add">
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

                <div className="newPost__btn">
                    {/* <input className="newPost__add--img btn" type="file" onChange={(e) => setPostImg(e.target.value)} /> */}
                    {/* <input className="btn" type="file" onChange={(e) => setPostImg(e.target.value)} /> */}
                    <input className="btn" type="file" name="image" onChange={(e) => setPostImg(e.target.value)} />
                    {/* <button className="newPost__add--img btn" type="submit">
                        Upload
                    </button> */}

                    <input className="newPost__add--send btn" type="submit" value="Envoyer" onClick={sendNewPost} />
                </div>
            </form>
        </div>
    );
}

export default PostForm;
