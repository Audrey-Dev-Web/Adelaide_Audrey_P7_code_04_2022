import React, { useState, useEffect } from "react";

import { BiPlus, BiX, BiCommentAdd } from "react-icons/bi";

import DateTime from "../DateTime";
import CommentForm from "./CommentForm";
import EditComment from "./EditComment";
import DeleteComment from "./DeleteComment";
import ErrorBoundary from "../ErrorBoundary";

// Permet d'afficher les informations de l'utilisateur qui a créé un post losque celui-ci est un post partagé
import UserData from "../usersProfile/UserData";

function Comments(props) {
    const { post_id, access } = props;

    const [data, setData] = useState({ data: [] });
    const [showComments, setShowComments] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState("");

    const [message, setMessage] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [noComments, setNoComments] = useState(false);

    // State pour afficher ou non le formulaire de commentaire
    const [createMod, setCreateMod] = useState(false);

    // const user = JSON.parse(sessionStorage.getItem("isAuthenticate"));
    // const token = user.pass;

    const token = access;
    const user_id = access.user_id;
    const user_role = access.role;

    const url = `http://localhost:8080/api/articles/${post_id}/comments`;
    const reqOptions = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    };

    const fetchComments = async () => {
        // toggleComments();

        if (isLoading) {
            setIsLoading(false);
        } else {
            setIsLoading(true);

            try {
                const res = await fetch(url, reqOptions);

                if (res.status === 201) {
                    setMessage("Soyez le premier à commenter cet article !");
                    setNoComments(true);
                }

                if (res.ok) {
                    const result = await res.json();
                    setData(result);
                } else {
                    setErrorMsg(err);
                    setError(true);
                    setTimeout(function () {
                        setErrorMsg(null);
                        setError(false);
                    }, 3000);
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

    useEffect(() => {
        fetchComments();
    }, []);

    // Lance le fetch au click
    const toggleComments = () => {
        if (!showComments) {
            setShowComments(true);
            console.log("mode edition activée !");
        } else {
            setShowComments(false);
            console.log("mode edition désactivée !");
        }
    };

    return (
        <div>
            <div className="showComments">
                {/* AFFICHAGE DU FORMULAIRE DE COMMENTAIRE */}
                <div className="showCommentForm">
                    <div className="showCommentForm">
                        <ErrorBoundary>
                            <CommentForm post_id={post_id} access={access} />
                        </ErrorBoundary>
                    </div>
                </div>

                {!error ? null : <div className="errorMsg">{errorMsg}</div>}
                <h3 className="comments__title">{!noComments ? "Commentaires" : message}</h3>
                {!success ? null : <div className="validateMsg">{message}</div>}
                {data.allComments?.map((comment) => {
                    return (
                        <div className="comments__post" key={comment.id}>
                            <div className="comments__header">
                                <div className="comments__author">
                                    <ErrorBoundary>
                                        <UserData
                                            realAuthor_id={comment.author_id}
                                            dateTime={comment.timestamp}
                                            access={access}
                                        />
                                    </ErrorBoundary>
                                </div>
                            </div>
                            <div className="comments__content">
                                <p>{comment.comment}</p>
                            </div>

                            <div className="comments__buttons">
                                <ErrorBoundary>
                                    <EditComment
                                        author_id={comment.author_id}
                                        post_id={comment.article_id}
                                        comment_id={comment.id}
                                        comment_value={comment.comment}
                                        access={access}
                                    />
                                </ErrorBoundary>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Comments;
