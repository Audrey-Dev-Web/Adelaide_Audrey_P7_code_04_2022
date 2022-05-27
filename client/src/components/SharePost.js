import React, { useState } from "react";

import { BiShare, BiRepost } from "react-icons/bi";

function SharePost(props) {
    const { post_id, userId, access } = props;
    const [shareNumber, setShareNumber] = useState(1);

    const [message, setMessage] = useState("");

    const [shared, setShared] = useState(false);

    // const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    // const token = user.pass;
    // const user_id = user.id;

    const token = access.token;
    const user_id = access.user_id;
    const user_role = access.role;

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
        setShareNumber(1);

        fetch(url, reqOptions)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((data) => {
                console.log(data);
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
                <BiRepost />
            </button>

            <span className="share__message" style={{ display: shared ? "block" : "none" }}>
                {message}
            </span>
        </div>
    );
}

export default SharePost;
