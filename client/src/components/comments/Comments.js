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
    // const [dataIsLoaded, setDataIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState("");

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

                if (!res.ok) {
                    throw new Error(`Error! status: ${res.status}`);
                }

                const result = await res.json();

                // console.log("result is: ", result);
                // console.log("result de data.allComments: ", data.allComments);
                // console.log("Résultat de data.allComments[0].id: ", data.allComments[0].id);
                // console.log("result is: ", JSON.stringify(result, null, 4));

                setData(result);
            } catch (err) {
                setErr("Aucun commentaire à afficher");
            } finally {
                setIsLoading(false);
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

    // Affiche le formulaire de commentaire au click
    // function toggleCreateMod(e) {
    //     setCreateMod(!createMod);
    // }

    return (
        <div>
            {/* <button className="btn" onClick={handleClick}>
                Afficher les commentaires
            </button> */}
            {/* <ErrorBoundary>
                <CommentForm post_id={post.article.id} />
            </ErrorBoundary> */}
            {/* <div className="showComments" style={{ display: showComments ? "block" : "none" }}> */}
            <div className="showComments">
                {/* AFFICHAGE DU FORMULAIRE DE COMMENTAIRE */}
                <div className="showCommentForm">
                    {/* <h3>Ajouter un commentaire</h3> */}
                    {/* <button type="button" className="btn" onClick={toggleCreateMod}>
                        <p hidden>Ajouter un commentaire</p>
                        <BiCommentAdd />
                    </button> */}
                    <div className="showCommentForm">
                        <ErrorBoundary>
                            <CommentForm post_id={post_id} access={access} />
                        </ErrorBoundary>
                    </div>
                </div>

                {err ? <h2>{err}</h2> : <h3 className="comments__title">Commentaires :</h3>}

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

                                {/* <DeleteComment
                                    author_id={comment.author_id}
                                    post_id={comment.article_id}
                                    comment_id={comment.id}
                                    access={access}
                                /> */}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default Comments;
