import React, { useState } from "react";

import { BiRepost } from "react-icons/bi";

function SharePost(props) {
    const { post_id, is_shared, userId, commentsCount, access } = props;

    const [shareNumber, setShareNumber] = useState(1);
    const [message, setMessage] = useState("");
    const [shared, setShared] = useState(false);

    const token = access;

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
            {is_shared ? (
                <button type="button" className="social__icon btn btn__share" onClick={(e) => shareButton()}>
                    <p hidden>Annulé le partage</p>
                    <BiRepost />
                    cancel
                </button>
            ) : (
                <button type="button" className="social__icon btn btn__share" onClick={(e) => shareButton()}>
                    <p hidden>Partager cet article</p>
                    <BiRepost />
                    <span className="social__count btn__share--count">{commentsCount}</span>
                </button>
            )}

            <span className="share__message" style={{ display: shared ? "block" : "none" }}>
                {message}
            </span>
        </div>
    );
}

export default SharePost;
