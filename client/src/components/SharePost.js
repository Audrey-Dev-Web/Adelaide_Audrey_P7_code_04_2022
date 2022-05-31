import React, { useState } from "react";
import jwt_decode from "jwt-decode";

import { BiShare, BiRepost } from "react-icons/bi";

function SharePost(props) {
    const { post_id, userId, access } = props;

    // console.log(post_id);

    const [shareNumber, setShareNumber] = useState(1);
    const [message, setMessage] = useState("");
    const [shared, setShared] = useState(false);

    const token = access;
    // const user_id = access.user_id;
    // const user_role = access.role;

    const shareObject = {
        share: shareNumber,
    };

    const url = `http://localhost:8080/api/articles/${post_id}/share`;
    const reqOptions = {
        method: "POST",
        body: JSON.stringify(shareObject),
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    function shareButton(e) {
        // setShared(true)
        // setShareNumber(1);

        fetch(url, reqOptions)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((data) => {
                setMessage(data.MESSAGE);
                setShared(true);

                window.setTimeout(function () {
                    window.location.reload();
                }, 3000);
            })
            .catch((err) => {
                setMessage("Une erreur est survenue ! " + err);
            });
    }

    return (
        <div>
            <button type="button" className="social__icon shareBtn" onClick={(e) => shareButton()}>
                <p hidden>Partager cet article</p>
                <BiRepost />
            </button>

            <span className="share__message" style={{ display: shared ? "block" : "none" }}>
                {message}
            </span>
        </div>
    );
}

export default SharePost;
