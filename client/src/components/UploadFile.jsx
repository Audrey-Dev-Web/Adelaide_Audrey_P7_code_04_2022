import React, { useState } from "react";

function UploadFile() {
    const [postImg, setPostImg] = useState(null);

    const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    const token = user.pass;

    const postObject = {
        title: "test envoi multer titre",
        content: "test envoi multer content",
        image: postImg,
    };

    let formData = new FormData();

    formData.append("title", "le titre du test image");
    formData.append("content", "le contenu du post image");

    const upload = async (e) => {
        // console.log(postImg);
        e.preventDefault();

        try {
            let res = await fetch("http://localhost:8080/api/articles", {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`,
                    "content-type": "multipart/form-data",
                    boundary: "bleurp",
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
        <div className="container">
            <div>
                <form encType="multipart/form-data">
                    <h3>React File Upload</h3>
                    <div className="form-group">
                        <input
                            type="file"
                            encType="multipart/form-data"
                            name="image"
                            onChange={(e) => setPostImg(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button type="submit" onClick={upload}>
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UploadFile;
